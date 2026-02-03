import streamlit as st
import requests

st.markdown(
    "<style>[data-testid='stSidebar']{display:none;}</style>",
    unsafe_allow_html=True
)

st.title("🔐 Aurenza ERP Login")

email = st.text_input("Email")
password = st.text_input("Password", type="password")

if st.button("Login"):
    res = requests.post(
        "http://127.0.0.1:8000/login",
        json={"email": email, "password": password}
    )

    if res.status_code == 200:
        data = res.json()
        st.session_state.token = data["token"]
        st.session_state.role = data["role"]
        st.switch_page("pages/dashboard.py")
    else:
        st.error("Invalid email or password")
