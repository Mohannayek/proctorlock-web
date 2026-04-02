import React, { useState, useEffect } from 'react';
import { 
  Shield, LayoutGrid, Video, Library, BarChart2, Settings, Users, 
  Bell, HelpCircle, Lock, ArrowRight, Clock, Layers, History, Menu, X 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('Student'); 
  const [recentExam, setRecentExam] = useState(null); 

  useEffect(() => {
    // Auth Check
    const savedUser = localStorage.getItem('proctorlock_user');
    if (savedUser) {
      const userObj = JSON.parse(savedUser);
      setUserName(userObj.fullName || 'Student'); 
    } else {
      navigate('/');
    }

    // Check for recent exam results
    const savedExam = localStorage.getItem('recent_exam');
    if (savedExam) {
      setRecentExam(JSON.parse(savedExam));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('proctorlock_user');
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col justify-between 
        transition-transform duration-300 transform lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <div className="bg-[#1B365D] p-2 rounded-lg"><Shield className="text-white" size={20} /></div>
                <h2 className="text-[#1B365D] font-bold text-lg">The Sentinel</h2>
            </div>
            <button className="lg:hidden text-gray-500" onClick={() => setIsSidebarOpen(false)}><X size={24}/></button>
          </div>

          <nav className="mt-2 px-4 space-y-1">
            <NavItem icon={<LayoutGrid size={18}/>} label="OVERVIEW" active={activeTab === 'OVERVIEW'} onClick={() => {setActiveTab('OVERVIEW'); setIsSidebarOpen(false);}} />
            <NavItem icon={<Video size={18}/>} label="LIVE SESSIONS" active={activeTab === 'LIVE SESSIONS'} onClick={() => {setActiveTab('LIVE SESSIONS'); setIsSidebarOpen(false);}} />
            <NavItem icon={<Library size={18}/>} label="EXAM LIBRARY" active={activeTab === 'EXAM LIBRARY'} onClick={() => {setActiveTab('EXAM LIBRARY'); setIsSidebarOpen(false);}} />
            <NavItem icon={<BarChart2 size={18}/>} label="REPORTS" active={activeTab === 'INTEGRITY REPORTS'} onClick={() => {setActiveTab('INTEGRITY REPORTS'); setIsSidebarOpen(false);}} />
            <NavItem icon={<Settings size={18}/>} label="SETTINGS" active={activeTab === 'SETTINGS'} onClick={() => {setActiveTab('SETTINGS'); setIsSidebarOpen(false);}} />
          </nav>
        </div>

        <div onClick={handleLogout} className="p-6 mb-4 text-xs font-semibold text-gray-400 flex items-center space-x-2 cursor-pointer hover:text-red-500 transition">
           <X size={16} /> <span>LOG OUT</span>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-4">
            <button className="lg:hidden text-[#1B365D]" onClick={() => setIsSidebarOpen(true)}>
                <Menu size={24} />
            </button>
            <span className="text-xl font-bold text-[#1B365D]">Proctorlock</span>
            <nav className="hidden lg:flex space-x-6 text-sm font-medium ml-6">
               <span className="text-[#1B365D] border-b-2 border-[#1B365D] pb-5 -mb-5">Dashboard</span>
               <span className="text-gray-500">Support</span>
            </nav>
          </div>
          <div className="flex items-center space-x-3 lg:space-x-5">
             <Bell className="text-gray-400" size={20} />
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} 
                  alt={userName} 
                  className="w-8 h-8 rounded-full border border-gray-200 bg-blue-50" 
             />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'OVERVIEW' && (
            <>
              <div className="mb-6">
                  <h1 className="text-2xl lg:text-3xl font-bold text-[#1B365D]">Welcome, {userName.split(' ')[0]}</h1>
                  <p className="text-sm text-gray-500 mt-1">Exam in <span className="font-bold text-[#10B981]">2 days</span>.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  
                  {/* Hero Card */}
                  <div className="lg:col-span-2 bg-[#1B365D] rounded-2xl lg:rounded-3xl p-6 lg:p-8 text-white relative overflow-hidden shadow-lg min-h-55 flex flex-col justify-between">
                      <div className="relative z-10">
                          <h2 className="text-2xl lg:text-3xl font-bold mb-2">Ready to validate your skills?</h2>
                          <p className="text-blue-100/80 text-xs lg:text-sm mb-6">Advanced Cloud Architecture Assessment</p>
                          <button 
                              onClick={() => navigate('/verification')}
                            className="bg-[#4ADE80] hover:bg-[#34d399] text-[#1B365D] px-5 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2 transition"
                          >
                              <span>Start Exam</span> <ArrowRight size={16} />
                          </button>
                      </div>
                  </div>

                  {/* Dynamic Results Card */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
                      <h3 className="text-lg font-bold text-[#1B365D] mb-4">Recent Results</h3>
                      
                      {recentExam ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600 truncate mr-2">{recentExam.name}</span>
                                <span className="text-sm font-bold text-[#10B981]">{recentExam.score}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className="bg-[#10B981] h-full rounded-full transition-all duration-1000 ease-out" 
                                  style={{ width: `${recentExam.score}%` }}
                                ></div>
                            </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center flex-1 py-4 opacity-70">
                            <BarChart2 className="text-gray-300 mb-2" size={32} />
                            <p className="text-sm text-gray-400 font-medium">No exams completed yet.</p>
                        </div>
                      )}
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <PrepCard icon={<Clock size={20}/>} title="Mock Tests" color="bg-blue-50" textColor="text-blue-600" />
                  <PrepCard icon={<Layers size={20}/>} title="Question Bank" color="bg-emerald-50" textColor="text-emerald-600" />
                  <PrepCard icon={<History size={20}/>} title="PYQs" color="bg-indigo-50" textColor="text-indigo-600" />
              </div>
            </>
          )}

          {activeTab !== 'OVERVIEW' && (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center p-6 border-2 border-dashed border-gray-200 rounded-3xl">
              <Settings size={32} className="text-gray-400 mb-4" />
              <p className="text-gray-500">{activeTab} content goes here.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Sub-components
const NavItem = ({ icon, label, active, onClick }) => (
  <div onClick={onClick} className={`flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer transition ${active ? 'bg-blue-50 text-[#1B365D] font-bold' : 'text-gray-500 hover:bg-gray-50'}`}>
    {icon} <span className="text-xs tracking-wider uppercase">{label}</span>
  </div>
);

const PrepCard = ({ icon, title, color, textColor }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
      <div className={`${color} ${textColor} p-3 rounded-lg`}>{icon}</div>
      <h4 className="font-bold text-[#1B365D] text-sm">{title}</h4>
  </div>
);

export default StudentDashboard;