#🧠 Learning Management System (LMS)
A simple web-based Learning Management System built with Flask (Python) in the backend and HTML, CSS, JavaScript in the frontend. It allows users (students and admins) to register, log in, and manage courses.

📁 Project Structure
bash
Copy
Edit
LMS/
│
├── backend/
│   ├── .env                # Environment variables (MySQL credentials, etc.)
│   └── app.py              # Flask application and REST API
│
├── frontend/
│   ├── HTML Files          # index.html, register.html, courses.html, admin-dashboard.html
│   ├── CSS Files           # style.css, style1.css, style-admin.css
│   └── JS Files            # script.js, script1.js, register.js, admin.js
│
└── README.md               # Project documentation

🚀 Features
✅ User Registration and Login (Student & Admin roles)
🔐 Password Hashing with Bcrypt
📋 Course Management (CRUD) for Admins
📚 Course Viewing for Students
🎨 Responsive User Interface with HTML/CSS
🔁 API integration using JavaScript (Fetch API)

⚙️ Technologies Used
💻 Frontend
HTML5
CSS3
JavaScript (Vanilla)

🐍 Backend
Python (Flask)
Flask-CORS
Flask-MySQLdb
Bcrypt
dotenv

🗃️ Database
MySQL

