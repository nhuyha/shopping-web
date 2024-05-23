import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

df = pd.read_csv('D:/1/UET/H/OODA/Project/shopping-web/recommender-system/rating.csv')
# Tạo ma trận người dùng - sách => tính độ tương đồng
df = df.groupby(['customerID', 'ID']).rating.mean().reset_index()
user_book_matrix = df.pivot(index='customerID', columns='ID', values='rating').fillna(0)
user_similarity = cosine_similarity(user_book_matrix)

def recommend_books(customer_id, num_recommendations=10):
    # Lấy chỉ số của người dùng
    user_index = user_book_matrix.index.tolist().index(customer_id)
    scores = user_similarity[user_index].dot(user_book_matrix)
    
    # Loại bỏ các sách mà người dùng đã đánh giá
    user_ratings = user_book_matrix.loc[customer_id]
    scores = pd.Series(scores, index=user_book_matrix.columns)
    scores = scores.drop(user_ratings[user_ratings > 0].index)
    
    # Lấy top sách được gợi ý
    recommendations = scores.sort_values(ascending=False).head(num_recommendations).index.tolist()
    return recommendations

recommendations = recommend_books(3)
print("Books recommended for customer '3':", recommendations)