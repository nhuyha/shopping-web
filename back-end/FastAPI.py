from typing import Union
from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI
from pydantic import BaseModel
import database
class Product:
    def __init__(self, id: int, name: str, image_url: str, detail: str, price: float):
        self.id = id
        self.name = name
        self.image_url = image_url
        self.detail = detail
        self.price = price

app = FastAPI()
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

@app.put("/them_san_pham")
def them_san_pham(ten:str,anh:str, mo_ta:str, gia:int, so_luong:int):
    return database.them_san_pham(ten,anh, mo_ta, gia, so_luong)

@app.put("/xoa_san_pham")
def xoa_san_pham(product_id:int):
    return database.xoa_san_pham(product_id)