"use client";
import React from "react";

function MainComponent() {
  const [products, setProducts] = React.useState([
    {
      id: 1,
      name: "Wireless Headphones",
      price: 99.99,
      image: "/images/headphones.jpg",
    },
    {
      id: 2,
      name: "Smartwatch",
      price: 199.99,
      image: "/images/smartwatch.jpg",
    },
    {
      id: 3,
      name: "Portable Speaker",
      price: 149.99,
      image: "/images/speaker.jpg",
    },
  ]);
  const [cart, setCart] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [showCart, setShowCart] = React.useState(false);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product) => {
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

  const handleCartClick = () => {
    setShowCart(true);
  };

  const handleTitleClick = () => {
    setShowCart(false);
  };

  const noProductsMessage =
    search && filteredProducts.length === 0 ? <p>No products found.</p> : null;

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
            placeholder="Search products"
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
            <h2 className="text-lg font-semibold mb-4">Cart Items:</h2>
            <ul>
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="mb-2 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={`Image of ${item.name}`}
                      className="w-20 h-20 object-cover"
                    />
                    <span>{item.name}</span>
                  </div>
                  <span>Quantity: {item.quantity}</span>
                </li>
              ))}
              {cart.length === 0 && <li>Your cart is empty.</li>}
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
                  alt={`${product.name} product image`}
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
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </main>
      <footer className="bg-[#1a73e8] p-4 text-center text-white">
        © 2023 Online Marketplace
      </footer>
    </div>
  );
}

export default MainComponent;