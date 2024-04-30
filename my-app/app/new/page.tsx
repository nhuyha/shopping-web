"use client";
import React from "react";
type Product = {
  id: number,
  name: string,
  imageUrl: string,
  detail: string,
  price: number
};
type Order ={
  id: number,
  buyer: string,
  deliveryAddress: string,
  phoneNumber: string,
  items: [
        {
          productId: number,
          quantity: number,
          price: number,
        },
      ],
  totalOrderPrice: number,
  status: string,
};
function MainComponent() {
  const [products, setProducts] = React.useState([
    {
      id: 1,
      name: "Water Bottle",
      imageUrl: "images/water_bottle.jpg",
      detail: "Holds 1 liter, BPA free",
      price: 15,
    },
  ]);
  const [selectedProduct, setSelectedProduct] = React.useState<(Product)>();
  const [selectedOrder, setSelectedOrder] = React.useState<(Order)>();
  const [orders, setOrders] = React.useState([
    {
      id: 1,
      buyer: "Alice Johnson",
      deliveryAddress: "78 Wonderland Ave, Fantasia",
      phoneNumber: "555-123-4567",
      items: [
        {
          productId: 1,
          quantity: 5,
          price: 15,
        },
      ],
      totalOrderPrice: 75,
      status: "Shipped",
    },
  ]);

  const updateOrderStatus = (id:number, newStatus:string) => {
    const updatedOrders = orders.map((order) =>
      order.id === id ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
  };

  const updateProduct = (id:number, name:string, imageUrl:string, detail:string, price:number) => {
    const updatedProducts = products.map((product) =>
      product.id === id
        ? { ...product, name, imageUrl, detail, price }
        : product
    );
    setProducts(updatedProducts);
  };

  const addProduct = (name:string, imageUrl:string, detail:string, price:number) => {
    const newProduct = {
      id: products.length + 1,
      name,
      imageUrl,
      detail,
      price,
    };
    setProducts([...products, newProduct]);
  };

  const deleteProduct = (id:number) => {
    const filteredProducts = products.filter((product) => product.id !== id);
    setProducts(filteredProducts);
  };

  const handleProductSelection = (product:Product) => {
    setSelectedProduct(product);
  };

  const handleOrderSelection = (order:Order) => {
    setSelectedOrder(order);
  };

  const handleProductUpdate = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    updateProduct(
      selectedProduct!.id,
      form.get("name"),
      form.get("imageUrl"),
      form.get("detail"),
      form.get("price")
    );
  };

  const handleAddProduct = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    addProduct(
      form.get("name"),
      form.get("imageUrl"),
      form.get("detail"),
      form.get("price")
    );
    form.reset();
  };

  return (
    <div className="font-roboto">
      <h1 className="text-2xl font-bold mb-4 text-center">Seller Dashboard</h1>
      <div className="flex flex-wrap justify-center gap-10 p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold mb-6">Product Management</h2>
          <form onSubmit={handleAddProduct}>
            <input
              type="text"
              name="name"
              placeholder="Product name"
              className="border p-1 rounded"
              required
            />
            <input
              type="text"
              name="imageUrl"
              placeholder="Image URL"
              className="border p-1 rounded"
              required
            />
            <textarea
              name="detail"
              placeholder="Details"
              className="border p-1 rounded"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              className="border p-1 rounded"
              required
            />
            <button
              type="submit"
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Product
            </button>
          </form>
          {products.map((product) => (
            <div
              key={product.id}
              className="my-4 p-4 border-b cursor-pointer"
              onClick={() => handleProductSelection(product)}
            >
              <img
                src={product.imageUrl}
                alt={`Image of ${product.name}`}
                className="h-20 my-2"
              />
              <p>Name: {product.name}</p>
              <p>Details: {product.detail}</p>
              <p>Price: ${product.price}</p>
              <button
                className="text-red-500"
                onClick={() => deleteProduct(product.id)}
              >
                Delete
              </button>
            </div>
          ))}
          {selectedProduct && (
            <form onSubmit={handleProductUpdate}>
              <input
                type="text"
                name="name"
                className="border p-1 rounded"
                defaultValue={selectedProduct.name}
              />
              <input
                type="text"
                name="imageUrl"
                className="border p-1 rounded"
                defaultValue={selectedProduct.imageUrl}
              />
              <textarea
                name="detail"
                className="border p-1 rounded"
                defaultValue={selectedProduct.detail}
              />
              <input
                type="number"
                name="price"
                className="border p-1 rounded"
                defaultValue={selectedProduct.price}
              />
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Update
              </button>
            </form>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold mb-6">Order Management</h2>
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-4 mb-2 border-b cursor-pointer"
              onClick={() => handleOrderSelection(order)}
            >
              <p>Order ID: {order.id}</p>
              <p>Total Price: ${order.totalOrderPrice}</p>
              <p>Status: {order.status}</p>
            </div>
          ))}
          {selectedOrder && (
            <div>
              <h3 className="text-lg font-bold mb-4">Order Details</h3>
              <p>
                Name:{" "}
                <span className="font-semibold">{selectedOrder.buyer}</span>
              </p>
              <p>
                Address:{" "}
                <span className="font-semibold">
                  {selectedOrder.deliveryAddress}
                </span>
              </p>
              <p>
                Phone:{" "}
                <span className="font-semibold">
                  {selectedOrder.phoneNumber}
                </span>
              </p>
              {selectedOrder.items.map((item, index) => (
                <div key={index}>
                  <p>
                    Product Name:{" "}
                    <span className="font-semibold">
                      {products.find((p) => p.id === item.productId).name}
                    </span>
                  </p>
                  <p>
                    Quantity:{" "}
                    <span className="font-semibold">{item.quantity}</span>
                  </p>
                  <p>
                    Price per item:{" "}
                    <span className="font-semibold">${item.price}</span>
                  </p>
                </div>
              ))}
              <p>
                Total Order Price:{" "}
                <span className="font-semibold">
                  ${selectedOrder.totalOrderPrice}
                </span>
              </p>
              <button
                onClick={() => updateOrderStatus(selectedOrder.id, "Delivered")}
                className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Mark as Delivered
              </button>
              <button
                onClick={() => updateOrderStatus(selectedOrder.id, "Shipped")}
                className="mt-4 ml-4 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
              >
                Mark as Shipped
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainComponent;