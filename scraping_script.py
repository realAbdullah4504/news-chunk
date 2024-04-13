import newspaper
import time
import os
import pdb
from datetime import datetime
from time import sleep
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from newspaper import Article
from dotenv import load_dotenv
from assign_category import train_model, assign_subcategory, map_category_from_sub_category
from apscheduler.schedulers.background import BackgroundScheduler
import nltk, traceback, requests
from bson import ObjectId 

database = None
batch_size = 5

def initialize(ping = False):
    load_dotenv()
    db_username = os.environ['DB_USERNAME']
    db_password = os.environ['DB_PASSWORD']
    db_url = os.environ['MONGODB_URL']
    uri = "mongodb+srv://" + db_username + ":" + db_password + "@" + db_url + "/?retryWrites=true&w=majority"
    # Create a new client and connect to the server
    if (os.environ["ENV"] == "production"):
        client = MongoClient(uri, server_api=ServerApi('1'))
    else:
        client = MongoClient("mongodb://localhost:27017")
    # Send a ping to confirm a successful connection
    if ping:
      try:
          client.admin.command('ping')
          print("printed Pinged your deployment. You successfully connected to MongoDB!")
      except Exception as e:
          print(e)

    global database
    database = client["article-db"]
    global user_collection
    user_collection = database['users']
    global article_collection
    article_collection = database['articles']
    global save_article_collection
    save_article_collection = database['save_articles']
    global vote_article_collection
    vote_article_collection = database['vote_articles']

    return client

# Function to close the MongoDB connection
def close_connection(client):
    try:
        client.close()
        database = None
    except Exception as e:
        print("Error closing MongoDB connection:", e)


# Function to scrape articles from a given website
def scrape_articles(url, company):
    try:
        nltk.download('punkt')  # Download NLTK data once

        paper = newspaper.build(url, memoize_articles=False)
        print(f"{company} => len {len(paper.articles)}")

        i = 0
        articles_batch = []

        for article in paper.articles:
            try:
                start_time = time.time()
                article.download()
                article.parse()
                article.nlp()
                category = ""
                if article.summary == "":
                    sub_category = ""
                    paywall = True
                else:
                    paywall = False
                    sub_category = assign_subcategory(article.summary)
                    if sub_category:
                        category = map_category_from_sub_category(sub_category[0])
                article_obj = {
                    'title': article.title,
                    'url': article.url,
                    'company': company,
                    'category': [category],
                    'sub_category': sub_category,
                    'paywall': paywall,
                    'summary': article.summary,
                    'content': article.text,
                    'image': article.top_image,
                    'images': list(set(article.images)),  # Store images as a list
                    'authors': article.authors,
                    'vote': '',
                    'date_created': datetime.utcnow()
                }
                articles_batch.append(article_obj)
                i += 1
                if i % 20 == 0:
                    print("Article number is: " + str(i))
                # Insert data into the database in batches
                if i % batch_size == 0:
                    insert_articles_batch(articles_batch)
                    articles_batch.clear()
                article.html = ""
                article.doc = None
                article = None
            except Exception as e:
                print(f"scrape_articles: scraping error in articles")
                print(e)
                tb = traceback.extract_tb(e.__traceback__)
                for filename, line_no, function, text in tb:
                    print(f"File: {filename}, Line: {line_no}, Function: {function}")
                    print(text)
                continue

        # Insert any remaining articles
        if articles_batch:
            insert_articles_batch(articles_batch)

    except Exception as e:
        print(f"scrape_articles: scraping error in newspaper module {company} {url}")
        print(e)
        tb = traceback.extract_tb(e.__traceback__)
        for filename, line_no, function, text in tb:
            print(f"File: {filename}, Line: {line_no}, Function: {function}")
            print(text)

