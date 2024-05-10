"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from 'next/navigation';
import { Localized,useLocalization } from "@fluent/react";
type Customer={
  CustomerID:number,
  CustomerName:string,
  username:string,
  password:string,
  Email:string,
  Address:string,
  PhoneNumber: string,
}

function MainComponent() {
  const Router=useRouter();
  const [menu, setMenu] = React.useState("profile");
  const [Customer, setCustomer]= React.useState<Customer>();
  useEffect(() => {
    fetch("http://127.0.0.1:8000/thong_tin_khach_hang")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setCustomer(data);
      })
      .catch((error) => {
        console.error("Fetch Error:", error);
      });
  },);
  function handleMenuChange(menuOption:string) {
    if (menuOption==="logout"){
      const token = localStorage.getItem("token");
      try {
        const response = fetch(
          "http://127.0.0.1:8000//xoa_token",
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
        Router.push("/login")
      } catch (error) {
        alert("Failed to add product");
        console.error("Error during add product:", error);
        throw error;
      }}      
    else setMenu(menuOption);
    
  }
  const handleTitleClick = () => {
    Router.push("/");
  };

  return (
    <div className="p-4">
      <header className="flex items-center justify-between bg-[#1a73e8] p-4 text-white">
        <h1 className="text-3xl cursor-pointer" onClick={handleTitleClick}>
          Online Marketplace
        </h1>
        <div className="flex justify-between items-center mb-6">
        
        <button
          className="bg-[#007BFF] text-white px-4 py-2 font-roboto rounded"
          onClick={() => handleMenuChange("logout")}
        >
          Đăng xuất
        </button>
      </div>
      </header>
      <ul>
      {menu === "profile" &&(
        <div>
          <h1 className="text-[#121212] font-roboto text-xl">
          Thông tin tài khoản
        </h1>
        
          <div className="mb-4">
            <span>Name:</span>
            <label className="block font-roboto text-sm text-[#666] mb-2">
              Tên:
            </label>
            <div className="font-roboto text-[#333]"></div>
          </div>
          <div className="mb-4">
            <label className="block font-roboto text-sm text-[#666] mb-2">
              Username:
            </label>
            <div className="font-roboto text-[#333]">nguyenvana</div>
          </div>
          <div className="mb-4">
            <label className="block font-roboto text-sm text-[#666] mb-2">
              Email:
            </label>
            <div className="font-roboto text-[#333]">
              nguyenvana@example.com
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-roboto text-sm text-[#666] mb-2">
              Address:
            </label>
            <div className="font-roboto text-[#333]">
              123 Nguyen Trai, Hanoi, Vietnam
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-roboto text-sm text-[#666] mb-2">
              Phone Number:
            </label>
            <div className="font-roboto text-[#333]">0123456789</div>
          </div>
      
          <button
            className="bg-[#007BFF] text-white px-4 py-2 font-roboto rounded mb-4"
            onClick={() => handleMenuChange("changePassword")}
          >
            Thay đổi mật khẩu
          </button>
          <button
            className="bg-[#007BFF] text-white px-4 py-2 font-roboto rounded"
            onClick={() => handleMenuChange("changeProfile")}
          >
            Thay đổi thông tin cá nhân
          </button>
        </div>
      )}</ul>

      {menu === "changePassword" && (
        <div>
          <div className="mb-4">
            <label className="block font-roboto text-sm text-[#666] mb-2">
              Mật khẩu cũ:
            </label>
            <input
              type="password"
              name="oldPassword"
              className="border border-[#CCC] w-full p-2 font-roboto"
            />
          </div>
          <div className="mb-4">
            <label className="block font-roboto text-sm text-[#666] mb-2">
              Mật khẩu mới:
            </label>
            <input
              type="password"
              name="newPassword"
              className="border border-[#CCC] w-full p-2 font-roboto"
            />
          </div>
          <div className="mb-4">
            <label className="block font-roboto text-sm text-[#666] mb-2">
              Xác nhận mật khẩu:
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="border border-[#CCC] w-full p-2 font-roboto"
            />
          </div>
          <button
            className="bg-[#007BFF] text-white px-4 py-2 font-roboto rounded mb-4"
            onClick={() => handleMenuChange("profile")}
          >
            Submit
          </button>
        </div>
      )}

      {menu === "changeProfile" && (
        <div>
          <div className="mb-4">
            <label className="block font-roboto text-sm text-[#666] mb-2">
              Tên:
            </label>
            <input
              type="text"
              name="name"
              className="border border-[#CCC] w-full p-2 font-roboto"
            />
          </div>
          <div className="mb-4">
            <label className="block font-roboto text-sm text-[#666] mb-2">
              Email:
            </label>
            <input
              type="email"
              name="email"
              className="border border-[#CCC] w-full p-2 font-roboto"
            />
          </div>
          <div className="mb-4">
            <label className="block font-roboto text-sm text-[#666] mb-2">
              Address:
            </label>
            <input
              type="text"
              name="address"
              className="border border-[#CCC] w-full p-2 font-roboto"
            />
          </div>
          <div className="mb-4">
            <label className="block font-roboto text-sm text-[#666] mb-2">
              Phone Number:
            </label>
            <input
              type="tel"
              name="phoneNumber"
              className="border border-[#CCC] w-full p-2 font-roboto"
            />
          </div>
          <button
            className="bg-[#007BFF] text-white px-4 py-2 font-roboto rounded"
            onClick={() => handleMenuChange("profile")}
          >
            Submit
          </button>
        </div>
      )}

      {menu === "logout" && (
        <div>
          <h2 className="text-[#121212] font-roboto text-xl">
            Bạn đã đăng xuất
          </h2>
        </div>
      )}
    </div>
  );
}

export default MainComponent;