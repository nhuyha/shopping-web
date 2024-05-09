"use client";
import React from "react";

function MainComponent() {
  const [menu, setMenu] = React.useState("profile");

  function handleMenuChange(menuOption) {
    setMenu(menuOption);
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[#121212] font-roboto text-xl">
          Thông tin tài khoản
        </h1>
        <button
          className="bg-[#007BFF] text-white px-4 py-2 font-roboto rounded"
          onClick={() => handleMenuChange("logout")}
        >
          Đăng xuất
        </button>
      </div>
      {menu === "profile" && (
        <div>
          <div className="mb-4">
            <label className="block font-roboto text-sm text-[#666] mb-2">
              Tên:
            </label>
            <div className="font-roboto text-[#333]">Nguyen Van A</div>
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
      )}

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