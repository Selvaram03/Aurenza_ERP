import streamlit as st
import requests

if st.session_state.role != "SUPER_ADMIN":
    st.error("Unauthorized")
    st.stop()

res = requests.get("http://localhost:8000/pnl")
data = res.json()

st.metric("Revenue", data["revenue"])
st.metric("Expense", data["expense"])
st.metric("Profit", data["profit"])
