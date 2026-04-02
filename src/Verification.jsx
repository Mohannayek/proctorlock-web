import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Shield, Camera, CheckCircle, AlertTriangle, ArrowRight, CloudLightning } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Verification = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [status, setStatus] = useState('ready'); // ready, scanning, success, fail
  const [message, setMessage] = useState("Awaiting biometric scan.");

  const captureAndVerify = useCallback(async () => {
    if (!webcamRef.current) return;
    
    setIsVerifying(true);
    setStatus('scanning');
    setMessage("Uploading to AWS Cloud AI...");

    // Take a picture
    const imageSrc = webcamRef.current.getScreenshot();

    try {
      // SEND TO YOUR API GATEWAY
      const response = await fetch('https://uy9fws4qb5.execute-api.us-east-1.amazonaws.com/verify-face',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageSrc })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setMessage(`${Math.round(data.confidence)}% Match - Cloud Verification Passed`);
      } else {
        setStatus('fail');
        setMessage(data.message || data.error || "Verification Failed");
      }
    } catch (error) {
      console.error(error);
      setStatus('fail');
      setMessage("Network error communicating with Cloud AI.");
    } finally {
      setIsVerifying(false);
    }
  }, [webcamRef]);

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-6 text-white font-sans">
      
      <div className="flex items-center space-x-3 mb-10">
        <div className="bg-[#1B365D] p-2 rounded-lg shadow-lg border border-blue-500/30">
          <CloudLightning className="text-[#4ADE80]" size={24} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Cloud Biometric Verification</h1>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        <div className="relative group">
          <div className={`absolute -inset-1 rounded-3xl blur opacity-25 transition duration-1000 ${status === 'fail' ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-[#4ADE80]'}`}></div>
          <div className="relative bg-[#1E293B] rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-video flex items-center justify-center">
            
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              screenshotQuality={0.9}
              className="w-full h-full object-cover"
            />

            {status === 'scanning' && (
              <div className="absolute inset-0 border-t-4 border-[#4ADE80]/50 shadow-[0_0_30px_rgba(74,222,128,0.5)] animate-[scan_2s_ease-in-out_infinite]"></div>
            )}
            {status === 'success' && (
               <div className="absolute inset-0 border-4 border-[#4ADE80] rounded-3xl transition-all duration-500 pointer-events-none"></div>
            )}
            {status === 'fail' && (
               <div className="absolute inset-0 border-4 border-red-500 rounded-3xl transition-all duration-500 pointer-events-none bg-red-500/10"></div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-4">AWS Rekognition Check</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Your image will be securely processed by AWS Cloud AI. Ensure your eyes are open and clearly visible.
            </p>
          </div>

          <div className="space-y-4">
            <StatusItem 
              icon={<Camera size={18}/>} 
              label="System Status" 
              status={message} 
              isError={status === 'fail'}
              isSuccess={status === 'success'}
            />
          </div>

          {(status === 'ready' || status === 'fail') && (
            <button 
              onClick={captureAndVerify}
              disabled={isVerifying}
              className="w-full bg-[#1B365D] hover:bg-blue-900 text-white font-bold py-4 rounded-2xl transition shadow-lg flex items-center justify-center space-x-3 border border-blue-500/30"
            >
              <Camera size={20} />
              <span>{status === 'fail' ? 'Retry Scan' : 'Initiate Cloud Scan'}</span>
            </button>
          )}

          {status === 'scanning' && (
            <div className="w-full bg-slate-800 py-4 rounded-2xl flex items-center justify-center space-x-3 italic text-[#4ADE80]">
              <div className="w-4 h-4 border-2 border-[#4ADE80] border-t-transparent rounded-full animate-spin"></div>
              <span>Transmitting to AWS...</span>
            </div>
          )}

          {status === 'success' && (
            <button 
              onClick={() => navigate('/exam')}
              className="w-full bg-[#4ADE80] hover:bg-emerald-400 text-[#0F172A] font-bold py-4 rounded-2xl transition shadow-lg flex items-center justify-center space-x-3"
            >
              <span>Enter Examination Room</span>
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
      <style>{`@keyframes scan { 0% { transform: translateY(0); } 50% { transform: translateY(100%); } 100% { transform: translateY(0); } }`}</style>
    </div>
  );
};

const StatusItem = ({ icon, label, status, isError, isSuccess }) => (
  <div className={`flex items-center justify-between p-4 rounded-xl border ${isError ? 'bg-red-500/10 border-red-500/30' : isSuccess ? 'bg-[#4ADE80]/10 border-[#4ADE80]/30' : 'bg-white/5 border-white/10'}`}>
    <div className="flex items-center space-x-3 text-slate-300">
      {icon} <span className="text-sm font-medium">{label}</span>
    </div>
    <span className={`text-sm font-bold ${isError ? 'text-red-400' : isSuccess ? 'text-[#4ADE80]' : 'text-slate-500'}`}>
      {status}
    </span>
  </div>
);

export default Verification;