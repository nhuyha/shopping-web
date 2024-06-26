"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from 'next/navigation';
import libsodium from 'libsodium-wrappers-sumo';
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
  const localization = useLocalization();
  const [customer, setCustomer] = useState<Customer | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    
      fetch(link+"/thong_tin_khach_hang", {
        method: "GET",
          headers: {
            accept: "application/json",
            Authorization: "Bearer " + token,
          },
      })
      .then(response => response.json())
      .then(data=>{
        setCustomer(data)
      })
      .catch(error => {
        console.error("Fetch error:", error);
      });
    
  }, []);
  const [changePassword, setChangePassword] = React.useState(false);
  const [changeProfile, setChangeProfile] = React.useState(false);
  const [ShowProfile, setShowProfile] = React.useState(true);
  const changePasswordClick=()=>{
    setChangePassword(true)
    setShowProfile(false)
  };
  const changeProfileClick=()=>{
    setChangeProfile(true)
    setShowProfile(false)
  }
  async function ChangePassword(newPassword:string): Promise<any> {
    const token = localStorage.getItem("token");
    await libsodium.ready;
    newPassword=Buffer.from(libsodium.crypto_pwhash(32,newPassword,new Uint8Array([1,32,16,17,98,77,55,21,56,102,11,24,68,23,14,17]),libsodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,libsodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,libsodium.crypto_pwhash_ALG_DEFAULT)).toString('base64')
    try {
        const response = await fetch(link+"/khach_hang_doi_mat_khau?newPassword=" + encodeURIComponent(newPassword), {
          method: "PUT",
          headers: {
            accept: "application/json",
            Authorization: "Bearer " + token,
          },
        });
        if (!response.ok) {
          throw new Error("Password change failed");
        }
        alert("Password changed successfully!");
        handleLogout()
      } catch (error) {
        alert("Failed to change password");
        console.error("Error during password change:", error);
      }
    
  };
  async function ChangeProfile(CustomerName:string,Email:string,Address:string,PhoneNumber:string): Promise<any> {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams();
    params.append("CustomerName", CustomerName);
    params.append("Email",Email);
    params.append("Address",Address);
    params.append("PhoneNumber",PhoneNumber);
    try {
        const response = await fetch(link+"/khach_hang_chinh_sua_thong_tin?" + params, {
          method: "PUT",
          headers: {
            accept: "application/json",
            Authorization: "Bearer " + token,
          },
        });
        if (!response.ok) {
          throw new Error("Profile change failed");
        }
        alert("Profile changed successfully!");
        setCustomer({
          'CustomerID': customer!.CustomerID,
          'CustomerName': CustomerName,
          'username': customer!.username,
          'password': customer!.password,
          'Email': Email,
          'Address': Address,
          'PhoneNumber': PhoneNumber
        })
        setChangeProfile(false)
        setShowProfile(true)
      } catch (error) {
        alert("Failed to change profile");
        console.error("Error during profile change:", error);
      }
    
  };
  async function checkPassword(oldPassword:string,newPassword:string): Promise<any> {
    const token = localStorage.getItem("token");
    await libsodium.ready;
    oldPassword=Buffer.from(libsodium.crypto_pwhash(32,oldPassword,new Uint8Array([1,32,16,17,98,77,55,21,56,102,11,24,68,23,14,17]),libsodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,libsodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,libsodium.crypto_pwhash_ALG_DEFAULT)).toString('base64')
    try {
        const response = await fetch(link+"/khach_hang_xac_minh?password=" + encodeURIComponent(oldPassword), {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: "Bearer " + token,
          },
        });
        if (!response.ok) {
          throw new Error("Password wrong");
        }
        ChangePassword(newPassword)
      } catch (error) {
        alert("Failed to change password");
        console.error("Error during password change:", error);
      }
  };
  const handleChangePassword = (event:React.SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const formData = new FormData(form);
      checkPassword(
        formData.get("oldPassword") as string,
        formData.get("newPassword") as string,
      );
    };
  

  const handleChangeProfile = (event:React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    ChangeProfile(
      formData.get("CustomerName") as string,
      formData.get("Email") as string,
      formData.get("Address") as string,
      formData.get("PhoneNumber") as string,
    );
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
  const handleTitleClick = () => {
    Router.push("/");
  };
  const handleRatingClick = () => {
    Router.push("/rating");
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

      <div className="flex justify-center mt-8">
        <h1 className="text-[#121212] font-roboto text-2xl">
        <Localized id="Profile"></Localized>
          
        </h1>        
      </div>
      <main className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {changePassword && (
          <div className="col-span-full bg-white p-4">
            <form
              onSubmit={handleChangePassword}
              className="w-full max-w-[400px] p-8 bg-white shadow-md rounded"
              >
              <h1 className="text-2xl font-bold mb-4 text-center">
                <Localized id="ChangePassword"></Localized>
              </h1>
              <div className="mb-4">
              <label
                className="block text-lg font-roboto text-[#333] mb-2"
                 htmlFor="oldPassword"
              >
            
                <Localized id="OldPassword"></Localized>
              </label>
              <input
                name="oldPassword"
                id="oldPassword"
                type="text"
                required
                placeholder={localization.l10n.getString("Enter-OldPassword")}
                className="w-full px-3 py-2 border rounded text-lg text-[#333]"
              />
              </div>
              <div className="mb-6">
              <label
                className="block text-lg font-roboto text-[#333] mb-2"
                htmlFor="newPassword"
              >
                <Localized id="NewPassword"></Localized>
              </label>
              <input
                name="newPassword"
                id="newPassword"
                type="text"
                required
                placeholder={localization.l10n.getString("Enter-newpassword")}            
                className="w-full px-3 py-2 border rounded text-lg text-[#333]"
                /></div>
              <div className="flex items-center justify-between">
              <button
              type="submit"
              className="mt-3 bg-gray-800 text-white rounded px-6 py-2 hover:bg-gray-700 active:bg-gray-900 transition duration-150 ease-in-out"
              >
              <Localized id="submit"></Localized>
              </button>
              </div>
            </form>
          </div>)}
            <>
            {ShowProfile && customer && (
            <>
            <div className="mb-4">
              <label className="block font-roboto text-sm text-[#666] mb-2">
              <Localized id="name"></Localized>:
              </label>
              <div className="font-roboto text-[#333]">{customer.CustomerName}</div>
            </div>
            <div className="mb-4">
              <label className="block font-roboto text-sm text-[#666] mb-2">
              <Localized id="Username"></Localized>:
              </label>
              <div className="font-roboto text-[#333]">{customer.username}</div>
            </div>
            <div className="mb-4">
              <label className="block font-roboto text-sm text-[#666] mb-2">
              <Localized id="Email"></Localized>:
              </label>
              <div className="font-roboto text-[#333]">{customer.Email}</div>
            </div>
            <div className="mb-4">
              <label className="block font-roboto text-sm text-[#666] mb-2">
              <Localized id="address"></Localized>:
              </label>
              <div className="font-roboto text-[#333]">{customer.Address}</div>
            </div>
            <div className="mb-4">
              <label className="block font-roboto text-sm text-[#666] mb-2">
              <Localized id="phone"></Localized>:
              </label>
              <div className="font-roboto text-[#333]">{customer.PhoneNumber}</div>
            </div>
            <div className="mt-8">
              <button
                  className="mt-3 mx-6 bg-gray-800 text-white rounded px-6 py-2 hover:bg-gray-700 active:bg-gray-900 transition duration-150 ease-in-out"
                  onClick={changePasswordClick}  // Example structure, update as needed
                >
                  <Localized id="ChangePassword"></Localized>
                </button>
                  
                <button
                  className="mt-3 mx-6 bg-gray-800 text-white rounded px-6 py-2 hover:bg-gray-700 active:bg-gray-900 transition duration-150 ease-in-out"
                  onClick={changeProfileClick}  // Example structure, update as needed
                >
                  <Localized id="ChangeProfile"></Localized>
              </button>
              <button
                  className="mt-3 mx-6 bg-gray-800 text-white rounded px-6 py-2 hover:bg-gray-700 active:bg-gray-900 transition duration-150 ease-in-out"
                  onClick={handleRatingClick}  // Example structure, update as needed
                >
                  <Localized id="Sản phẩm đã mua"></Localized>
                </button>
            </div>
            </>
            
          )}
          </>

        {changeProfile&&customer &&(
          <div className="col-span-full bg-white p-4">
            <form
              onSubmit={handleChangeProfile}
              className="w-full max-w-[400px] p-8 bg-white shadow-md rounded"
              >
              <h1 className="text-2xl font-bold mb-4 text-center">
                <Localized id="ChangeProfile"></Localized>
              </h1>
              <div className="mb-4">
              <label
                className="block text-lg font-roboto text-[#333] mb-2"
                 htmlFor="CustomerName"
              >
                <Localized id="name"></Localized>
              </label>
              <input
              name="CustomerName"
              id="CustomerName"
              type="text"
              required
              placeholder={customer.CustomerName}
              className="w-full px-3 py-2 border rounded text-lg text-[#333]"
              />
              </div>
              <div className="mb-4">
              <label
                className="block text-lg font-roboto text-[#333] mb-2"
                 htmlFor="Email"
              >
                <Localized id="email"></Localized>
              </label>
              <input
              name="Email"
              id="Email"
              type="text"
              required
              placeholder={customer.Email}
              className="w-full px-3 py-2 border rounded text-lg text-[#333]"
              />
              </div>
              <div className="mb-4">
              <label
                className="block text-lg font-roboto text-[#333] mb-2"
                 htmlFor="Address"
              >
            
                <Localized id="address"></Localized>
              </label>
              <input
              name="Address"
              id="Address"
              type="text"
              required
              placeholder={customer.Address}
              className="w-full px-3 py-2 border rounded text-lg text-[#333]"
              />
              </div>
              <div className="mb-4">
              <label
                className="block text-lg font-roboto text-[#333] mb-2"
                 htmlFor="PhoneNumber"
              >
            
                <Localized id="phone"></Localized>
              </label>
              <input
              name="PhoneNumber"
              id="PhoneNumber"
              type="text"
              required
              placeholder={customer.PhoneNumber}
              className="w-full px-3 py-2 border rounded text-lg text-[#333]"
              />
              </div>
            <div className="flex items-center justify-between">
            <button
            type="submit"
            className="mt-3 bg-gray-800 text-white rounded px-6 py-2 hover:bg-gray-700 active:bg-gray-900 transition duration-150 ease-in-out"
            >
            <Localized id="submit"></Localized>
            </button>
        </div>
        </form>
          </div>
        )}
      </main>
        
    </div>
    
  )
}
export default MainComponent;