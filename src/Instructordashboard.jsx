import React, { useState, useRef, useEffect } from 'react';
import { 
  Shield, LayoutGrid, Video, Library, BarChart2, Settings, Users, Bell, HelpCircle, 
  Eye, AlertTriangle, Wand2, UploadCloud, Cpu, CheckCircle, Plus, Trash2, 
  Search, MoreVertical, Edit, FileText, XCircle, Clock, Calendar, Check, Sliders, MonitorPlay, Activity, Mail, Phone, Lock, List, Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import LiveStreamPlayer from './LiveStreamPlayer';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  
  // --- EXISTING DASHBOARD STATE ---
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [searchQuery, setSearchQuery] = useState('');

  // --- NEW AI EXTRACTOR STATE ---
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [questions, setQuestions] = useState([]);

  // --- API INTEGRATION STATE ---
  const [liveSessions, setLiveSessions] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [isLoadingApi, setIsLoadingApi] = useState(true);
  const [activeLiveStream, setActiveLiveStream] = useState(null);

  useEffect(() => {
    const fetchApiData = async (isInitialLoad = true) => {
      if (isInitialLoad) setIsLoadingApi(true);
      try {
        // Fetch Live Sessions
        const sessionRes = await fetch('https://uy9fws4qb5.execute-api.us-east-1.amazonaws.com/live-sessions');
        if (sessionRes.ok) {
           const sessionData = await sessionRes.json();
           setLiveSessions(sessionData);
        } else {
           throw new Error("Live sessions API not ready");
        }
      } catch (e) {
        console.warn("Fallback to mock data for live sessions:", e);
        setLiveSessions([
          { name: "Marcus Chen", status: "Secure", exam: "CS-402", time: "42:15", img: "Marcus" },
          { name: "Elena Rodriguez", status: "Warning", exam: "BIO-211", time: "12:08", img: "Elena", flags: 3 },
          { name: "Sarah Jenkins", status: "Secure", exam: "CS-402", time: "40:10", img: "Sarah" },
          { name: "David Kim", status: "Critical", exam: "ENG-101", time: "05:50", img: "David", flags: 7 },
          { name: "Lisa Wong", status: "Secure", exam: "BIO-211", time: "15:30", img: "Lisa" },
          { name: "James Smith", status: "Secure", exam: "CS-402", time: "38:45", img: "James" },
        ]);
      }

      try {
        // Fetch Incidents
        const incidentRes = await fetch('https://uy9fws4qb5.execute-api.us-east-1.amazonaws.com/incidents');
        if (incidentRes.ok) {
           const incidentData = await incidentRes.json();
           setIncidents(incidentData);
        } else {
           throw new Error("Incidents API not ready");
        }
      } catch (e) {
        console.warn("Fallback to mock data for incidents:", e);
        setIncidents([
          { id: 1, student: "David Kim", exam: "ENG-101", time: "10 mins ago", type: "Multiple Faces Detected", severity: "High", color: "red", videoUrl: "https://example-bucket.s3.amazonaws.com/video1.mp4" },
          { id: 2, student: "Elena Rodriguez", exam: "BIO-211", time: "2 hrs ago", type: "Tab Switched", severity: "Medium", color: "amber", videoUrl: "https://example-bucket.s3.amazonaws.com/video2.mp4" },
          { id: 3, student: "John Doe", exam: "MATH-301", time: "1 day ago", type: "Background Noise", severity: "Low", color: "blue", videoUrl: "https://example-bucket.s3.amazonaws.com/video3.mp4" },
          { id: 4, student: "Jane Smith", exam: "CS-402", time: "1 day ago", type: "Looking Away", severity: "Medium", color: "amber", videoUrl: "https://example-bucket.s3.amazonaws.com/video4.mp4" },
        ]);
      }
      if (isInitialLoad) setIsLoadingApi(false);
    };

    // Initial load
    fetchApiData(true);

    // Set up polling for real-time updates (every 5 seconds)
    const intervalId = setInterval(() => {
      fetchApiData(false);
    }, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleReviewVideo = (videoUrl) => {
    if (videoUrl) {
      alert(`Connecting to AWS S3 bucket to retrieve video stream:\n${videoUrl}\n\n(A video player modal will open here in the next phase)`);
    } else {
      alert("No video recording found for this incident.");
    }
  };

  const handleScheduleExam = () => {
    alert("This will open the 'Create Exam' modal in the next phase!");
  };

  const handleLogout = () => {
    localStorage.removeItem('proctorlock_user');
    navigate('/');
  };

  // --- REAL GEMINI AI EXTRACTOR FUNCTIONS ---
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      startAIScan(droppedFile);
    } else {
      alert("For this demo, please drop an Image file (.png, .jpg, .jpeg) of the quiz.");
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) startAIScan(selectedFile);
  };

  // Helper to convert the image file so the AI can read it
  const fileToGenerativePart = async (file) => {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  };

  const startAIScan = async (selectedFile) => {
    setFile(URL.createObjectURL(selectedFile));
    setIsScanning(true);
    setQuestions([]);

    try {
      // 1. Initialize Gemini (Replace with import.meta.env.VITE_GEMINI_API_KEY later!)
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      
      // We use 1.5 Flash because it is super fast at reading images
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // 2. Prepare the Image and the strict prompt
      const imagePart = await fileToGenerativePart(selectedFile);
      const prompt = `
        You are an AI assistant for a university professor. 
        Read this image of an exam, worksheet, or textbook quiz. 
        Extract all the questions and multiple-choice options you can find.
        
        You MUST return ONLY a raw JSON array matching this exact format. Do not use markdown blocks, just the raw array:
        [
          {
            "id": 1,
            "q": "What is the exact question text?",
            "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
            "correct": 0
          }
        ]
        
        If you can guess the correct answer, set the 'correct' index (0-3). Otherwise, set it to 0. 
        If there are no options in the image, generate 4 plausible multiple choice options based on the question.
      `;

      // 3. Call the API!
      const result = await model.generateContent([prompt, imagePart]);
      const responseText = result.response.text();

      // 4. Clean up the AI's text and turn it into real React State
      const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedQuestions = JSON.parse(cleanedText);

      // Give every question a unique ID just in case
      const questionsWithIds = parsedQuestions.map((q, idx) => ({ ...q, id: Date.now() + idx }));
      
      setQuestions(questionsWithIds);

    } catch (error) {
      console.error("AI Extraction Failed:", error);
      alert("The AI couldn't read that image clearly. Try taking a brighter photo or a clearer screenshot!");
    } finally {
      setIsScanning(false);
    }
  };

  const handleUpdateQuestion = (id, field, value, optionIndex = null) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        if (optionIndex !== null) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return { ...q, [field]: value };
      }
      return q;
    }));
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSaveToBank = () => {
    console.log("Saving to DB:", questions);
    alert(`Successfully saved ${questions.length} questions to the Exam Bank!`);
    setQuestions([]);
    setFile(null);
    setActiveTab('EXAM LIBRARY'); 
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between h-full z-10 shrink-0">
        <div>
          {/* Logo Area */}
          <div className="p-6 flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('OVERVIEW')}>
            <div className="bg-[#1B365D] p-2 rounded-lg">
                <Shield className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-[#1B365D] font-bold text-lg leading-tight">The Sentinel</h2>
              <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse"></div>
                  <p className="text-[9px] text-[#10B981] font-bold tracking-widest uppercase">AI Monitoring Active</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-2 px-4 space-y-1">
            <NavItem icon={<LayoutGrid size={18}/>} label="OVERVIEW" active={activeTab === 'OVERVIEW'} onClick={() => setActiveTab('OVERVIEW')} />
            <NavItem icon={<Video size={18}/>} label="LIVE SESSIONS" active={activeTab === 'LIVE SESSIONS'} onClick={() => setActiveTab('LIVE SESSIONS')} />
            <NavItem icon={<Library size={18}/>} label="EXAM LIBRARY" active={activeTab === 'EXAM LIBRARY'} onClick={() => setActiveTab('EXAM LIBRARY')} />
            
            <NavItem icon={<Wand2 size={18}/>} label="AI GENERATOR" active={activeTab === 'AI GENERATOR'} onClick={() => setActiveTab('AI GENERATOR')} />
            
            <NavItem icon={<BarChart2 size={18}/>} label="INTEGRITY REPORTS" active={activeTab === 'INTEGRITY REPORTS'} onClick={() => setActiveTab('INTEGRITY REPORTS')} />
            <NavItem icon={<Settings size={18}/>} label="SETTINGS" active={activeTab === 'SETTINGS'} onClick={() => setActiveTab('SETTINGS')} />
            <NavItem icon={<Users size={18}/>} label="USER MANAGEMENT" active={activeTab === 'USER MANAGEMENT'} onClick={() => setActiveTab('USER MANAGEMENT')} />
          </nav>
        </div>

        <div className="p-6 space-y-4">
          <button 
            onClick={handleScheduleExam}
            className="w-full bg-[#1B365D] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#15294a] transition shadow-md flex justify-center items-center space-x-2"
          >
            <span className="text-lg leading-none">+</span> <span>SCHEDULE EXAM</span>
          </button>
          
          <div 
            onClick={handleLogout}
            className="text-xs font-semibold text-gray-400 flex items-center justify-center space-x-2 cursor-pointer hover:text-red-500 transition"
          >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
             <span>LOG OUT</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Header Navigation */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-[#1B365D] mr-6">Proctorlock</span>
            <nav className="flex space-x-6 text-sm font-medium">
               <span className={`cursor-pointer transition ${activeTab === 'OVERVIEW' ? 'text-[#1B365D] border-b-2 border-[#1B365D] pb-5 -mb-5' : 'text-gray-500 hover:text-gray-800'}`} onClick={() => setActiveTab('OVERVIEW')}>Dashboard</span>
               <span className={`cursor-pointer transition ${activeTab === 'EXAM LIBRARY' || activeTab === 'AI GENERATOR' ? 'text-[#1B365D] border-b-2 border-[#1B365D] pb-5 -mb-5' : 'text-gray-500 hover:text-gray-800'}`} onClick={() => setActiveTab('EXAM LIBRARY')}>Exams</span>
               <span className="text-gray-500 hover:text-gray-800 cursor-pointer transition" onClick={() => alert("Support Center opening...")}>Support</span>
            </nav>
          </div>
          <div className="flex items-center space-x-5">
             <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search exams or students" 
                  className="bg-gray-100/80 rounded-full pl-10 pr-4 py-2 text-sm w-72 outline-none focus:ring-2 focus:ring-blue-100 transition" 
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-4 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>
             <Bell className="text-gray-400 cursor-pointer hover:text-[#1B365D] transition" size={20} onClick={() => alert("You have 3 new notifications.")} />
             <HelpCircle className="text-gray-400 cursor-pointer hover:text-[#1B365D] transition" size={20} />
             <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-full cursor-pointer shadow-sm border-2 border-white hover:ring-2 hover:ring-blue-300 transition"></div>
          </div>
        </header>

        {/* Scrollable Dashboard Workspace */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* 1. ORIGINAL OVERVIEW TAB */}
          {activeTab === 'OVERVIEW' && (
            <>
              <div className="flex items-center justify-between mb-8">
                  <div>
                      <h1 className="text-3xl font-bold text-[#1B365D]">Instructor Dashboard</h1>
                      <p className="text-gray-500 mt-1">Welcome back, Dr. Aris. 12 exams are currently live.</p>
                  </div>
                  <div className="flex space-x-4">
                      <button className="bg-blue-50 text-[#1B365D] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-100 transition flex items-center space-x-2" onClick={() => setActiveTab('AI GENERATOR')}>
                          <Wand2 size={16} /> <span>Auto-Generate Exam</span>
                      </button>
                      <button className="bg-[#1B365D] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#15294a] transition shadow-md" onClick={handleScheduleExam}>
                          Create New Exam
                      </button>
                  </div>
              </div>

              <div className="flex gap-8">

                  {/* CENTER COLUMN */}
                  <div className="flex-1 min-w-0">
                      
                      {/* Row 1: Top Stat Cards */}
                      <div className="grid grid-cols-3 gap-6 mb-8">
                          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer">
                              <div className="flex justify-between items-start mb-4">
                                  <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Total Students</p>
                                  <div className="bg-blue-50 p-1.5 rounded-lg text-blue-500"><Users size={16}/></div>
                              </div>
                              <h2 className="text-4xl font-bold text-[#1B365D] mb-2">1,482</h2>
                              <p className="text-xs text-[#10B981] font-medium flex items-center"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> 12% from last term</p>
                          </div>
                          
                          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => setActiveTab('EXAM LIBRARY')}>
                              <div className="flex justify-between items-start mb-4">
                                  <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Exams Completed</p>
                                  <div className="bg-blue-50 p-1.5 rounded-lg text-blue-500"><LayoutGrid size={16}/></div>
                              </div>
                              <h2 className="text-4xl font-bold text-[#1B365D] mb-2">843</h2>
                              <p className="text-xs text-gray-400 font-medium">On track for semester goals</p>
                          </div>
                          
                          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-b-4 border-b-[#10B981] hover:shadow-md transition cursor-pointer" onClick={() => setActiveTab('INTEGRITY REPORTS')}>
                              <div className="flex justify-between items-start mb-4">
                                  <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Integrity Score</p>
                                  <div className="bg-emerald-50 p-1.5 rounded-lg text-[#10B981]"><Shield size={16}/></div>
                              </div>
                              <h2 className="text-4xl font-bold text-[#1B365D] mb-2">98.4%</h2>
                              <p className="text-xs text-[#10B981] font-medium">Optimal AI compliance</p>
                          </div>
                      </div>

                      {/* Row 2: Live Monitoring Table */}
                      <div>
                          <div className="flex justify-between items-center mb-4">
                              <div className="flex items-center space-x-3">
                                <h3 className="text-xl font-bold text-[#1B365D]">Live Monitoring</h3>
                                <span className="bg-teal-100 text-teal-700 text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider">12 Active</span>
                              </div>
                              <span onClick={() => setActiveTab('LIVE SESSIONS')} className="text-sm font-semibold text-[#1B365D] hover:underline cursor-pointer">View All Sessions</span>
                          </div>

                          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                              <table className="w-full text-left border-collapse">
                                  <thead>
                                      <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                                          <th className="p-5 pl-6">Student</th>
                                          <th className="p-5">Exam ID</th>
                                          <th className="p-5">Duration</th>
                                          <th className="p-5">AI Status</th>
                                          <th className="p-5 pr-6 text-right">Action</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                      <tr className="hover:bg-gray-50/50 transition">
                                          <td className="p-5 pl-6 flex items-center space-x-3">
                                              <div className="w-10 h-10 rounded-full bg-blue-100 overflow-hidden border border-gray-200 shrink-0">
                                                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" alt="avatar" />
                                              </div>
                                              <div>
                                                  <p className="text-sm font-bold text-[#1B365D]">Marcus Chen</p>
                                                  <p className="text-xs text-gray-400">CS-402: Adv Systems</p>
                                              </div>
                                          </td>
                                          <td className="p-5 text-sm font-medium text-gray-600">#E-99420</td>
                                          <td className="p-5 text-sm font-medium text-gray-600">42:15 / 60:00</td>
                                          <td className="p-5">
                                              <span className="flex items-center text-xs font-bold text-[#10B981]">
                                                  <div className="w-2 h-2 bg-[#10B981] rounded-full mr-2"></div> Secure
                                              </span>
                                          </td>
                                          <td className="p-5 pr-6 text-right">
                                              <button onClick={() => alert("Viewing Marcus Chen's live feed...")} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"><Eye size={16}/></button>
                                          </td>
                                      </tr>
                                      
                                      <tr className="hover:bg-gray-50/50 transition bg-red-50/20">
                                          <td className="p-5 pl-6 flex items-center space-x-3">
                                              <div className="w-10 h-10 rounded-full bg-blue-100 overflow-hidden border border-gray-200 shrink-0">
                                                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Elena" alt="avatar" />
                                              </div>
                                              <div>
                                                  <p className="text-sm font-bold text-[#1B365D]">Elena Rodriguez</p>
                                                  <p className="text-xs text-gray-400">BIO-211: Genetics</p>
                                              </div>
                                          </td>
                                          <td className="p-5 text-sm font-medium text-gray-600">#E-99425</td>
                                          <td className="p-5 text-sm font-medium text-gray-600">12:08 / 90:00</td>
                                          <td className="p-5">
                                              <span className="flex items-center text-xs font-bold text-red-500">
                                                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div> 3 Flags
                                              </span>
                                          </td>
                                          <td className="p-5 pr-6 text-right">
                                              <button onClick={() => alert("Intervening in Elena Rodriguez's session!")} className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-sm"><AlertTriangle size={16}/></button>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>

                  {/* RIGHT COLUMN: AI Alerts & System Stats */}
                  <div className="w-80 shrink-0">
                      <h3 className="text-xl font-bold text-[#1B365D] mb-4">AI Real-time Alerts</h3>

                      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden border-l-4 border-l-red-500 mb-4">
                          <div className="flex justify-between items-start mb-3">
                              <span className="bg-red-100 text-red-600 text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider">High Severity</span>
                              <span className="text-xs text-gray-400 font-medium">2 mins ago</span>
                          </div>
                          <h4 className="font-bold text-[#1B365D] text-base mb-3">Multiple faces detected</h4>

                          <div className="bg-gray-50 rounded-lg p-3 flex items-center space-x-3 mb-4 border border-gray-100">
                              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Elena" alt="Candidate" className="w-10 h-10 rounded-md bg-white border border-gray-200 shrink-0" />
                              <div className="text-xs">
                                  <p className="text-gray-500"><span className="font-medium text-gray-700">Candidate:</span> Elena Rodriguez</p>
                                  <p className="text-gray-500"><span className="font-medium text-gray-700">Location:</span> Genetics Midterm</p>
                              </div>
                          </div>

                          <div className="flex space-x-2">
                              <button onClick={() => alert("Connecting to Elena's camera feed...")} className="flex-1 bg-red-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-red-700 transition shadow-sm">JOIN SESSION</button>
                              <button onClick={() => alert("Dismissing alert.")} className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                          </div>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mt-6">
                          <h4 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">Active System Load</h4>

                          <div className="mb-4">
                              <div className="flex justify-between text-xs font-medium mb-1">
                                  <span className="text-gray-600">AI Processing</span>
                                  <span className="text-[#1B365D] font-bold">42%</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-1.5">
                                  <div className="bg-[#1B365D] h-1.5 rounded-full" style={{ width: '42%' }}></div>
                              </div>
                          </div>

                          <div>
                              <div className="flex justify-between text-xs font-medium mb-1">
                                  <span className="text-gray-600">Bandwidth Usage</span>
                                  <span className="text-[#10B981] font-bold">18%</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-1.5">
                                  <div className="bg-[#10B981] h-1.5 rounded-full" style={{ width: '18%' }}></div>
                              </div>
                          </div>
                      </div>
                  </div>

              </div>
            </>
          )}

          {/* 2. NEW AI GENERATOR TAB */}
          {activeTab === 'AI GENERATOR' && (
            <div className="max-w-5xl mx-auto space-y-8 pb-20">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#1B365D]">AI Question Extractor</h2>
                <p className="text-gray-500 mt-1">Upload a scanned document or PDF to magically extract questions for your exam bank.</p>
              </div>

              {/* UPLOAD ZONE */}
              {!file && !isScanning && questions.length === 0 && (
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="border-3 border-dashed border-blue-200 bg-white rounded-3xl p-16 flex flex-col items-center justify-center text-center transition hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer shadow-sm group"
                  onClick={() => fileInputRef.current.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileSelect} 
                    accept="image/png, image/jpeg, application/pdf" 
                    className="hidden" 
                  />
                  <div className="bg-blue-100 p-6 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                    <UploadCloud size={48} className="text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-700 mb-2">Upload Question Paper</h2>
                  <p className="text-slate-500 max-w-md">Drag and drop your scanned quiz, photo of a textbook, or PDF here. The Sentinel AI will parse it instantly.</p>
                </div>
              )}

              {/* SCANNING ANIMATION */}
              {isScanning && (
                <div className="bg-white rounded-3xl p-16 flex flex-col items-center justify-center shadow-sm border border-slate-200">
                  <div className="relative w-64 h-80 bg-slate-100 rounded-lg overflow-hidden border border-slate-300 mb-8 shadow-inner">
                     {file && <img src={file} alt="Document" className="w-full h-full object-cover opacity-50 grayscale" />}
                     
                     <div className="absolute top-0 left-0 w-full h-1 bg-[#4ADE80] shadow-[0_0_20px_rgba(74,222,128,1)] animate-[scan_2s_ease-in-out_infinite]"></div>
                  </div>
                  <div className="flex items-center space-x-3 text-blue-600">
                    <Cpu className="animate-pulse" size={24} />
                    <h3 className="text-xl font-bold">Extracting text & formatting JSON...</h3>
                  </div>
                  <p className="text-slate-500 mt-2 text-sm">Our LLM is identifying question structures and potential options.</p>
                </div>
              )}

              {/* RESULTS UI */}
              {questions.length > 0 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-end bg-blue-50 border border-blue-100 p-6 rounded-2xl">
                    <div>
                      <div className="flex items-center space-x-2 text-emerald-600 font-bold mb-1">
                        <CheckCircle size={20} /> <span>Extraction Complete</span>
                      </div>
                      <p className="text-sm text-blue-800">Review the AI-generated questions below. You can edit them before saving.</p>
                    </div>
                    <button onClick={handleSaveToBank} className="bg-[#1B365D] hover:bg-blue-900 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg transition">
                      Save to Exam Bank
                    </button>
                  </div>

                  {questions.map((q, index) => (
                    <div key={q.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 relative group">
                      <button 
                        onClick={() => removeQuestion(q.id)}
                        className="absolute top-6 right-6 text-slate-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={20} />
                      </button>
                      
                      <div className="flex space-x-4">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 space-y-4">
                          <textarea 
                            value={q.q}
                            onChange={(e) => handleUpdateQuestion(q.id, 'q', e.target.value)}
                            className="w-full text-lg font-bold text-slate-800 border-none outline-none resize-none focus:ring-2 focus:ring-blue-100 rounded-lg p-2 transition -ml-2"
                            rows="2"
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {q.options.map((opt, optIdx) => (
                              <div key={optIdx} className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-100 focus-within:border-blue-300 focus-within:ring-1 focus-within:ring-blue-300 transition">
                                <input 
                                  type="radio" 
                                  name={`correct-${q.id}`} 
                                  checked={q.correct === optIdx}
                                  onChange={() => handleUpdateQuestion(q.id, 'correct', optIdx)}
                                  className="w-4 h-4 text-emerald-500 focus:ring-emerald-500"
                                />
                                <input 
                                  type="text"
                                  value={opt}
                                  onChange={(e) => handleUpdateQuestion(q.id, null, e.target.value, optIdx)}
                                  className="flex-1 bg-transparent border-none outline-none text-sm text-slate-600 focus:text-slate-900"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button className="w-full py-4 border-2 border-dashed border-slate-300 text-slate-500 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-50 hover:text-slate-700 transition">
                    <Plus size={20} /> <span>Add Blank Question</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 3. LIVE SESSIONS TAB */}
          {activeTab === 'LIVE SESSIONS' && (
            <div className="max-w-6xl mx-auto space-y-6 pb-20">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-[#1B365D]">Live Sessions</h2>
                  <p className="text-gray-500 mt-1">Monitoring 12 active students across 3 exams.</p>
                </div>
                <div className="flex space-x-3">
                  <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition flex items-center space-x-2">
                    <Filter size={16} /> <span>Filter</span>
                  </button>
                  <button className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 transition flex items-center space-x-2">
                    <AlertTriangle size={16} /> <span>High Risk Only</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {isLoadingApi ? (
                   <div className="col-span-full py-12 flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B365D]"></div>
                   </div>
                ) : (
                  liveSessions.map((student, i) => (
                  <div key={i} className={`bg-white rounded-2xl overflow-hidden border ${student.status === 'Critical' ? 'border-red-400 shadow-[0_0_15px_rgba(248,113,113,0.3)]' : student.status === 'Warning' ? 'border-amber-400' : 'border-gray-100'} shadow-sm relative group`}>
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 z-10 flex items-center space-x-1.5 bg-white/90 backdrop-blur px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm">
                      <div className={`w-2 h-2 rounded-full ${student.status === 'Secure' ? 'bg-emerald-500' : student.status === 'Warning' ? 'bg-amber-500' : 'bg-red-500 animate-pulse'}`}></div>
                      <span className={student.status === 'Secure' ? 'text-emerald-700' : student.status === 'Warning' ? 'text-amber-700' : 'text-red-700'}>{student.status}</span>
                    </div>

                    {/* Camera Feed Placeholder */}
                    <div className="h-36 bg-gray-900 relative">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.img}&backgroundColor=c0aede`} alt="feed" className="w-full h-full object-cover opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 text-white text-xs font-medium flex items-center space-x-2">
                         <Clock size={12} /> <span>{student.time}</span>
                      </div>
                      
                      {/* Hover Actions */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3 backdrop-blur-sm">
                        <button onClick={() => setActiveLiveStream(student.name)} className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-500 transition"><Eye size={18} /></button>
                        <button className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-200 transition"><MoreVertical size={18} /></button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-[#1B365D] text-sm truncate">{student.name}</h3>
                          <p className="text-xs text-gray-500">{student.exam}</p>
                        </div>
                        {student.flags > 0 && (
                          <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center">
                             {student.flags} Flags
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )))}
              </div>
            </div>
          )}

          {/* 4. EXAM LIBRARY TAB */}
          {activeTab === 'EXAM LIBRARY' && (
            <div className="max-w-6xl mx-auto space-y-8 pb-20">
               <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-[#1B365D]">Exam Library</h2>
                    <p className="text-gray-500 mt-1">Manage your created exams and drafts.</p>
                  </div>
                  <button className="bg-[#1B365D] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#15294a] transition shadow-md flex items-center space-x-2" onClick={handleScheduleExam}>
                     <Plus size={16} /> <span>Create New Exam</span>
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[
                   { title: "Advanced Cloud Architecture", code: "CS-402", date: "Oct 12, 2024", duration: "60 Min", questions: 45, status: "Active", color: "blue" },
                   { title: "Genetics Midterm", code: "BIO-211", date: "Oct 14, 2024", duration: "90 Min", questions: 60, status: "Scheduled", color: "emerald" },
                   { title: "Calculus III Final", code: "MATH-301", date: "Nov 02, 2024", duration: "120 Min", questions: 100, status: "Draft", color: "slate" },
                   { title: "Introduction to Psychology", code: "PSY-101", date: "Sep 28, 2024", duration: "45 Min", questions: 30, status: "Completed", color: "gray" },
                 ].map((exam, i) => (
                   <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition group">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl bg-${exam.color}-50 text-${exam.color}-600`}>
                          <FileText size={24} />
                        </div>
                        <button className="text-gray-400 hover:text-gray-700 transition"><MoreVertical size={20}/></button>
                      </div>
                      <h3 className="font-bold text-[#1B365D] text-lg mb-1 line-clamp-1">{exam.title}</h3>
                      <p className="text-xs text-gray-500 mb-4 font-medium">{exam.code}</p>
                      
                      <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs mb-6">
                         <div className="flex items-center space-x-2 text-gray-600"><Calendar size={14} className="text-gray-400"/> <span>{exam.date}</span></div>
                         <div className="flex items-center space-x-2 text-gray-600"><Clock size={14} className="text-gray-400"/> <span>{exam.duration}</span></div>
                         <div className="flex items-center space-x-2 text-gray-600"><List size={14} className="text-gray-400"/> <span>{exam.questions} Qs</span></div>
                         <div className="flex items-center space-x-2 text-gray-600"><Shield size={14} className="text-gray-400"/> <span className="text-[#10B981] font-medium">Proctored</span></div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md ${
                          exam.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                          exam.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                          exam.status === 'Completed' ? 'bg-gray-100 text-gray-600' : 'bg-slate-100 text-slate-600'
                        }`}>{exam.status}</span>
                        
                        <div className="flex space-x-2">
                           <button className="p-1.5 text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded transition"><Edit size={16}/></button>
                           {exam.status === 'Draft' && <button className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded transition"><Trash2 size={16}/></button>}
                        </div>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* 5. INTEGRITY REPORTS TAB */}
          {activeTab === 'INTEGRITY REPORTS' && (
            <div className="max-w-5xl mx-auto space-y-6 pb-20">
               <div className="mb-6">
                  <h2 className="text-3xl font-bold text-[#1B365D]">Integrity Reports</h2>
                  <p className="text-gray-500 mt-1">Review AI-flagged incidents and session analytics.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
                     <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl"><Shield size={24}/></div>
                     <div>
                       <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Overall Score</p>
                       <h3 className="text-2xl font-bold text-[#1B365D]">98.4%</h3>
                     </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
                     <div className="p-4 bg-red-50 text-red-600 rounded-xl"><AlertTriangle size={24}/></div>
                     <div>
                       <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Critical Flags</p>
                       <h3 className="text-2xl font-bold text-[#1B365D]">24</h3>
                     </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
                     <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><MonitorPlay size={24}/></div>
                     <div>
                       <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Sessions Monitored</p>
                       <h3 className="text-2xl font-bold text-[#1B365D]">8,421</h3>
                     </div>
                  </div>
               </div>

               <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                     <h3 className="font-bold text-[#1B365D]">Recent Flagged Incidents</h3>
                     <button className="text-sm text-blue-600 font-semibold hover:underline">View All</button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {isLoadingApi ? (
                       <div className="py-12 flex justify-center items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B365D]"></div>
                       </div>
                    ) : (
                      incidents.map((incident, i) => (
                       <div key={i} className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition">
                          <div className="flex items-center space-x-4">
                             <div className={`w-2 h-10 rounded-full bg-${incident.color}-500`}></div>
                             <div>
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-bold text-[#1B365D]">{incident.student}</h4>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-${incident.color}-100 text-${incident.color}-700`}>{incident.severity}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{incident.type} &bull; <span className="text-gray-400">{incident.exam}</span></p>
                             </div>
                          </div>
                          <div className="flex flex-col items-end">
                             <span className="text-xs text-gray-400 mb-2">{incident.time}</span>
                             <div className="flex space-x-2">
                               <button className="text-xs font-semibold bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">Dismiss</button>
                               <button onClick={() => handleReviewVideo(incident.videoUrl)} className="text-xs font-bold text-white bg-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-700 transition shadow-sm">Review Video</button>
                             </div>
                          </div>
                       </div>
                    )))}
                  </div>
               </div>
            </div>
          )}

          {/* 6. SETTINGS TAB */}
          {activeTab === 'SETTINGS' && (
            <div className="max-w-4xl mx-auto space-y-8 pb-20">
               <div>
                  <h2 className="text-3xl font-bold text-[#1B365D]">Settings</h2>
                  <p className="text-gray-500 mt-1">Manage your account and proctoring preferences.</p>
               </div>

               <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                     <h3 className="text-lg font-bold text-[#1B365D] mb-4">Profile Information</h3>
                     <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 rounded-full bg-blue-100 overflow-hidden border-2 border-white shadow-md relative group cursor-pointer">
                           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Instructor" alt="avatar" />
                           <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><Edit size={20} className="text-white"/></div>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-4">
                           <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                             <input type="text" defaultValue="Dr. Aris Vance" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-[#1B365D] outline-none focus:ring-2 focus:ring-blue-100 transition" />
                           </div>
                           <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</label>
                             <input type="email" defaultValue="aris.vance@university.edu" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-[#1B365D] outline-none focus:ring-2 focus:ring-blue-100 transition" />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="p-6 border-b border-gray-100">
                     <h3 className="text-lg font-bold text-[#1B365D] mb-4">AI Proctoring Strictness</h3>
                     <div className="space-y-4">
                        {[
                          { title: "Face Detection Sensitivity", desc: "How quickly to flag if a face is not visible.", level: "High" },
                          { title: "Audio Monitoring", desc: "Flag background noises and speaking.", level: "Medium" },
                          { title: "Browser Lockdown", desc: "Prevent tab switching and copy/paste.", level: "Strict" },
                        ].map((setting, i) => (
                           <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                              <div>
                                 <h4 className="font-bold text-[#1B365D] text-sm">{setting.title}</h4>
                                 <p className="text-xs text-gray-500 mt-0.5">{setting.desc}</p>
                              </div>
                              <select className="bg-white border border-gray-200 text-sm font-semibold text-[#1B365D] rounded-lg px-3 py-1.5 outline-none cursor-pointer shadow-sm">
                                <option>{setting.level}</option>
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                              </select>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="p-6 bg-gray-50/50 flex justify-end">
                     <button className="bg-[#1B365D] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#15294a] transition shadow-md">Save Changes</button>
                  </div>
               </div>
            </div>
          )}

          {/* 7. USER MANAGEMENT TAB */}
          {activeTab === 'USER MANAGEMENT' && (
            <div className="max-w-6xl mx-auto space-y-6 pb-20">
               <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-[#1B365D]">User Management</h2>
                    <p className="text-gray-500 mt-1">Manage 1,482 enrolled students across your courses.</p>
                  </div>
                  <button className="bg-[#10B981] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-600 transition shadow-md flex items-center space-x-2">
                     <Plus size={16} /> <span>Invite Students</span>
                  </button>
               </div>

               <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                     <div className="relative">
                        <input type="text" placeholder="Search students by name or ID..." className="bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm w-80 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition" />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                     </div>
                     <button className="text-gray-500 hover:text-gray-800 bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm font-semibold shadow-sm flex items-center space-x-2">
                        <Filter size={16} /> <span>Filter by Course</span>
                     </button>
                  </div>
                  
                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr className="bg-white border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                              <th className="p-4 pl-6">Student Name</th>
                              <th className="p-4">Student ID</th>
                              <th className="p-4">Courses</th>
                              <th className="p-4">Status</th>
                              <th className="p-4 pr-6 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {[
                             { name: "Alex Johnson", id: "S-10924", courses: 2, status: "Active" },
                             { name: "Maria Garcia", id: "S-10925", courses: 1, status: "Active" },
                             { name: "James Wilson", id: "S-10926", courses: 3, status: "Suspended" },
                             { name: "Sophia Lee", id: "S-10927", courses: 2, status: "Active" },
                             { name: "Liam Brown", id: "S-10928", courses: 1, status: "Pending" },
                          ].map((student, i) => (
                             <tr key={i} className="hover:bg-gray-50/50 transition">
                                <td className="p-4 pl-6 flex items-center space-x-3">
                                   <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden border border-gray-200">
                                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} alt="avatar" />
                                   </div>
                                   <span className="text-sm font-bold text-[#1B365D]">{student.name}</span>
                                </td>
                                <td className="p-4 text-sm font-medium text-gray-600">{student.id}</td>
                                <td className="p-4 text-sm font-medium text-gray-600">{student.courses} Courses</td>
                                <td className="p-4">
                                   <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-md ${
                                     student.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                                     student.status === 'Suspended' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                   }`}>{student.status}</span>
                                </td>
                                <td className="p-4 pr-6 text-right">
                                   <button className="text-gray-400 hover:text-[#1B365D] p-1.5 rounded transition"><MoreVertical size={18}/></button>
                                </td>
                             </tr>
                          ))}
                      </tbody>
                  </table>
                  <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                     <span>Showing 1 to 5 of 1,482 entries</span>
                     <div className="flex space-x-1">
                        <button className="px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50">Prev</button>
                        <button className="px-3 py-1 bg-[#1B365D] text-white rounded-md">1</button>
                        <button className="px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50">2</button>
                        <button className="px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50">Next</button>
                     </div>
                  </div>
               </div>
            </div>
          )}

        </div>
      </main>
      
      {/* Required for the scanning animation */}
      <style>{`
        @keyframes scan {
          0% { top: -5%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 105%; opacity: 0; }
        }
      `}</style>

      {activeLiveStream && (
        <LiveStreamPlayer 
          channelName={activeLiveStream} 
          onClose={() => setActiveLiveStream(null)} 
        />
      )}
    </div>
  );
}; // <-- THE COMPONENT CLOSES PERFECTLY HERE NOW

// NavItem Component
const NavItem = ({ icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer transition mb-1 ${active ? 'bg-blue-50 text-[#1B365D] font-bold shadow-sm border border-blue-100/50' : 'text-gray-500 hover:bg-gray-50 hover:text-[#1B365D] font-semibold'}`}
  >
    <div className={active ? "text-[#1B365D]" : "text-gray-400"}>{icon}</div>
    <span className="text-xs tracking-wider">{label}</span>
  </div>
);

export default InstructorDashboard;