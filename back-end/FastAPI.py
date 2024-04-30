from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel
import database

app = FastAPI()

@app.get("/danh_sach_san_pham")
def danh_sach_san_pham():
    return database.danh_sach_san_pham()

@app.put("/them_san_pham")
def them_san_pham(ten:str,anh:str, mo_ta:str, gia:int, so_luong:int):
    return database.them_san_pham(ten,anh, mo_ta, gia, so_luong)

@app.put("/xoa_san_pham")
def xoa_san_pham(product_id:int):
    return database.xoa_san_pham(product_id)