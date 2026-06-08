import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './login'; 
import InstructorDashboard from './Instructordashboard';
import StudentDashboard from './StudentDashboard';
import SignUpScreen from './SignUpScreen';
import Verification from './Verification';
import ExamRoom from './ExamRoom';
import ForgotPassword from './ForgotPassword';
// Protected Route Wrapper Component
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('proctorlock_user');
  
  if (!user) {
    // If there is no user session in localStorage, redirect immediately to login
    return <Navigate to="/" replace />;
  }
  
  // If user is logged in, allow them to view the page
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

        {/* Protected Routes - Redirects to login if not authenticated */}
        <Route path="/student" element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/examroom" element={
          <ProtectedRoute>
            <ExamRoom />
          </ProtectedRoute>
        } />
        <Route path="/exam" element={
          <ProtectedRoute>
            <ExamRoom />
          </ProtectedRoute>
        } />
        <Route path="/instructor" element={
          <ProtectedRoute>
            <InstructorDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;