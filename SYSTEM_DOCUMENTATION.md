# News Consolidater System Documentation

## Overview
This is a news aggregation and categorization system that scrapes articles from various news websites, processes them using machine learning, and stores them in a MongoDB database.

## System Architecture
```
News Websites → Scraping Script → ML Classification → MongoDB Database
```

## assign_category.py - Machine Learning Classification Module

### Purpose
Trains and uses a multi-label text classification model to categorize news articles based on their content.

### Dependencies
- `pandas` - Data manipulation
- `sklearn` - Machine learning algorithms
- `numpy` - Numerical operations
- `json` - JSON file handling

### Global Variables
- `model` - Trained ML pipeline (currently reset to None after training)
- `vectorizer` - CountVectorizer for text feature extraction
- `mlb` - MultiLabelBinarizer for multi-label processing
- `multi_target_classifier` - Trained classifier for predictions

### Core Functions

#### `pick_first_sub_category(sub_category)` (Line 23)
```python
def pick_first_sub_category(sub_category):
    return sub_category.split(",")[0]
```
- **Purpose**: Extracts the first sub-category from comma-separated values
- **Input**: String of comma-separated sub-categories
- **Output**: First sub-category as string

#### `map_category_from_sub_category(sub_category)` (Line 26)
```python
def map_category_from_sub_category(sub_category):
    general_category = ["Politics and Government", "Business and Finance", "Science and Technology", "Climate and Environment", "Health and Medical", "Entertainment and Celebrity News"]
    sports_category = ["Sports"]
    lifestyle_category = ["Travel", "Fashion and Style", "Food and Cooking", "Arts and Culture"]
```
- **Purpose**: Maps specific sub-categories to broader categories
- **Categories**:
  - Sports → "Sports"
  - Travel, Fashion, Food, Arts → "Lifestyle"  
  - Others → "General"
- **Input**: Single sub-category string
- **Output**: Broad category string

#### `read_data_from_json(file_path)` (Line 37)
```python
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
```
- **Purpose**: Loads training data from JSON file
- **Features**:
  - Skips "Uncategorized" articles
  - Extracts text summaries and sub-category labels
- **Input**: Path to JSON training data file
- **Output**: Tuple of (texts, labels)

#### `train_model()` (Line 55)
```python
def train_model():
    texts, labels = read_data_from_json('training_data.json')
    
    # Text vectorization using CountVectorizer
    vectorizer = CountVectorizer()
    X_train = vectorizer.fit_transform(texts_train)
    
    # Convert multi-label categories into binary form
    mlb = MultiLabelBinarizer()
    y_train = mlb.fit_transform(labels_train)
    
    # Train the model using MultiOutputClassifier with MultinomialNB
    classifier = MultinomialNB()
    multi_target_classifier = MultiOutputClassifier(classifier)
    multi_target_classifier.fit(X_train, y_train)
```
- **Purpose**: Trains multi-label text classification model
- **Process**:
  1. **Data Loading**: Reads from `training_data.json`
  2. **Data Splitting**: 90% train, 10% test split
  3. **Vectorization**: Uses `CountVectorizer` for text feature extraction
  4. **Multi-label Processing**: `MultiLabelBinarizer` handles multiple categories per article
  5. **Model Training**: `MultiOutputClassifier` with `MultinomialNB`
- **Issue**: Line 99 resets `model` to None (potential bug)

#### `assign_subcategory(news)` (Line 105)
```python
def assign_subcategory(news):
    summary_vectorized = vectorizer.transform([news])
    predictions = multi_target_classifier.predict(summary_vectorized)
    predicted_labels = mlb.inverse_transform(predictions)
    flattened_labels = list(itertools.chain(*predicted_labels))
    return flattened_labels
```
- **Purpose**: Classifies new articles using trained model
- **Input**: News article text
- **Output**: List of predicted sub-categories
- **Process**:
  1. Vectorizes input text using trained vectorizer
  2. Predicts categories using multi-target classifier
  3. Converts binary predictions back to label names
  4. Flattens multi-dimensional results to single list

### Training Data Format
Expected JSON structure:
```json
[
  {
    "summary": "Article summary text...",
    "sub_category": "Politics, Government"
  },
  {
    "summary": "Another article summary...",
    "sub_category": "Sports"
  }
]
```

