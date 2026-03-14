# Task Management Application

A production-ready **Full Stack Task Manager** built using **Node.js, Express, MongoDB, and React**.
The application allows users to securely register, authenticate, and manage their personal tasks with advanced features like pagination, filtering, and search.

---

# Live Demo

Frontend: https://your-frontend-url.vercel.app
Backend API: https://your-backend-url.onrender.com

---

# Features

## Authentication

* User Registration
* User Login
* JWT Authentication
* JWT stored securely in **HTTP-only cookies**
* Password hashing using **bcrypt**

## Task Management

* Create tasks
* View tasks
* Update tasks
* Delete tasks

Each task includes:

* Title
* Description
* Status
* Priority
* Created Date

Users can only access **their own tasks**.

---

# Advanced Features

### Pagination

Tasks can be retrieved with pagination:

GET /api/tasks?page=1&limit=5

### Search

Search tasks by title:

GET /api/tasks?search=taskname

### Status Filtering

Filter tasks by status:

GET /api/tasks?status=todo

---

# Security Features

* Password hashing with **bcrypt**
* JWT authentication
* HTTP-only cookies
* AES encryption for sensitive fields
* Input validation using **express-validator**
* Rate limiting
* Secure headers using **helmet**
* Environment variables for secrets

---

# Tech Stack

Frontend

* React (Vite)
* Axios
* TailwindCSS

Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

Deployment

* Backend: Render
* Frontend: Vercel

---

# Project Structure

Backend

backend
│
├── controllers
├── middleware
├── models
├── routes
├── utils
├── server.js
└── app.js

Frontend

frontend
│
├── components
├── pages
├── services
├── App.jsx
└── main.jsx

---

# Installation Guide

## Clone Repository

git clone https://github.com/yourusername/task-manager-app.git

cd task-manager-app

---

# Backend Setup

cd backend

Install dependencies

npm install

Create .env file

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
AES_SECRET_KEY=your_encryption_key

Start server

npm run dev

Backend runs on

http://localhost:5000

---

# Frontend Setup

cd frontend

Install dependencies

npm install

Run development server

npm run dev

Frontend runs on

http://localhost:5173

---

# API Documentation

## Register

POST /api/auth/register

Request

{
"name": "John",
"email": "[john@example.com](mailto:john@example.com)",
"password": "Password123"
}

Response

{
"success": true,
"message": "Account created successfully"
}

---

## Login

POST /api/auth/login

Request

{
"email": "[john@example.com](mailto:john@example.com)",
"password": "Password123"
}

---

## Create Task

POST /api/tasks

{
"title": "Finish project",
"description": "Complete backend APIs",
"status": "todo"
}

---

## Get Tasks

GET /api/tasks?page=1&limit=5

---

## Update Task

PUT /api/tasks/:id

---

## Delete Task

DELETE /api/tasks/:id

---

# Architecture Overview

The application follows a **layered backend architecture**:

Routes → Controllers → Services → Database

Middleware is used for:

* Authentication
* Validation
* Error handling
* Rate limiting

This structure ensures scalability and maintainability.

---

# Security Considerations

* Passwords are hashed before storing
* JWT stored in secure cookies
* Input validation prevents injection attacks
* Sensitive data encrypted with AES
* API rate limiting prevents abuse

---

# Future Improvements

* Task reminders
* Due date notifications
* Mobile responsive UI improvements
* Role-based access control

---

# Author

Umaya
