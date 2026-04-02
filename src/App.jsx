import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginScreen from './login'; 
import InstructorDashboard from './dashboard';
import StudentDashboard from './StudentDashboard';
import SignUpScreen from './SignUpScreen';
import Verification from './Verification';
import ExamRoom from './ExamRoom';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/dashboard" element={<InstructorDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/examroom" element={<ExamRoom />} />
        <Route path="/exam" element={<ExamRoom />} />
      </Routes>
    </Router>
  );
}

export default App;