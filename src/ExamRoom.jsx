import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';
import { Shield, AlertTriangle, Clock, ChevronRight, CheckCircle, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExamRoom = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  
  // --- STATE DECLARATIONS ---
  const [model, setModel] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); 
  const [selectedAnswers, setSelectedAnswers] = useState({});
  
  // These are the two variables that were missing!
  const [warningCount, setWarningCount] = useState(0);
  const [isTerminated, setIsTerminated] = useState(false);

  // --- MOCK QUESTIONS ---
  const questions = [
    { q: "What is the primary advantage of a Serverless architecture?", options: ["No servers at all", "Automatic scaling", "Lower latency", "Fixed cost"] },
    { q: "Which AWS service is best suited for NoSQL data storage?", options: ["RDS", "S3", "DynamoDB", "Redshift"] }
  ];

  // --- AI MODEL LOADING ---
  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await cocossd.load();
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  // --- CONTINUOUS AI MONITORING (THE WATCHDOG) ---
  useEffect(() => {
    const detect = async () => {
      if (model && webcamRef.current && webcamRef.current.video.readyState === 4 && !isTerminated) {
        const video = webcamRef.current.video;
        const predictions = await model.detect(video);
        
        let newAlerts = [];
        let personCount = 0;

        predictions.forEach(prediction => {
          if (prediction.class === 'cell phone') newAlerts.push("MOBILE DEVICE DETECTED");
          if (prediction.class === 'person') personCount++;
        });

        if (personCount > 1) newAlerts.push("MULTIPLE PERSONS DETECTED");
        if (personCount === 0) newAlerts.push("CANDIDATE NOT VISIBLE");

        setAlerts(newAlerts);
      }
    };

    const interval = setInterval(detect, 2000); 
    return () => clearInterval(interval);
  }, [model, isTerminated]);

  // --- 3-STRIKE PENALTY LOGIC ---
  useEffect(() => {
    if (alerts.length > 0 && !isTerminated) {
      const timer = setTimeout(() => {
        setWarningCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 3) setIsTerminated(true);
          return newCount;
        });
      }, 3000); // 3 seconds to correct behavior before getting a strike
      return () => clearTimeout(timer);
    }
  }, [alerts, isTerminated]);

  // --- ANTI-CHEAT: TAB SWITCHING ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isTerminated) {
        alert("SECURITY WARNING: You left the exam tab! This has been logged.");
        setWarningCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 3) setIsTerminated(true);
          return newCount;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isTerminated]);

  // --- TIMER LOGIC ---
  useEffect(() => {
    if (isTerminated) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [isTerminated]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSelectOption = (option) => {
    if (isTerminated) return;
    setSelectedAnswers(prev => ({ ...prev, [currentQuestion]: option }));
  };

  const handleSubmit = () => {
    const examResult = {
        name: "Cloud Architecture Assessment",
        score: Math.floor(Math.random() * 21) + 80
    };
    localStorage.setItem('recent_exam', JSON.stringify(examResult));
    alert("Exam Submitted Successfully!");
    navigate('/student'); 
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col font-sans">
      
      {/* KICKOUT OVERLAY */}
      {isTerminated && (
        <div className="fixed inset-0 bg-[#0F172A] z-[100] flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-red-500/20 p-6 rounded-full mb-6 animate-pulse">
            <AlertTriangle size={64} className="text-red-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Exam Session Terminated</h1>
          <p className="text-slate-400 max-w-md mb-8">
            The Sentinel AI has detected multiple security violations. Your session has been closed and your instructor has been notified of the integrity breach.
          </p>
          <button 
            onClick={() => navigate('/student')}
            className="bg-white hover:bg-gray-200 text-[#0F172A] px-8 py-3 rounded-xl font-bold transition"
          >
            Return to Dashboard
          </button>
        </div>
      )}

      {/* HEADER */}
      <header className="bg-[#1B365D] text-white px-8 py-4 flex justify-between items-center shadow-lg z-10">
        <div className="flex items-center space-x-3">
          <Shield className="text-[#4ADE80]" />
          <span className="font-bold tracking-tight uppercase text-sm">Proctorlock Secure Session</span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="bg-white/10 px-4 py-1.5 rounded-full flex items-center space-x-2 border border-white/20">
            <Clock size={16} className={`${timeLeft < 300 ? 'text-red-400 animate-pulse' : 'text-[#4ADE80]'}`} />
            <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
          <button onClick={handleSubmit} className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-lg text-xs font-bold transition">FINISH EXAM</button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT: EXAM AREA */}
        <div className="flex-1 p-10 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-400 font-bold text-xs tracking-widest uppercase mb-4">Question {currentQuestion + 1} of {questions.length}</p>
            <h2 className="text-2xl font-bold text-[#1B365D] mb-8 leading-snug">
              {questions[currentQuestion].q}
            </h2>

            <div className="space-y-4">
              {questions[currentQuestion].options.map((option, idx) => {
                const isSelected = selectedAnswers[currentQuestion] === option;
                return (
                  <div 
                    key={idx} 
                    onClick={() => handleSelectOption(option)}
                    className={`group flex items-center p-5 border-2 rounded-2xl cursor-pointer transition shadow-sm ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent bg-white hover:border-blue-200'
                    }`}
                  >
                    <div className={`w-6 h-6 border-2 rounded-full mr-4 flex items-center justify-center transition-colors ${
                      isSelected ? 'border-blue-500' : 'border-gray-200 group-hover:border-blue-400'
                    }`}>
                      <div className={`w-2.5 h-2.5 bg-blue-500 rounded-full transition-opacity ${
                        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                      }`}></div>
                    </div>
                    <span className={`font-semibold ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>{option}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 flex justify-between items-center">
               <button 
                  className="text-gray-400 font-bold hover:text-gray-600 transition disabled:opacity-0" 
                  disabled={currentQuestion === 0} 
                  onClick={() => setCurrentQuestion(q => q - 1)}
               >
                  PREVIOUS
               </button>
               
               {currentQuestion < questions.length - 1 ? (
                 <button 
                    className="bg-[#1B365D] hover:bg-blue-900 text-white px-8 py-3 rounded-xl font-bold flex items-center space-x-2 transition" 
                    onClick={() => setCurrentQuestion(q => q + 1)}
                 >
                    <span>SAVE & NEXT</span> <ChevronRight size={18} />
                 </button>
               ) : (
                 <button 
                    className="bg-[#10B981] hover:bg-emerald-400 text-white px-8 py-3 rounded-xl font-bold flex items-center space-x-2 transition shadow-lg shadow-emerald-500/30" 
                    onClick={handleSubmit}
                 >
                    <span>SUBMIT EXAM</span> <CheckCircle size={18} />
                 </button>
               )}
            </div>
          </div>
        </div>

        {/* RIGHT: AI MONITORING SIDEBAR */}
        <div className="w-80 bg-white border-l border-gray-200 p-6 flex flex-col space-y-6">
          <div className="relative rounded-2xl overflow-hidden border-2 border-gray-100 shadow-inner bg-black aspect-video">
            <Webcam
              audio={false}
              ref={webcamRef}
              className="w-full h-full object-cover grayscale opacity-80"
            />
            <div className="absolute top-2 left-2 flex items-center space-x-1.5 bg-black/50 px-2 py-1 rounded-md">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Live Feed</span>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase">Sentinel Analysis</h3>
              {/* STRIKE COUNTER UI */}
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${warningCount > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                Strikes: {warningCount}/3
              </span>
            </div>
            
            {!model ? (
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center space-x-3">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-bold text-blue-700 uppercase">Loading AI...</span>
              </div>
            ) : alerts.length === 0 ? (
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center space-x-3">
                <CheckCircle className="text-emerald-500" size={20} />
                <span className="text-xs font-bold text-emerald-700 uppercase">Environment Secure</span>
              </div>
            ) : (
              alerts.map((alert, i) => (
                <div key={i} className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center space-x-3 animate-pulse">
                  <AlertTriangle className="text-red-500" size={20} />
                  <span className="text-xs font-bold text-red-700 uppercase">{alert}</span>
                </div>
              ))
            )}

            <div className="bg-gray-50 p-4 rounded-xl space-y-3 mt-auto">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Network Stability</span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase">Excellent</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div className="bg-emerald-500 h-1 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
             <div className="flex items-center space-x-2 mb-2">
                <Monitor size={14} className="text-blue-600" />
                <span className="text-[10px] font-bold text-blue-600 uppercase">Proctor Note</span>
             </div>
             <p className="text-[10px] text-blue-800 leading-relaxed">Your screen and camera are being monitored by AI. Tab switching or physical violations will result in termination.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamRoom;