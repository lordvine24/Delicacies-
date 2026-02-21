# Delicacies-🥘 Delicacies
Online Food Ordering & Catering Booking Platform
📌 Overview
Delicacies is a full-stack web application that allows users to order food online and book catering services for events and functions.
The platform integrates secure mobile payments via M-Pesa and uses a modern decoupled architecture.
🏗 Architecture
Copy code

React (Frontend)
        ↓
Python Backend (REST API)
        ↓
Firebase (Cloud Firestore)
        ↓
Daraja API (M-Pesa Integration)
🛠 Tech Stack
Frontend
React
Tailwind CSS
Axios
React Router
Backend
Python
FastAPI
JWT Authentication
Database
Firebase (Cloud Firestore)
Payment Integration
Daraja API
✨ Features
User Features
User registration and login
Browse available meals
Add items to cart
Secure checkout via M-Pesa
Book catering services for events
View order history
View booking status
Catering Booking
Select event type
Choose catering package
Select event date and location
Specify number of guests
Pay deposit via M-Pesa
Admin Features
Add, edit, delete products
Manage catering packages
View and manage orders
Approve or reject bookings
Update order status
💳 Payment Flow
User initiates checkout
Backend sends STK Push request to Daraja API
User confirms payment on mobile device
Payment confirmation received via callback
Order or booking status updated in Firebase
🗄 Firebase Collections
users
products
cart
orders
bookings
catering_packages
payments
🔐 Authentication
JWT-based authentication
Protected API routes
Secure token verification
🚀 Installation
Clone Repository
Bash

git clone https://github.com/lordvine 24/delicacies.git
cd delicacies
Backend Setup
Bash

cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
Frontend Setup
Bash

cd frontend
npm install
npm run dev
🔑 Environment Variables
Create .env file in backend:


SECRET_KEY=your_secret_key
FIREBASE_CREDENTIALS=path_to_service_account.json
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
CALLBACK_URL=your_callback_url
📂 Project Structure


delicacies/
│
├── backend/
│   ├── auth/
│   ├── products/
│   ├── orders/
│   ├── bookings/
│   ├── payments/
│   └── firebase_config/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── context/
│   └── assets/
🎯 Project Goal
To provide a modern digital platform that simplifies food ordering and catering service booking with secure mobile payment integration.
👨‍💻 Author
Developed using React, Python, Firebase, and Daraja API