# Function to insert a batch of articles into the database
def insert_articles_batch(articles_batch):
    if articles_batch:
        client = initialize()
        for article_obj in articles_batch:
            query = {"title": article_obj["title"], "company": article_obj["company"]}
            result = article_collection.find_one(query)
            if result is None:
                existing_images = []
                for img_url in article_obj["images"]:
                    query = {"images": {"$elemMatch": {"$eq": img_url}}}
                    existing_count = article_collection.count_documents(query)
                    if existing_count > 0:
                        existing_images.append(img_url)
                # Remove existing image URLs from article_obj['image']
                for img_url in existing_images:
                    article_obj["images"].remove(img_url)
                article_collection.insert_one(article_obj)
                print(f"Inserted article: {article_obj['title']} into the database")
            else:
              #print(f"Article {article_obj['title']} already exists in the database")
              pass
        close_connection(client)

def print_article_details(article):
    print("************************************************************")
    for key, value in article.items():
        print(key, ":", value)
    print("************************************************************")

# Main function to scrape, summarize, and extract images
def scrape_and_summarize_news_sites(news_sites):
    for company, site_url in news_sites.items():
        print(company, site_url)
        scrape_articles(site_url, company)


# Dictionary of news site URLs and corresponding categories
news_sites = {
    'BBC News': 'https://www.bbc.co.uk/news',
    'Sky News': 'https://news.sky.com/uk',
    'ITV News': 'https://www.itv.com/news',
    'The Independent': 'https://www.independent.co.uk/',
    'Channel 4 News': 'https://www.channel4.com/news/',
    'The Sun': 'https://www.thesun.co.uk',
    'Economist': 'https://www.economist.com/',
    'Financial Times': 'https://www.ft.com/'
    #'Independent': 'https://www.independent.co.uk/',
    #'Ft': 'https://www.ft.com/',
    #'CNN': 'https://edition.cnn.com/',
    #'Mirror': 'https://mirror.co.uk',
    #'Forbes': 'https://forbes.com',
    #'Huffpost': 'https://www.huffpost.com/',
    #'Telegraph': 'https://www.telegraph.co.uk/',
    #'Thetimes': 'https://www.thetimes.co.uk/',
    #'Bloomberg': 'https://www.bloomberg.com/uk',
    #'Lemode': 'https://www.lemonde.fr/',
    #'Indian Times': 'https://www.indiatimes.com',
    #'News18': 'https://www.news18.com',
    #'Times of India': 'https://www.timesofindia.com',
    #'NDTV': 'https://www.ndtv.com',
    #'India': 'https://www.india.com',
    #'Hindustan Times': 'https://www.hindustantimes.com',
    #'News': 'https://www.news.google.com',
    #'Buzz feed': 'https://www.buzzfeed.com',
    #'Msn': 'https://www.msn.com',
}

def schedule_scraping():
    scheduler = BackgroundScheduler()
    scheduler.add_job(scrape_sites, 'date', run_date=datetime.now())
    scheduler.add_job(scrape_sites, 'interval', hours=10)
    scheduler.start()

def scrape_sites():
    try:
        print("printing Job Started")
        scrape_and_summarize_news_sites(news_sites)
        print("Job Ended")
    except Exception as e:
        print(f"scrape_sites: error in scrape_and_summarize_news_sites")
        print(e)

# def update_categories_based_on_new_model():
#     collection = database["articles"]
#     # Retrieve all documents from the collection
#     cursor = collection.find()

#     # Update and store each document back
#     print(cursor.count())
#     i = 0
#     for article in cursor:
#         if article["summary"] == "":
#             article["sub_category"] = ""
#             article["category"] = ""
#             article["paywall"] = True
#         else:
#             article["paywall"] = False
#             sub_category = assign_subcategory(article["summary"])
#             article["sub_category"] = sub_category
#             article["category"] = map_category_from_sub_category(sub_category)

#         # Update the document in the collection
#         update_query = {"_id": article["_id"]}
#         update_data = {"$set": article}
#         collection.update_one(update_query, update_data)
#         print(str(i) + " / " + str(cursor.count()))
#         i = i + 1

