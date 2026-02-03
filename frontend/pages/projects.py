import streamlit as st
import requests
import pandas as pd

if st.session_state.token is None:
    st.switch_page("pages/login.py")

st.title("📁 Projects")

with st.form("create_project"):
    name = st.text_input("Project Name")
    client = st.text_input("Client Name")
    value = st.number_input("Project Value", min_value=0)
    if st.form_submit_button("Create Project"):
        requests.post(
            "http://127.0.0.1:8000/projects/create",
            json={"name": name, "client": client, "value": value}
        )
        st.success("Project created")

projects = requests.get("http://127.0.0.1:8000/projects/list").json()
st.dataframe(pd.DataFrame(projects), use_container_width=True)
