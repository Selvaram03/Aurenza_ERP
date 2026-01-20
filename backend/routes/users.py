from fastapi import APIRouter
from backend.database import users_col
from backend.auth import hash_password

router = APIRouter()

@router.post("/users/create")
def create_user(data: dict):
    users_col.insert_one({
        "name": data["name"],
        "email": data["email"],
        "password": hash_password(data["password"]),
        "role": data["role"],  # SUPER_ADMIN, ADMIN, PM, EMPLOYEE
        "active": True
    })
    return {"msg": "User created"}
