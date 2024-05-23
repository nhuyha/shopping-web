import database
import numpy as np
import sqlite3
import pandas as pd

df=pd.read_csv("D:/1/UET/H/OODA/Project/shopping-web/recommender-system/book.csv")


for index,row in df.iterrows():
    Name=row['Title']
    Image=row['image']
    Description=row['description']
    price=200000
    database.them_san_pham(Name,Image,Description,price)
