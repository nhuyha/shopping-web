"use client";
import React from "react";
import { useRouter } from 'next/navigation';

function MainComponent() {
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
    try {
        const response = await fetch('https://organic-guacamole-j6qqg64q74625xx6-8000.app.github.dev/dang_nhap', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
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
        <div className="mb-4">
          <label
            className="block text-lg font-roboto text-[#333] mb-2"
            htmlFor="username"
          >
            Tên đăng nhập
          </label>
          <input
            name="username"
            id="username"
            type="text"
            required
            placeholder="Nhập tên đăng nhập"
            className="w-full px-3 py-2 border rounded text-lg text-[#333]"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-lg font-roboto text-[#333] mb-2"
            htmlFor="password"
          >
            Mật khẩu
          </label>
          <input
            name="password"
            id="password"
            type="password"
            required
            placeholder="Nhập mật khẩu"
            className="w-full px-3 py-2 border rounded text-lg text-[#333]"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Đăng nhập
          </button>
        </div>
      </form>
    </div>
  );
}

export default MainComponent;