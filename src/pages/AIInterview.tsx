import React, { useState } from 'react';
import { 
  Bot, 
  Mic, 
  Video, 
  Settings, 
  Play, 
  Square, 
  MessageSquare, 
  Code2, 
  Layout, 
  ChevronRight,
  CheckCircle2,
  Clock,
  BarChart
} from 'lucide-react';

export default function AIInterview() {
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Software Engineer');
  const [selectedCompany, setSelectedCompany] = useState('Google');
  const [selectedType, setSelectedType] = useState('Behavioral');

  const roles = ['Software Engineer', 'Product Manager', 'Data Scientist', 'UI/UX Designer', 'Quantitative Analyst'];
  const companies = ['Google', 'Meta', 'Amazon', 'Apple', 'Netflix', 'Microsoft', 'TikTok', 'Jane Street'];
  const types = [
    { id: 'Behavioral', name: '行为面试 (BQ)', icon: MessageSquare, desc: '考察领导力、团队协作与冲突解决' },
    { id: 'Technical', name: '算法与数据结构', icon: Code2, desc: 'LeetCode 风格的算法题与代码实现' },
    { id: 'SystemDesign', name: '系统设计', icon: Layout, desc: '高并发、分布式系统架构设计' }
  ];

  if (isInterviewStarted) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex flex-col">
        {/* Interview Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Bot className="text-primary w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-deep">AI Interviewer - {selectedCompany}</h2>
              <p className="text-sm text-gray-500">{selectedRole} • {selectedType} Interview</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-red-500 bg-red-50 px-3 py-1.5 rounded-full text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span>Recording</span>
            </div>
            <span className="text-gray-500 font-mono text-sm">00:14:32</span>
            <button 
              onClick={() => setIsInterviewStarted(false)}
              className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <Square className="w-4 h-4" />
              <span>End Interview</span>
            </button>
          </div>
        </div>

        {/* Interview Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Video & Transcript */}
          <div className="w-1/3 flex flex-col border-r border-gray-200 bg-white">
            {/* AI Video Placeholder */}
            <div className="h-64 bg-gray-900 relative flex items-center justify-center shrink-0">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary to-transparent"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-800 rounded-full border-4 border-primary/30 flex items-center justify-center mb-4 relative">
                  <Bot className="w-12 h-12 text-primary" />
                  {/* Voice wave animation */}
                  <div className="absolute -inset-4 border border-primary/20 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                  <div className="absolute -inset-8 border border-primary/10 rounded-full animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-1 h-3 bg-primary rounded-full animate-pulse"></span>
                  <span className="w-1 h-5 bg-primary rounded-full animate-pulse delay-75"></span>
                  <span className="w-1 h-4 bg-primary rounded-full animate-pulse delay-150"></span>
                  <span className="w-1 h-6 bg-primary rounded-full animate-pulse delay-200"></span>
                  <span className="w-1 h-3 bg-primary rounded-full animate-pulse delay-300"></span>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                AI Interviewer
              </div>
            </div>

            {/* Transcript */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex flex-col space-y-1">
                <span className="text-xs font-medium text-gray-500">AI Interviewer</span>
                <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3 text-sm text-gray-800">
                  Welcome to your mock interview for the {selectedRole} position at {selectedCompany}. Let's start with a behavioral question. Can you tell me about a time when you had to deal with a difficult team member?
                </div>
              </div>
              <div className="flex flex-col space-y-1 items-end">
                <span className="text-xs font-medium text-gray-500">You</span>
                <div className="bg-primary/10 rounded-2xl rounded-tr-none p-3 text-sm text-primary-dark">
                  Sure. In my previous role, I worked with a colleague who consistently missed deadlines, which affected our project timeline...
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-xs font-medium text-gray-500">AI Interviewer</span>
                <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3 text-sm text-gray-800">
                  How did you approach them about this issue, and what was the outcome?
                </div>
              </div>
            </div>

            {/* User Controls */}
            <div className="p-4 bg-white border-t border-gray-200 flex justify-center space-x-4 shrink-0">
              <button className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                <Mic className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                <Video className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Panel: Workspace (Code/Whiteboard/Notes) */}
          <div className="flex-1 bg-gray-50 flex flex-col">
            <div className="bg-white border-b border-gray-200 px-4 py-2 flex space-x-4 text-sm font-medium">
              <button className="text-primary border-b-2 border-primary pb-2 -mb-[9px]">Interview Notes</button>
              {selectedType === 'Technical' && <button className="text-gray-500 hover:text-gray-700 pb-2">Code Editor</button>}
              {selectedType === 'SystemDesign' && <button className="text-gray-500 hover:text-gray-700 pb-2">Whiteboard</button>}
            </div>
            <div className="flex-1 p-6">
              <div className="bg-white rounded-xl border border-gray-200 h-full p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Question Prompt</h3>
                <p className="text-gray-700 mb-6">
                  {selectedType === 'Behavioral' 
                    ? "Tell me about a time when you had to deal with a difficult team member. Focus on your approach, the actions you took, and the final outcome."
                    : selectedType === 'Technical'
                    ? "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice."
                    : "Design a URL shortening service like bit.ly. Consider scalability, high availability, and read/write ratio."}
                </p>
                
                <div className="border-t border-gray-100 pt-6">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                    Evaluation Criteria
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600 ml-6 list-disc">
                    {selectedType === 'Behavioral' ? (
                      <>
                        <li>STAR Method (Situation, Task, Action, Result)</li>
                        <li>Empathy and communication skills</li>
                        <li>Conflict resolution ability</li>
                        <li>Focus on positive outcomes</li>
                      </>
                    ) : selectedType === 'Technical' ? (
                      <>
                        <li>Optimal time and space complexity</li>
                        <li>Handling edge cases</li>
                        <li>Code readability and structure</li>
                        <li>Communication of thought process</li>
                      </>
                    ) : (
                      <>
                        <li>Requirements gathering and capacity estimation</li>
                        <li>High-level architecture design</li>
                        <li>Database schema and choice of DB</li>
                        <li>Handling bottlenecks and scaling strategies</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-deep mb-4 tracking-tight">
            AI 模拟面试
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            1:1 还原真实大厂面试场景。支持语音交互、代码考核与系统设计，面试结束后提供深度评估报告。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-deep mb-6 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-primary" />
                配置面试环境
              </h2>
              
              <div className="space-y-6">
                {/* Role & Company */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">目标岗位 (Role)</label>
                    <select 
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-gray-50 focus:bg-white"
                    >
                      {roles.map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">目标公司 (Company)</label>
                    <select 
                      value={selectedCompany}
                      onChange={(e) => setSelectedCompany(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-gray-50 focus:bg-white"
                    >
                      {companies.map(company => <option key={company} value={company}>{company}</option>)}
                    </select>
                  </div>
                </div>

                {/* Interview Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">面试类型 (Interview Type)</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {types.map((type) => {
                      const Icon = type.icon;
                      const isSelected = selectedType === type.id;
                      return (
                        <div 
                          key={type.id}
                          onClick={() => setSelectedType(type.id)}
                          className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                            isSelected 
                              ? 'border-primary bg-primary/5' 
                              : 'border-gray-100 bg-white hover:border-primary/30 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className={`w-6 h-6 mb-3 ${isSelected ? 'text-primary' : 'text-gray-400'}`} />
                          <h3 className={`font-bold mb-1 ${isSelected ? 'text-primary-dark' : 'text-gray-700'}`}>
                            {type.name}
                          </h3>
                          <p className="text-xs text-gray-500 leading-relaxed">
                            {type.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Settings */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">开启摄像头</h4>
                      <p className="text-sm text-gray-500">分析面部表情与眼神交流（推荐 BQ 面试开启）</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsInterviewStarted(true)}
              className="w-full bg-primary hover:bg-primary-hover text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>开始面试 (Start Interview)</span>
            </button>
          </div>

          {/* Right Sidebar: Stats & History */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-deep mb-4">我的面试数据</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">12</div>
                  <div className="text-xs text-gray-500">完成面试</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-500 mb-1">85</div>
                  <div className="text-xs text-gray-500">平均得分</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">行为面试 (BQ)</span>
                  <span className="font-medium text-gray-900">92/100</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
                
                <div className="flex items-center justify-between text-sm pt-2">
                  <span className="text-gray-600">算法与数据结构</span>
                  <span className="font-medium text-gray-900">78/100</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
                
                <div className="flex items-center justify-between text-sm pt-2">
                  <span className="text-gray-600">系统设计</span>
                  <span className="font-medium text-gray-900">85/100</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-deep">最近面试记录</h3>
                <button className="text-sm text-primary hover:underline">查看全部</button>
              </div>
              <div className="space-y-4">
                {[
                  { company: 'Google', role: 'Software Engineer', type: 'System Design', date: '2天前', score: 88 },
                  { company: 'Meta', role: 'Product Manager', type: 'Behavioral', date: '5天前', score: 94 },
                  { company: 'Amazon', role: 'Software Engineer', type: 'Technical', date: '1周前', score: 75 },
                ].map((record, i) => (
                  <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <BarChart className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-900">{record.company} - {record.type}</div>
                        <div className="text-xs text-gray-500 flex items-center mt-0.5">
                          <Clock className="w-3 h-3 mr-1" />
                          {record.date}
                        </div>
                      </div>
                    </div>
                    <div className={`font-bold ${record.score >= 90 ? 'text-green-500' : record.score >= 80 ? 'text-primary' : 'text-yellow-500'}`}>
                      {record.score}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
