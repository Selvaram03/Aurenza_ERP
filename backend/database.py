from pymongo import MongoClient
import os

MONGO_URI = "mongodb+srv://selvaram_db_user:t1whHfT9bzZtAtl6@enrichdatabase.eof7ta0.mongodb.net/?appName=Enrichdatabase"

client = MongoClient(MONGO_URI)
db = client["aurenza_erp"]

users_col = db["users"]
projects_col = db["projects"]
expenses_col = db["expenses"]
audit_col = db["audit_logs"]
