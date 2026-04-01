import React, { useState } from 'react';
import { Shield, ArrowRight, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SignUpScreen = () => {
  const navigate = useNavigate();
  
  // Form State
  const [role, setRole] = useState('student'); 
  const [instructorCode, setInstructorCode] = useState(''); 
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // The AWS Integration Function
  const handleSignUp = async (e) => {
    e.preventDefault();
    
    // 1. Password Validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match! Please try again.");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    // 2. INSTRUCTOR SECURITY GATE
    if (role === 'instructor') {
      const VALID_SECRET_CODE = 'SENTINEL-2026'; 
      if (instructorCode !== VALID_SECRET_CODE) {
        alert("Invalid Instructor Access Code. Please contact your system administrator.");
        return; 
      }
    }

    // 3. SEND DATA TO AWS LAMBDA
    try {
      console.log("Contacting AWS Server...");

      const response = await fetch('https://uy9fws4qb5.execute-api.us-east-1.amazonaws.com/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          fullName: formData.fullName,
          password: formData.password,
          role: role
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      // 4. Success! Route to appropriate dashboard
      console.log("AWS Success:", data.message);
      
      if (role === 'student') {
        navigate('/student');
      } else {
        navigate('/dashboard');
      }

    } catch (error) {
        console.error("Registration Error:", error);
        alert(`Registration failed: ${error.message}`);
    }
  };

  // The UI Rendering
  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans">
      
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 bg-[#1B365D] text-white p-12 flex-col justify-between rounded-r-3xl shadow-2xl z-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><path fill="#ffffff" d="M43.5,-75.2C54.6,-66.1,60.6,-49.6,67.3,-33.8C73.9,-18,81.1,-2.9,80.6,12C80.1,26.9,71.8,41.5,60.3,51.8C48.8,62.1,34.1,68.1,18.9,72.4C3.7,76.6,-12,79.1,-26.8,75C-41.5,70.9,-55.4,60.3,-64.1,47C-72.9,33.7,-76.6,17.7,-77.2,1.6C-77.8,-14.5,-75.3,-30.7,-66.9,-43.5C-58.4,-56.3,-44,-65.7,-30.2,-72.6C-16.3,-79.6,-2.9,-84.1,10.6,-85.1C24,-86.2,32.4,-84.3,43.5,-75.2Z" transform="translate(200 200) scale(1.2)" /></svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-xl font-bold mb-12">
            <Shield className="text-[#4ADE80]" size={28} />
            <span>Proctorlock</span>
          </div>
          
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Join the new standard in<br/>
            <span className="text-[#4ADE80]">Academic Integrity.</span>
          </h1>
          
          <p className="text-blue-100/80 text-lg max-w-md leading-relaxed">
            Create your account to access our secure, AI-driven examination sanctuary. 
          </p>
        </div>

        <div className="relative z-10">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 w-72 mb-8 border border-white/20 shadow-lg">
               <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-[#4ADE80] rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm font-bold tracking-wider text-gray-200 uppercase">System Ready</p>
                    <p className="text-xs text-blue-200/70">Awaiting new user registration...</p>
                  </div>
               </div>
            </div>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-[#1B365D] mb-2">Create Account</h2>
          <p className="text-gray-500 mb-8">Set up your profile to access the platform.</p>

          {/* ROLE SELECTOR TOGGLE */}
          <div className="flex bg-gray-100 p-1.5 rounded-xl mb-8">
            <button 
              type="button"
              onClick={() => {
                setRole('student');
                setInstructorCode(''); 
              }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${role === 'student' ? 'bg-white text-[#1B365D] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Student
            </button>
            <button 
              type="button"
              onClick={() => setRole('instructor')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${role === 'instructor' ? 'bg-white text-[#1B365D] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Instructor
            </button>
          </div>

          <form onSubmit={handleSignUp}>
            <div className="mb-4">
              <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Full Name</label>
              <input 
                type="text" 
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Alexander Doe" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-gray-700 focus:ring-2 focus:ring-[#1B365D] focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="name@university.edu" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-gray-700 focus:ring-2 focus:ring-[#1B365D] focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* CONDITIONAL INSTRUCTOR CODE FIELD */}
            {role === 'instructor' && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-xl animate-in fade-in slide-in-from-top-4 duration-300">
                <label className="flex items-center text-[10px] font-bold text-[#1B365D] tracking-widest uppercase mb-2">
                  <KeyRound size={12} className="mr-1.5" /> Instructor Access Code <span className="text-red-500 ml-1">*</span>
                </label>
                <input 
                  type="text" 
                  value={instructorCode}
                  onChange={(e) => setInstructorCode(e.target.value)}
                  placeholder="Enter admin-provided key" 
                  className="w-full bg-white border border-blue-200 rounded-lg p-3 text-[#1B365D] font-bold placeholder:font-normal focus:ring-2 focus:ring-[#1B365D] focus:border-transparent outline-none transition"
                  required={role === 'instructor'}
                />
                <p className="text-[10px] text-gray-500 mt-2">Required to establish a verified educator account.</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Password</label>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-gray-700 focus:ring-2 focus:ring-[#1B365D] focus:border-transparent outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Confirm</label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-gray-700 focus:ring-2 focus:ring-[#1B365D] focus:border-transparent outline-none transition"
                    required
                  />
                </div>
            </div>

            <button type="submit" className="w-full bg-[#1B365D] hover:bg-[#15294a] text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-900/20 flex items-center justify-center space-x-2">
              <span>Create {role === 'instructor' ? 'Verified Account' : 'Account'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-gray-500">
            Already have an account? <span onClick={() => navigate('/')} className="font-bold text-[#1B365D] hover:underline cursor-pointer">Sign In</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpScreen;