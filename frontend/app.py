import streamlit as st

st.set_page_config(
    page_title="Aurenza ERP",
    layout="wide",
)

# Initialize session
if "token" not in st.session_state:
    st.session_state.token = None
    st.session_state.role = None

# 🔐 BEFORE LOGIN → HIDE SIDEBAR + FORCE LOGIN
if st.session_state.token is None:
    st.markdown(
        "<style>[data-testid='stSidebar']{display:none;}</style>",
        unsafe_allow_html=True
    )
    st.switch_page("pages/login.py")
