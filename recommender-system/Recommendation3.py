import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from scipy.sparse import csr_matrix
from scipy.sparse.linalg import svds

def combine_recommendations(user_id, books, ratings, n_content=5, n_collab=5):
    # Đọc dữ liệu từ CSV
    books_df = pd.read_csv(books)
    ratings_df = pd.read_csv(ratings)

    # Loại bỏ các mục trùng lặp bằng cách lấy trung bình các đánh giá
    ratings_df = ratings_df.groupby(['user_id', 'Book_id']).rating.mean().reset_index()

    # Tạo ma trận người dùng - sách
    user_item_matrix = ratings_df.pivot(index='user_id', columns='Book_id', values='rating').fillna(0)

    # Dựa trên nội dung
    def content_based_recommendations(book_id, n=n_content):
        tfidf = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf.fit_transform(books_df['description'])
        cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)
        
        idx = books_df.index[books_df['Book_id'] == book_id].tolist()[0]
        sim_scores = list(enumerate(cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        sim_scores = sim_scores[1:n+1]
        
        book_indices = [i[0] for i in sim_scores]
        return books_df.iloc[book_indices]

    # Dựa trên cộng tác
    def collaborative_recommendations(user_id, n=n_collab):
        user_ratings_mean = np.mean(user_item_matrix, axis=1)
        R_demeaned = user_item_matrix - user_ratings_mean.values.reshape(-1, 1)
        
        U, sigma, Vt = svds(csr_matrix(R_demeaned), k=50)
        sigma = np.diag(sigma)
        
        all_user_predicted_ratings = np.dot(np.dot(U, sigma), Vt) + user_ratings_mean.values.reshape(-1, 1)
        user_row_number = user_id - 1
        sorted_user_ratings = np.argsort(all_user_predicted_ratings[user_row_number])[::-1]
        
        recommended_book_indices = sorted_user_ratings[:n]
        return books_df[books_df['Book_id'].isin(user_item_matrix.columns[recommended_book_indices])]

    # Kiểm tra nếu người dùng đã có đánh giá
    if user_id in user_item_matrix.index:
        user_books = ratings_df[ratings_df['user_id'] == user_id]['Book_id'].tolist()
        if user_books:
            book_id = user_books[0]
            content_recs = content_based_recommendations(book_id, n=n_content)
            collab_recs = collaborative_recommendations(user_id, n=n_collab)

            combined_recs = pd.concat([content_recs, collab_recs]).drop_duplicates().reset_index(drop=True)
        else:
            combined_recs = content_based_recommendations(book_id, n=n_content + n_collab)
    else:
        combined_recs = books_df.sample(n=n_content + n_collab).reset_index(drop=True)

    return combined_recs['Book_id'].tolist()

# Đường dẫn đến các tệp CSV
books_csv_path = 'books.csv'
ratings_csv_path = 'rating.csv'

# Ví dụ sử dụng hàm
user_id = 1
recommended_books = combine_recommendations(user_id, books_csv_path, ratings_csv_path)
print(recommended_books)
