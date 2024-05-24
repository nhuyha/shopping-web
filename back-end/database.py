import sqlite3
import hashlib
from datetime import datetime
# Kết nối đến cơ sở dữ liệu SQLite (nếu tệp không tồn tại, nó sẽ được tạo ra tự động)
conn = sqlite3.connect('shopping.db',check_same_thread=False)
cursor = conn.cursor()

# Tạo bảng Sản phẩm (Products)
cursor.execute('''
    CREATE TABLE IF NOT EXISTS Products (
        ProductID INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT NOT NULL,
        Image TEXT,
        Description TEXT,
        Price DECIMAL(10, 2) NOT NULL,
        DELETED INTEGER
    )
''')

# Tạo bảng Danh mục (Categories)
cursor.execute('''
    CREATE TABLE IF NOT EXISTS Categories (
        CategoryID INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT NOT NULL
    )
''')

# Tạo bảng Sản phẩm - Danh mục (Product_Category)
cursor.execute('''
    CREATE TABLE IF NOT EXISTS Product_Category (
        ProductID INTEGER,
        CategoryID INTEGER,
        PRIMARY KEY (ProductID, CategoryID),
        FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
        FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
    )
''')

# Tạo bảng Đơn hàng (Orders)
cursor.execute('''
    CREATE TABLE IF NOT EXISTS Orders (
        OrderID INTEGER PRIMARY KEY AUTOINCREMENT,
        CustomerID INTEGER,
        OrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        TotalAmount DECIMAL(10, 2) NOT NULL,
        Status TEXT NOT NULL,
        Paid INTEGER NOT NULL,
        FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
    )
''')

# Tạo bảng Chi tiết đơn hàng (OrderDetails)
cursor.execute('''
    CREATE TABLE IF NOT EXISTS OrderDetails (
        OrderDetailID INTEGER PRIMARY KEY AUTOINCREMENT,
        OrderID INTEGER,
        ProductID INTEGER,
        Quantity INTEGER NOT NULL,
        Price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
        FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
    )
''')

# Tạo bảng Khách hàng (Customers)
cursor.execute('''
    CREATE TABLE IF NOT EXISTS Customers (
        CustomerID INTEGER PRIMARY KEY AUTOINCREMENT,
        CustomerName TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        Email TEXT UNIQUE NOT NULL,
        Address TEXT,
        PhoneNumber TEXT
    )
''')

#Bảng giỏ hàng
cursor.execute('''
    CREATE TABLE IF NOT EXISTS Cart (
        CustomerID INTEGER,
        ProductID INTEGER,
        Quantity INTEGER,
        FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
        FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
    )
''')
#Token
cursor.execute('''
               CREATE TABLE IF NOT EXISTS TOKEN (
               CustomerID INTEGER,
               Token TEXT UNIQUE NOT NULL,
               FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
               )
               ''')
# Rating
cursor.execute('''CREATE TABLE IF NOT EXISTS Ratings (
    RatingID INTEGER PRIMARY KEY AUTOINCREMENT,
    CustomerID INTEGER NOT NULL,
    ProductID INTEGER NOT NULL,
    Rating INTEGER NOT NULL CHECK (Rating >= 1 AND Rating <= 5),
    RatingDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
    )
''')
# Lưu các thay đổi vào cơ sở dữ liệu và đóng kết nối
conn.commit()
cursor.execute('''
               
CREATE INDEX IF NOT EXISTS abc
ON Cart (CustomerID, ProductID)''')
conn.commit()
def khach_hang_danh_gia_san_pham(CustomerID,ProductID, rating):

    # Thực thi truy vấn SQL để chèn sản phẩm mới vào bảng Sản phẩm (Products)
    cursor.execute('''
        INSERT INTO Ratings (CustomerID,ProductID, rating)
        VALUES (?, ?, ?)
    ''', (CustomerID,ProductID, rating))

    # Lấy khóa chính của sản phẩm vừa được thêm vào
    product_id = cursor.lastrowid
    # Lưu các thay đổi vào cơ sở dữ liệu và đóng kết nối
    conn.commit()

    return product_id
