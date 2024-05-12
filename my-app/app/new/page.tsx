"use client";
import React,{ useState, useEffect } from "react";
import { Localized,useLocalization } from "@fluent/react";
import {link} from "../link"
type Product = {
  id: number,
  name: string,
  image_url: string,
  detail: string,
  price: number
};
type OrderDetail={
  product_id: number,
  quantity: number,
  price: number,
}
type Order ={
  order_id: number,
  customer_name: string,
  address: string,
  phone_number: string,
  details : OrderDetail[],
  total_amount: number,
  status: string,
};
function MainComponent() {
  const localization = useLocalization()
  const [products, setProducts] = React.useState<(Product)[]>([]);
  useEffect(() => {
    fetch(link+'/danh_sach_san_pham')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setProducts(data);
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
}, []);
  const [selectedProduct, setSelectedProduct] = React.useState<(Product)>();
  
  const [selectedOrder, setSelectedOrder] = React.useState<(Order)>();
  const [orders, setOrders] = React.useState<Order[]>([]);
  useEffect(() => {
    fetch(link+'/danh_sach_don_hang')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setOrders(data);
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
}, []);

  const updateOrderStatus = async(id:number, newStatus:string) => {
    const params = new URLSearchParams();
    params.append('order_id', String(id))
    params.append('trang_thai_moi', newStatus)
    try {
      const response = await fetch(link+'/cap_nhat_tinh_trang_don_hang?'+params, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
      });
      if (!response.ok) {
          throw new Error('Failed to add product');
      }
      const updatedOrders = orders.map((order) =>
        order.order_id === id ? { ...order, status: newStatus } : order);
      setOrders(updatedOrders);
    }
      catch (error) {
    alert('Failed to add product');
    console.error('Error during add product:', error);
    throw error;}
    
  };

  const updateProduct = async (id:number, name:string, imageUrl:string, detail:string, price:number) => {
    
    try {
      const response = await fetch(link+'/chinh_sua_san_pham', {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body:JSON.stringify({
            "id":id,
            "ten":name,
            "anh":imageUrl,
            "mo_ta":detail,
            "gia":price
          })
      });
      if (!response.ok) {
          throw new Error('Failed to add product');
      }
      const updatedProducts = products.map((product) =>
        product.id === id
          ? { ...product, name, imageUrl, detail, price }
          : product
      );
      setProducts(updatedProducts);
  }catch (error) {
    alert('Failed to add product');
    console.error('Error during add product:', error);
    throw error;
}
  };

  const addProduct = async(name:string, imageUrl:string, detail:string, price:number) => {
      try {
      const response = await fetch(link+'/them_san_pham', {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body:JSON.stringify({
            "ten":name,
            "anh":imageUrl,
            "mo_ta":detail,
            "gia":price
          })
      });
      if (!response.ok) {
          throw new Error('Failed to add product');
      }
      const id= await response.json()
      setProducts((prevProducts) => [...prevProducts,{id: id,
        name: name,
        image_url: imageUrl,
        detail: detail,
        price: price
      }]);
  }catch (error) {
    alert('Failed to add product');
    console.error('Error during add product:', error);
    throw error;
}
};  

  const deleteProduct = async (id:number) => {
    const params = new URLSearchParams();
    params.append('product_id', String(id))
    try {
      const response = await fetch(link+'/xoa_san_pham?'+params, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
      });
      if (!response.ok) {
          throw new Error('Failed to add product');
      }
      const filteredProducts = products.filter((product) => product.id !== id);
      setProducts(filteredProducts);}
      catch (error) {
    alert('Failed to add product');
    console.error('Error during add product:', error);
    throw error;}
    
  };

  const handleProductSelection = (product:Product) => {
    setSelectedProduct(product);
  };

  const handleOrderSelection = (order:Order) => {
    setSelectedOrder(order);
  };

  const handleProductUpdate = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    updateProduct(
      selectedProduct!.id,
      formData.get("name") as string,
      base64,
      formData.get("detail") as string,
      parseInt(formData.get("price") as string),
    );
    event.currentTarget.reset();
  };
  const [base64, setBase64] = React.useState("");
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setBase64(reader.result);
      };
    }
  }
  const handleAddProduct = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    addProduct(
      form.get("name") as string,
      base64 ,
      form.get("detail") as string,
      parseInt(form.get("price") as string),
    );
    
    event.currentTarget.reset();
  };

  return (
    <div className="font-roboto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        <Localized id="sellerDashboard"></Localized>
      </h1>
      <div className="flex flex-wrap justify-center gap-10 p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold mb-6">
            <Localized id="productManagement"></Localized>
          </h2>
          <form onSubmit={handleAddProduct}>
            <input
              type="text"
              name="name"
              placeholder={localization.l10n.getString("product-name")}
              className="border p-1 rounded"
              required
            />
            <input
            type="file"
            id="file-upload"
            name="image"
            accept="image/*"
            className="block w-full text-sm text-[#666] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#f4f4f4] file:text-[#333]"
            onChange={handleFileChange}
          />
            <textarea
              name="detail"
              placeholder={localization.l10n.getString("product-detail")}
              className="border p-1 rounded"
              required
            />
            <input
              type="number"
              name="price"
              placeholder={localization.l10n.getString("price")}
              className="border p-1 rounded"
              required
            />
            <button
              type="submit"
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              <Localized id="submit"></Localized>
            </button>
          </form>
          {products.map((product) => (
            <div
              key={product.id}
              className="my-4 p-4 border-b cursor-pointer"
              onClick={() => handleProductSelection(product)}
            >
              <img
                src={product.image_url}
                className="h-20 my-2"
              />
              <p><Localized id="name"></Localized>: {product.name}</p>
              <p><Localized id="product-detail"></Localized>: {product.detail}</p>
              <p><Localized id="price">Price</Localized>: ${product.price}</p>
              <button
                className="text-red-500"
                onClick={() => deleteProduct(product.id)}
              >
                <Localized id="delete"></Localized>
              </button>
            </div>
          ))}
          {selectedProduct && (
            <form onSubmit={handleProductUpdate}>
              <input
                type="text"
                name="name"
                className="border p-1 rounded"
                defaultValue={selectedProduct.name}
              />
              <input
                type="file"
                id="file-upload"
                name="image"
                accept="image/*"
                className="border p-1 rounded"
                onChange={handleFileChange}
              />
              <textarea
                name="detail"
                className="border p-1 rounded"
                defaultValue={selectedProduct.detail}
              />
              <input
                type="number"
                name="price"
                className="border p-1 rounded"
                defaultValue={selectedProduct.price}
              />
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                <Localized id="update"></Localized>
              </button>
            </form>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold mb-6">
            <Localized id="order-management"></Localized>
          </h2>
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="p-4 mb-2 border-b cursor-pointer"
              onClick={() => handleOrderSelection(order)}
            >
              <p><Localized id="order-id"></Localized>: {order.order_id}</p>
              <p><Localized id="total-order-price"></Localized>: $ {order.total_amount}</p>
              <p><Localized id="status"></Localized>: {order.status}</p>
            </div>
          ))}
          {selectedOrder && (
            <div>
              <h3 className="text-lg font-bold mb-4"><Localized id="orderDetails"></Localized></h3>
              <p>
                <Localized id="name"></Localized>:{" "}
                <span className="font-semibold">{selectedOrder.customer_name}</span>
              </p>
              <p>
                <Localized id="address"></Localized>:{" "}
                <span className="font-semibold">
                  {selectedOrder.address}
                </span>
              </p>
              <p>
                <Localized id="phone"></Localized>:{" "}
                <span className="font-semibold">
                  {selectedOrder.phone_number}
                </span>
              </p>
              {selectedOrder.details.map((OrderDetail) => (
                <div key={OrderDetail.product_id}>
                  <p>
                    <Localized id="product-name"></Localized>:{" "}
                    <span className="font-semibold">
                      {products.find((p) => p.id === OrderDetail.product_id)!.name}
                    </span>
                  </p>
                  <p>
                    <Localized id="quantity"></Localized>:{" "}
                    <span className="font-semibold">{OrderDetail.quantity}</span>
                  </p>
                  <p>
                    <Localized id="price-per-item"></Localized>:{" "}
                    <span className="font-semibold">${OrderDetail.price}</span>
                  </p>
                </div>
              ))}
              <p>
                <Localized id="total-order-price">e</Localized>:{" "}
                <span className="font-semibold">
                  ${selectedOrder.total_amount}
                </span>
              </p>
              <button
                onClick={() => updateOrderStatus(selectedOrder.order_id, "Delivered")}
                className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                <Localized id="Delivered"></Localized>
              </button>
              <button
                onClick={() => updateOrderStatus(selectedOrder.order_id, "Shipped")}
                className="mt-4 ml-4 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
              >
                <Localized id="Delivering"></Localized>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