## scraping_script.py - Web Scraping and Data Collection Module

### Purpose
Scrapes news articles from multiple websites, categorizes them using the ML model, and stores them in MongoDB.

### Dependencies
- `newspaper` - Web scraping library
- `pymongo` - MongoDB driver
- `apscheduler` - Task scheduling
- `nltk` - Natural language processing
- `requests` - HTTP requests
- `assign_category` - Custom ML module

### Database Configuration
- **Database**: `article-db`
- **Collections**:
  - `users` - User accounts
  - `articles` - News articles
  - `save_articles` - Saved articles by users
  - `vote_articles` - Article voting data

### Core Functions

#### `initialize(ping=False)` (Line 19)
```python
def initialize(ping = False):
    load_dotenv()
    client = MongoClient("mongodb+srv://abdullahjaved4504:Test123@cluster0.duvi6gl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    database = client["article-db"]
```
- **Purpose**: Establishes MongoDB connection and sets up collections
- **Features**:
  - Loads environment variables (currently unused)
  - Sets up global database collections
  - Optional ping to test connection
- **Security Issue**: Hardcoded credentials in code

#### `scrape_articles(url, company)` (Line 61)
```python
def scrape_articles(url, company):
    paper = newspaper.build(url, memoize_articles=False)
    
    for article in paper.articles:
        article.download()
        article.parse()
        article.nlp()
        
        # Categorization
        sub_category = assign_subcategory(article.summary)
        category = map_category_from_sub_category(sub_category[0])
        
        article_obj = {
            'title': article.title,
            'url': article.url,
            'company': company,
            'category': [category],
            'sub_category': sub_category,
            'summary': article.summary,
            'content': article.text,
            'images': list(set(article.images)),
            'authors': article.authors,
            'date_created': datetime.utcnow()
        }
```
- **Purpose**: Scrapes articles from a given news website
- **Process**:
  1. **Article Discovery**: Uses newspaper3k to find articles
  2. **Content Extraction**: Downloads, parses, and processes each article
  3. **NLP Processing**: Extracts summary and keywords
  4. **Categorization**: Uses ML model to assign categories
  5. **Paywall Detection**: Empty summaries marked as paywalled
  6. **Batch Processing**: Inserts articles in batches of 5
- **Error Handling**: Comprehensive try-catch blocks with traceback logging

#### `insert_articles_batch(articles_batch)` (Line 134)
```python
def insert_articles_batch(articles_batch):
    for article_obj in articles_batch:
        query = {"title": article_obj["title"], "company": article_obj["company"]}
        result = article_collection.find_one(query)
        if result is None:
            # Remove duplicate images before insertion
            article_collection.insert_one(article_obj)
```
- **Purpose**: Inserts batch of articles into MongoDB with duplicate prevention
- **Features**:
  - Checks for duplicate articles by title and company
  - Removes duplicate images before insertion
  - Inserts unique articles only

#### `scrape_and_summarize_news_sites(news_sites)` (Line 164)
```python
def scrape_and_summarize_news_sites(news_sites):
    for company, site_url in news_sites.items():
        scrape_articles(site_url, company)
```
- **Purpose**: Orchestrates scraping across multiple news sites
- **Input**: Dictionary of site names and URLs

#### `schedule_scraping()` (Line 201)
```python
def schedule_scraping():
    scheduler = BackgroundScheduler()
    scheduler.add_job(scrape_sites, 'date', run_date=datetime.now())
    scheduler.add_job(scrape_sites, 'interval', hours=10)
    scheduler.start()
```
- **Purpose**: Sets up automated scraping schedule
- **Schedule**: Runs every 10 hours

### Supported News Sources
Currently active sources (Line 171):
- **BBC News**: https://www.bbc.co.uk/news
- **Sky News**: https://news.sky.com/uk
- **ITV News**: https://www.itv.com/news
- **The Independent**: https://www.independent.co.uk/
- **Channel 4 News**: https://www.channel4.com/news/
- **The Sun**: https://www.thesun.co.uk
- **Economist**: https://www.economist.com/
- **Financial Times**: https://www.ft.com/

Commented out sources include CNN, Forbes, Bloomberg, Times of India, and others.