def them_san_pham(ten,anh, mo_ta, gia):

    # Thực thi truy vấn SQL để chèn sản phẩm mới vào bảng Sản phẩm (Products)
    cursor.execute('''
        INSERT INTO Products (Name, Image, Description, Price,DELETED)
        VALUES (?, ?, ?, ?,?)
    ''', (ten,anh, mo_ta, gia,0))

    # Lấy khóa chính của sản phẩm vừa được thêm vào
    product_id = cursor.lastrowid
    # Lưu các thay đổi vào cơ sở dữ liệu và đóng kết nối
    conn.commit()

    return product_id

def xoa_san_pham(product_id):
    # Thực thi truy vấn SQL để cập nhật cờ Deleted của sản phẩm dựa trên ProductID
    cursor.execute('''
        UPDATE Products
        SET DELETED = 1
        WHERE ProductID = ?
    ''', (product_id,))

    # Lưu các thay đổi vào cơ sở dữ liệu
    conn.commit()
    return product_id

def chinh_sua_san_pham(product_id, ten_moi,anh_moi, mo_ta_moi, gia_moi):
    # Thực thi truy vấn SQL để cập nhật thông tin của sản phẩm dựa trên ProductID
    cursor.execute('''
        UPDATE Products
        SET Name = ?,
            Image = ?,
            Description = ?,
            Price = ?
            
        WHERE ProductID = ?
    ''', (ten_moi,anh_moi, mo_ta_moi, gia_moi, product_id))

    # Lưu các thay đổi vào cơ sở dữ liệu và đóng kết nối
    conn.commit()

def cap_nhat_tinh_trang_don_hang(order_id, trang_thai_moi):

    # Thực thi truy vấn SQL để cập nhật tình trạng của đơn hàng dựa trên OrderID
    cursor.execute('''
        UPDATE Orders
        SET Status = ?
        WHERE OrderID = ?
    ''', (trang_thai_moi, order_id))

    # Lưu các thay đổi vào cơ sở dữ liệu và đóng kết nối
    conn.commit()

def them_khach_hang(ten,username,password,email,address,phone):
  cursor.execute('''
    SELECT *
        FROM Customers
        WHERE username = ?
    ''',(username,))
  result=cursor.fetchone()
  if result!= None:
     return None
  
   
  password=hashlib.blake2b(password.encode('utf-8')).hexdigest()
  cursor.execute('''
    INSERT INTO Customers (CustomerName,username,password,Email,Address,PhoneNumber)
    VALUES(?,?,?,?,?,?)
    ''',(ten,username,password,email,address,phone))
  customer_id=cursor.lastrowid
  conn.commit()
  return customer_id

def thong_tin_khach_hang(customerid):
    cursor.execute('''
        SELECT * FROM Customers
        WHERE CustomerID=?
    ''', (customerid,))
    rows = cursor.fetchall()
    return rows[0]
    
def khach_hang_chinh_sua_thong_tin(CustomerID,CustomerName,Email,Address,PhoneNumber):
    cursor.execute('''
        UPDATE Customers
        SET CustomerName = ?,
            Email=?,
            Address=?,
            PhoneNumber=?
            
        WHERE CustomerID = ?
    ''', (CustomerName,Email,Address,PhoneNumber,CustomerID))
    conn.commit()

def khach_hang_doi_mat_khau(CustomerID,password):
   password=hashlib.blake2b(password.encode('utf-8')).hexdigest()
   cursor.execute('''
        UPDATE Customers
        SET password=?
            
        WHERE CustomerID = ?
    ''', (password,CustomerID))
   conn.commit()

def khach_hang_xoa_san_pham_khoi_gio_hang(customer_id, product_id):

    # Thực thi truy vấn SQL để xóa sản phẩm khỏi bảng ShoppingCart
    cursor.execute('''
        DELETE FROM Cart
        WHERE CustomerID = ? AND ProductID = ?
    ''', (customer_id, product_id))

    # Lưu các thay đổi vào cơ sở dữ liệu và đóng kết nối
    conn.commit()

