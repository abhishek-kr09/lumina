# 🌟 Lumina

[![Live Demo](https://img.shields.io/badge/Live%20Demo-🟢_Online-success?style=for-the-badge)](https://lumina-mate.vercel.app)

**Lumina** is a full-stack mental health support platform designed specifically for students. It combines role-based dashboards, seamless counseling appointment workflows, and an AI assistant to provide accessible, round-the-clock psychological support.

---

## ✨ Features

### 🎓 Student Experience
*   📝 **Register & Log in** securely.
*   🔍 **Browse** a directory of approved counselors.
*   📅 **Book** counseling appointments easily.
*   📊 **Track** appointment statuses directly from the student dashboard.
*   🤖 **Chat** with an AI-powered mental health assistant.
*   📚 **Access** self-assessments, wellness resources, emergency support, and community pages.

### 🧑‍⚕️ Counselor Experience
*   🩺 **Register** with specific specialties and professional credentials.
*   ⏳ **Onboarding:** Wait for admin approval before gaining full platform access.
*   📋 **Manage Schedule:** View assigned patient appointments.
*   ✅ **Actionable Workflow:** Approve, reject, or mark appointments as completed.

### 🛡️ Admin Experience
*   📈 **Dashboard:** View comprehensive platform statistics.
*   👥 **User Management:** Oversee and manage all platform users.
*   📅 **Global Oversight:** Review all appointments across the system.
*   ⚖️ **Vetting:** Approve or reject new counselor applications.

---

## 🛠️ Tech Stack

*   **Frontend:** React 19 ⚛️, Vite ⚡, Tailwind CSS 🎨, Axios 📡, React Router 🗺️
*   **Backend:** Node.js 🟢, Express 🚂, Mongoose 🍃
*   **Database:** MongoDB 🗄️
*   **Authentication:** JWT 🔑 + Role-based middleware 🚪
*   **AI Integration:** Groq Chat Completions API (`llama-3.3-70b-versatile`) 🦙

---

## 📂 Repository Layout

```text
Lumina/
├── client/   # React app (UI, pages, auth context, API client)
└── server/   # Express API (routes, controllers, models, middleware)
```

---

## 🚀 Quick Start

### Prerequisites
*   Node.js 18+ recommended 📦
*   npm (Node Package Manager)
*   MongoDB local instance or MongoDB Atlas connection string 🔗
*   Groq API key (for the AI chatbot) 🔑

### 1. Install Dependencies

```bash
# From project root, install backend dependencies:
cd server
npm install

# Install frontend dependencies:
cd ../client
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/lumina
JWT_SECRET=replace_with_a_strong_secret
GROQ_API_KEY=replace_with_your_groq_key
CLIENT_URL=http://localhost:5173
```
*(Groq keys can be generated from [console.groq.com](https://console.groq.com))*

Create a `.env` file in the `client/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Run the Backend

```bash
cd server
npm run dev
```
*Backend starts at `http://localhost:5000`*

### 4. Run the Frontend

```bash
cd client
npm run dev
```
*Frontend starts at `http://localhost:5173`*

---

## 📜 Available Scripts

### Client (`client/package.json`)
*   `npm run dev` - Start Vite dev server
*   `npm run build` - Production build
*   `npm run preview` - Preview build output
*   `npm run lint` - Run ESLint

### Server (`server/package.json`)
*   `npm run dev` - Start server with watch mode (Nodemon)
*   `npm start` - Start server normally

### Backend Verification Helper
A helper script exists at `server/verify_backend.js`. Run it manually from the `server/` directory to verify your setup:
```bash
node verify_backend.js
```

---

## 🌐 API Reference

**Base URL:** `http://localhost:5000/api`

### Auth 🔐
*   `POST /auth/register`
*   `POST /auth/login`
*   `GET /auth/counselors`
*   `GET /auth/me` *(Protected)*

### Appointments 📅
*   `POST /appointment/book` *(Student)*
*   `GET /appointment/my` *(Student)*
*   `GET /appointment/counselor` *(Counselor)*
*   `PATCH /appointment/:id/status` *(Counselor)*

### Admin 🛡️
*   `GET /admin/users`
*   `GET /admin/appointments`
*   `DELETE /admin/user/:id`
*   `GET /admin/stats`
*   `GET /admin/pending-counselors`
*   `PATCH /admin/approve-counselor/:id`
*   `DELETE /admin/reject-counselor/:id`

### Chatbot 🤖
*   `POST /chatbot/message`

---

## 📌 Important Notes

*   **Vetting:** Counselor registrations are strictly reviewed by an Admin before they can start accepting appointments.
*   **Security:** The platform includes secure authentication, role-based access control, and password hashing via bcrypt.
*   **Disclaimer:** Crisis support content is informational and does not replace emergency services or licensed medical care.

---

## ☁️ Deployment Guide

Use this exact order to avoid CORS and Axios base URL issues during deployment:

1. **Deploy Backend first** (Render, Railway, Fly, etc.).
2. Copy the backend public URL (e.g., `https://lumina-api.onrender.com`).
3. Set your frontend environment variable `VITE_API_BASE_URL` to `https://lumina-api.onrender.com/api`.
4. **Deploy Frontend** (Vercel, Netlify, etc.).
5. Copy the frontend public URL (e.g., `https://lumina-mate.vercel.app`).
6. Set your backend environment variable `CLIENT_URL` to the frontend URL.
   * *For multiple frontend domains, use comma-separated values:*
     `CLIENT_URL=https://lumina-mate.vercel.app,https://www.lumina-mate.vercel.app`
7. **Redeploy Backend** after updating `CLIENT_URL` to apply the new CORS rules.
8. Test login, protected routes, and the booking flow.

### ⚠️ CORS and Axios Notes
*   Backend CORS now only allows origins explicitly listed in `CLIENT_URL`.
*   Frontend Axios now reads `VITE_API_BASE_URL` (with a localhost fallback for local dev).
*   **Never** keep frontend Axios hardcoded to localhost in a production environment.

---

## 📄 License

ISC License
