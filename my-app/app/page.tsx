"use client"
import React,{ useState, useEffect } from "react";
import { Localized, useLocalization } from "@fluent/react"
type Product = { 
  id: number,
  name: string, 
  image: string,
  detail: string,
  price: number,
  
};

function MainComponent() {
  const localization = useLocalization()
  const [products, setProducts] = React.useState<(Product)[]>([]);
  useEffect(() => {
    fetch('https://organic-guacamole-j6qqg64q74625xx6-8000.app.github.dev/danh_sach_san_pham')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setProducts(data);
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
}, []);
  const [cart, setCart] = React.useState<(Product & { quantity: number })[]>([]);
  useEffect(() => {
    fetch('https://organic-guacamole-j6qqg64q74625xx6-8000.app.github.dev/du_lieu_gio_hang?token='+encodeURIComponent(token!))
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
          setCart(data);
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
}, []);
  const [search, setSearch] = React.useState("");
  const [showCart, setShowCart] = React.useState(false);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product: Product) => {
    const productExists = cart.find((item) => item.id === product.id);
    if (productExists) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
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

  const handleTitleClick = () => {
    setShowCart(false);
  };

  const noProductsMessage =
    search && filteredProducts.length === 0 ? <p><Localized id="noProductsFound">No products found.</Localized></p> : null;

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
      </header>
      <main className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {showCart ? (
          <div className="col-span-full bg-white p-4">
            <h2 className="text-lg font-semibold mb-4"><Localized id="cart-items">Cart Items:</Localized></h2>
            <ul>
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="mb-2 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover"
                    />
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
          </div>
        ) : (
          <>
            {noProductsMessage}
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded overflow-hidden shadow-lg"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[200px] object-cover"
                />
                <div className="p-4">
                  <h5 className="text-lg text-[#333] mb-2">{product.name}</h5>
                  <p className="text-xl text-[#121212]">
                    ${product.price.toFixed(2)}
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
