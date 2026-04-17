import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Chatbot from './pages/Chatbot'
import Assessment from './pages/Assessment'
import Resources from './pages/Resources'
import Community from './pages/Community'
import Counseling from './pages/Counseling'
import Emergency from './pages/Emergency'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Register from './pages/Register'
import StudentDashboard from './pages/StudentDashboard'
import CounselorDashboard from './pages/CounselorDashboard'
import { AuthProvider, useAuth } from './context/AuthContext'

function RequireRole({ allowedRoles, children }) {
    const { user } = useAuth()

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (!allowedRoles.includes(user.role)) {
        if (user.role === 'admin') return <Navigate to="/admin" replace />
        if (user.role === 'counselor') return <Navigate to="/counselor-dashboard" replace />
        return <Navigate to="/student-dashboard" replace />
    }

    return children
}

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="/assessment" element={<Assessment />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/community" element={<Community />} />
                <Route path="/counseling" element={<Counseling />} />
                <Route path="/emergency" element={<Emergency />} />
                <Route
                    path="/admin"
                    element={
                        <RequireRole allowedRoles={['admin']}>
                            <Admin />
                        </RequireRole>
                    }
                />
                <Route
                    path="/student-dashboard"
                    element={
                        <RequireRole allowedRoles={['student']}>
                            <StudentDashboard />
                        </RequireRole>
                    }
                />
                <Route
                    path="/counselor-dashboard"
                    element={
                        <RequireRole allowedRoles={['counselor']}>
                            <CounselorDashboard />
                        </RequireRole>
                    }
                />
            </Routes>
        </AuthProvider>
    )
}

export default App
