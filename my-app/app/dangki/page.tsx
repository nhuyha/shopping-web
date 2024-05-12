"use client";
import React from "react";
import { useRouter } from 'next/navigation';
import libsodium from 'libsodium-wrappers-sumo';
import { Buffer } from "buffer";
import {link} from "../link";


function MainComponent() {
  const Router=useRouter();
  const handleSubmit = (event:React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    dangki(
      formData.get("ten") as string,
      formData.get("username") as string,
      formData.get("password") as string,
      formData.get("email") as string,
      formData.get("address") as string,
      formData.get("phone") as string,

    );
  };
  async function dangki(ten: string, username: string, password: string, email: string, address:string, phone:string): Promise<any> {
    await libsodium.ready; console.log(libsodium)
    password=Buffer.from(libsodium.crypto_pwhash(32,password,new Uint8Array([1,32,16,17,98,77,55,21,56,102,11,24,68,23,14,17]),libsodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,libsodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,libsodium.crypto_pwhash_ALG_DEFAULT)).toString('base64')
    const params= new URLSearchParams()
    params.append('ten',ten)
    params.append('username', username)
    params.append('password',password)
    params.append('email',email)
    params.append('address', address)
    params.append('phone',phone)
    try {
        const response = await fetch(link+"/them_khach_hang?" + params, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            
        });

        if (!response.ok) {
            throw new Error('Failed to login');
        }

        const data = await response.json();
        if (data===null){
            throw new Error('Failed to login');
        }
        else{
            Router.push("/login");
        }
        
    } catch (error) {
        alert('Failed to login');
        console.error('Error during login:', error);
        throw error;
    }
}

  return (
    <div className="bg-[#F5F5F5] min-h-screen flex justify-center items-center">
      <form 
      onSubmit={handleSubmit}
      className="w-full max-w-[400px] bg-white p-8 shadow-md rounded">
        <h1 className="font-roboto text-2xl text-center mb-6">
          Register for Online Shopping
        </h1>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="fullName"
          >
            Full Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="fullName"
            placeholder="Full Name"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="username"
            placeholder="Username"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            name="password"
            placeholder="********"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="email"
            name="email"
            placeholder="Email"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="address"
          >
            Address
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="address"
            placeholder="Address"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="phone"
          >
            Phone
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="phone"
            placeholder="Phone Number"
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            className="bg-[#3498db] hover:bg-[#2980b9] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default MainComponent;