import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginScreen from './login'; 
import InstructorDashboard from './Instructordashboard';
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
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/examroom" element={<ExamRoom />} />
        <Route path="/exam" element={<ExamRoom />} />
        <Route path="/instructor" element={<InstructorDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;