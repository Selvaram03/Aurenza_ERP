from pymongo import MongoClient
from passlib.context import CryptContext
from datetime import datetime

# ==============================
# CONFIG
# ==============================
MONGO_URI = "mongodb+srv://aurenzalabs_db_user:<LB7T3i8iUiQhf2vW>@aurenzadb.txnjw8c.mongodb.net/?appName=Aurenzadb"
DB_NAME = "aurenza_erp"

pwd_context = CryptContext(schemes=["bcrypt"])

# ==============================
# PASSWORD HASH
# ==============================
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# ==============================
# USERS TO SEED
# ==============================
USERS = [
    {
        "name": "Selva Ram",
        "email": "superadmin@aurenzalabs.com",
        "password": "SuperAdmin@123",
        "role": "SUPER_ADMIN"
    },
    {
        "name": "Finance Admin",
        "email": "admin@aurenzalabs.com",
        "password": "Admin@123",
        "role": "ADMIN"
    },
    {
        "name": "Project Manager",
        "email": "pm@aurenzalabs.com",
        "password": "PM@123",
        "role": "PM"
    },
    {
        "name": "Abhishek Janjal",
        "email": "abhishekjanjal@aurenzalabs.com",
        "password": "Emp@123",
        "role": "EMPLOYEE"
    }
]

# ==============================
# MAIN SCRIPT
# ==============================
def seed_users():
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    users_col = db["users"]

    for user in USERS:
        existing = users_col.find_one({"email": user["email"]})

        if existing:
            print(f"⚠️  User already exists: {user['email']}")
            continue

        users_col.insert_one({
            "name": user["name"],
            "email": user["email"],
            "password": hash_password(user["password"]),
            "role": user["role"],
            "active": True,
            "created_at": datetime.now()
        })

        print(f"✅ Created user: {user['email']} | Role: {user['role']}")

    print("\n🎉 User seeding completed successfully!")

if __name__ == "__main__":
    seed_users()
