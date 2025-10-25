import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// Updated imports with .jsx extension
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import Layout from './components/Layout.jsx';
import StudentDashboard from './components/StudentDashboard.jsx';
import UGDashboard from './components/UG_Dashboard.jsx';
import PGDashboard from './components/PG_Dashboard.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

const Dashboard = () => {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" />;

    try {
        const decoded = jwtDecode(token);
        const userRole = decoded.user.role;

        let DashboardComponent;
        switch (userRole) {
            case 'student': DashboardComponent = StudentDashboard; break;
            case 'ug': DashboardComponent = UGDashboard; break;
            case 'pg': DashboardComponent = PGDashboard; break;
            case 'admin': DashboardComponent = AdminDashboard; break;
            default: return <Navigate to="/login" />;
        }

        return (
            <Layout>
                <DashboardComponent />
            </Layout>
        );
    } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        return <Navigate to="/login" />;
    }
};

function App() {
    const token = localStorage.getItem('token');
    
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route 
                    path="/dashboard" 
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } 
                />
                <Route 
                    path="/profile" 
                    element={
                        <PrivateRoute>
                            <Layout>
                                <ProfilePage />
                            </Layout>
                        </PrivateRoute>
                    } 
                />
                
                {/* Fallback Routes */}
                <Route 
                    path="*" 
                    element={<Navigate to={token ? "/dashboard" : "/"} />} 
                />
            </Routes>
        </Router>
    );
}

export default App;