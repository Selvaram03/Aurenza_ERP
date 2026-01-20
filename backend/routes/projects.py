from fastapi import APIRouter
from backend.database import projects_col

router = APIRouter()

@router.post("/projects/create")
def create_project(data: dict):
    projects_col.insert_one({
        "project_name": data["name"],
        "client": data["client"],
        "value": data["value"],
        "status": "ACTIVE"
    })
    return {"msg": "Project created"}
