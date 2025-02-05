Full-Fledged Authentication System
A complete authentication system built using React.js, Redux, Node.js, Express, and MongoDB with JWT-based authentication.

Features

🚀 User Registration & Login

🔒 Secure JWT Authentication

🔑 Password Hashing (bcrypt)

📧 Email Validation & Password Strength Check

💾 Persistent Login with Token Storage

🔐 Protected Routes with Authentication Middleware

🚪 User Logout Functionality

📱 Responsive UI with Tailwind CSS


Tech Stack

Frontend:

⚛️ React.js (with Redux for state management)

🔗 React Router

🌐 Axios (for API requests)

💅 Tailwind CSS (for styling)

🎉 React Toastify (for notifications)

Backend:

🖥️ Node.js with Express.js

🗃️ MongoDB with Mongoose

🔑 JWT (JSON Web Token) for authentication

🧬 Bcrypt (for password hashing)

🌐 CORS, dotenv, and cookie-parser

Installation & Setup

1️⃣ Clone the Repository

bash

Copy Edit

git clone https://github.com/Devansh120811/AuthenticationSystem.git

cd AuthenticationSytem

2️⃣ Install Dependencies

Backend:

bash

Copy Edit

cd backend

npm install

Frontend:

bash

Copy Edit

cd frontend

npm install

3️⃣ Setup Environment Variables

Create a .env file in the backend folder and add the following:

bash

Copy Edit

PORT=8000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CORS_URL=http://localhost:5173

🚀 Run the Application

Start the Backend Server

bash

Copy Edit

cd backend

npm run dev

Start the Frontend

bash

Copy Edit

cd frontend

npm run dev

The frontend will run on: http://localhost:5173/

🛠️ How JWT Works in This Project?

User logs in with email & password.

Server validates the user & generates a JWT token.

Token is stored in localStorage for authentication persistence.

On each API request, the frontend sends the token in the headers.

The backend verifies the token before responding.

🤝 Contributing

Feel free to open a pull request if you'd like to improve or extend the project!

📄 License

This project is open-source under the MIT License.
