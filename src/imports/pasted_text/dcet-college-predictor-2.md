Build a complete AI-powered web application called "DCET College Predictor (Karnataka)".

PROJECT OBJECTIVE

The application should predict which engineering colleges a Diploma CET (DCET) student in Karnataka can get based on:

- DCET Rank
- Category
- Branch Preference
- Previous 4-5 years cutoff data
- Counseling trends

The system must provide college recommendations along with admission probability and categorize them as:

1. Safe Colleges
2. High Chance Colleges
3. Moderate Chance Colleges
4. Dream Colleges

----------------------------------------------------

TECH STACK

Frontend:
- ReactJS
- Tailwind CSS
- Axios
- Chart.js

Backend:
- Python FastAPI

Machine Learning:
- Scikit-Learn
- Random Forest Classifier
- Pandas
- NumPy
- Joblib

Database:
- MySQL

Deployment:
- Vercel (Frontend)
- Render or Railway (Backend)

----------------------------------------------------

PROJECT FEATURES

Student Module:

The student can enter:

- DCET Rank
- Category
- Gender (optional)
- Branch Preference
- Preferred Location (optional)
- Counseling Round (optional)

After clicking Predict Colleges, the application should display:

----------------------------------------------------

Prediction Result

Display:

Safe Colleges

High Chance Colleges

Moderate Chance Colleges

Dream Colleges

Each college card must display:

- College Name
- Branch Name
- College Code
- Admission Probability
- Previous Year Cutoff
- Predicted Cutoff
- Location
- Fees
- Placement Percentage
- Average Package
- Highest Package
- Counseling Trends

----------------------------------------------------

College Recommendation Engine

The recommendation engine should:

Take the previous 4-5 years cutoff data and calculate:

- Trend Analysis
- Weighted Average Cutoff
- Probability Score
- College Ranking

The ML model should use:

Inputs:

- Rank
- Category
- Branch
- Year
- Round
- Cutoff Trends

Output:

- Recommended Colleges

Use:

- RandomForestClassifier
- predict_proba()

to return admission probabilities.

----------------------------------------------------

ADMIN PANEL

Build a complete admin dashboard.

Admin Features:

- Upload CSV dataset
- Add colleges
- Edit college information
- Delete college information
- Upload yearly cutoff data
- Retrain ML model
- View dataset statistics

----------------------------------------------------

DATABASE TABLES

Students

student_id
rank
category
branch
location

---------------------------------

Colleges

college_id
college_name
college_code
location
fees
avg_package
highest_package
placement_percentage

---------------------------------

Cutoffs

cutoff_id
college_id
year
round
branch
category
closing_rank

---------------------------------

Predictions

prediction_id
student_rank
recommended_college
probability

----------------------------------------------------

MACHINE LEARNING PIPELINE

Create:

1. Data preprocessing script.

Functions:
- Handle missing values.
- Encode categorical data.
- Normalize data if required.

2. Training script.

Perform:
- Train-Test Split
- Random Forest Training
- Accuracy Evaluation
- Save model using Joblib

3. Prediction script.

Inputs:
- Rank
- Category
- Branch

Outputs:
- List of colleges with probability scores.

----------------------------------------------------

WEBSITE PAGES

Landing Page

Features:
- Hero section
- About DCET Predictor
- Previous year statistics
- College trends
- Call to action button

---------------------------------

Prediction Page

Input Form:

- Rank
- Category
- Branch

Button:
Predict Colleges

---------------------------------

Results Page

Display:

Safe Colleges

High Chance Colleges

Moderate Chance Colleges

Dream Colleges

Show:

- Probability Graphs
- Cutoff Trends
- Admission Chances

---------------------------------

College Details Page

Show:

- Placements
- Fees
- Hostel Information
- Branches Available
- Previous Year Cutoffs

---------------------------------

Admin Dashboard

Features:

- Upload CSV
- Manage Colleges
- Train Model
- View Analytics

----------------------------------------------------

CHARTS

Use Chart.js to display:

- Previous Year Cutoff Trends
- Admission Probability Graphs
- College Comparison Graphs
- Branch Wise Statistics

----------------------------------------------------

PROJECT STRUCTURE

DCET_COLLEGE_PREDICTOR

Frontend
- Components
- Pages
- API Services
- Charts

Backend
- FastAPI Routes
- ML Model
- Prediction Service
- Authentication

ML
- preprocess.py
- train_model.py
- predict.py

Database
- MySQL Schema

Dataset
- cutoff_data.csv

----------------------------------------------------

BONUS FEATURES

Add:

- Top 10 Recommended Colleges
- College Comparison Tool
- Branch Comparison Tool
- Counseling Guidance
- Download Prediction Report as PDF
- Dark Mode
- Mobile Responsive UI
- Search and Filter Colleges
- Option Entry Generator

----------------------------------------------------

EXPECTED OUTPUT

If a student enters:

Rank = 1540
Category = GM
Branch = CSE

Output should look like:

SAFE COLLEGES

- College A (95%)
- College B (92%)

HIGH CHANCE

- College C (88%)
- College D (84%)

MODERATE

- College E (72%)

DREAM COLLEGES

- College F (55%)

----------------------------------------------------

IMPORTANT REQUIREMENTS

- Use clean and modular code.
- Use FastAPI REST APIs.
- Use Random Forest ML model.
- Save the trained model using Joblib.
- Make the frontend modern and responsive.
- Write proper comments in the code.
- Provide a complete folder structure.
- Include requirements.txt.
- Include SQL schema.
- Include API documentation.
- Include sample CSV datasets.
- Include README.md with setup instructions.

Generate the entire project with production-level code and proper architecture.