### Article Data Structure
```python
article_obj = {
    'title': article.title,
    'url': article.url,
    'company': company,
    'category': [category],           # Broad category
    'sub_category': sub_category,      # Specific categories
    'paywall': paywall,               # Boolean
    'summary': article.summary,
    'content': article.text,
    'image': article.top_image,
    'images': list(set(article.images)),
    'authors': article.authors,
    'vote': '',
    'date_created': datetime.utcnow()
}
```

## System Integration and Workflow

### Startup Process
```python
def main():
    print("Running")
    train_model()          # Train ML model
    print("Model Trained")
    scrape_sites()         # Start scraping
```

### Data Flow Pipeline
1. **Model Training**: 
   - Load training data from JSON
   - Train multi-label classifier
   - Prepare vectorization components

2. **Web Scraping**:
   - Discover articles from news sites
   - Extract content and metadata
   - Process with NLP (summarization)

3. **Classification**:
   - Apply ML model to article summaries
   - Map sub-categories to broad categories
   - Handle paywall detection

4. **Storage**:
   - Check for duplicates
   - Remove duplicate images
   - Store in MongoDB with metadata

5. **Automation**:
   - Schedule recurring scraping
   - Background task execution

## Configuration and Setup

### Environment Variables
The script attempts to load these variables (currently unused):
- `DB_USERNAME`
- `DB_PASSWORD` 
- `MONGODB_URL`
- `ENV`
- `MAILGUN_DOMAIN`
- `MAILGUN_API_KEY`

### MongoDB Collections
- **users**: User account information
- **articles**: Main news article storage
- **save_articles**: User-saved articles
- **vote_articles**: Article voting data

## Known Issues and Improvements

### Security Issues
- **Hardcoded Credentials**: Database credentials exposed in code (Line 29)
- **No Input Validation**: Scraped content not sanitized

### Code Quality Issues
- **Model Reset Bug**: `model` variable reset to None after training (Line 99)
- **Unused Code**: Many functions commented out but potentially useful
- **Error Handling**: Limited error handling for ML model failures

### Performance Considerations
- **Batch Size**: Fixed batch size of 5 articles
- **Memory Management**: Manual cleanup of article objects
- **Rate Limiting**: No built-in rate limiting for web requests

### Suggested Improvements
1. Move credentials to environment variables
2. Fix model variable reset issue
3. Add comprehensive error handling
4. Implement rate limiting for web scraping
5. Add logging and monitoring
6. Create configuration file for news sources
7. Add unit tests for critical functions

## Utility Functions

### Email Functionality
```python
def send_email(subject, receiver_email, sender_email, content):
    return requests.post(
        "https://api.mailgun.net/v3/" + os.environ['MAILGUN_DOMAIN'] +"/messages",
        auth=("api", os.environ['MAILGUN_API_KEY']),
        data={"from": "News Consolidater <" + sender_email + ">",
              "to": [receiver_email],
              "subject": subject,
              "text": content})
```

### Database Maintenance
Several commented-out functions for database maintenance:
- `update_categories_based_on_new_model()`
- `update_articles_category()`
- `clone_article_table()`
- `remove_duplicate_articles()`
- `remove_duplicate_images()`

## Dependencies Summary

### Python Packages
```
newspaper3k>=0.2.8
pymongo>=4.0.0
scikit-learn>=1.0.0
pandas>=1.3.0
numpy>=1.21.0
apscheduler>=3.9.0
nltk>=3.7
requests>=2.28.0
python-dotenv>=0.19.0
```

### External Services
- **MongoDB Atlas**: Database storage
- **Mailgun**: Email sending (configured but not actively used)
- **News Websites**: Various news sources for scraping

## Usage Instructions

### Running the System
```python
# Main execution
python scraping_script.py

# Or manually
from scraping_script import main
main()
```

### Training Only
```python
from assign_category import train_model
train_model()
```

### Scraping Only
```python
from scraping_script import scrape_sites
scrape_sites()
```

### Custom News Sources
Modify the `news_sites` dictionary to add or remove sources:
```python
news_sites = {
    'Custom News': 'https://example.com/news',
    # Add more sources...
}
```

## Conclusion

This system provides a comprehensive news aggregation solution with automated categorization using machine learning. While functional, it would benefit from improved security practices, error handling, and code organization. The modular design allows for easy extension and customization of news sources and classification models.
