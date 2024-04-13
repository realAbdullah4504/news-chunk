import pandas as pd
import pdb
import json
import numpy as np
import itertools
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.multioutput import MultiOutputClassifier
from sklearn.metrics import accuracy_score, classification_report

model = None
vectorizer = None
mlb = None
multis_target_classifier = None

def pick_first_sub_category(sub_category):
    return sub_category.split(",")[0]

def map_category_from_sub_category(sub_category):
    general_category = ["Politics and Government", "Business and Finance", "Science and Technology", "Climate and Environment", "Health and Medical", "Entertainment and Celebrity News"]
    sports_category = ["Sports"]
    lifestyle_category = ["Travel", "Fashion and Style", "Food and Cooking", "Arts and Culture"]
    if sub_category in sports_category:
        return "Sports"
    elif sub_category in lifestyle_category:
        return "Lifestyle"
    else:
        return "General"

def read_data_from_json(file_path):
    texts = []
    labels = []
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
        for item in data:
            if item["sub_category"] == 'Uncategorized':
                continue
            text = item["summary"]
            sub_categories = item["sub_category"]
            texts.append(text)
            labels.append(sub_categories)
    return texts, labels

def read_data_from_csv(file_path):
    data = pd.read_csv(file_path)
    return data["text"], data["category"]

def train_model():
    # Step 1: Prepare the Data File (CSV file with 'text' and 'category' columns)
    #texts, labels = read_data_from_csv('training_data.csv')
    texts, labels = read_data_from_json('training_data.json')

    # Step 3: Preprocess the Data (if needed)

    # Step 4: Model Selection and Training
    tfidf_vectorizer = TfidfVectorizer()
    classifier = LinearSVC()

    global model
    model = Pipeline([
        ('tfidf', tfidf_vectorizer),
        ('clf', classifier)
    ])

    # Split data into training and testing sets (80% train, 20% test)
    texts_train, texts_test, labels_train, labels_test = train_test_split(texts, labels, test_size=0.1, random_state=42)

    # Text vectorization using CountVectorizer
    global vectorizer
    vectorizer = CountVectorizer()
    X_train = vectorizer.fit_transform(texts_train)
    X_test = vectorizer.transform(texts_test)

    # Convert multi-label categories into binary form
    global mlb
    mlb = MultiLabelBinarizer()
    y_train = mlb.fit_transform(labels_train)
    y_test = mlb.transform(labels_test)

    # Train the model using MultiOutputClassifier with MultinomialNB classifier
    classifier = MultinomialNB()
    global multi_target_classifier
    multi_target_classifier = MultiOutputClassifier(classifier)
    multi_target_classifier.fit(X_train, y_train)

    # Make predictions on the test set
    predictions = multi_target_classifier.predict(X_test)

    # In multi-label classification, we need to convert predictions back to original labels
    predicted_labels = mlb.inverse_transform(predictions)
    actual_labels = mlb.inverse_transform(y_test)
    model = None
    # Calculate accuracy
    accuracy = accuracy_score(y_test, predictions)



def assign_subcategory(news):
    #pdb.set_trace()
    #predicted_category = model.predict([news])[0]
    # Vectorize the summary using the same CountVectorizer
    summary_vectorized = vectorizer.transform([news])

    # Make predictions using the trained model
    predictions = multi_target_classifier.predict(summary_vectorized)

    # In multi-label classification, convert predictions back to original labels
    predicted_labels = mlb.inverse_transform(predictions)
    flattened_labels = list(itertools.chain(*predicted_labels))

    #print("Predicted category:", flattened_labels)
    return flattened_labels

train_model()
#assign_subcategory("Lawyers speak at the last day of the inquiry's first module, which has been looking at pandemic preparedness.\nCatch up next")
