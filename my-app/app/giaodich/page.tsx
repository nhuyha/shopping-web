"use client";
import React from "react";

function MainComponent() {
  const a =new URLSearchParams(location.search) 
 const OrderID=a.get("vnp_Amount")
 const status=a.get("vnp_TransactionStatus")

  return (
    <div className="flex flex-col items-center p-6 bg-[#f4f4f4] min-h-screen">
      <h1 className="text-2xl font-bold text-[#333] mb-4 font-roboto">
        Kết Quả Giao Dịch
      </h1>
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 font-roboto">
            Tên Khách Hàng:
          </label>
          <p className="mt-1 font-roboto">Nguyễn Văn A</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 font-roboto">
            Mã Đơn Hàng:
          </label>
          <p className="mt-1 font-roboto">ORD123456789</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 font-roboto">
            Tổng Giá Tiền:
          </label>
          <p className="mt-1 font-roboto">2.000.000 VND</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 font-roboto">
            Ngày Thanh Toán:
          </label>
          <p className="mt-1 font-roboto">01/01/2023</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 font-roboto">
            Kết Quả Giao Dịch:
          </label>
        { (status==="00")? (<p className="mt-1 font-roboto text-green-600">Thành Công</p>)
        :(<p className="mt-1 font-roboto text-red-600">Thất bại</p>)}
        </div>
      </div>
    </div>
  );
}

export default MainComponent;