from fastapi import APIRouter
from backend.database import projects_col, expenses_col

router = APIRouter()

@router.get("/pnl")
def pnl():
    revenue = sum(p["value"] for p in projects_col.find())
    expense = sum(e["amount"] for e in expenses_col.find())
    return {
        "revenue": revenue,
        "expense": expense,
        "profit": revenue - expense
    }
