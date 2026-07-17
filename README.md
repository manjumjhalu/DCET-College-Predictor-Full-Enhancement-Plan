# DCET College Predictor (Karnataka) 🎓✨

An AI-powered web application built to predict engineering colleges that Diploma CET (DCET) lateral-entry students can get in Karnataka. It analyzes 5 years of historical KEA counseling cutoff trends to provide estimated admission probabilities.

---
Open (https://6a5a6ce70843ad14645888bb--dcetcollegepredictor.netlify.app/)
### ⚠️ IMPORTANT DISCLAIMER
> **INDICATIVE PROBABILITIES ONLY — NOT REAL KEA DATA**
> All predictions and admission probabilities shown here are **statistical estimates** based on historical trends (2021–2025). This tool is **NOT affiliated with KEA** (Karnataka Examinations Authority) or VTU. It does **not** guarantee admission. Always refer to official KEA cutoffs at [kea.kar.nic.in](https://kea.kar.nic.in) before making counseling decisions.

---

## 🚀 Key Features

*   **3-Step Prediction Wizard**: Smooth, user-friendly form collecting Rank, Category (GM, 2A, SC, ST, etc.), Branch preference, Location, and Counseling Round.
*   **Structured Recommendations**: Colleges are classified into **Safe**, **High Chance**, **Moderate Chance**, and **Dream Colleges** based on admission probability.
*   **College Comparison Tool**: Select and compare up to 3 colleges side-by-side with a polar radar chart comparing placement rates, package details, fees, and NAAC grades.
*   **Cutoff Trend Analysis**: Interactive charts showing the 5-year closing rank trends per branch and category.
*   **Option Entry Order Generator**: Automatically recommends a prioritized preference list of colleges to help students plan option entry submissions.
*   **Report Export**: Download predictions and counseling reports as a PDF with clean, print-ready CSS formatting.
*   **Premium & Responsive Design**: Vibrant color palette, custom gradients, dynamic micro-animations, full mobile optimization, and dark/light mode toggles.

---

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), TypeScript, Tailwind CSS
*   **Visualizations**: Chart.js / Recharts (Area charts, Bar charts, Line charts, Radar charts)
*   **Icons**: Lucide React
*   **Toast Notifications**: Sonner

---

## 💻 Local Setup & Development

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### 1. Clone & Install
```bash
git clone https://github.com/manjumjhalu/DCET-College-Predictor-Full-Enhancement-Plan.git
cd DCET-College-Predictor-Full-Enhancement-Plan
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open (https://localhost5000/) (or the port specified in terminal) in your browser.

### 3. Build for Production
```bash
npm run build
```
The optimized bundle will be created inside the `dist` folder.

---

