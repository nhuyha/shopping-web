import database
import numpy as np
import sqlite3
import pandas as pd

df=pd.read_csv("D:/1/UET/H/OODA/Project/shopping-web/recommender-system/books.csv")
df1=pd.read_csv("D:/1/UET/H/OODA/Project/shopping-web/recommender-system/users.csv")
df2=pd.read_csv("D:/1/UET/H/OODA/Project/shopping-web/recommender-system/rating.csv")

for index,row in df.iterrows():
    Name=row['Title']
    Image=row['image']
    Description=row['description']
    price=row['Price']
    database.them_san_pham(Name,Image,Description,price)

for index,row in df1.iterrows():
    CustomerName=row['profileName']
    username=str(row['user_id'])+"username"
    password='123456'
    Email=username+"mail@gmail.com"
    Address="Address 123"
    PhoneNumber='0123456'
    database.them_khach_hang(CustomerName,username,password,Email,Address,PhoneNumber)

for index,row in df2.iterrows():
    productID=row["Book_id"]
    customerID=row["user_id"]
    rating=row["rating"]
    database.khach_hang_danh_gia_san_pham(customerID,productID,rating)
