import React, { useState } from 'react';
import { Mail, Lock, KeyRound, ArrowLeft, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Real AWS Cognito: Send OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email.includes('@')) {
        setError("Please enter a valid email address.");
        setIsLoading(false);
        return;
      }
      
      await resetPassword({ username: email });
      
      setIsLoading(false);
      setStep(2); 
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to send verification code.");
      setIsLoading(false);
    }
  };

  // Real AWS Cognito: Verify OTP & Change Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (otp.length < 6) {
        setError("OTP must be 6 digits.");
        setIsLoading(false);
        return;
      }
      if (newPassword.length < 8) {
        setError("Password must be at least 8 characters.");
        setIsLoading(false);
        return;
      }
      
      await confirmResetPassword({ 
        username: email, 
        confirmationCode: otp, 
        newPassword: newPassword 
      });

      setIsLoading(false);
      setSuccess(true); 
    } catch (err) {
      console.error(err);
      setError(err.message || "Invalid OTP or password requirement not met.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col justify-center items-center p-4 font-sans text-white">
      
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-[#1B365D] p-2 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/20">
          <Shield className="text-[#4ADE80]" size={28} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Proctorlock</h1>
      </div>

      <div className="w-full max-w-md bg-[#1E293B] rounded-3xl shadow-2xl border border-white/10 overflow-hidden relative">
        <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-[#4ADE80]"></div>

        <div className="p-8">
          
          {!success && (
             <button 
                onClick={() => step === 1 ? navigate('/') : setStep(1)} 
                className="flex items-center space-x-2 text-slate-400 hover:text-white transition text-sm font-medium mb-6"
             >
               <ArrowLeft size={16} /> <span>{step === 1 ? 'Back to Login' : 'Back to Email'}</span>
             </button>
          )}

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl flex items-center space-x-3 text-sm">
              <AlertCircle size={18} /> <span>{error}</span>
            </div>
          )}

          {step === 1 && !success && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Enter the email address associated with your account and we'll send you a secure 6-digit verification code.
              </p>

              <form onSubmit={handleRequestOTP} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-300 ml-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail size={18} className="text-slate-500" />
                    </div>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0F172A] border border-slate-700 text-white rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                      placeholder="student@university.edu"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-[#1B365D] hover:bg-blue-900 border border-blue-500/30 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg"
                >
                  {isLoading ? (
                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                     <span>Send Verification Code</span>
                  )}
                </button>
              </form>
            </div>
          )}

          {step === 2 && !success && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold mb-2">Secure Verification</h2>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                We sent a 6-digit code to <span className="text-white font-bold">{email}</span>. Enter it below to create a new password.
              </p>

              <form onSubmit={handleResetPassword} className="space-y-5">
                
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-300 ml-1">6-Digit Code</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <KeyRound size={18} className="text-slate-500" />
                    </div>
                    <input 
                      type="text" 
                      required
                      maxLength="6"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))} 
                      className="w-full bg-[#0F172A] border border-slate-700 text-white rounded-xl py-3.5 pl-11 pr-4 tracking-[0.5em] font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                      placeholder="000000"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-300 ml-1">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock size={18} className="text-slate-500" />
                    </div>
                    <input 
                      type="password" 
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[#0F172A] border border-slate-700 text-white rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-[#4ADE80] hover:bg-emerald-400 text-[#0F172A] font-bold py-3.5 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20"
                >
                  {isLoading ? (
                     <div className="w-5 h-5 border-2 border-[#0F172A] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                     <>
                        <span>Confirm Password Reset</span>
                        <CheckCircle size={18} />
                     </>
                  )}
                </button>
              </form>
            </div>
          )}

          {success && (
            <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center text-center py-6">
              <div className="bg-emerald-500/20 p-4 rounded-full mb-6">
                 <CheckCircle className="text-[#4ADE80]" size={48} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Password Reset!</h2>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Your credentials have been successfully updated. You can now log in to the Sentinel system with your new password.
              </p>
              <button 
                onClick={() => navigate('/')} 
                className="w-full bg-[#1B365D] hover:bg-blue-900 border border-blue-500/30 text-white font-bold py-3.5 rounded-xl transition"
              >
                Return to Login
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;