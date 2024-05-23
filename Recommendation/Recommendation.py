import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

# Bước 1: Đọc dữ liệu từ tệp CSV
df = pd.read_csv('Books2.csv')

# Bước 2: Tổng hợp hoặc trung bình các đánh giá của từng người dùng cho mỗi cuốn sách
df = df.groupby(['customer_id', 'book_id']).rating.mean().reset_index()

# Bước 3: Tạo ma trận người dùng - sách
user_book_matrix = df.pivot(index='customer_id', columns='book_id', values='rating').fillna(0)

# Bước 4: Tính độ tương đồng cosine giữa người dùng
user_similarity = cosine_similarity(user_book_matrix)

# Bước 5: Tạo hàm gợi ý sách
def recommend_books(customer_id, num_recommendations=3):
    # Lấy chỉ số của người dùng
    user_index = user_book_matrix.index.tolist().index(customer_id)
    
    # Tính điểm gợi ý
    scores = user_similarity[user_index].dot(user_book_matrix)
    
    # Loại bỏ các sách mà người dùng đã đánh giá
    user_ratings = user_book_matrix.loc[customer_id]
    scores = pd.Series(scores, index=user_book_matrix.columns)
    scores = scores.drop(user_ratings[user_ratings > 0].index)
    
    # Lấy top sách được gợi ý
    recommendations = scores.sort_values(ascending=False).head(num_recommendations).index.tolist()
    return recommendations

# Ví dụ gợi ý sách cho người dùng có customer_id = 'AVCGYZL8FQQTD'
#recommendations = recommend_books('AVCGYZL8FQQTD') thay '' bang customer_id
#print("Books recommended for customer 'AVCGYZL8FQQTD':", recommendations)