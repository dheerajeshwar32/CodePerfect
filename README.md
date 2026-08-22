# ⚡ KYC | Know Your Career 

> **An Edge-AI powered career compass and skill-matching engine.** 
> Built for INNOHACK 2.0

![KYC Preview](https://via.placeholder.com/800x400.png?text=KYC+|+Know+Your+Career) *(Note: Replace this link with a screenshot of your actual app later!)*

## 🚀 Overview
Traditional job matching relies on rigid, outdated keyword filters, causing highly qualified candidates to slip through the cracks due to formatting differences. **KYC (Know Your Career)** solves this by utilizing semantic vector embeddings to understand the *actual meaning* behind a candidate's skills. 

By running NLP models entirely in the browser via Edge AI, KYC provides instantaneous, highly accurate job matching with zero server latency and absolute data privacy.

## ✨ Key Features
* **🧠 Edge AI Semantic Matching:** Uses `multilingual-e5-small` via Transformers.js in a Web Worker to calculate cosine similarity between user skills and job requirements.
* **🔒 Privacy-First Architecture:** Resume parsing and vector mathematics happen 100% offline on the user's local device.
* **🤖 Generative AI Career Coach:** Integrates Google Gemini (1.5 Flash/Pro) to dynamically generate personalized, 3-step actionable roadmaps for missing skills.
* **⚡ Progressive Offline Mode:** Includes a robust Guest Mode allowing users to bypass authentication and utilize the core matching engine without an internet connection.
* **🔐 Seamless Authentication:** Frictionless Google Sign-In powered by Firebase.

## 🛠️ Tech Stack
* **Frontend:** React.js, Vite, Tailwind CSS (Glassmorphism UI)
* **Edge ML Engine:** Hugging Face Transformers.js (Web Workers)
* **Generative AI:** Google Gemini API
* **Backend/Auth:** Firebase (Authentication, Firestore)

## 💻 Local Setup
Want to run KYC locally? Follow these steps:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/CodePerfect.git](https://github.com/your-username/CodePerfect.git)
   cd CodePerfect
