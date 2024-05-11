"use client"
import React, { useState, useEffect, useContext } from "react";
import { Localized, useLocalization } from "@fluent/react";
import { useRouter } from 'next/navigation';
import Context from './context'
import {link} from "./link"
type Product = {
  id: number;
  name: string;
  image: string;
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

      setCart([]);
    } catch (error) {
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
    <div className="w-full min-h-screen bg-[#f0f0f0] font-roboto">
      <header className="flex items-center justify-between bg-[#1a73e8] p-4 text-white">
        <h1 className="text-3xl cursor-pointer" onClick={handleTitleClick}>
          Online Marketplace
        </h1>
        <div className="w-[300px]">
          <input
            className="w-full p-2 rounded text-black bg-white"
            type="search"
            name="searchProduct"
            placeholder={localization.l10n.getString("search-products")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="relative text-xl" onClick={handleCartClick}>
          🛒
          <span className="absolute top-0 right-0 rounded-full bg-[#ff0000] px-2 text-sm">
            {cart.reduce((count, product) => count + product.quantity, 0)}
          </span>
        </button>
        <button className="relative text-xl" onClick={handleClick}>
          Đổi ngôn ngữ
          </button>
        <button className="relative text-xl" onClick={handleProfileClick}>
          Tài khoản
        </button>
      </header>
      <main className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {showCart ? (
          <div className="col-span-full bg-white p-4">
            <h2 className="text-lg font-semibold mb-4">
              <Localized id="cart-items">Cart Items:</Localized>
            </h2>
            <ul>
              {cart.map((item) => (
                <li key={item.id} className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover" />
                    <span>{item.name}</span>
                  </div>
                  <div>
                    <button onClick={() => adjustQuantity(item.id, item.quantity - 1)}>-</button>
                    <span><Localized id="quantity"></Localized>: {item.quantity}</span>
                    <button onClick={() => adjustQuantity(item.id, item.quantity + 1)}>+</button>
                    <button onClick={() => removeFromCart(item.id)}>Remove</button>
                  </div>
                </li>
              ))}
              {cart.length === 0 && <li><Localized id="your-cart-is-empty"></Localized></li>}
            </ul>
            <button onClick={createOrder} className="bg-[#ff9800] text-white rounded px-6 py-2 hover:bg-[#f57c00] active:bg-[#ef6c00] transition duration-150 ease-in-out">
              <Localized id="checkout">Checkout</Localized>
            </button>
          </div>
        ) : (
          <>
            {noProductsMessage}
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded overflow-hidden shadow-lg">
                <img src={product.image} alt={product.name} className="w-full h-[200px] object-cover" />
                <div className="p-4">
                  <h5 className="text-lg text-[#333] mb-2">{product.name}</h5>
                  <p className="text-xl text-[#121212]">
                    ${product.price}
                  </p>
                  <button
                    onClick={() => addToCart(product)}
                    className="mt-3 bg-[#4caf50] text-white rounded px-6 py-2 hover:bg-[#45a045] active:bg-[#43a047] transition duration-150 ease-in-out"
                  >
                    <Localized id="add-to-cart"></Localized>
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
}

export default MainComponent;
