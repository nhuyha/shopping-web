"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from 'next/navigation';

import { Localized,useLocalization } from "@fluent/react";
import {link} from "../link"
type Customer = {
  CustomerID: number;
  CustomerName: string;
  username: string;
  password: string;
  Email: string;
  Address: string;
  PhoneNumber: string;
};

// MainComponent definition
function MainComponent() {
  const Router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${link}/thong_tin_khach_hang`, {
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })
      .then(response => response.json())
      .then(setCustomer)
      .catch(error => {
        console.error("Fetch error:", error);
      });
    }
  }, []);
  const handleTitleClick = () => {
    Router.push("/");
  };
  const handleChangePassword = async (newPasswordData) => {
    const token = localStorage.getItem("token");
    if (token && newPasswordData) {
      try {
        const response = await fetch(`${link}/doi_mat_khau`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(newPasswordData)
        });
        if (!response.ok) {
          throw new Error("Password change failed");
        }
        alert("Password changed successfully!");
      } catch (error) {
        alert("Failed to change password");
        console.error("Error during password change:", error);
      }
    }
  };

  const handleChangeProfile = async (newProfileData) => {
    const token = localStorage.getItem("token");
    if (token && newProfileData) {
      try {
        const response = await fetch(`${link}/cap_nhat_ho_so`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(newProfileData)
        });
        if (!response.ok) {
          throw new Error("Profile update failed");
        }
        alert("Profile updated successfully!");
      } catch (error) {
        alert("Failed to update profile");
        console.error("Error during profile update:", error);
      }
    }
  };

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

  return (
    <div className="p-4">
      <header className="flex items-center justify-between bg-[#1a73e8] p-4 text-white">
        <h1 className="text-3xl cursor-pointer" onClick={handleTitleClick}>
          Online Marketplace
        </h1>
        <button
          className="bg-[#007BFF] text-white px-4 py-2 font-roboto rounded"
          onClick={handleLogout}
        >
          Đăng xuất
        </button>
      </header>

      <div>
        <h1 className="text-[#121212] font-roboto text-xl">
          Thông tin tài khoản
        </h1>
        {/* Display customer information if available */}
        {customer && (
          <>
            <div className="mb-4">
              <label className="block font-roboto text-sm text-[#666] mb-2">
                Name:
              </label>
              <div className="font-roboto text-[#333]">{customer.CustomerName}</div>
            </div>
            <div className="mb-4">
              <label className="block font-roboto text-sm text-[#666] mb-2">
                Username:
              </label>
              <div className="font-roboto text-[#333]">{customer.username}</div>
            </div>
            <div className="mb-4">
              <label className="block font-roboto text-sm text-[#666] mb-2">
                Email:
              </label>
              <div className="font-roboto text-[#333]">{customer.Email}</div>
            </div>
            <div className="mb-4">
              <label className="block font-roboto text-sm text-[#666] mb-2">
                Address:
              </label>
              <div className="font-roboto text-[#333]">{customer.Address}</div>
            </div>
            <div className="mb-4">
              <label className="block font-roboto text-sm text-[#666] mb-2">
                Phone Number:
              </label>
              <div className="font-roboto text-[#333]">{customer.PhoneNumber}</div>
            </div>
          </>
        )}

        {/* Buttons to trigger password and profile changes */}
        <button
          className="bg-[#007BFF] text-white px-4 py-2 font-roboto rounded mb-4"
          onClick={() => handleChangePassword({ oldPassword: '', newPassword: '' })}  // Example structure, update as needed
        >
          Thay đổi mật khẩu
        </button>
        <button
          className="bg-[#007BFF] text-white px-4 py-2 font-roboto rounded"
          onClick={() => handleChangeProfile({ name: '', email: '', address: '', phoneNumber: '' })}  // Example structure, update as needed
        >
          Thay đổi thông tin cá nhân
        </button>
      </div>
    </div>
  );

};

export default MainComponent;