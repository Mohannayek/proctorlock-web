import React, { useState } from 'react';
import { Shield, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginScreen = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('student'); 
  
  // State to hold the form data
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Admin bypass for prototype
      if (role === 'admin') {
        alert("Admin Dashboard module is currently under construction!");
        setIsLoading(false);
        return;
      }

      // 1. Send data to your AWS API Gateway
      const response = await fetch('https://uy9fws4qb5.execute-api.us-east-1.amazonaws.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: role
        })
      });

      const data = await response.json();

      // 2. Handle errors (wrong password, user not found, etc.)
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // 3. Success! Save user data locally so the dashboard knows who is logged in
      localStorage.setItem('proctorlock_user', JSON.stringify(data.user));
      
      // 4. Route to the correct dashboard
      if (role === 'student') {
        navigate('/student');
      } else {
        navigate('/dashboard');
      }

    } catch (error) {
      alert(`Login Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans">
      
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 bg-[#1B365D] text-white p-12 flex-col justify-between rounded-r-3xl shadow-2xl z-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><path fill="#ffffff" d="M43.5,-75.2C54.6,-66.1,60.6,-49.6,67.3,-33.8C73.9,-18,81.1,-2.9,80.6,12C80.1,26.9,71.8,41.5,60.3,51.8C48.8,62.1,34.1,68.1,18.9,72.4C3.7,76.6,-12,79.1,-26.8,75C-41.5,70.9,-55.4,60.3,-64.1,47C-72.9,33.7,-76.6,17.7,-77.2,1.6C-77.8,-14.5,-75.3,-30.7,-66.9,-43.5C-58.4,-56.3,-44,-65.7,-30.2,-72.6C-16.3,-79.6,-2.9,-84.1,10.6,-85.1C24,-86.2,32.4,-84.3,43.5,-75.2Z" transform="translate(200 200) scale(1.2)" /></svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-xl font-bold mb-16">
            <Shield className="text-[#4ADE80]" size={28} />
            <span>Proctorlock</span>
          </div>
          
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Integrity without<br/>
            <span className="text-[#4ADE80]">Interruption.</span>
          </h1>
          
          <p className="text-blue-100/80 text-lg max-w-md leading-relaxed">
            Our AI-powered monitoring system creates a calm, secure sanctuary for examinations. Professional precision meets human-centric design.
          </p>
        </div>

        <div className="relative z-10">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 w-72 mb-8 border border-white/20 shadow-lg">
               <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-[#4ADE80] rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm font-bold tracking-wider text-gray-200 uppercase">The Sentinel Active</p>
                    <p className="text-xs text-blue-200/70">Secure biometrics scanning...</p>
                  </div>
               </div>
            </div>

            <div className="h-48 w-full max-w-lg bg-[#0f213d] rounded-2xl overflow-hidden border border-white/10 relative shadow-inner flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
                <Lock className="text-white/20 w-16 h-16" />
                <div className="absolute top-0 left-0 w-full h-1 bg-[#4ADE80]/50 shadow-[0_0_15px_rgba(74,222,128,0.5)] animate-[scan_3s_ease-in-out_infinite]"></div>
            </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-[#1B365D] mb-2">Welcome Back</h2>
          <p className="text-gray-500 mb-8">Please enter your details to access your dashboard.</p>

          {/* ROLE SELECTOR TOGGLE */}
          <div className="flex bg-gray-100 p-1.5 rounded-xl mb-8">
            <button 
              type="button"
              onClick={() => setRole('student')}
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
            <button 
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${role === 'admin' ? 'bg-white text-[#1B365D] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="name@organization.com" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-gray-700 focus:ring-2 focus:ring-[#1B365D] focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase">Password</label>
                <span className="text-[10px] font-bold text-[#10B981] hover:underline uppercase tracking-wider cursor-pointer">Forgot?</span>
              </div>
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

            <button disabled={isLoading} type="submit" className="w-full bg-[#1B365D] hover:bg-[#15294a] text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-900/20 disabled:opacity-70 disabled:cursor-not-allowed">
              {isLoading ? 'Verifying Credentials...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-gray-500">
            New to Proctorlock? <span onClick={() => navigate('/signup')} className="font-bold text-[#1B365D] hover:underline cursor-pointer">Create an account</span>
          </p>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(192px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default LoginScreen;