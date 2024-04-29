import sqlite3
from datetime import datetime
# Kết nối đến cơ sở dữ liệu SQLite (nếu tệp không tồn tại, nó sẽ được tạo ra tự động)
conn = sqlite3.connect('shopping.db')
cursor = conn.cursor()

# Tạo bảng Sản phẩm (Products)
cursor.execute('''
    CREATE TABLE IF NOT EXISTS Products (
        ProductID INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT NOT NULL,
        Image TEXT,
        Description TEXT,
        Price DECIMAL(10, 2) NOT NULL,
        StockQuantity INTEGER NOT NULL,
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
        Email TEXT UNIQUE NOT NULL,
        Address TEXT,
        PhoneNumber TEXT
    )
''')
cursor.execute('''
    CREATE TABLE IF NOT EXISTS Cart (
        CustomerID INTEGER,
        ProductID INTEGER,
        Quantity INTEGER,
        FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
        FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
    )
''')
# Lưu các thay đổi vào cơ sở dữ liệu và đóng kết nối
conn.commit()

def them_san_pham(ten,anh, mo_ta, gia, so_luong):

    # Thực thi truy vấn SQL để chèn sản phẩm mới vào bảng Sản phẩm (Products)
    cursor.execute('''
        INSERT INTO Products (Name, Image, Description, Price, StockQuantity)
        VALUES (?, ?, ?, ?, ?)
    ''', (ten,anh, mo_ta, gia, so_luong))

    # Lấy khóa chính của sản phẩm vừa được thêm vào
    product_id = cursor.lastrowid

    # Lưu các thay đổi vào cơ sở dữ liệu và đóng kết nối
    conn.commit()

    return product_id

def xoa_san_pham(product_id):
        # Thực thi truy vấn SQL để xóa sản phẩm dựa trên ProductID
    cursor.execute('''
        DELETE FROM Products
        WHERE ProductID = ?
    ''', (product_id,))

    # Lưu các thay đổi vào cơ sở dữ liệu và đóng kết nối
    conn.commit()

def chinh_sua_san_pham(product_id, ten_moi,anh_moi, mo_ta_moi, gia_moi, so_luong_moi):
    # Thực thi truy vấn SQL để cập nhật thông tin của sản phẩm dựa trên ProductID
    cursor.execute('''
        UPDATE Products
        SET Name = ?,
            Image = ?,
            Description = ?,
            Price = ?,
            StockQuantity = ?
        WHERE ProductID = ?
    ''', (ten_moi,anh_moi, mo_ta_moi, gia_moi, so_luong_moi, product_id))

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

def them_khach_hang(ten,email,address,phone):
  cursor.execute('''
    INSERT INTO Customers (CustomerName,Email,Address,PhoneNumber)
    VALUES(?,?,?,?)
    ''',(ten,email,address,phone))
  customer_id=cursor.lastrowid
  conn.commit()
  return customer_id



def them_don_hang(customer_id, total_amount, status):
    
    # Lấy thời gian hiện tại
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    # Thực thi truy vấn SQL để chèn đơn hàng mới vào bảng Orders
    cursor.execute('''
        INSERT INTO Orders (CustomerID, OrderDate, TotalAmount, Status)
        VALUES (?, ?, ?, ?)
    ''', (customer_id, current_time, total_amount, status))

    # Lấy ID của đơn hàng vừa được thêm vào
    order_id = cursor.lastrowid

    # Lưu các thay đổi vào cơ sở dữ liệu và đóng kết nối
    conn.commit()
    return order_id

def xoa_san_pham_khoi_gio_hang(customer_id, product_id):

    # Thực thi truy vấn SQL để xóa sản phẩm khỏi bảng ShoppingCart
    cursor.execute('''
        DELETE FROM ShoppingCart
        WHERE CustomerID = ? AND ProductID = ?
    ''', (customer_id, product_id))

    # Lưu các thay đổi vào cơ sở dữ liệu và đóng kết nối
    conn.commit()

def thay_doi_so_luong_san_pham_trong_gio_hang(customer_id, product_id, new_quantity):
    if (new_quantity==0):
      xoa_san_pham_khoi_gio_hang(customer_id, product_id)
    else:
    # Thực thi truy vấn SQL để cập nhật số lượng sản phẩm trong giỏ hàng
      cursor.execute('''
        UPDATE ShoppingCart
        SET Quantity = ?
        WHERE CustomerID = ? AND ProductID = ?
    ''', (new_quantity, customer_id, product_id))

    # Lưu các thay đổi vào cơ sở dữ liệu và đóng kết nối
    conn.commit()

def kiem_tra_san_pham_trong_gio_hang(customer_id, product_id):
    # Thực thi truy vấn SQL để kiểm tra sản phẩm trong giỏ hàng
    cursor.execute('''
        SELECT COUNT(*)
        FROM ShoppingCart
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
        FROM ShoppingCart
        WHERE CustomerID = ? AND ProductID=?
    ''', (customer_id,product_id))

    # Lấy kết quả của truy vấn
    rows = cursor.fetchall()
    return rows[0]

def them_san_pham_vao_gio_hang(customer_id, product_id, quantity):
  if(kiem_tra_san_pham_trong_gio_hang(customer_id, product_id)):
    new_quantity=in_so_luong_san_pham_trong_gio_hang(customer_id,product_id)+quantity
    thay_doi_so_luong_san_pham_trong_gio_hang(customer_id, product_id, new_quantity)
  else:

    # Thực thi truy vấn SQL để chèn sản phẩm vào bảng ShoppingCart
    cursor.execute('''
        INSERT INTO ShoppingCart (CustomerID, ProductID, Quantity)
        VALUES (?, ?, ?, ?)
    ''', (customer_id, product_id, quantity))
    # Lưu các thay đổi vào cơ sở dữ liệu và đóng kết nối
    conn.commit()

def xoa_bot_1_san_pham(customer_id, product_id):
  new_quantity=in_so_luong_san_pham_trong_gio_hang(customer_id,product_id)-1
  thay_doi_so_luong_san_pham_trong_gio_hang(customer_id, product_id, new_quantity)
