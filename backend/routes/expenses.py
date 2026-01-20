from fastapi import APIRouter
from backend.database import expenses_col

router = APIRouter()

@router.post("/expenses/add")
def add_expense(data: dict):
    expenses_col.insert_one({
        "project_id": data["project_id"],
        "amount": data["amount"],
        "status": "APPROVED"
    })
    return {"msg": "Expense added"}
