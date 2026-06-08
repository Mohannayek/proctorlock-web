import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginScreen from './login'; 
import InstructorDashboard from './Instructordashboard';
import StudentDashboard from './StudentDashboard';
import SignUpScreen from './SignUpScreen';
import Verification from './Verification';
import ExamRoom from './ExamRoom';
import ForgotPassword from './ForgotPassword';
// Protected Route Wrapper Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const userString = localStorage.getItem('proctorlock_user');
  const token = localStorage.getItem('proctorlock_token');
  const location = useLocation();
  
  if (!userString || !token) {
    // If there is no user session or token, redirect immediately to login
    return <Navigate to="/" replace />;
  }

  try {
    const user = JSON.parse(userString);
    if (allowedRoles && !allowedRoles.includes(user.role)) {
       // If the user's role is not in the allowed list, boot them back to their own dashboard
       if (user.role === 'student') return <Navigate to={`/student/${user.id}`} replace />;
       if (user.role === 'instructor' || user.role === 'admin') return <Navigate to={`/instructor/${user.id}`} replace />;
       return <Navigate to="/" replace />;
    }

    // Security check: Make sure the ID in the URL matches the logged in user's ID
    const pathParts = location.pathname.split('/');
    if (pathParts.length >= 3) {
       const urlId = pathParts[2];
       if (urlId !== user.id) {
           // Redirect them to their actual dashboard
           return <Navigate to={`/${pathParts[1]}/${user.id}`} replace />;
       }
    }
  } catch (e) {
    // If localStorage data is corrupted, force login
    localStorage.removeItem('proctorlock_user');
    localStorage.removeItem('proctorlock_token');
    return <Navigate to="/" replace />;
  }
  
  // If user is logged in and authorized, allow them to view the page
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - Accessible without login */}
        <Route path="/" element={<LoginScreen />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/verification" element={<Verification />} />

        {/* Protected Routes - Redirects to login if not authenticated or wrong role */}
        <Route path="/student/:id" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/examroom" element={
          <ProtectedRoute allowedRoles={['student']}>
            <ExamRoom />
          </ProtectedRoute>
        } />
        <Route path="/exam" element={
          <ProtectedRoute allowedRoles={['student']}>
            <ExamRoom />
          </ProtectedRoute>
        } />
        <Route path="/instructor/:id" element={
          <ProtectedRoute allowedRoles={['instructor', 'admin']}>
            <InstructorDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;