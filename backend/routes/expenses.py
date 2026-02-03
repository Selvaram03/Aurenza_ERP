from fastapi import APIRouter
from backend.database import expenses_col

router = APIRouter()

@router.post("/expenses/add")
def add_expense(data: dict):
    expenses_col.insert_one({
        "project_id": data["project_id"],
        "amount": data["amount"],
        "category": data["category"],
        "status": "APPROVED"
    })
    return {"msg": "Expense added"}

@router.get("/expenses/list")
def list_expenses():
    return [{
        "project_id": str(e["project_id"]),
        "amount": e["amount"],
        "category": e["category"],
        "status": e["status"]
    } for e in expenses_col.find()]
