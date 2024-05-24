from typing import Annotated, Union
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm
from fastapi import Depends, FastAPI,Request, HTTPException
from pydantic import BaseModel
from fastapi.responses import RedirectResponse
import os
import hashlib
from datetime import datetime, timedelta, timezone
import hmac
from urllib.parse import urlencode
import database
from dotenv import load_dotenv
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class Product:
    def __init__(self, id: int, name: str, image_url: str, detail: str, price: float):
        self.id = id
        self.name = name
        self.image_url = image_url
        self.detail = detail
        self.price = price
class product(BaseModel):
            id:int
            ten:str
            anh:str
            mo_ta:str
            gia:int
class product1(BaseModel):
            
            ten:str
            anh:str
            mo_ta:str
            gia:int
class OrderDetail:
    def __init__(self,product_id:int,quantity:int,price:int):
        self.product_id=product_id
        self.quantity=quantity
        self.price=price
class Order:
    def __init__(self, order_id:int, customer_name:str, address:str, phone_number:str, details, total_amount:int, status:str):
        self.order_id = order_id
        self.customer_name = customer_name
        self.address = address
        self.phone_number = phone_number
        self.details = details  # This will be a list of (ProductID, Quantity) tuples
        self.total_amount = total_amount
        self.status = status
class order:
    def __init__(self, Amount:int, Status:str, Paid: int ):
        self.Amount=Amount
        self.Status=Status
        self.Paid=Paid

class Cart:
    def __init__ (self, product_id:int, product_name:str, product_price:int, product_image:str, product_quantity:int, product_detail:str):
        self.id=product_id
        self.name=product_name
        self.image=product_image
        self.detail=product_detail
        self.price=product_price
        self.quantity=product_quantity
        

class Customer:
    def __init__ (self,CustomerID:int, CustomerName:str,username:str, password:str, Email:str,Address:str,PhoneNumber:str ):
        self.CustomerID=CustomerID
        self.CustomerName=CustomerName
        self.username=username
        self.password=password
        self.Email=Email
        self.Address=Address
        self.PhoneNumber=PhoneNumber

