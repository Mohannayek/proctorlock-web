import React, { useState } from 'react';
import { Shield, LayoutGrid, Video, Library, BarChart2, Settings, Users, Bell, HelpCircle, Eye, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  // 1. Add State for the Sidebar Navigation
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  // 2. Add State for the Search Bar
  const [searchQuery, setSearchQuery] = useState('');

  // Placeholder function for the Schedule Exam button
  const handleScheduleExam = () => {
    alert("This will open the 'Create Exam' modal in the next phase!");
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between h-full z-10">
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

        <div className="p-6 space-y-4">
          <button 
            onClick={handleScheduleExam}
            className="w-full bg-[#1B365D] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#15294a] transition shadow-md flex justify-center items-center space-x-2"
          >
            <span className="text-lg leading-none">+</span> <span>SCHEDULE NEW EXAM</span>
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
               <span className="text-[#1B365D] border-b-2 border-[#1B365D] pb-5 -mb-5 cursor-pointer">Dashboard</span>
               <span className="text-gray-500 hover:text-gray-800 cursor-pointer transition" onClick={() => setActiveTab('EXAM LIBRARY')}>Exams</span>
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
          
          {/* Conditional Rendering based on activeTab */}
          {activeTab === 'OVERVIEW' && (
            <>
              {/* Dashboard Title & Actions */}
              <div className="flex items-center justify-between mb-8">
                  <div>
                      <h1 className="text-3xl font-bold text-[#1B365D]">Instructor Dashboard</h1>
                      <p className="text-gray-500 mt-1">Welcome back, Dr. Aris. 12 exams are currently live.</p>
                  </div>
                  <div className="flex space-x-4">
                      <button className="bg-blue-50 text-[#1B365D] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-100 transition flex items-center space-x-2" onClick={() => setActiveTab('EXAM LIBRARY')}>
                          <Library size={16} /> <span>Question Bank</span>
                      </button>
                      <button className="bg-[#1B365D] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#15294a] transition shadow-md" onClick={handleScheduleExam}>
                          Create New Exam
                      </button>
                  </div>
              </div>

              {/* The Core Layout: Left Main Column & Right Alerts Column */}
              <div className="flex gap-8">

                  {/* CENTER COLUMN: Stats & Tables */}
                  <div className="flex-1 min-w-0">
                      
                      {/* Row 1: Top Stat Cards */}
                      <div className="grid grid-cols-3 gap-6 mb-8">
                          {/* Card 1 */}
                          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer">
                              <div className="flex justify-between items-start mb-4">
                                  <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Total Students</p>
                                  <div className="bg-blue-50 p-1.5 rounded-lg text-blue-500"><Users size={16}/></div>
                              </div>
                              <h2 className="text-4xl font-bold text-[#1B365D] mb-2">1,482</h2>
                              <p className="text-xs text-[#10B981] font-medium flex items-center"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> 12% from last term</p>
                          </div>
                          
                          {/* Card 2 */}
                          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => setActiveTab('EXAM LIBRARY')}>
                              <div className="flex justify-between items-start mb-4">
                                  <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Exams Completed</p>
                                  <div className="bg-blue-50 p-1.5 rounded-lg text-blue-500"><LayoutGrid size={16}/></div>
                              </div>
                              <h2 className="text-4xl font-bold text-[#1B365D] mb-2">843</h2>
                              <p className="text-xs text-gray-400 font-medium">On track for semester goals</p>
                          </div>
                          
                          {/* Card 3 */}
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
                                      {/* Secure Student Row */}
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
                                      
                                      {/* Flagged Student Row */}
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

                      {/* Warning Card */}
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

                      {/* System Load Widget */}
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

          {/* Placeholder for other tabs */}
          {activeTab !== 'OVERVIEW' && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white/50">
              <div className="bg-blue-50 text-[#1B365D] p-4 rounded-full mb-4">
                <Settings size={32} />
              </div>
              <h2 className="text-2xl font-bold text-[#1B365D] mb-2">{activeTab} Module</h2>
              <p className="text-gray-500 max-w-md">This section is currently under development. Data will be populated from AWS DynamoDB in the next phase.</p>
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

// Updated NavItem to accept onClick handler
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