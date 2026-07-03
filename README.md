# KrishiMitra - AI-Powered Agriculture Portal

**KrishiMitra** is a comprehensive, AI-powered digital assistance portal designed to support farmers. It integrates advanced machine learning models for crop disease detection, voice-enabled AI support chat, weather-based advisory, and government schemes recommendations into a unified, responsive user experience.

---

## 🌟 Key Features

1. **AI-Powered Plant Disease Detection**:
   - High-accuracy CNN model (`crop_disease_model.h5`) capable of detecting 38 classes of crop health/disease.
   - Generates organic treatment tips, recommended pesticides/insecticides, and preventive measures.
   - Multilingual output support in 9 Indian languages (English, Hindi, Kannada, Telugu, Tamil, Malayalam, Marathi, Bengali, and Gujarati).

2. **AI Farming Assistant (Chatbot)**:
   - Natural language interaction for farming queries.
   - Integrated Speech-to-Text translation for easy accessibility.
   - Real-time sentiment analysis and emergency flagging.

3. **Expert Recommendations**:
   - Live weather-based crop watering advisories.
   - Monthly seasonal crop recommendations.
   - Market price trends for major crops.

4. **Government Schemes & Loans Portal**:
   - Rule-based eligibility checking for interest-free loans and subsidies.
   - Simplifies complex government guidelines for farmers.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons
- **Backend Services**:
  - Python / Flask (Main CNN server & Chatbot engine)
  - Node.js / Express (Govt Schemes service)
- **Machine Learning**: TensorFlow 2.x, Keras (via `tf-keras` legacy compatibility), NumPy, Pillow

---

## 📂 Project Architecture

```
KrishiMitra/plant-disease-detection/
├── backend/                       # Main Flask Server (Disease Detection)
│   ├── cnn_app.py                 # Core API code (runs on port 5000)
│   └── disease_info.json          # Multilingual treatment database
├── models/                        # Trained Models & Metadata
│   ├── crop_disease_model.h5      # CNN model weights
│   └── class_indices.json         # Index mapping for classes
├── src/                           # Central React Hub Frontend
│   ├── App.jsx                    # Main application landing layout
│   └── index.css                  # UI styling with Tailwind
├── Expert_Recommendations-main/   # Expert Recommendations System
│   ├── backend/                   # Python Flask advisor service (port 5004)
│   └── frontend/                  # React dashboard (port 5184)
├── farmer_chat-master/            # Speech & Sentiment Chatbot
│   ├── backend/                   # Python Flask chatbot service (port 5002)
│   └── frontend/                  # React Voice Chat UI (port 3000)
└── Govt-Scheme-Loans-Frontend-frontend-integration/
    ├── backend/                   # Node/Express scheme advisor (port 5006)
    └── frontend/                  # React scheme matching portal (port 5194)
```

---

## 🚀 Installation & Setup

Ensure you have **Python 3.10+** and **Node.js 18+** installed.

### 1. Main Hub (Disease Detection)

#### Backend Setup:
1. Navigate to the project root:
   ```bash
   cd plant-disease-detection
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate   # On Windows
   source venv/bin/activate  # On macOS/Linux
   ```
3. Install dependencies (TensorFlow, Keras compatibility layer, Flask):
   ```bash
   pip install tensorflow keras tf-keras numpy pillow matplotlib scikit-learn flask flask-cors
   ```
4. Start the backend:
   ```bash
   python -u -X utf8 backend/cnn_app.py
   ```
   *Note: The server runs on **port 5000**.*

#### Frontend Setup:
1. Open a new terminal inside the `plant-disease-detection` root folder.
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   *Note: The frontend client runs on **port 5173**.*

---

### 2. Running Subprojects (Optional Integrations)

To run the full suite of KrishiMitra, start each service:

| Service / App | Location | Setup & Run Commands | Default Port |
| :--- | :--- | :--- | :--- |
| **Expert Frontend** | `Expert_Recommendations-main/frontend` | `npm install` <br> `npm run dev` | `5184` |
| **Expert Backend** | `Expert_Recommendations-main/backend` | `pip install -r requirements.txt` <br> `python app.py` | `5004` |
| **Schemes Frontend** | `Govt-Scheme-Loans-Frontend-frontend-integration/frontend` | `npm install` <br> `npm run dev` | `5194` |
| **Schemes Backend** | `Govt-Scheme-Loans-Frontend-frontend-integration/backend` | `npm install` <br> `npm run dev` | `5006` |
| **Chatbot Frontend** | `farmer_chat-master/frontend` | `npm install` <br> `npm start` | `3000` |
| **Chatbot Backend** | `farmer_chat-master/backend` | `pip install -r requirements.txt` <br> `python app.py` | `5002` |

---

## 📝 License
This project is open-source and available under the MIT License.
