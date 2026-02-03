import streamlit as st
import requests
import pandas as pd

if st.session_state.token is None:
    st.switch_page("pages/login.py")

st.title("💸 Expenses")

projects = requests.get("http://127.0.0.1:8000/projects/list").json()
project_map = {p["project_name"]: p["id"] for p in projects}

with st.form("add_expense"):
    project = st.selectbox("Project", project_map.keys())
    amount = st.number_input("Amount", min_value=0)
    category = st.selectbox("Category", ["Cloud", "Salary", "Tools", "Marketing"])
    if st.form_submit_button("Add Expense"):
        requests.post(
            "http://127.0.0.1:8000/expenses/add",
            json={
                "project_id": project_map[project],
                "amount": amount,
                "category": category
            }
        )
        st.success("Expense added")

expenses = requests.get("http://127.0.0.1:8000/expenses/list").json()
st.dataframe(pd.DataFrame(expenses), use_container_width=True)
