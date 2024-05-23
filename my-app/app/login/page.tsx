"use client";
import React from "react";
import { useRouter } from 'next/navigation';
import libsodium from 'libsodium-wrappers-sumo';
import { Buffer } from "buffer";
import{link} from  "../link"
import { Localized, useLocalization } from "@fluent/react";

function MainComponent() {
  const localization = useLocalization();
  const Router=useRouter();
  const handleSubmit = (event:React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    login(
      formData.get("username") as string,
      formData.get("password") as string,

    );
  };
  async function login(username: string, password: string): Promise<any> {
    await libsodium.ready;
    password=Buffer.from(libsodium.crypto_pwhash(32,password,new Uint8Array([1,32,16,17,98,77,55,21,56,102,11,24,68,23,14,17]),libsodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,libsodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,libsodium.crypto_pwhash_ALG_DEFAULT)).toString('base64')
    try {
        const response = await fetch(link+"/dang_nhap?username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password), {
            method: 'POST',
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
            
            localStorage.setItem("token",data);
            Router.push("/");
        }
        
    } catch (error) {
        alert('Failed to login');
        console.error('Error during login:', error);
        throw error;
    }
}


  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f0f0f0]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[400px] p-8 bg-white shadow-md rounded"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">
        <Localized id="Login"></Localized>
      </h1>
        <div className="mb-4">
          <label
            className="block text-lg font-roboto text-[#333] mb-2"
            htmlFor="username"
          >
            
            <Localized id="Username"></Localized>
          </label>
          <input
            name="username"
            id="username"
            type="text"
            required
            placeholder={localization.l10n.getString("Enter-username")}
            className="w-full px-3 py-2 border rounded text-lg text-[#333]"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-lg font-roboto text-[#333] mb-2"
            htmlFor="password"
          >
            <Localized id="Password"></Localized>
          </label>
          <input
            name="password"
            id="password"
            type="password"
            required
            placeholder={localization.l10n.getString("Enter-password")}            className="w-full px-3 py-2 border rounded text-lg text-[#333]"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            <Localized id="submit"></Localized>
          </button>
        </div>
        <div>
        <p className="text-center">
          Bạn chưa có tài khoản?{" "}
          <a
            href="#"
            onClick={() => Router.push("/dangki")}
            className="text-[#3498db] hover:underline"
          >
            Đăng kí tài khoản
          </a>
        </p>
        </div>
      </form>
    </div>
  );
}

export default MainComponent;