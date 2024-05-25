"use client";
import React, { useState, useEffect, useContext } from "react";
import { Localized, useLocalization } from "@fluent/react";
import { useRouter } from 'next/navigation';
import { link } from "../link";

type Product = {
  id: number;
  name: string;
  image_url: string;
  price: number;
  Quantity:number;
};

function MainComponent() {
    const Router = useRouter();
  const [ratingProduct, setRatingProduct] = useState<number | null>(null);
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});

  const [products, setProducts] = React.useState<Product[]>([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(link+"/danh_sach_san_pham_da_mua",{
        headers: {
          accept: "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Fetch Error:", error);
      });
  }, []);

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
  const handleRatingClick = (productId: number) => {
    setRatingProduct(productId);
  };

  const handleSetRating = (productId: number, rate: number) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [productId]: rate,
    }));
    setRatingProduct(null);
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
        <Localized id="Sản phẩm đã mua"></Localized>
        </h1>        
      </div>
      <div className="space-y-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-6 rounded-lg shadow w-full flex space-x-6"
          >
            <img
              src={product.image_url}
              alt={`Ảnh của ${product.name}`}
              className="w-[120px] h-[200px] object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600">Số lượng: {product.Quantity}</p>
              <p className="text-gray-600">
                Giá: {product.price.toLocaleString()} VND
              </p>
              {ratingProduct === product.id ? (
                <div className="flex space-x-2 mt-4">
                  {[1, 2, 3, 4, 5].map((rate) => {
                    const buttonClass =
                      rate <= (ratings[product.id] || 0)
                        ? "bg-yellow-400"
                        : "bg-gray-200";
                    return (
                      <button
                        key={rate}
                        onClick={() => handleSetRating(product.id, rate)}
                        className={`py-1 px-3 rounded ${buttonClass}`}
                      >
                        {rate}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <button
                  onClick={() => handleRatingClick(product.id)}
                  className="mt-4 py-2 px-4 bg-blue-500 text-white rounded"
                  name="rateProduct"
                >
                  Đánh giá sản phẩm
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainComponent;