def khach_hang_thay_doi_so_luong_san_pham_trong_gio_hang(customer_id, product_id, new_quantity):
    if (new_quantity==0):
      return khach_hang_xoa_san_pham_khoi_gio_hang(customer_id, product_id)
    else:
    # Thực thi truy vấn SQL để cập nhật số lượng sản phẩm trong giỏ hàng
      cursor.execute('''
        UPDATE Cart
        SET Quantity = ?
        WHERE CustomerID = ? AND ProductID = ?
    ''', (new_quantity, customer_id, product_id))

    # Lưu các thay đổi vào cơ sở dữ liệu và đóng kết nối
    conn.commit()

def kiem_tra_san_pham_trong_gio_hang(customer_id, product_id):
    # Thực thi truy vấn SQL để kiểm tra sản phẩm trong giỏ hàng
    cursor.execute('''
        SELECT COUNT(*)
        FROM Cart
        WHERE CustomerID = ? AND ProductID = ?
    ''', (customer_id, product_id))

    # Lấy kết quả của truy vấn
    result = cursor.fetchone()

    # Trả về True nếu sản phẩm có trong giỏ hàng, False nếu không có
    return result[0] > 0

def in_so_luong_san_pham_trong_gio_hang(customer_id,product_id):
    # Thực thi truy vấn SQL để lấy số lượng sản phẩm trong giỏ hàng của khách hàng
    cursor.execute('''
        SELECT Quantity
        FROM Cart
        WHERE CustomerID = ? AND ProductID=?
    ''', (customer_id,product_id))

    # Lấy kết quả của truy vấn
    rows = cursor.fetchall()
    return rows[0][0]

def khach_hang_them_1_san_pham_vao_gio_hang(customer_id, product_id):
  if(kiem_tra_san_pham_trong_gio_hang(customer_id, product_id)):
    new_quantity=in_so_luong_san_pham_trong_gio_hang(customer_id,product_id)+1
    khach_hang_thay_doi_so_luong_san_pham_trong_gio_hang(customer_id, product_id, new_quantity)
  else:

    # Thực thi truy vấn SQL để chèn sản phẩm vào bảng ShoppingCart
    cursor.execute('''
        INSERT INTO Cart (CustomerID, ProductID, Quantity)
        VALUES (?, ?, ?)
    ''', (customer_id, product_id, 1))
    # Lưu các thay đổi vào cơ sở dữ liệu và đóng kết nối
    conn.commit()
    

def khach_hang_xoa_bot_1_san_pham(customer_id, product_id):
  if(in_so_luong_san_pham_trong_gio_hang(customer_id, product_id)==1):
    return khach_hang_xoa_san_pham_khoi_gio_hang(customer_id, product_id)
  new_quantity=in_so_luong_san_pham_trong_gio_hang(customer_id,product_id)-1
  khach_hang_thay_doi_so_luong_san_pham_trong_gio_hang(customer_id, product_id, new_quantity)

def danh_sach_san_pham():
    cursor.execute('''
    SELECT * from Products
    WHERE DELETED !=1 ''' )
    rows = cursor.fetchall()
    return rows


def danh_sach_don_hang():
    cursor.execute('''
    SELECT o.OrderID, o.TotalAmount, o.Status,o.Paid
     c.CustomerName, c.Address, c.PhoneNumber, od.ProductID, od.Quantity, p.Price
    FROM Orders o
    JOIN Customers c ON o.CustomerID = c.CustomerID
    JOIN OrderDetails od ON o.OrderID = od.OrderID
    JOIN Products p ON od.ProductID = p.ProductID
    ''')
    rows = cursor.fetchall()
    return rows



def du_lieu_gio_hang(CustomerID):
    cursor.execute('''
    SELECT c.ProductID, c.Quantity, p.Name,p.Price, p.Image, p.Description
    FROM Cart c
    JOIN Products p ON c.ProductID = p.ProductID
    WHERE c.CustomerID = ?
    ''', (CustomerID,))
    rows = cursor.fetchall()
    return rows

