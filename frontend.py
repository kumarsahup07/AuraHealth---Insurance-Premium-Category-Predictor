import streamlit as st
import requests
import os

st.set_page_config(
    page_title="AuraHealth AI · Premium Predictor",
    page_icon="🛡️",
    layout="wide"
)

# Custom Glassmorphism Theme CSS
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700&family=Space+Grotesk:wght@600;700&display=swap');

html, body, [class*="css"] {
    font-family: 'Plus Jakarta Sans', sans-serif;
}

.stApp {
    background: radial-gradient(circle at 15% 15%, rgba(0, 240, 255, 0.08) 0%, transparent 45%),
                radial-gradient(circle at 85% 85%, rgba(139, 92, 246, 0.08) 0%, transparent 45%),
                #07090e;
    color: #f8fafc;
}

/* Glass Cards */
div[data-testid="stVerticalBlock"] > div.element-container:has(.glass-card) {
    background: rgba(255, 255, 255, 0.035);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
}

/* Morph Hero Card */
.morph-hero {
    position: relative;
    border-radius: 18px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 20px 40px rgba(0, 240, 255, 0.15);
    transition: transform 0.4s ease, box-shadow 0.4s ease;
}
.morph-hero:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: 0 25px 50px rgba(0, 240, 255, 0.3);
    border-color: rgba(0, 240, 255, 0.5);
}

/* Glass Buttons */
.stButton > button {
    background: linear-gradient(135deg, #00f0ff, #3b82f6 50%, #8b5cf6 100%) !important;
    color: white !important;
    border: none !important;
    border-radius: 12px !important;
    padding: 14px 28px !important;
    font-weight: 700 !important;
    font-size: 1rem !important;
    box-shadow: 0 10px 25px rgba(0, 240, 255, 0.3) !important;
    transition: all 0.3s ease !important;
    width: 100%;
}
.stButton > button:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 35px rgba(0, 240, 255, 0.5) !important;
}

/* Input Fields */
input, select {
    border-radius: 10px !important;
}

.result-badge {
    padding: 24px;
    border-radius: 16px;
    text-align: center;
    margin-top: 16px;
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.15);
}
.badge-low {
    background: radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(13, 17, 29, 0.8) 100%);
    border-color: rgba(16, 185, 129, 0.4);
    color: #10b981;
}
.badge-medium {
    background: radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(13, 17, 29, 0.8) 100%);
    border-color: rgba(245, 158, 11, 0.4);
    color: #f59e0b;
}
.badge-high {
    background: radial-gradient(circle, rgba(244, 63, 94, 0.25) 0%, rgba(13, 17, 29, 0.8) 100%);
    border-color: rgba(244, 63, 94, 0.4);
    color: #f43f5e;
}
</style>
""", unsafe_allow_html=True)

API_URL = "http://127.0.0.1:8000/predict"

# Top Hero Bar
hero_col1, hero_col2 = st.columns([1.3, 1])

with hero_col1:
    st.markdown('<div style="display:inline-block; padding: 4px 12px; border-radius: 999px; background: rgba(0, 240, 255, 0.1); border: 1px solid rgba(0, 240, 255, 0.3); color: #00f0ff; font-size: 0.8rem; font-weight: 600; margin-bottom: 12px;">🛡️ FastAPI & ML Powered</div>', unsafe_allow_html=True)
    st.markdown('<h1 style="font-family: \'Space Grotesk\', sans-serif; font-size: 2.4rem; font-weight: 700; margin-bottom: 8px;">AuraHealth <span style="background: linear-gradient(135deg, #00f0ff, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Predictor</span></h1>', unsafe_allow_html=True)
    st.markdown('<p style="color: #94a3b8; font-size: 1.05rem;">Minimalist glassmorphic risk assessment interface connected to FastAPI intelligence service.</p>', unsafe_allow_html=True)

with hero_col2:
    hero_img_path = os.path.join(os.path.dirname(__file__), "static", "hero.jpg")
    if os.path.exists(hero_img_path):
        st.markdown('<div class="morph-hero">', unsafe_allow_html=True)
        st.image(hero_img_path, use_container_width=True)
        st.markdown('</div>', unsafe_allow_html=True)

st.markdown("---")

col_form, col_res = st.columns([1.2, 0.8], gap="large")

with col_form:
    st.markdown("### 📋 Client Biometrics & Lifestyle")
    
    sub1, sub2 = st.columns(2)
    with sub1:
        age = st.number_input("Age (years)", min_value=1, max_value=119, value=30)
        weight = st.number_input("Weight (kg)", min_value=1.0, max_value=250.0, value=68.0)
    with sub2:
        height = st.number_input("Height (meters)", min_value=0.5, max_value=2.49, value=1.72, step=0.01)
        income_lpa = st.number_input("Annual Income (₹ LPA)", min_value=0.1, max_value=500.0, value=12.0, step=0.5)

    sub3, sub4 = st.columns(2)
    with sub3:
        smoker = st.selectbox("Smoking Status", options=[False, True], format_func=lambda x: "🚭 Non-Smoker" if not x else "🚬 Smoker")
    with sub4:
        occupation = st.selectbox(
            "Occupation",
            ['private_job', 'government_job', 'business_owner', 'freelancer', 'student', 'retired', 'unemployed'],
            format_func=lambda x: x.replace('_', ' ').title()
        )

    city = st.text_input("City of Residence", value="Mumbai")

    # Real-time BMI peek
    bmi_preview = weight / (height ** 2) if height > 0 else 0
    st.caption(f"Estimated BMI: **{bmi_preview:.2f}**")

    predict_btn = st.button("✨ Calculate Premium Category", use_container_width=True)

with col_res:
    st.markdown("### 🎯 Prediction Results")
    
    if predict_btn:
        input_data = {
            "age": int(age),
            "weight": float(weight),
            "height": float(height),
            "income_lpa": float(income_lpa),
            "smoker": bool(smoker),
            "city": city.strip() or "Mumbai",
            "occupation": occupation
        }

        with st.spinner("Calling FastAPI ML Model..."):
            try:
                response = requests.post(API_URL, json=input_data, timeout=5)
                if response.status_code == 200:
                    result = response.json()
                    cat = result.get('predicted_category', 'Medium').capitalize()
                    bmi = result.get('bmi', bmi_preview)

                    badge_class = "badge-medium"
                    if cat.lower() == "low":
                        badge_class = "badge-low"
                    elif cat.lower() == "high":
                        badge_class = "badge-high"

                    st.markdown(f"""
                    <div class="result-badge {badge_class}">
                        <div style="font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase;">Predicted Premium Tier</div>
                        <div style="font-size: 2.8rem; font-weight: 800; font-family: 'Space Grotesk', sans-serif;">{cat}</div>
                        <div style="font-size: 0.9rem; margin-top: 8px;">Final Computed BMI: <strong>{bmi:.2f}</strong></div>
                    </div>
                    """, unsafe_allow_html=True)

                    st.json(result)
                else:
                    st.error(f"Backend API Error: {response.status_code}")
                    st.write(response.json())
            except requests.exceptions.ConnectionError:
                st.error("❌ Could not connect to FastAPI at http://127.0.0.1:8000. Ensure 'uvicorn app:app --reload' is running!")
    else:
        st.info("👈 Enter details on the left and click **Calculate Premium Category** to generate ML prediction.")
