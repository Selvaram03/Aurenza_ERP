import streamlit as st
import requests

if st.session_state.role not in ["ADMIN", "SUPER_ADMIN"]:
    st.error("Unauthorized")
    st.stop()

st.title("👑 Admin Console")

data = requests.get("http://127.0.0.1:8000/pnl").json()

col1, col2, col3 = st.columns(3)
col1.metric("Revenue", f"₹ {data['revenue']:,}")
col2.metric("Expenses", f"₹ {data['expense']:,}")
col3.metric("Profit", f"₹ {data['profit']:,}")

if data["profit"] < 0:
    st.error("Company running at loss – revise pricing")
else:
    st.success("Company profitable")