app = FastAPI()
origins = [
    "*"
]
app2 = FastAPI()
origins = [
    "*"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/danh_sach_san_pham")
def danh_sach_san_pham():
    rows = database.danh_sach_san_pham()
    danh_sach=[]
    for row in rows:
        danh_sach.append(Product(id=row[0], name=row[1],
         image_url=row[2], detail=row[3], price=row[4]))
    return danh_sach

@app2.get("/danh_sach_san_pham")
def danh_sach_san_pham():
    rows = database.danh_sach_san_pham()
    danh_sach=[]
    for row in rows:
        danh_sach.append(Product(id=row[0], name=row[1],
         image_url=row[2], detail=row[3], price=row[4]))

    return danh_sach
    
@app2.put("/them_san_pham")
def them_san_pham(product:product1):
    return database.them_san_pham(product.ten,product.anh,product.mo_ta,product.gia)

@app2.put("/xoa_san_pham")
def xoa_san_pham(product_id:int):
    return database.xoa_san_pham(product_id)

@app2.put("/chinh_sua_san_pham")
def chinh_sua_san_pham(product:product):
    return database.chinh_sua_san_pham(product.id, product.ten,product.anh, product.mo_ta, product.gia)

@app2.put("/cap_nhat_tinh_trang_don_hang")
def cap_nhat_tinh_trang_don_hang(order_id:int, trang_thai_moi:str):
    return database.cap_nhat_tinh_trang_don_hang(order_id, trang_thai_moi)

@app.put("/them_khach_hang")
def them_khach_hang(ten:str,username:str, password:str,email:str,address:str,phone:str):
    return database.them_khach_hang(ten,username,password,email,address,phone)

@app.put("/khach_hang_chinh_sua_thong_tin")
def khach_hang_chinh_sua_thong_tin(token:Annotated[str, Depends(oauth2_scheme)],CustomerName:str,Email:str,Address:str,PhoneNumber:str):
    CustomerID=database.khach_hang_token(token)
    return database.khach_hang_chinh_sua_thong_tin(CustomerID,CustomerName,Email,Address,PhoneNumber)

@app.put("/khach_hang_doi_mat_khau")
def khach_hang_doi_mat_khau(token:Annotated[str, Depends(oauth2_scheme)],newPassword:str):
    CustomerID=database.khach_hang_token(token)
    return database.khach_hang_doi_mat_khau(CustomerID,newPassword)
    
@app.get("/khach_hang_xac_minh")
def khach_hang_xac_minh(token:Annotated[str, Depends(oauth2_scheme)],password:str):
    CustomerID=database.khach_hang_token(token)
    return database.khach_hang_xac_minh(CustomerID,password)

@app.put("/khach_hang_xoa_san_pham_khoi_gio_hang")
def khach_hang_xoa_san_pham_khoi_gio_hang(token:Annotated[str, Depends(oauth2_scheme)], product_id:int):
    customer_id=database.khach_hang_token(token)
    return database.khach_hang_xoa_san_pham_khoi_gio_hang(customer_id,product_id)

@app.put("/khach_hang_thay_doi_so_luong_san_pham_trong_gio_hang")
def khach_hang_thay_doi_so_luong_san_pham_trong_gio_hang(token:Annotated[str, Depends(oauth2_scheme)], product_id:int, new_quantity:int):
    customer_id=database.khach_hang_token(token)
    return database.khach_hang_thay_doi_so_luong_san_pham_trong_gio_hang(customer_id, product_id, new_quantity)

@app.put("/khach_hang_them_1_san_pham_vao_gio_hang")
def khach_hang_them_1_san_pham_vao_gio_hang(token:Annotated[str, Depends(oauth2_scheme)], product_id:int):
    customer_id=database.khach_hang_token(token)
    return database.khach_hang_them_1_san_pham_vao_gio_hang(customer_id, product_id)

@app.put("/khach_hang_xoa_bot_1_san_pham")
def khach_hang_xoa_bot_1_san_pham(token:Annotated[str, Depends(oauth2_scheme)], product_id:int):
    customer_id=database.khach_hang_token(token)
    return database.khach_hang_xoa_bot_1_san_pham(customer_id, product_id)

@app2.get("/danh_sach_don_hang")
def danh_sach_don_hang():
    rows = database.danh_sach_don_hang()
    orders = {}
    for row in rows:
        order_id = row[0]
        if order_id not in orders:
            orders[order_id] = Order(
                order_id=row[0], 
                total_amount=row[1], 
                status=row[2], 
                customer_name=row[3], 
                address=row[4], 
                phone_number=row[5], 
                details=[]
            )
        orders[order_id].details.append(OrderDetail(row[6], row[7],row[8]))
    
    return list(orders.values())

@app.get("/du_lieu_gio_hang")
def du_lieu_gio_hang(token:Annotated[str, Depends(oauth2_scheme)]):
    CustomerID=database.khach_hang_token(token)
    gio_hang=database.du_lieu_gio_hang(CustomerID)
    cart=[]
    for row in gio_hang:
        cart.append(Cart(row[0],row[2],row[3],row[4],row[1],row[5]))

    return cart

@app.put("/khach_hang_them_don_hang")
def khach_hang_them_don_hang(token:Annotated[str, Depends(oauth2_scheme)]):
    CustomerID=database.khach_hang_token(token)
    return database.khach_hang_them_don_hang(CustomerID)

@app.get("/thong_tin_khach_hang")
def thong_tin_khach_hang(token:Annotated[str,Depends(oauth2_scheme)]):
    CustomerID=database.khach_hang_token(token)
    customer=database.thong_tin_khach_hang(CustomerID)
    return Customer(customer[0],customer[1],customer[2],customer[3],customer[4],customer[5],customer[6])

@app.put("/khach_hang_xoa_gio_hang")
def khach_hang_xoa_gio_hang(token:Annotated[str, Depends(oauth2_scheme)]):
    customer_id=database.khach_hang_token(token)
    return database.khach_hang_xoa_gio_hang(customer_id)

@app2.get("/danh_sach_khach_hang")
def danh_sach_khach_hang():
    rows=database.danh_sach_khach_hang()
    khach_hang=[]
    for row in rows:
        khach_hang.append(Customer(row[0],row[1],row[2],row[3],row[4],row[5],row[6]))
    return khach_hang

@app.put("/them_token")
def them_token(Customer_id:int):
    return database.them_token(Customer_id)

@app.put("/xoa_token")
def xoa_token(token:Annotated[str, Depends(oauth2_scheme)]):
    return database.xoa_token(token)

@app.post("/dang_nhap")
def dang_nhap(username:str, password: str):
    return database.dang_nhap(username, password)

@app.post("/token")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    username=form_data.username
    password=form_data.password
    return {"access_token": database.dang_nhap(username,password), "token_type": "bearer"}

@app2.get("/danh_sach_token")
def danh_sach_token():
    return database.danh_sach_token()


@app.post("/link_thanh_toan")
def link_thanh_toan(OrderID:int,request: Request,token:Annotated[str, Depends(oauth2_scheme)],vnp_return_url:str):
    load_dotenv("env.server")
    vnp_ip_addr = os.getenv("vnp_ip_addr")
    order_desc = os.getenv("order_desc")
    order_type = os.getenv("order_type")
    vnp_hash_secret = os.getenv("vnp_hash_secret")
    vnp_url = os.getenv("vnp_url")
    vnp_TmnCode = os.getenv("vnp_TmnCode")
    CustomerID=database.khach_hang_token(token)
    row=database.thong_tin_don_hang(OrderID,CustomerID)
    amount=row[0][0]
    # Define the GMT+7 timezone offset
    gmt_plus_7 = timezone(timedelta(hours=7))

    # Get the current time in UTC
    now_utc = datetime.utcnow()

    # Add 24 hours to the current time
    future_utc = now_utc + timedelta(days=1)

    # Convert the future time to GMT+7 timezone
    future_gmt_plus_7 = future_utc.astimezone(gmt_plus_7)

    # Format the future time as a string in the desired format
    txtexpire = future_gmt_plus_7.strftime('%Y%m%d%H%M%S')
    vnp_amount = amount * 100

    vnp_create_date = datetime.now().strftime('%Y%m%d%H%M%S')
    
    
    order_id=OrderID
   
    input_data = {
        "vnp_Version": "2.1.0",
        "vnp_TmnCode": vnp_TmnCode,
        "vnp_Amount": vnp_amount,
        "vnp_Command": "pay",
        "vnp_CreateDate": vnp_create_date,
        "vnp_CurrCode": "VND",
        "vnp_IpAddr": vnp_ip_addr,
        "vnp_Locale": "vn",
        "vnp_OrderInfo": order_desc,
        "vnp_OrderType": order_type,
        "vnp_ReturnUrl": vnp_return_url,
        "vnp_TxnRef": order_id,
        "vnp_ExpireDate": txtexpire
    }

    sorted_input_data = dict(sorted(input_data.items()))
    query = urlencode(sorted_input_data)
    hash_data = urlencode(sorted_input_data)

    vnp_url += "?" + query

    if vnp_hash_secret:
        vnp_secure_hash = hmac.new(vnp_hash_secret.encode(), hash_data.encode(), hashlib.sha512).hexdigest()
        vnp_url += "&vnp_SecureHash=" + vnp_secure_hash

    return vnp_url

@app.get("/vnp")
def vnp(vnp_Amount,vnp_BankCode,vnp_BankTranNo,vnp_CardType,vnp_OrderInfo,vnp_PayDate,vnp_ResponseCode,vnp_TmnCode,vnp_TransactionNo,vnp_TransactionStatus,vnp_TxnRef,vnp_SecureHash):
    load_dotenv("env.server")
    vnp_hash_secret = os.getenv("vnp_hash_secret")
    input_data = {
        "vnp_TmnCode": vnp_TmnCode,
        "vnp_Amount": vnp_Amount,
        "vnp_BankCode":vnp_BankCode,
        "vnp_BankTranNo": vnp_BankTranNo,
        "vnp_CardType": vnp_CardType,
        "vnp_PayDate": vnp_PayDate,
        "vnp_OrderInfo": vnp_OrderInfo,
        "vnp_TransactionNo": vnp_TransactionNo,
        "vnp_ResponseCode": vnp_ResponseCode,
        "vnp_TransactionStatus": vnp_TransactionStatus,
        "vnp_TxnRef": vnp_TxnRef,
    }
    print(input_data)
    sorted_input_data = dict(sorted(input_data.items()))
    hash_data = urlencode(sorted_input_data)

    server_vnp_secure_hash = hmac.new(vnp_hash_secret.encode(), hash_data.encode(), hashlib.sha512).hexdigest()
    row=database.thong_tin_don_hang_2(int(vnp_TxnRef))
    print(row)
    if server_vnp_secure_hash==vnp_SecureHash:
        if row==int(vnp_Amount)//100:
            if vnp_ResponseCode == '00':
                database.cap_nhat_thanh_toan(int(vnp_TxnRef))
                print('Payment Success. Your code implement here')
                return ({'RspCode': '00', 'Message': 'Confirm Success'})
        print("No Success")
        return({'RspCode': '04', 'Message': 'invalid amount'})  
    print("No Success")
    return({'RspCode': '04', 'Message': 'invalid amount'})           
        
@app2.get("/danh_sach_rating")
def danh_sach_rating():
    return database.danh_sach_rating()