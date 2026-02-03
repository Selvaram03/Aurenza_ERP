import streamlit as st

# 🔐 AUTH GUARD
if st.session_state.token is None:
    st.switch_page("pages/login.py")

# ========== SIDEBAR ==========
st.sidebar.title("Aurenza ERP")

# COMMON
st.sidebar.page_link("pages/dashboard.py", label="Dashboard")
st.sidebar.page_link("pages/projects.py", label="Projects")
st.sidebar.page_link("pages/expenses.py", label="Expenses")

# ADMIN ONLY
if st.session_state.role in ["ADMIN", "SUPER_ADMIN"]:
    st.sidebar.page_link("pages/admin_console.py", label="Admin Console")

# LOGOUT
if st.sidebar.button("Logout"):
    st.session_state.clear()
    st.switch_page("pages/login.py")

# ========== DASHBOARDS ==========
role = st.session_state.role

st.title("📊 Dashboard")

if role == "SUPER_ADMIN":
    st.success("👑 Super Admin Dashboard")
    st.write("• Full company P&L")
    st.write("• Pricing decisions")
    st.write("• Strategic insights")

elif role == "ADMIN":
    st.info("🧑‍💼 Admin Dashboard")
    st.write("• Expense approvals")
    st.write("• Project performance")
    st.write("• Cost control")

elif role == "PM":
    st.warning("📁 Project Manager Dashboard")
    st.write("• Assigned projects")
    st.write("• Budget vs spend")
    st.write("• Team costs")

elif role == "EMPLOYEE":
    st.write("👤 Employee Dashboard")
    st.write("• Submit expenses")
    st.write("• View assigned projects")
