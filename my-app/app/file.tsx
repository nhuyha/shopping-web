"use client";
import React from "react";

function MainComponent() {
  const [selectedOrder, setSelectedOrder] = React.useState(null);

  const orders = [
    {
      id: 1,
      buyer: "Alice Johnson",
      deliveryAddress: "78 Wonderland Ave, Fantasia",
      phoneNumber: "555-123-4567",
      productName: "Water Bottle",
      productQuantity: 5,
      productPrice: 15,
      totalOrderPrice: 75,
      status: "Shipped",
    },
    {
      id: 2,
      buyer: "Bob Smith",
      deliveryAddress: "123 Dreamland Road, Neverland",
      phoneNumber: "555-987-6543",
      productName: "Water Bottle",
      productQuantity: 3,
      productPrice: 15,
      totalOrderPrice: 45,
      status: "Pending",
    },
    {
      id: 3,
      buyer: "Charlie Black",
      deliveryAddress: "456 Mystic Falls, Narnia",
      phoneNumber: "555-789-1234",
      productName: "Water Bottle",
      productQuantity: 10,
      productPrice: 15,
      totalOrderPrice: 150,
      status: "Delivered",
    },
  ];

  return (
    <div className="font-roboto">
      <h1 className="text-2xl font-bold mb-4 text-center">Seller Dashboard</h1>
      <div className="flex flex-wrap justify-center gap-10 p-4">
        <div className="bg-[#f7f7f7] p-6 rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold mb-6">Post Product</h2>
          <form className="space-y-4">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="productName"
              >
                Product Name
              </label>
              <input
                name="productName"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="productPrice"
              >
                Price
              </label>
              <input
                name="productPrice"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="productImage"
              >
                Product Image
              </label>
              <input
                name="productImage"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="file"
                accept="image/*"
              />
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold mb-6">Order Management</h2>
          <div>
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-4 mb-2 border-b"
                onClick={() => setSelectedOrder(order)}
              >
                <p>Order ID: {order.id}</p>
                <p>Price: {order.productPrice}</p>
                <p>Status: {order.status}</p>
              </div>
            ))}
          </div>
          {selectedOrder && (
            <div className="mt-6">
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
              <p>
                Product Name:{" "}
                <span className="font-semibold">
                  {selectedOrder.productName}
                </span>
              </p>
              <p>
                Quantity:{" "}
                <span className="font-semibold">
                  {selectedOrder.productQuantity}
                </span>
              </p>
              <p>
                Price per item:{" "}
                <span className="font-semibold">
                  {selectedOrder.productPrice}
                </span>
              </p>
              <p>
                Total Order Price:{" "}
                <span className="font-semibold">
                  ${selectedOrder.totalOrderPrice}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainComponent;