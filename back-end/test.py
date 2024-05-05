import pytest
import sqlite3
from database import *

# Connect to an in-memory database for testing
conn = sqlite3.connect('shopping.db')
cursor = conn.cursor()

# Fixture to add sample data for testing
@pytest.fixture
def sample_data():
    # Add sample products
    product1_id = them_san_pham("Product 1", "image1.jpg", "Description 1", 10.99, 100)
    product2_id = them_san_pham("Product 2", "image2.jpg", "Description 2", 20.99, 50)
    # Add sample customer
    customer_id = them_khach_hang("John Doe", "john@example.com", "123456", "123 Main St", "1234567890")
    return product1_id, product2_id, customer_id

# Test adding a product
def test_add_product(sample_data):
    product_id = sample_data[0]
    assert product_id == 1  # Assuming this is the first product added

# Test deleting a product
def test_delete_product(sample_data):
    product_id = sample_data[1]
    xoa_san_pham(product_id)
    # Try to retrieve the deleted product
    with pytest.raises(sqlite3.Error):
        cursor.execute('SELECT * FROM Products WHERE ProductID = ?', (product_id,))
        row = cursor.fetchone()

# Test adding a customer
def test_add_customer(sample_data):
    customer_id = sample_data[2]
    assert customer_id == 1  # Assuming this is the first customer added

# Test updating customer information
def test_update_customer_info(sample_data):
    customer_id = sample_data[2]
    khach_hang_chinh_sua_thong_tin(customer_id, "Jane Doe", "jane@example.com", "456 Elm St", "0987654321")
    # Retrieve updated customer information
    cursor.execute('SELECT * FROM Customers WHERE CustomerID = ?', (customer_id,))
    row = cursor.fetchone()
    assert row[1] == "Jane Doe"
    assert row[4] == "456 Elm St"

# Test adding a product to cart
def test_add_product_to_cart(sample_data):
    product_id = sample_data[0]
    customer_id = sample_data[2]
    khach_hang_them_1_san_pham_vao_gio_hang(customer_id, product_id)
    # Retrieve cart items for the customer
    cursor.execute('SELECT * FROM Cart WHERE CustomerID = ?', (customer_id,))
    rows = cursor.fetchall()
    assert len(rows) == 1
    assert rows[0][1] == product_id
    assert rows[0][2] == 1

# Test removing a product from cart
def test_remove_product_from_cart(sample_data):
    product_id = sample_data[0]
    customer_id = sample_data[2]
    khach_hang_xoa_bot_1_san_pham(customer_id, product_id)
    # Retrieve cart items for the customer
    cursor.execute('SELECT * FROM Cart WHERE CustomerID = ?', (customer_id,))
    rows = cursor.fetchall()
    assert len(rows) == 0

# Test creating an order
def test_create_order(sample_data):
    customer_id = sample_data[2]
    khach_hang_them_don_hang(customer_id)
    # Retrieve orders for the customer
    cursor.execute('SELECT * FROM Orders WHERE CustomerID = ?', (customer_id,))
    rows = cursor.fetchall()
    assert len(rows) == 1

# Test deleting a token
def test_delete_token(sample_data):
    customer_id = sample_data[2]
    token = them_token(customer_id)
    xoa_token(token)
    # Try to retrieve the deleted token
    with pytest.raises(sqlite3.Error):
        cursor.execute('SELECT * FROM TOKEN WHERE Token = ?', (token,))
        row = cursor.fetchone()