def send_email(subject, receiver_email, sender_email, content):
  print(receiver_email)
  print(sender_email)
  print("News Consolidater <" + sender_email + ">")
  return requests.post(
    "https://api.mailgun.net/v3/" + os.environ['MAILGUN_DOMAIN'] +"/messages",
    auth=("api", os.environ['MAILGUN_API_KEY']),
    #data={"from": "Excited User <mailgun@" + os.environ['MAILGUN_DOMAIN'] +">",
    data={"from": "News Consolidater <" + sender_email + ">",
      "to": [receiver_email],
      "subject": subject,
      "text": content})

# def update_articles_category():
#     client = initialize()
#     database = client["article-db"]
#     collection = database['articles']
#     query = {}
#     articles = list(collection.find(query).sort([('_id', -1)]))
#     for article_obj in articles:
#         # Get the first category from the list of categories
#         if 'category' in article_obj and len(article_obj['category']) > 1:
#             first_category = article_obj['category'][0]
#             # Update the 'category' field with the first category
#             collection.update_one({'_id': ObjectId(article_obj['_id'])}, {'$set': {'category': [first_category]}})

# def clone_article_table():
#     client = initialize()
#     database = client["article-db"]
#     collection = database['articles']
#     duplicate_collection = database['articles_duplicate']  # Create a collection for duplicates
    
#     # Retrieve articles from the original collection
#     articles = collection.find().sort([('_id', -1)])
    
#     articles_to_insert = []  # List to store articles for bulk insert
    
#     for index, article in enumerate(articles):
#         articles_to_insert.append(article)
        
#         # Print the index to keep track of progress
#         print(f"Processed {index + 1} articles")
    
#     # Use insert_many for bulk insertion
#     if articles_to_insert:
#         duplicate_collection.insert_many(articles_to_insert)

def remove_duplicate_articles():
    client = initialize()
    database = client["article-db"]
    collection = database['articles_duplicate']
        
    pipeline = [
        {
            "$group": {
                "_id": {
                    "title": "$title",
                    "company": "$company"
                },
                "article_ids": {"$push": "$_id"},
                "count": {"$sum": 1}
            }
        },
        {
            "$match": {
                "count": {"$gt": 1}
            }
        }]

    result = collection.aggregate(pipeline)
    for doc in result:
        pdb.set_trace()
        url = doc["_id"]["url"]
        content = doc["_id"]["content"]
        company = doc["_id"]["company"]
        article_ids = doc["article_ids"]
        
        print(f"URL: {url}")
        print(f"Content: {content}")
        print(f"Company: {company}")
        print(f"Article IDs: {article_ids}")
        print("---")


def remove_duplicate_images():
    client = initialize()
    database = client["article-db"]
    collection = database['articles_duplicate']

    # Get all articles sorted by '_id' in descending order
    articles = collection.find().sort([('_id', -1)])
    #articles = [collection.find_one({"_id": ObjectId('64e9fb4d905b8a0658e79711')})]

    for article_obj in articles:
        article_id = article_obj['_id']
        images = article_obj['images']
        images_to_remove = []

        for image_index in images:
            # Query to check if the image index exists in any other articles
            query = {"_id": {"$ne": ObjectId(article_id)}, "images": image_index}
            other_articles_with_image = collection.count_documents(query)

            # If there are no other articles with the same image index, mark it for removal
            if other_articles_with_image != 0:
                images_to_remove.append(image_index)

        # Remove the unused images from the current article
        updated_images = [img for img in images if img not in images_to_remove]
        print(f"================ updated images {updated_images}")
        collection.update_one({"_id": ObjectId(article_id)}, {"$set": {"images": updated_images}})


def main():
    print("Running")
    train_model()
    print("Model Trained")
    scrape_sites()


# def verify_all_users():
#     client = initialize()
#     cursor = user_collection.find()
#     # Update and store each document back
#     print(cursor.count())
#     i = 0
#     for user in cursor:
#         user["verified"] = True
#         user["verification_token"] = None
#         update_query = {"_id": ObjectId(user["_id"])}
#         update_data = {"$set": user}
#         user_collection.update_one(update_query, update_data)
#         print(str(i) + " / " + str(cursor.count()))
#         i = i + 1
#     close_connection(client)

#if __name__ == "__main__":
#   verify_all_users()
    #response = send_email()
    #print(response)
    #print(response.text)
    #main()
