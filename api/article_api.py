from flask import Flask, jsonify, request, send_from_directory
from flask_mail import Mail, Message
# from scraping_script import main 
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import pdb, math, os
# from dotenv import load_dotenv
from newsapi.newsapi_client import NewsApiClient
from flask_bcrypt import Bcrypt
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from flask_cors import CORS, cross_origin
# from apscheduler.schedulers.blocking import BlockingScheduler
from bson import ObjectId 
import secrets
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import json

app = Flask(__name__, static_folder='../articles/build', static_url_path='')
# load_dotenv()
jwt_secret_key = 'iam good'
app.config['JWT_SECRET_KEY'] = jwt_secret_key
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False
jwt = JWTManager(app)

bcrypt = Bcrypt(app)

# Email configuration
# smtp_server = os.environ.get('MAIL_SERVER')  # Replace with your SMTP server address
# smtp_port = int(os.environ.get('MAIL_PORT'))  # Replace with your SMTP server's port (587 is the default for TLS)
# smtp_username = os.environ.get('MAIL_USERNAME')  # Replace with your SMTP username
# smtp_password = os.environ.get('MAIL_PASSWORD')  # Replace with your SMTP password

mail=Mail(app)

user_collection = None
article_collection = None
vote_article_collection = None
save_article_collection = None
sender_email = 'abdullah'
database = None
page_size = 10

