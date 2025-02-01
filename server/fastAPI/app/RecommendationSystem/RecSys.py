import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import json

class RecommenderSystem:
    def __init__(self, courses_data: pd.DataFrame):
        self.model = SentenceTransformer('all-mpnet-base-v2')  # Defining the embedding model
        self.courses = courses_data  # Loading the preprocessed dataset
        self.courses['embeddings'] = self.courses['embeddings'].apply(lambda x: np.array(json.loads(x)))  # Loading course embeddings in proper format
        
    def recommend_courses_on_skill(self, user_input: str, num_courses=5, more=False):
        query_embeddings = self.model.encode(user_input, convert_to_tensors=True)  # Converting user query into embeddings
        similarities = cosine_similarity([query_embeddings], [course for course in self.courses['embeddings']])[0] # Finding cosine_similarity of user query with each course in the dataset
        weighted_similarity = 0.7*similarities + 0.3*self.courses['normalized_popularity'] # Assigning recommendation weight to similarity score and the popularity of the course (num_reviews*star_rating/(num_reviews+1))
        if more:
            num_courses = 10
        top_indices = weighted_similarity.argsort()[::-1][:num_courses] # Getting the top recommendation's indices for the courses dataset
        recommendations = self.courses.iloc[top_indices] # Getting the top recommendations
        
        return recommendations[['url', 'course_title', 'popularity_score']]