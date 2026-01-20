import streamlit as st
import requests

st.title("Aurenza ERP Login")

email = st.text_input("Email")
password = st.text_input("Password", type="password")

if st.button("Login"):
    res = requests.post(
        "http://localhost:8000/login",
        json={"email": email, "password": password}
    )
    if res.status_code == 200:
        data = res.json()
        st.session_state.token = data["token"]
        st.session_state.role = data["role"]
        st.success("Login Successful")
        st.experimental_rerun()
    else:
        st.error("Invalid credentials")