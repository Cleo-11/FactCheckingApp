import sys
import joblib
import nltk
from nltk.corpus import stopwords
import string

# Ensure 'stopwords' are downloaded only if not present
try:
    stop_words = set(stopwords.words('english'))
except LookupError:
    nltk.download('stopwords')
    stop_words = set(stopwords.words('english'))

# Load the model and vectorizer
clf = joblib.load('models/pa_classifierfinal.pkl')
vectorizer = joblib.load('models/tfidf_vectorizerfinal.pkl')

# Preprocess input text
def preprocess_text(text):
    text = text.lower().translate(str.maketrans('', '', string.punctuation))
    text = ' '.join([word for word in text.split() if word not in stop_words])
    return text

# Read input from stdin
input_text = sys.stdin.read().strip()
processed_text = preprocess_text(input_text)

# Transform and predict
text_tfidf = vectorizer.transform([processed_text])
prediction = clf.predict(text_tfidf)[0]
print(prediction)