def khach_hang_them_don_hang(CustomerID):
    OrderDate = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    Status="Preparing"
    Paid =0
    TotalAmount=0
    gio_hang=du_lieu_gio_hang(CustomerID)

    for san_pham in gio_hang:
        TotalAmount=TotalAmount+san_pham[1]*san_pham[3]
    cursor.execute('''
        INSERT INTO Orders (CustomerID, OrderDate,TotalAmount,Status,Paid)
        VALUES (?, ?, ?, ?,?)
    ''', (CustomerID, OrderDate,TotalAmount,Status,Paid))
    OrderID = cursor.lastrowid

    for san_pham in gio_hang:
        ProductID=san_pham[0]
        Quantily=san_pham[1]
        Price=san_pham[3]
        cursor.execute('''
            INSERT INTO OrderDetails (OrderID,ProductID,Quantity,Price)
            VALUES (?, ?, ?, ?)
        ''', ( OrderID,ProductID,Quantily,Price))

    conn.commit()
    khach_hang_xoa_gio_hang(CustomerID)
    return OrderID

def khach_hang_xoa_gio_hang(customer_id):
    cursor.execute('''
        DELETE FROM Cart
        WHERE CustomerID=?
        ''',(customer_id,))
    conn.commit()

def danh_sach_khach_hang():
    cursor.execute('''
    SELECT * from Customers ''' )
    rows = cursor.fetchall()
    return rows

def xoa_token(token):
    cursor.execute('''
        DELETE FROM TOKEN
        WHERE token=?
        ''',(token,))
    conn.commit()

import secrets
import string

def generate_random_string(length):
    letters = string.ascii_letters
    return ''.join(secrets.choice(letters) for _ in range(length))

def them_token(Customer_id):
   Token = generate_random_string(32)
   cursor.execute('''
    INSERT INTO TOKEN  (CustomerID,Token)
    VALUES(?,?)
    ''',(Customer_id,Token))
   conn.commit()
   return Token

def dang_nhap(username,password):
    password=hashlib.blake2b(password.encode('utf-8')).hexdigest()
    cursor.execute('''
    SELECT CustomerID
        FROM Customers
        WHERE username = ? AND password = ?
    ''',(username,password))
   
    result=cursor.fetchall()
    if result:
      Customer_id=result[0][0]
      return them_token(Customer_id)
    else:
      return None
def khach_hang_xac_minh(customerid,password):
    password=hashlib.blake2b(password.encode('utf-8')).hexdigest()
    cursor.execute('''
    SELECT *
        FROM Customers
        WHERE CustomerID = ? AND password = ?
    ''',(customerid,password))
   
    result=cursor.fetchall()
    if result:
        return customerid
    else:
        return None
    
def khach_hang_token(token):
   cursor.execute('''
    SELECT CustomerID
        FROM TOKEN
        WHERE token = ?
    ''',(token,))
   
   result=cursor.fetchone()
   return result[0]

def danh_sach_token():
   cursor.execute('''
    SELECT *
        FROM TOKEN
    ''',)
   
   result=cursor.fetchall()
   return result

def danh_sach_rating():
    cursor.execute('''
        SELECT * FROM Ratings
                   ''',)
    result=cursor.fetchall()
    return result

def thong_tin_don_hang(OrderID,customerId):
    cursor.execute('''
    SELECT TotalAmount,Status, Paid
    FROM Orders 
    WHERE OrderID = ? AND CustomerID=?
    ''', (OrderID,customerId))
    rows = cursor.fetchall()
    return rows

def thong_tin_don_hang_2(OrderID):
    cursor.execute('''
    SELECT TotalAmount
    FROM Orders 
    WHERE OrderID = ?
    ''', (OrderID,))
    rows = cursor.fetchall()
    return rows[0][0]

def cap_nhat_thanh_toan(OrderID):
    cursor.execute('''
    UPDATE Orders
    SET Paid=?
    WHERE OrderID = ?
    ''', (1,OrderID,))
    conn.commit()
    