def initialize(ping = False):
    # load_dotenv()
    # db_username = os.environ['DB_USERNAME']
    # db_password = os.environ['DB_PASSWORD']
    # db_url = os.environ['MONGODB_URL']
    # uri = "mongodb+srv://" + db_username + ":" + db_password + "@" + db_url + "/?retryWrites=true&w=majority"
    uri="mongodb+srv://abdullahjaved4504:Test123@cluster0.duvi6gl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    # Create a new client and connect to the server
    # if (os.environ["ENV"] == "production"):
    #     client = MongoClient(uri, server_api=ServerApi('1'))
    # else:
    client = MongoClient("mongodb+srv://abdullahjaved4504:Test123@cluster0.duvi6gl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
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
        user_collection = None
        article_collection = None
        save_article_collection = None
        vote_article_collection = None
    except Exception as e:
        print("Error closing MongoDB connection:", e)




@app.route('/api/articles', methods=['GET'])
@cross_origin()
def articles():
    category = request.args.getlist('category')
    subcategory = request.args.getlist('subcategory')
    company = request.args.getlist('company')
    last_id = request.args.get('last_id')
    user_id = request.args.get('user_id')
    client = initialize()
    database = client["article-db"]
    collection = database['articles']

    if last_id:
      try:
        last_id = ObjectId(last_id)
      except Exception as e:
        last_id = None

    query = {}
    if category:
        query['category'] = {'$in': category}

    if subcategory:
        query['sub_category'] = {'$in': subcategory}

    if company:
        query['company'] = {'$in': company}

    if last_id is None or last_id == '':
        articles = list(collection.find(query).sort([('_id', -1)]).limit(page_size))
    else:
        query['_id'] = {'$lt': last_id}
        articles = list(collection.find(query).sort([('_id', -1)]).limit(page_size))

    for article in articles:
        article['id'] = str(article['_id'])
        article['saved'] = False
        del article['_id']

    if user_id is not None and user_id != '':
      saved_articles = get_saved_articles_from_db(user_id, last_id, client)
      for article in articles:
        article['saved'] = is_saved_article(article['id'], saved_articles)
    close_connection(client)
    return jsonify(articles)

@app.route('/api/all_articles', methods=['GET'])
@cross_origin()
def all_articles():
    category = request.args.getlist('category')
    subcategory = request.args.getlist('subcategory')
    company = request.args.getlist('company')
    last_id = request.args.get('last_id')
    user_id = request.args.get('user_id')
    client = initialize()
    database = client["article-db"]
    collection = database['articles']

    if last_id:
        try:
          last_id = ObjectId(last_id)
        except Exception as e:
          last_id = None

    query = {}
    if category:
        query['category'] = {'$in': category}

    if subcategory:
        query['sub_category'] = {'$in': subcategory}

    if company:
        query['company'] = {'$in': company}

    if last_id is None or last_id == '':
        articles = list(collection.find(query).sort([('_id', -1)]))
    else:
        query['_id'] = {'$lt': last_id}
        articles = list(collection.find(query).sort([('_id', -1)]))

    for article in articles:
        article['id'] = str(article['_id'])
        article['saved'] = False
        del article['_id']

    if user_id is not None and user_id != '':
      saved_articles = get_saved_articles_from_db(user_id, last_id, client)
      for article in articles:
        article['saved'] = is_saved_article(article['id'], saved_articles)

    close_connection(client)
    return jsonify(articles)

@app.route('/api/articles/<article_id>', methods=['GET'])
@cross_origin()
def one_article(article_id):
    client = initialize()
    database = client["article-db"]
    collection = database['articles']

    article = collection.find_one({'_id': ObjectId(article_id)})
    if article:
        article['id'] = str(article['_id'])
        del article['_id']

    vote_collection = database['vote_articles']
    user_ids = [doc["user_id"] for doc in vote_collection.find({"article_id": article['id']}, {"user_id": 1})]
    response = {
        'article': article,
        'user_ids': user_ids,
        'count': len(user_ids)
    }
    close_connection(client)
    return jsonify(response), 200

# @app.route('/articles/<article_id>/destroy', methods=['GET'])
# @cross_origin()
# def destroy_article(article_id):
#     document_id_to_remove = ObjectId(article_id)
#     client = initialize()
#     database = client["article-db"]
#     collection = database['save_articles']
#     result1 = collection.delete_many({"article_id": {'$in': [document_id_to_remove]}})
#     print("Saved articles deleted")
#     print(result1.deleted_count)

#     database = client["article-db"]
#     collection = database['vote_articles']
#     result2 = collection.delete_many({"article_id": {'$in': [document_id_to_remove]}})
#     print("Voted articles deleted")
#     print(result2.deleted_count)

#     database = client["article-db"]
#     collection = database['articles']

#     # Delete the document with the specified ObjectId
#     result = collection.delete_one({"_id": document_id_to_remove})

#     # Check if a document was deleted
#     close_connection(client)
#     if result.deleted_count == 1:
#         print("Document deleted successfully.")
#         return jsonify({"message": "Document deleted successfully"}), 200
#     else:
#         print("Document not found or could not be deleted.")
#         return jsonify({"message": "Document not found or could not be deleted"}), 404

@app.route('/api/articles_count', methods=['GET'])
@cross_origin()
def all_articles_count():
    client = initialize()
    database = client["article-db"]
    collection = database['articles']
    # Find records in the collection where the 'category' field contains the input category
    # Use projection to exclude the '_id' field if you don't want to include it in the result
    # If you want to sort the results, you can add 'sort' parameter with the desired sorting field and order.
    # For example: collection.find({'category': {'$in': [category]}}).sort('date_created', -1)
    articles_count = len(list(collection.find({}, {'_id': 0})))
    close_connection(client)
    return jsonify(articles_count)

# @app.route('/get_trending_news', methods=['GET'])
# @cross_origin()
# def get_trending_news():
#     try:
#         # Fetch top headlines from the 'general' category
#         news_api = NewsApiClient(os.environ["NEWSAPI_KEY"])
#         trending_news_data = news_api.get_top_headlines(category='general', language='en', country='us')
#         if trending_news_data and trending_news_data['status'] == 'ok':
#             articles = trending_news_data['articles']
#             for index, article in enumerate(articles):
#                 print(f"{index+1}. {article['title']}")
#                 print(f"   Source: {article['source']['name']}")
#                 print(f"   URL: {article['url']}")
#                 print()
#         else:
#             print("Unable to fetch trending news.")
#         return trending_news_data
#     except Exception as e:
#         print(f"Error occurred: {e}")
#         return None

@app.route('/api/signup', methods=['POST'])
@cross_origin()
def signup():
    data = request.get_json()
    # Define the required parameters as a list
    required_params = ['first_name', 'last_name', 'username', 'email', 'password']
    
    # Check if all required parameters are present in the request body
    if not validate_params(data, required_params):
        return jsonify({'error': 'Some required parameters are missing'}), 400

    firstname = data['first_name']
    lastname = data['last_name']
    username = data['username']
    email = data['email']
    password = data['password']

    client = initialize()
    database = client["article-db"]
    user_collection = database['users']

    # Check if username or email already exists
    if user_collection.find_one({'$or': [{'username': username}, {'email': email}]}):
        return jsonify({'error': 'Username or email already exists'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Store user data in the database
    verification_token = secrets.token_urlsafe(32)
    user_data = {
        'first_name': firstname,
        'last_name': lastname,
        'username': username,
        'verified': False,
        'verification_token': str(verification_token),
        'email': email,
        'password': hashed_password
    }
    user_collection.insert_one(user_data)

    response = {
        'message': 'User registered successfully. Please verify your email to login.'
    }
    content = "Click the following link to verify your email: " + "https://news-consolidater-a6b192023f70.herokuapp.com/api/verify_email/" + str(verification_token)
    send_email('Verify Your Email', email, sender_email, content)
    close_connection(client)
    return jsonify(response), 201

@app.route('/api/resend_verification_email', methods=['POST'])
@cross_origin()
def resend_verification_email():
    required_fields = ['identifier']
    missing_fields = [field for field in required_fields if field not in request.args]

    if missing_fields:
        return jsonify({'error': f'Missing fields: {", ".join(missing_fields)}'}), 400

    identifier = request.args.get('identifier')

    client = initialize()
    user_collection = database['users']

    user = user_collection.find_one({'$or': [{'username': identifier}, {'email': identifier}]})
    close_connection(client)
    if user:
        if user['verified'] == True:
            return jsonify({'error': 'Email verified already'}), 200

        email = user['email']
        verification_token = secrets.token_urlsafe(32)
        if user_collection.update_one({'_id': ObjectId(user['_id'])}, {'$set': {'verification_token': verification_token}}):
          close_connection(client)
          content = "Click the following link to verify your email: " + "https://news-consolidater-a6b192023f70.herokuapp.com/verify_email/" + str(verification_token)
          response = send_email('Verify Your Email', email, sender_email, content)
          if response.get('message'):
              return jsonify({'message': 'Verification email sent successfully'})
          else:
              return jsonify(response)
        else:
          close_connection(client)
          return jsonify({'message': 'User not found'}), 404
    else:
        return jsonify({'error': 'Invalid username or email'}), 401


@app.route('/api/forgot_password', methods=['POST'])
@cross_origin()
def forgot_password():
    required_fields = ['identifier']
    missing_fields = [field for field in required_fields if field not in request.args]

    if missing_fields:
        return jsonify({'message': f'Missing fields: {", ".join(missing_fields)}'}), 400

    identifier = request.args.get('identifier')

    client = initialize()
    user = user_collection.find_one({'$or': [{'username': identifier}, {'email': identifier}]})

    if not user:
        close_connection(client)
        return jsonify({'message': 'User not found with this email or username'}), 400
    else:
        email = user['email']
        reset_token = secrets.token_urlsafe(32)
        if user_collection.update_one({'_id': ObjectId(user['_id'])}, {'$set': {'reset_token': reset_token}}):
            close_connection(client)
            content = "Click the following link to reset your password: " + "https://news-consolidater-a6b192023f70.herokuapp.com/reset_password/" + str(reset_token)
            response = send_email('Reset Your Password', email, sender_email, content)
            if response.get('message'):
                return jsonify({'message': 'Password reset email sent successfully'})
            else:
                return jsonify(response)
        else:
            close_connection(client)
            return jsonify({'message': 'User not updated due to an error'}), 404


@app.route('/api/reset_password', methods=['POST'])
@cross_origin()
def reset_password():
    data = request.get_json()
    # Define the required parameters as a list
    required_params = ['new_password', 'reset_token']
    # Check if all required parameters are present in the request body
    if not validate_params(data, required_params):
        return jsonify({'error': 'Some required parameters are missing'}), 400

    new_password = data['new_password']
    reset_token = data['reset_token']

    client = initialize()
    user = user_collection.find_one({'reset_token': reset_token})
    if user:
        hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        if user_collection.update_one({'reset_token': reset_token}, {'$set': {'reset_token': None, 'password': hashed_password}}):
            close_connection(client)
            return jsonify({'message': 'Password reset successfully'})

    close_connection(client)
    return jsonify({'error': 'Invalid or expired reset token'}), 400

@app.route('/api/verify_email/<verification_token>', methods=['GET'])
@cross_origin()
def verify_email(verification_token):
    client = initialize()
    user = user_collection.find_one({'verification_token': verification_token, 'verified': False})
    if user:
        if user_collection.update_one({'_id': ObjectId(user['_id'])}, {'$set': {'verification_token': None, 'verified': True}}):
            close_connection(client)
            return jsonify({'message': 'Email verified successfully'})

    close_connection(client)
    return jsonify({'message': 'Invalid or expired verification token'}), 400

@app.route('/api/login', methods=['POST'])
@cross_origin()
def login():
    data = request.get_json()
    # Define the required parameters as a list
    required_params = ['identifier', 'password']
    # Check if all required parameters are present in the request body
    if not validate_params(data, required_params):
        return jsonify({'error': 'Some required parameters are missing'}), 400

    identifier = data['identifier']
    password = data['password']

    client = initialize()
    database = client["article-db"]
    user_collection = database['users']

    user = user_collection.find_one({'$or': [{'username': identifier}, {'email': identifier}]})
    close_connection(client)
    if user:
        user = user_collection.find_one({'$and': [{'$or': [{'username': identifier}, {'email': identifier}]}, {'verified': True}]})
        if not user:
          return jsonify({'error': 'Please verify your email'}), 401

        if bcrypt.check_password_hash(user['password'], password):
            user_attributes = {
                'username': user['username'],
                'email': user['email'],
                'user_id': str(user['_id'])
            }
            access_token = create_access_token(identity=identifier)
            return jsonify({'message': 'Logged in successfully', 'user': user_attributes, 'access_token': access_token}), 200
        else:
            return jsonify({'error': 'Invalid password'}), 401
    else:
        return jsonify({'error': 'Invalid username or email'}), 401

@app.route('/api/change_password', methods=['POST'])
@jwt_required()  # Requires authentication via JWT
@cross_origin()  # Enable Cross-Origin Resource Sharing if needed
def change_password():
    data = request.get_json()
    # Define the required parameters as a list
    required_params = ['user_id', 'old_password', 'new_password']
    # Check if all required parameters are present in the request body
    if not validate_params(data, required_params):
        return jsonify({'error': 'Some required parameters are missing'}), 400

    user_id = data['user_id']
    old_password = data['old_password']
    new_password = data['new_password']

    # Check if the user_id is provided
    if not user_id:
        return jsonify({'error': 'User must be logged in to perform this operation.'}), 400

    if old_password == new_password:
        return jsonify({'error': 'Old and new password are same'}), 400

    client = initialize()
    database = client['article-db']  # Replace with your actual database name
    users_collection = database['users']  # Replace with your user collection name

    # Check if the user exists and the old_password matches
    user = users_collection.find_one({'_id': ObjectId(user_id)})
    if not user:
        close_connection(client)
        return jsonify({'error': 'User not found.'}), 404

    # Check if the old_password matches the current password
    if not bcrypt.check_password_hash(user['password'], old_password):
        close_connection(client)
        return jsonify({'error': 'Old password is incorrect.'}), 400

    # Hash and update the user's password with the new_password
    hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
    if users_collection.update_one({'_id': ObjectId(user_id)}, {'$set': {'password': hashed_password}}):
        close_connection(client)
        return jsonify({'message': 'Password changed successfully'}), 200
    return jsonify({'error': 'Error in updating password.'}), 400


@app.route('/api/save_article', methods=['POST'])
@jwt_required()
@cross_origin()
def save_article():
    required_fields = ['user_id', 'article_id']
    missing_fields = [field for field in required_fields if field not in request.args]

    if missing_fields:
        return jsonify({'error': f'Missing fields: {", ".join(missing_fields)}'}), 400

    user_id = request.args.get('user_id')
    article_id = request.args.get('article_id')

    # Check if both article_id and user_id are provided
    if not user_id:
        return jsonify({'error': 'User must be logged in to perform this operation.'}), 400

    if not article_id:
        return jsonify({'error': 'Article is not present.'}), 400

    client = initialize()
    database = client['article-db']
    association_collection = database['save_articles']  # Replace with your collection name
    existing_association = association_collection.find_one({'user_id': ObjectId(user_id), 'article_id': ObjectId(article_id)})
    if existing_association:
        return jsonify({'message': 'Article is already saved'}), 200

    # Create an association document
    association_data = {
        'article_id': ObjectId(article_id),
        'user_id': ObjectId(user_id)
    }

    association_collection.insert_one(association_data)
    close_connection(client)
    return jsonify({'message': 'Article saved successfully'}), 201

@app.route('/api/get_saved_articles', methods=['GET'])
@jwt_required()
@cross_origin()
def get_saved_articles():
    required_fields = ['user_id']
    missing_fields = [field for field in required_fields if field not in request.args]

    if missing_fields:
        return jsonify({'error': f'Missing fields: {", ".join(missing_fields)}'}), 400

    category = request.args.getlist('category')
    subcategory = request.args.getlist('subcategory')
    company = request.args.getlist('company')
    last_id = request.args.get('last_id')
    user_id = request.args.get('user_id')

    client = initialize()
    database = client['article-db']
    collection = database['save_articles']

    articles = collection.find({'user_id': ObjectId(user_id)})
    article_ids = [article['article_id'] for article in articles]
    article_ids = [ObjectId(id) for id in article_ids]

    database = client["article-db"]
    collection = database['articles']

    if last_id:
        try:
          last_id = ObjectId(last_id)
        except Exception as e:
          last_id = None

    query = {'_id': {'$in': article_ids}}
    if category:
        query['category'] = {'$in': category}

    if subcategory:
        query['sub_category'] = {'$in': subcategory}

    if company:
        query['company'] = {'$in': company}

    if last_id is None or last_id == '':
        articles = list(collection.find(query).sort([('_id', -1)]).limit(page_size))
    else:
        query['_id'] = {'$lt': last_id, '$in': article_ids}
        articles = list(collection.find(query).sort([('_id', -1)]).limit(page_size))

    for article in articles:
        article['id'] = str(article['_id'])
        article['saved'] = True
        del article['_id']
    close_connection(client)
    return jsonify(articles)

# Function to unsave (remove) a saved article
@app.route('/api/unsave_article', methods=['POST'])
@jwt_required()
@cross_origin()
def unsave_article():
    required_fields = ['user_id', 'article_id']
    missing_fields = [field for field in required_fields if field not in request.args]

    if missing_fields:
        return jsonify({'error': f'Missing fields: {", ".join(missing_fields)}'}), 400

    user_id = request.args.get('user_id')
    article_id = request.args.get('article_id')

    # Check if both article_id and user_id are provided
    if not user_id:
        return jsonify({'error': 'User must be logged in to perform this operation.'}), 400

    if not article_id:
        return jsonify({'error': 'Article is not present.'}), 400

    client = initialize()
    database = client['article-db']
    association_collection = database['save_articles']
    existing_association = association_collection.find_one({'user_id': ObjectId(user_id), 'article_id': ObjectId(article_id)})
    if not existing_association:
        return jsonify({'message': 'Article is not saved'}), 200

    association_collection.delete_one({'user_id': ObjectId(user_id), 'article_id': ObjectId(article_id)})
    close_connection(client)
    return jsonify({'message': 'Article unsaved successfully'}), 200

@app.route('/api/all_users', methods=['GET'])
@cross_origin()
def all_users():
    client = initialize()
    database = client['article-db']
    user_collection = database['users']
    page = int(request.args.get('page', 1))
    skip_count = (page - 1) * page_size

    total_users = user_collection.count_documents({})
    total_pages = (total_users + page_size - 1) // page_size

    users = user_collection.find({}, {'password': False}).skip(skip_count).limit(page_size)

    user_list = []
    for user in users:
        user['id'] = str(user.pop('_id'))  # Rename and convert ObjectId to string
        user_list.append(user)

    response = {
        'users': user_list,
        'total_pages': total_pages,
        'current_page': page
    }
    close_connection(client)
    return jsonify(response), 200

@app.route('/api/vote_article', methods=['POST'])
@jwt_required()
@cross_origin()
def vote_article():
    required_fields = ['user_id', 'article_id', 'vote_type']
    missing_fields = [field for field in required_fields if field not in request.args]

    if missing_fields:
        return jsonify({'error': f'Missing fields: {", ".join(missing_fields)}'}), 400
    user_id = request.args.get('user_id')
    article_id = request.args.get('article_id')
    vote_type = request.args.get('vote_type')
    client = initialize()
    database = client['article-db']
    association_collection = database['vote_articles']

    # Check if both article_id and user_id are provided
    if not user_id:
        return jsonify({'error': 'User must be logged in to perform this operation.'}), 400

    if not article_id:
        return jsonify({'error': 'Article is not present.'}), 400

    valid_vote_types = ['extreme_right', 'right', 'center', 'left', 'extreme_left']
    if vote_type not in valid_vote_types:
        return jsonify({'error': 'Invalid vote type. Choose from: extreme_right, right, center, left, extreme_left'}), 400

    association_collection = database['vote_articles']
    existing_association = association_collection.find_one({'user_id': ObjectId(user_id), 'article_id': ObjectId(article_id)})
    if existing_association:
        return jsonify({'message': 'Article is already voted'}), 200

    # Create an association document
    association_data = {
        'article_id': ObjectId(article_id),
        'user_id': ObjectId(user_id),
        'vote_type': vote_type
    }

    association_collection.insert_one(association_data)
    vote_counts = {vote_type: association_collection.count_documents({'vote_type': vote_type, "article_id":{ "$in": [ObjectId(article_id)]}}) for vote_type in valid_vote_types}
    print("vote_counts")
    print(vote_counts)
    print("vote_counts")
    label, score = calculate_score(vote_counts)

    article_collection = database["articles"]
    filter = {"_id": ObjectId(article_id)}

    # Define the update operation (e.g., set a new value for an attribute)
    update = {"$set": {"vote": label}}

    # Update a single document that matches the filter
    result = article_collection.update_one(filter, update)
    close_connection(client)
    return jsonify({'message': 'Article voted successfully', "score": label}), 201
    

@app.route('/signup')
@app.route('/login')
@app.route('/settings')
@app.route('/reset_password/<string:key>')  # Use angle brackets for dynamic parts
def frontend_routes(key=None):
    # Serve the 'index.html' file for frontend routes
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    # Serve the 'index.html' file for frontend routes
    return send_from_directory(app.static_folder, 'index.html')



def calculate_score(votes):
    weights = {
    'extreme_left': -100,
    'left': -50,
    'center': 0,
    'right': 50,
    'extreme_right': 100
    }
    total_votes = sum(votes.values())
    if total_votes == 0:
        return "center", 0

    weighted_average = sum(((1 if weights[category] >= 0 else -1) * math.log(abs(votes[category]) * abs(weights[category]) / total_votes + 1)) for category in votes.keys())
    # Define the maximum possible score based on the weights (using 'extreme_right' as the dynamic value)
    max_vote = math.log(weights['extreme_right'] * total_votes + 1)
    # Set the minimum vote as the negative of the maximum vote
    min_vote = -max_vote
    # Calculate the range of values from min_vote to max_vote
    value_range = max_vote - min_vote
    # Calculate the segment size based on the range divided by 5
    segment_size = value_range / 5
    # Determine the label segments starting from the min vote score
    label_segments = [min_vote + segment_size * i for i in range(1, 6)]
    label = None
    if weighted_average <= label_segments[0]:
        label = "extreme_left"
    elif weighted_average <= label_segments[1]:
        label = "left"
    elif weighted_average <= label_segments[2]:
        label = "center"
    elif weighted_average <= label_segments[3]:
        label = "right"
    else:
        label = "extreme_right"

    return label, weighted_average

@app.route('/api/unvote_article', methods=['POST'])
@jwt_required()
@cross_origin()
def unvote_article():
    required_fields = ['user_id', 'article_id']
    missing_fields = [field for field in required_fields if field not in request.args]

    if missing_fields:
        return jsonify({'error': f'Missing fields: {", ".join(missing_fields)}'}), 400

    user_id = request.args.get('user_id')
    article_id = request.args.get('article_id')

    # Check if both article_id and user_id are provided
    if not user_id:
        return jsonify({'error': 'User must be logged in to perform this operation.'}), 400

    if not article_id:
        return jsonify({'error': 'Article is not present.'}), 400

    client = initialize()
    database = client['article-db']
    association_collection = database['vote_articles']
    existing_association = association_collection.find_one({'user_id': ObjectId(user_id), 'article_id': ObjectId(article_id)})
    if not existing_association:
        return jsonify({'message': 'Article is not voted'}), 200

    association_collection.delete_one({'user_id': ObjectId(user_id), 'article_id': ObjectId(article_id)})
    
    valid_vote_types = ['extreme_right', 'right', 'center', 'left', 'extreme_left']
    vote_counts = {vote_type: association_collection.count_documents({'vote_type': vote_type, "article_id":{ "$in": [ObjectId(article_id)]}}) for vote_type in valid_vote_types}
    print("vote_counts")
    print(vote_counts)
    print("vote_counts")
    label, score = calculate_score(vote_counts)

    article_collection = database["articles"]
    filter = {"_id": ObjectId(article_id)}

    # Define the update operation (e.g., set a new value for an attribute)
    update = {"$set": {"vote": label}}

    # Update a single document that matches the filter
    result = article_collection.update_one(filter, update)
    close_connection(client)    
    return jsonify({'message': 'Article vote removed successfully', "score": label}), 200


def get_saved_articles_from_db(user_id, last_id, client):
    database = client['article-db']
    collection = database['save_articles']

    articles = collection.find({'user_id': ObjectId(user_id)})
    article_ids = [article['article_id'] for article in articles]
    article_ids = [ObjectId(id) for id in article_ids]
    collection = database['articles']
    
    query = {'_id': {'$in': article_ids}}
    if last_id is None or last_id == '':
        articles = list(collection.find(query).sort([('_id', -1)]).limit(page_size))
    else:
        query['_id'] = {'$lt': last_id}
        articles = list(collection.find(query).sort([('_id', -1)]).limit(page_size))

    for article in articles:
        article['id'] = str(article['_id'])
        del article['_id']
    return articles

@jwt_required()
@app.route('/api/destroy_user', methods=['DELETE'])
@cross_origin()
def destroy_user():
    required_fields = ['user_id', 'email']
    missing_fields = [field for field in required_fields if field not in request.args]

    if missing_fields:
        return jsonify({'error': f'Missing fields: {", ".join(missing_fields)}'}), 400

    # Get the user_id from the request query parameters
    user_id = request.args.get('user_id')
    email = request.args.get('email')

    user_id_to_remove = ObjectId(user_id)
    client = initialize()
    query = {
        "$and": [
            {"email": email},
            {"_id": user_id_to_remove},
        ]
    }

    # Execute the query
    result = user_collection.find_one(query)
    if not result:
      return jsonify({"message": "User not found"}), 404

    result1 = save_article_collection.delete_many({"user_id": user_id_to_remove})
    result2 = vote_article_collection.delete_many({"user_id": user_id_to_remove})
    if user_collection.delete_one({"_id": user_id_to_remove}):
        close_connection(client)
        return jsonify({"message": "User deleted successfully"}), 200
    else:
        close_connection(client)
        return jsonify({"message": "User not found or could not be deleted"}), 404

def validate_params(data, required_params):
    for param in required_params:
        if param not in data:
            return False
    return True

def is_saved_article(article_id, saved_articles):
    # Iterate through the list and check for the value
    for saved_article in saved_articles:
        if saved_article['id'] == article_id:
            return True
    return False

def send_email(subject, receiver_email, sender_email, content):
    # Create a MIMEMultipart message
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = subject

    # Attach the message to the email
    msg.attach(MIMEText(content, 'plain'))

    # Connect to the SMTP server
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()  # Use TLS for security (this is optional)
        server.login(smtp_username, smtp_password)

        # Send the email
        server.sendmail(sender_email, receiver_email, msg.as_string())

        # Quit the SMTP server
        server.quit()
        print('Email sent successfully')
        return { 'message': 'Email sent successfully' }
    except Exception as e:
        print(f'Error: {str(e)}')
        return { 'error': str(e) }

if __name__ == "__main__":
    initialize()
    app.run(port=3000)
