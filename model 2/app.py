import streamlit as st
import joblib
import pickle
from nltk.tokenize import RegexpTokenizer
from nltk.corpus import stopwords
from nltk.stem import SnowballStemmer
import nltk

# Ensure the required NLTK data packages are downloaded
nltk.download('stopwords')

# Initialize the stemmer and tokenizer
stemmer = SnowballStemmer('english')
tokenizer = RegexpTokenizer(r'[A-Za-z]+')

# Function to preprocess the text
def transform_text(text):
    # Convert text to lowercase
    text = text.lower()
    
    # Initialize the tokenizer and tokenize the text
    tokenizer = RegexpTokenizer(r'[A-Za-z]+')
    tokens = tokenizer.tokenize(text)
    
    # Initialize the stemmer
    stemmer = SnowballStemmer('english')
    
    # Get the list of stop words
    stop_words = set(stopwords.words('english'))
    
    # Remove stop words and stem the remaining tokens
    processed_tokens = [stemmer.stem(word) for word in tokens if word not in stop_words]
    
    # Join the stemmed tokens into a single string
    transformed_text = ' '.join(processed_tokens)
    return transformed_text

# Load the pre-trained models
cv = joblib.load(open('count_vectorizer.pkl', 'rb'))
model = pickle.load(open('model.pkl', 'rb'))

# Streamlit app title
st.title("News Detection")

# Text area for input
input_sms = st.text_area("Enter the message")

# Predict button
if st.button('Predict'):
    # Preprocess the input
    transformed_news = transform_text(input_sms)
    
    # Vectorize the input
    vector_input = cv.transform([transformed_news])
    
    # Predict using the loaded model
    result = model.predict(vector_input)[0]
    
    # Display the result
    if result == 1:
        st.header("Related")
    else:
        st.header("Not related")