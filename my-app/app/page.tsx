"use client"
import React, { useState, useEffect, useContext } from "react";
import { Localized, useLocalization } from "@fluent/react";
import { useRouter } from 'next/navigation';
import Context from './context'
import {link} from "./link"
type Product = {
  id: number;
  name: string;
  image_url: string;
  detail: string;
  price: number;
};

function MainComponent() {
  const localization = useLocalization();
  const Router=useRouter();
  const [products, setProducts] = React.useState<Product[]>([]);
  useEffect(() => {
    fetch(link+"/danh_sach_san_pham")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Fetch Error:", error);
      });
  }, []);

  const [cart, setCart] = React.useState<(Product & { quantity: number })[]>([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(link+"/du_lieu_gio_hang", {
      headers: {
        accept: "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setCart(data);
      })
      .catch((error) => {
        console.error("Fetch Error:", error);
      })
  }, []);

  const [search, setSearch] = React.useState("");
  const [selectedProduct, setSelectedProduct] = React.useState<Product>(null);
  const [showCart, setShowCart] = React.useState(false);
  const ngonngu = useContext(Context);
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = async (product: Product) => {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams();
    params.append("product_id", String(product.id));

    try {
      const response = await fetch(
        link+"/khach_hang_them_1_san_pham_vao_gio_hang?" + params,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add product");
      }
      const productExists = cart.find((item) => item.id === product.id);
      if (productExists) {
        setCart(
          cart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      } else {
        setCart([...cart, { ...product, quantity: 1 }]);
      }
    } catch (error) {
      alert("Failed to add product");
      console.error("Error during add product:", error);
      throw error;
    }
  };

  const removeFromCart = (productId: number) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
  };
  const calculateTotal = () => {
    return cart.reduce((total, item) => (total + item.price * item.quantity), 0);
  };
  const adjustQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      const updatedCart = cart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      setCart(updatedCart);
    }
  };

  const handleCartClick = () => {
    setShowCart(true);
  };
  const handleClick = () => {
    if (ngonngu.ngonngu==='vi-VN') ngonngu.update('en-US')
      else ngonngu.update('vi-VN')
  };
  const handleProfileClick = () => {
    Router.push("/user");
  };
  const handleTitleClick = () => {
    setShowCart(false);
    setSelectedProduct(null);
  };
  const handleProductClick = (product:Product) => {
    setSelectedProduct(product);
  };
  const createOrder = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(link+"/khach_hang_them_don_hang", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }
      const data=await response.json()
      setCart([]);
      {
        const currentUrl = window.location.href;
        const domain = currentUrl.split('/')[2];
        const newUrl = `https://${domain}/giaodich`;

        console.log(newUrl);
        const response = await fetch(link+"/link_thanh_toan?OrderID="+encodeURIComponent(data)+"&vnp_return_url="+encodeURIComponent(newUrl), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,

          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to create order");
        }
        const data2 =await response.json()
        location.href=(data2)
    }} catch (error) {
      console.error("Error during creating order:", error);
      alert("Failed to create order");
    }
  };
 
  const noProductsMessage = search && filteredProducts.length === 0 ? (
    <p>
      <Localized id="noProductsFound">No products found.</Localized>
    </p>
  ) : null;

  return (
    <div className="w-full min-h-screen bg-white text-black font-roboto">
      <header className="flex items-center justify-between bg-white p-4 shadow-md">
        <h1 className="text-3xl cursor-pointer font-sans" onClick={handleTitleClick}>
          Online Bookstore
        </h1>
        <div className="w-[300px]">
          <input
            className="w-full p-2 rounded text-black bg-white border border-gray-300 font-sans"
            type="search"
            name="searchProduct"
            placeholder={localization.l10n.getString("search-products")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="relative text-xl" onClick={handleCartClick}>
          🛒
          <span className="absolute top-0 right-0 rounded-full bg-gray-200 px-2 text-sm text-black">
            {cart.reduce((count, product) => count + product.quantity, 0)}
          </span>
        </button>
        <button className="relative text-xl ml-4" onClick={handleClick}>
          <Localized id="Language"></Localized>
        </button>
        <button className="relative text-xl ml-4" onClick={handleProfileClick}>
          👤
        </button>
      </header>
      
      {selectedProduct ? (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-[600px] mx-auto">
          <button
            onClick={() => setSelectedProduct(null)}
            className="text-[#010101] mb-4 font-bold"
          >
            &#x2190; <Localized id="Back"></Localized>
          </button>
          <img
            src={selectedProduct.image_url}
            alt={selectedProduct.name}
            className="w-[200px] h-[300px] object-cover mb-4 rounded"
          />
          <h2 className="text-3xl font-semibold mb-2">
            {selectedProduct.name}
          </h2>
          <p className="text-[#121212] mb-2">{selectedProduct.price} VND</p>
          <p className="text-gray-700 text-md mb-4">
            {selectedProduct.detail}
          </p>
          <button
            onClick={()=>addToCart(selectedProduct)}
            className="bg-[#010101] text-white px-4 py-2 rounded"
          >
           <Localized id="add-to-cart"></Localized>
          </button>
        </div>
      ) :(
      <main className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {showCart ? (
          <div className="col-span-full bg-white p-4 shadow-md">
            <h2 className="text-lg font-semibold mb-4">
              <Localized id="cart-items"></Localized>
            </h2>
            <ul>
              {cart.map((item) => (
                <li key={item.id} className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={item.image_url} alt={item.name} className="w-10 h-30 object-cover" />
                    <span>BOOK: {item.name}</span>
                  </div>
                  <div>
                    <span>
                      <Localized id="quantity"></Localized>:
                      <button className="mx-2" onClick={() => adjustQuantity(item.id, item.quantity - 1)}>
                        -
                      </button>
                      {item.quantity}
                      <button className="mx-2" onClick={() => adjustQuantity(item.id, item.quantity + 1)}>
                        +
                      </button>
                    </span>
                    <button className="ml-4" onClick={() => removeFromCart(item.id)}>
                      <Localized id="remove"></Localized>
                    </button>
                  </div>
                </li>
              ))}
              {cart.length === 0 && <li><Localized id="your-cart-is-empty"></Localized></li>}
            </ul>
            {cart.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold"><Localized id="total"></Localized>:</span>
                  <span className="text-lg font-semibold"> {calculateTotal()} VND</span>
                </div>
                <button
                  onClick={createOrder}
                  className="mt-4 bg-gray-800 text-white rounded px-6 py-2 hover:bg-gray-700 active:bg-gray-900 transition duration-150 ease-in-out"
                >
                  <Localized id="checkout"></Localized>
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {noProductsMessage}
            {filteredProducts.map((product) => (
              <div
              key={product.id}
              className="bg-white rounded overflow-hidden shadow-lg"
              onClick={() => handleProductClick(product)}
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="w-[120px] h-[200px] object-cover"
              />
              <div className="p-4">
                <h5 className="text-lg text-black mb-2">BOOK: {product.name}</h5>
                <p className="text-xl text-gray-700"> {product.price} VND </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the click from bubbling up to the div
                    addToCart(product);
                  }}
                  className="mt-3 bg-gray-800 text-white rounded px-6 py-2 hover:bg-gray-700 active:bg-gray-900 transition duration-150 ease-in-out"
                >
                  <Localized id="add-to-cart"></Localized>
                </button>
              </div>
            </div>
            ))}
          </>
        )}
      </main>)}
    </div>
  );
}

export default MainComponent;

