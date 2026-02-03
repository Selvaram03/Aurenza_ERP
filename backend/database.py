from pymongo import MongoClient

MONGO_URI = "mongodb+srv://aurenzalabs_db_user:<LB7T3i8iUiQhf2vW>@aurenzadb.txnjw8c.mongodb.net/?appName=Aurenzadb"

client = MongoClient(MONGO_URI)
db = client["aurenza_erp"]

users_col = db["users"]
projects_col = db["projects"]
expenses_col = db["expenses"]
