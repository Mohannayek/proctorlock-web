import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';
import { Shield, AlertTriangle, Clock, ChevronRight, CheckCircle, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExamRoom = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  
  const [model, setModel] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); 
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [warningCount, setWarningCount] = useState(0);
  const [isTerminated, setIsTerminated] = useState(false);

  const questions = [
    { q: "What is the primary advantage of a Serverless architecture?", options: ["No servers at all", "Automatic scaling", "Lower latency", "Fixed cost"] },
    { q: "Which AWS service is best suited for NoSQL data storage?", options: ["RDS", "S3", "DynamoDB", "Redshift"] }
  ];

  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await cocossd.load();
      setModel(loadedModel);
    };
    loadModel();
  }, []);

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

  useEffect(() => {
    if (alerts.length > 0 && !isTerminated) {
      const timer = setTimeout(() => {
        setWarningCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 3) setIsTerminated(true);
          return newCount;
        });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alerts, isTerminated]);

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

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col font-sans">
      
      {isTerminated && (
        <div className="fixed inset-0 bg-[#0F172A] z-[100] flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-red-500/20 p-6 rounded-full mb-6 animate-pulse">
            <AlertTriangle size={64} className="text-red-500" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">Exam Session Terminated</h1>
          <p className="text-slate-400 max-w-md mb-8 text-sm lg:text-base">
            The Sentinel AI has detected multiple security violations. Your session has been closed and your instructor has been notified of the integrity breach.
          </p>
          <button onClick={() => navigate('/student')} className="bg-white hover:bg-gray-200 text-[#0F172A] px-8 py-3 rounded-xl font-bold transition">
            Return to Dashboard
          </button>
        </div>
      )}

      {/* HEADER - Adjusted padding and text sizes for mobile */}
      <header className="bg-[#1B365D] text-white px-4 lg:px-8 py-3 lg:py-4 flex justify-between items-center shadow-lg z-20">
        <div className="flex items-center space-x-2 lg:space-x-3">
          <Shield className="text-[#4ADE80] w-5 h-5 lg:w-6 lg:h-6" />
          <span className="font-bold tracking-tight uppercase text-[10px] lg:text-sm">Secure Session</span>
        </div>
        <div className="flex items-center space-x-3 lg:space-x-6">
          <div className="bg-white/10 px-3 lg:px-4 py-1 lg:py-1.5 rounded-full flex items-center space-x-2 border border-white/20">
            <Clock size={14} className={`${timeLeft < 300 ? 'text-red-400 animate-pulse' : 'text-[#4ADE80]'}`} />
            <span className="font-mono font-bold text-xs lg:text-base">{formatTime(timeLeft)}</span>
          </div>
          <button onClick={handleSubmit} className="bg-red-500 hover:bg-red-600 px-3 lg:px-4 py-1.5 rounded-lg text-[10px] lg:text-xs font-bold transition">
            FINISH
          </button>
        </div>
      </header>

      {/* MAIN CONTENT - Changed from 'flex' to 'flex-col lg:flex-row' */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* RIGHT (MOBILE TOP): AI MONITORING SIDEBAR */}
        <div className="w-full lg:w-80 bg-white border-b lg:border-b-0 lg:border-l border-gray-200 p-4 lg:p-6 flex flex-col space-y-4 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] lg:shadow-none z-10 shrink-0">
          
          {/* Centered and constrained camera on mobile */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-gray-100 shadow-inner bg-black aspect-video max-w-[240px] lg:max-w-full mx-auto w-full">
            <Webcam audio={false} ref={webcamRef} className="w-full h-full object-cover grayscale opacity-80" />
            <div className="absolute top-2 left-2 flex items-center space-x-1.5 bg-black/50 px-2 py-1 rounded-md">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-[8px] lg:text-[10px] font-bold text-white uppercase tracking-tighter">Live Feed</span>
            </div>
          </div>

          <div className="flex-1 space-y-3 lg:space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] lg:text-xs font-bold text-gray-400 tracking-widest uppercase">Sentinel Analysis</h3>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${warningCount > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                Strikes: {warningCount}/3
              </span>
            </div>
            
            {!model ? (
              <div className="bg-blue-50 border border-blue-100 p-3 lg:p-4 rounded-xl flex items-center space-x-3">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[10px] lg:text-xs font-bold text-blue-700 uppercase">Loading AI...</span>
              </div>
            ) : alerts.length === 0 ? (
              <div className="bg-emerald-50 border border-emerald-100 p-3 lg:p-4 rounded-xl flex items-center space-x-3">
                <CheckCircle className="text-emerald-500" size={16} />
                <span className="text-[10px] lg:text-xs font-bold text-emerald-700 uppercase">Environment Secure</span>
              </div>
            ) : (
              alerts.map((alert, i) => (
                <div key={i} className="bg-red-50 border border-red-100 p-3 lg:p-4 rounded-xl flex items-center space-x-3 animate-pulse">
                  <AlertTriangle className="text-red-500" size={16} />
                  <span className="text-[10px] lg:text-xs font-bold text-red-700 uppercase">{alert}</span>
                </div>
              ))
            )}
          </div>
          
          {/* Hidden on mobile to save vertical space */}
          <div className="hidden lg:block bg-blue-50 p-4 rounded-xl border border-blue-100">
             <div className="flex items-center space-x-2 mb-2">
                <Monitor size={14} className="text-blue-600" />
                <span className="text-[10px] font-bold text-blue-600 uppercase">Proctor Note</span>
             </div>
             <p className="text-[10px] text-blue-800 leading-relaxed">Your screen and camera are being monitored by AI. Tab switching or physical violations will result in termination.</p>
          </div>
        </div>

        {/* LEFT (MOBILE BOTTOM): EXAM AREA */}
        <div className="flex-1 p-4 lg:p-10 overflow-y-auto bg-[#F1F5F9]">
          <div className="max-w-3xl mx-auto pb-20 lg:pb-0">
            <p className="text-gray-400 font-bold text-[10px] lg:text-xs tracking-widest uppercase mb-3 lg:mb-4">
              Question {currentQuestion + 1} of {questions.length}
            </p>
            <h2 className="text-xl lg:text-2xl font-bold text-[#1B365D] mb-6 lg:mb-8 leading-snug">
              {questions[currentQuestion].q}
            </h2>

            <div className="space-y-3 lg:space-y-4">
              {questions[currentQuestion].options.map((option, idx) => {
                const isSelected = selectedAnswers[currentQuestion] === option;
                return (
                  <div 
                    key={idx} 
                    onClick={() => handleSelectOption(option)}
                    className={`group flex items-center p-4 lg:p-5 border-2 rounded-xl lg:rounded-2xl cursor-pointer transition shadow-sm ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent bg-white hover:border-blue-200'
                    }`}
                  >
                    <div className={`w-5 h-5 lg:w-6 lg:h-6 border-2 rounded-full mr-3 lg:mr-4 flex shrink-0 items-center justify-center transition-colors ${
                      isSelected ? 'border-blue-500' : 'border-gray-200 group-hover:border-blue-400'
                    }`}>
                      <div className={`w-2 h-2 lg:w-2.5 lg:h-2.5 bg-blue-500 rounded-full transition-opacity ${
                        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                      }`}></div>
                    </div>
                    <span className={`font-medium lg:font-semibold text-sm lg:text-base ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>{option}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 lg:mt-12 flex justify-between items-center">
               <button 
                  className="text-gray-400 font-bold hover:text-gray-600 transition disabled:opacity-0 text-xs lg:text-base" 
                  disabled={currentQuestion === 0} 
                  onClick={() => setCurrentQuestion(q => q - 1)}
               >
                  PREVIOUS
               </button>
               
               {currentQuestion < questions.length - 1 ? (
                 <button 
                    className="bg-[#1B365D] hover:bg-blue-900 text-white px-5 lg:px-8 py-2.5 lg:py-3 rounded-xl font-bold flex items-center space-x-2 transition text-xs lg:text-base" 
                    onClick={() => setCurrentQuestion(q => q + 1)}
                 >
                    <span>SAVE & NEXT</span> <ChevronRight size={16} />
                 </button>
               ) : (
                 <button 
                    className="bg-[#10B981] hover:bg-emerald-400 text-white px-5 lg:px-8 py-2.5 lg:py-3 rounded-xl font-bold flex items-center space-x-2 transition shadow-lg shadow-emerald-500/30 text-xs lg:text-base" 
                    onClick={handleSubmit}
                 >
                    <span>SUBMIT EXAM</span> <CheckCircle size={16} />
                 </button>
               )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ExamRoom;