"use client";
import React from "react";

function MainComponent() {
  const handleAddToCart = () => {
    alert("Thêm vào giỏ hàng");
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-screen p-4">
      <div className="w-full md:w-[400px]">
        <img
          src="./product.jpg"
          alt="A detailed view of the product"
          className="w-full h-auto"
        />
      </div>
      <div className="w-full md:w-[400px] mt-4 md:mt-0 md:ml-4">
        <h1 className="text-2xl font-bold font-roboto">Tên sản phẩm</h1>
        <p className="text-xl font-semibold text-gray-700 mt-2">
          $ Giá sản phẩm
        </p>
        <p className="text-md text-gray-600 mt-2">
          Mô tả chi tiết sản phẩm. Thông tin chi tiết về đặc điểm, thành phần,
          và các thông tin cần thiết khác sẽ được đề cập ở đây.
        </p>
        <button
          className="w-full bg-blue-500 text-white py-2 px-4 mt-4 font-medium font-roboto"
          onClick={handleAddToCart}
        >
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
}

export default MainComponent;