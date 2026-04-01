import React, { useState } from 'react';
import { 
  Shield, LayoutGrid, Video, Library, BarChart2, Settings, Users, 
  Bell, HelpCircle, Lock, ArrowRight, Clock, Layers, History 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();
  // 1. Add State for the Sidebar Navigation
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  // 2. Add State for the Search Bar
  const [searchQuery, setSearchQuery] = useState('');

  // Handlers for button clicks
  const handleLogout = () => {
    navigate('/');
  };

  const handleStartExam = () => {
    alert("Initiating secure browser lockdown for Advanced Cloud Architecture...");
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between h-full z-10">
        <div>
          {/* Logo Area - Clicks back to Overview */}
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

          {/* Navigation - Now powered by State */}
          <nav className="mt-2 px-4 space-y-1">
            <NavItem icon={<LayoutGrid size={18}/>} label="OVERVIEW" active={activeTab === 'OVERVIEW'} onClick={() => setActiveTab('OVERVIEW')} />
            <NavItem icon={<Video size={18}/>} label="LIVE SESSIONS" active={activeTab === 'LIVE SESSIONS'} onClick={() => setActiveTab('LIVE SESSIONS')} />
            <NavItem icon={<Library size={18}/>} label="EXAM LIBRARY" active={activeTab === 'EXAM LIBRARY'} onClick={() => setActiveTab('EXAM LIBRARY')} />
            <NavItem icon={<BarChart2 size={18}/>} label="INTEGRITY REPORTS" active={activeTab === 'INTEGRITY REPORTS'} onClick={() => setActiveTab('INTEGRITY REPORTS')} />
            <NavItem icon={<Settings size={18}/>} label="SETTINGS" active={activeTab === 'SETTINGS'} onClick={() => setActiveTab('SETTINGS')} />
            <NavItem icon={<Users size={18}/>} label="USER MANAGEMENT" active={activeTab === 'USER MANAGEMENT'} onClick={() => setActiveTab('USER MANAGEMENT')} />
          </nav>
        </div>

        {/* Log Out Button */}
        <div 
            onClick={handleLogout}
            className="p-6 mb-4 text-xs font-semibold text-gray-400 flex items-center justify-center space-x-2 cursor-pointer hover:text-red-500 transition"
        >
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
           <span>LOG OUT</span>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Header Navigation */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-[#1B365D] mr-6">Proctorlock</span>
            <nav className="flex space-x-6 text-sm font-medium">
               <span className="text-[#1B365D] border-b-2 border-[#1B365D] pb-5 -mb-5 cursor-pointer">Dashboard</span>
               <span className="text-gray-500 hover:text-gray-800 cursor-pointer transition" onClick={() => setActiveTab('EXAM LIBRARY')}>Exams</span>
               <span className="text-gray-500 hover:text-gray-800 cursor-pointer transition" onClick={() => alert("Loading Support Docs...")}>Support</span>
            </nav>
          </div>
          <div className="flex items-center space-x-5">
             <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search resources..." 
                  className="bg-gray-100/80 rounded-full pl-10 pr-4 py-2 text-sm w-72 outline-none focus:ring-2 focus:ring-blue-100 transition" 
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-4 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>
             <Bell className="text-gray-400 cursor-pointer hover:text-[#1B365D] transition" size={20} onClick={() => alert("No new notifications")} />
             <Lock className="text-gray-400 cursor-pointer hover:text-[#10B981] transition" size={20} onClick={() => alert("Privacy settings active")} />
             <HelpCircle className="text-gray-400 cursor-pointer hover:text-[#1B365D] transition" size={20} />
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander" alt="Alexander" className="w-8 h-8 rounded-full cursor-pointer shadow-sm border border-gray-200 bg-blue-50 hover:ring-2 hover:ring-blue-300 transition" />
          </div>
        </header>

        {/* Scrollable Dashboard Workspace */}
        <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full">
          
          {/* Conditional Rendering based on activeTab */}
          {activeTab === 'OVERVIEW' && (
            <>
              {/* Welcome Text */}
              <div className="mb-8">
                  <h1 className="text-3xl font-bold text-[#1B365D]">Welcome back, Alexander</h1>
                  <p className="text-gray-500 mt-1">Your next scheduled certification is in <span className="font-bold text-[#10B981]">2 days, 4 hours</span>.</p>
              </div>

              {/* Top Row: Hero Card & Recent Results */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                  
                  {/* Hero Action Card */}
                  <div className="lg:col-span-2 bg-[#1B365D] rounded-3xl p-8 text-white relative overflow-hidden shadow-lg flex flex-col justify-between min-h-[280px]">
                      {/* Abstract Background Decoration */}
                      <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                          <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><path fill="#ffffff" d="M43.5,-75.2C54.6,-66.1,60.6,-49.6,67.3,-33.8C73.9,-18,81.1,-2.9,80.6,12C80.1,26.9,71.8,41.5,60.3,51.8C48.8,62.1,34.1,68.1,18.9,72.4C3.7,76.6,-12,79.1,-26.8,75C-41.5,70.9,-55.4,60.3,-64.1,47C-72.9,33.7,-76.6,17.7,-77.2,1.6C-77.8,-14.5,-75.3,-30.7,-66.9,-43.5C-58.4,-56.3,-44,-65.7,-30.2,-72.6C-16.3,-79.6,-2.9,-84.1,10.6,-85.1C24,-86.2,32.4,-84.3,43.5,-75.2Z" transform="translate(200 200) scale(1.2)" /></svg>
                      </div>

                      <div className="relative z-10 flex justify-between items-start mb-6">
                          <span className="bg-white/10 border border-white/20 text-white text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider backdrop-blur-sm">Next Steps</span>
                          <span className="flex items-center bg-white/10 border border-white/20 text-white text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider backdrop-blur-sm">
                              <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full mr-2"></div> System Secure
                          </span>
                      </div>

                      <div className="relative z-10 max-w-md">
                          <h2 className="text-3xl font-bold mb-3 leading-tight">Ready to validate your<br/>skills today?</h2>
                          <p className="text-blue-100/80 text-sm mb-8">Take the Advanced Cloud Architecture assessment now. Full proctoring enabled.</p>
                          
                          <button 
                            onClick={handleStartExam}
                            className="bg-[#4ADE80] text-[#1B365D] px-6 py-3 rounded-xl font-bold hover:bg-[#3bce6b] transition flex items-center space-x-2 shadow-md"
                          >
                              <span>Start New Exam</span> <ArrowRight size={18} />
                          </button>
                      </div>
                  </div>

                  {/* Recent Results Card */}
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col">
                      <div className="flex justify-between items-center mb-6">
                          <h3 className="text-lg font-bold text-[#1B365D]">Recent Results</h3>
                          <span onClick={() => setActiveTab('INTEGRITY REPORTS')} className="cursor-pointer text-[10px] font-bold text-[#1B365D] hover:underline uppercase tracking-wider">View All</span>
                      </div>
                      <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">Latest Evaluations</p>

                      <div className="space-y-5 flex-1 flex flex-col justify-center">
                          {/* Result 1 */}
                          <div className="flex items-center space-x-4 cursor-pointer hover:bg-gray-50 p-2 -ml-2 rounded-lg transition">
                              <div className="bg-blue-50 p-3 rounded-xl text-blue-600 shrink-0"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg></div>
                              <div className="flex-1">
                                  <div className="flex justify-between text-sm mb-1">
                                      <span className="font-bold text-[#1B365D]">Data Structures</span>
                                      <span className="font-bold text-[#10B981]">92%</span>
                                  </div>
                                  <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-[#10B981] h-1.5 rounded-full" style={{ width: '92%' }}></div></div>
                              </div>
                          </div>

                          {/* Result 2 */}
                          <div className="flex items-center space-x-4 cursor-pointer hover:bg-gray-50 p-2 -ml-2 rounded-lg transition">
                              <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 shrink-0"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg></div>
                              <div className="flex-1">
                                  <div className="flex justify-between text-sm mb-1">
                                      <span className="font-bold text-[#1B365D]">Machine Learning</span>
                                      <span className="font-bold text-[#1B365D]">78%</span>
                                  </div>
                                  <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-[#1B365D] h-1.5 rounded-full" style={{ width: '78%' }}></div></div>
                              </div>
                          </div>

                          {/* Result 3 */}
                          <div className="flex items-center space-x-4 cursor-pointer hover:bg-gray-50 p-2 -ml-2 rounded-lg transition">
                              <div className="bg-gray-50 p-3 rounded-xl text-gray-400 shrink-0"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                              <div className="flex-1">
                                  <div className="flex justify-between text-sm mb-1">
                                      <span className="font-bold text-gray-500">DevOps Practices</span>
                                      <span className="font-bold text-gray-400 text-xs">Pending</span>
                                  </div>
                                  <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-gray-300 h-1.5 rounded-full" style={{ width: '45%' }}></div></div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Preparation Center Section */}
              <div className="mb-8">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-[#1B365D]">Preparation Center</h3>
                      <div className="flex space-x-2 border-t border-gray-200 flex-1 ml-6 mr-6 mt-2"></div>
                      <div className="flex space-x-2">
                          <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
                          <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-[#1B365D] hover:bg-gray-50 transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Card 1 */}
                      <div onClick={() => setActiveTab('EXAM LIBRARY')} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer hover:border-blue-100">
                          <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-[#1B365D] mb-5">
                              <Clock size={24} />
                          </div>
                          <h4 className="font-bold text-[#1B365D] mb-2">Mock Tests</h4>
                          <p className="text-sm text-gray-500 leading-relaxed">Simulate real exam conditions with timed sessions and AI monitoring environment.</p>
                      </div>
                      
                      {/* Card 2 */}
                      <div onClick={() => alert("Loading Question Bank...")} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer hover:border-emerald-100">
                          <div className="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center text-[#10B981] mb-5">
                              <Layers size={24} />
                          </div>
                          <h4 className="font-bold text-[#1B365D] mb-2">Question Bank</h4>
                          <p className="text-sm text-gray-500 leading-relaxed">Browse over 10,000 curated questions categorized by difficulty and topic complexity.</p>
                      </div>

                      {/* Card 3 */}
                      <div onClick={() => alert("Loading Previous Year Data...")} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer hover:border-indigo-100">
                          <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center text-indigo-600 mb-5">
                              <History size={24} />
                          </div>
                          <h4 className="font-bold text-[#1B365D] mb-2">Previous Year Questions</h4>
                          <p className="text-sm text-gray-500 leading-relaxed">Analyze trends and patterns from historical exams to optimize your study strategy.</p>
                      </div>
                  </div>
              </div>

              {/* Integrity Score Footer */}
              <div onClick={() => setActiveTab('INTEGRITY REPORTS')} className="bg-[#EBF1FA] rounded-3xl p-6 border border-blue-100 flex items-center justify-between border-l-8 border-l-[#10B981] cursor-pointer hover:shadow-md transition">
                  <div className="flex items-center space-x-5">
                      <div className="bg-white p-3 rounded-2xl shadow-sm text-[#10B981]">
                          <Shield size={28} />
                      </div>
                      <div>
                          <h3 className="text-lg font-bold text-[#1B365D]">Your Integrity Score: 98%</h3>
                          <p className="text-sm text-gray-500">Maintained excellent proctoring adherence across 12 recent sessions.</p>
                      </div>
                  </div>
                  
                  <div className="flex items-center space-x-12 pr-6">
                      <div className="text-center">
                          <p className="text-2xl font-bold text-[#1B365D]">24</p>
                          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Completed</p>
                      </div>
                      <div className="text-center">
                          <p className="text-2xl font-bold text-[#1B365D]">02</p>
                          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Flags</p>
                      </div>
                      <div className="text-center">
                          <p className="text-2xl font-bold text-[#1B365D]">156h</p>
                          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Total Study</p>
                      </div>
                  </div>
              </div>
            </>
          )}

          {/* Placeholder for other tabs (Same as Instructor Dashboard) */}
          {activeTab !== 'OVERVIEW' && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white/50">
              <div className="bg-blue-50 text-[#1B365D] p-4 rounded-full mb-4">
                <Settings size={32} />
              </div>
              <h2 className="text-2xl font-bold text-[#1B365D] mb-2">{activeTab} Module</h2>
              <p className="text-gray-500 max-w-md">This section is currently under development. You will connect this to AWS DynamoDB to fetch user-specific data later.</p>
              <button 
                onClick={() => setActiveTab('OVERVIEW')}
                className="mt-6 px-6 py-2 bg-white border border-gray-200 text-[#1B365D] font-bold rounded-xl hover:bg-gray-50 transition shadow-sm"
              >
                Return to Overview
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

// Reusable Sidebar Nav Item Component
const NavItem = ({ icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer transition mb-1 ${active ? 'bg-blue-50 text-[#1B365D] font-bold shadow-sm border border-blue-100/50' : 'text-gray-500 hover:bg-gray-50 hover:text-[#1B365D] font-semibold'}`}
  >
    <div className={active ? "text-[#1B365D]" : "text-gray-400"}>{icon}</div>
    <span className="text-xs tracking-wider">{label}</span>
  </div>
);

export default StudentDashboard;