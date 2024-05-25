"use client";
import React, { useState, useEffect, useContext } from "react";
import { Localized, useLocalization } from "@fluent/react";
import { useRouter } from 'next/navigation';
import { link } from "../link";

function MainComponent() {
  const Router = useRouter();
  const a =new URLSearchParams(location.search) 
  const Amount=parseInt(a.get("vnp_Amount")!)/100
  const status=a.get("vnp_TransactionStatus")
  const orderid=a.get("vnp_TxnRef")
  const handleLogout = async () => {
  const token = localStorage.getItem("token");
    try {
      const response = await fetch(link+"/xoa_token", {
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to logout");
      }
      Router.push("/login");
    } catch (error) {
      alert("Failed to logout");
      console.error("Error during logout:", error);
    }
};
 const handleTitleClick = () => {
  Router.push("/");
};
  return (
    <div className="w-full min-h-screen bg-white text-black font-roboto">
        <header className="flex items-center justify-between bg-white p-4 shadow-md">
        <h1 className="text-3xl cursor-pointer font-sans" onClick={handleTitleClick}>
          Online Bookstore
        </h1>
        <button
          className="mt-3 bg-gray-800 text-white rounded px-6 py-2 hover:bg-gray-700 active:bg-gray-900 transition duration-150 ease-in-out"
          onClick={handleLogout}
        >
          <Localized id="logout"></Localized>
        </button>
      </header>
      <div className="flex flex-col items-center p-6 bg-[#f4f4f4] min-h-screen">
      <h1 className="text-2xl font-bold text-[#333] mb-4 font-roboto">
        Kết Quả Giao Dịch
      </h1>
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 font-roboto">
            Tên Khách Hàng:
          </label>
          <p className="mt-1 font-roboto">Hà</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 font-roboto">
            Mã Đơn Hàng:
          </label>
          <p className="mt-1 font-roboto">{orderid}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 font-roboto">
            Tổng Giá Tiền:
          </label>
          <p className="mt-1 font-roboto">{Amount} VND</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 font-roboto">
            Ngày Thanh Toán:
          </label>
          <p className="mt-1 font-roboto">25/05/2024</p>
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
    </div>
  );
}

export default MainComponent;