from fastapi import FastAPI, HTTPException
from backend.database import users_col
from backend.auth import verify_password, create_token
from backend.routes import users, projects, expenses, pnl

app = FastAPI()

app.include_router(users.router)
app.include_router(projects.router)
app.include_router(expenses.router)
app.include_router(pnl.router)

@app.post("/login")
def login(data: dict):
    user = users_col.find_one({"email": data["email"]})
    if not user or not verify_password(data["password"], user["password"]):
        raise HTTPException(status_code=401)

    token = create_token({
        "user_id": str(user["_id"]),
        "role": user["role"]
    })
    return {"token": token, "role": user["role"]}
