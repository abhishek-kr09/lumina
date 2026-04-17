# Lumina

Lumina is a full-stack mental health support platform for students. It combines role-based dashboards, counseling appointment workflows, and an AI assistant to provide accessible psychological support.

## What This Project Includes

### Student experience
- Register and log in
- Browse approved counselors
- Book counseling appointments
- Track appointment status from student dashboard
- Use the AI chatbot
- Access self-assessment, resources, emergency support, and community pages

### Counselor experience
- Register with speciality and credentials
- Wait for admin approval before full access
- View assigned appointments
- Approve, reject, or mark appointments as completed

### Admin experience
- View platform stats
- Manage users
- Review all appointments
- Approve or reject counselor applications

## Tech Stack

- Frontend: React 19, Vite 7, Tailwind CSS, Axios, React Router
- Backend: Node.js, Express, Mongoose
- Database: MongoDB
- Auth: JWT + role-based middleware
- AI: Groq Chat Completions API (`llama-3.3-70b-versatile`)

## Repository Layout

```text
Lumina/
  client/   # React app (UI, pages, auth context, API client)
  server/   # Express API (routes, controllers, models, middleware)
```

## Quick Start

### Prerequisites
- Node.js 18+ recommended
- npm
- MongoDB local instance or MongoDB Atlas connection string
- Groq API key (for chatbot)

### 1. Install dependencies

```bash
# from project root
cd server
npm install

cd ../client
npm install
```

### 2. Configure environment

Create a `.env` file in `server/`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/lumina
JWT_SECRET=replace_with_a_strong_secret
GROQ_API_KEY=replace_with_your_groq_key
```

Groq keys can be generated from https://console.groq.com.

### 3. Run the backend

```bash
cd server
npm run dev
```

Backend starts at `http://localhost:5000`.

### 4. Run the frontend

```bash
cd client
npm run dev
```

Frontend starts at `http://localhost:5173`.

## Available Scripts

### Client (`client/package.json`)
- `npm run dev` - Start Vite dev server
- `npm run build` - Production build
- `npm run preview` - Preview build output
- `npm run lint` - Run ESLint

### Server (`server/package.json`)
- `npm run dev` - Start server with watch mode
- `npm start` - Start server normally

### Backend verification helper

A helper script exists at `server/verify_backend.js`.

Run it manually from `server/`:

```bash
node verify_backend.js
```

## API Overview

Base URL: `http://localhost:5000/api`

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/counselors`
- `GET /auth/me` (protected)

### Appointments
- `POST /appointment/book` (student)
- `GET /appointment/my` (student)
- `GET /appointment/counselor` (counselor)
- `PATCH /appointment/:id/status` (counselor)

### Admin
- `GET /admin/users`
- `GET /admin/appointments`
- `DELETE /admin/user/:id`
- `GET /admin/stats`
- `GET /admin/pending-counselors`
- `PATCH /admin/approve-counselor/:id`
- `DELETE /admin/reject-counselor/:id`

### Chatbot
- `POST /chatbot/message`

## Public Notes

- Counselor registrations are reviewed before counselors can start accepting appointments.
- The platform includes secure authentication, role-based access control, and password hashing.
- Crisis support content is informational and does not replace emergency services or licensed medical care.

## License

ISC
