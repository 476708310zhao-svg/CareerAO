import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
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
  BarChart,
  User,
  VideoOff,
  PhoneOff,
  Send
} from 'lucide-react';
import { apiFetch } from '../lib/api';

export default function AIInterview() {
  const location = useLocation();
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Software Engineer');
  const [selectedCompany, setSelectedCompany] = useState('Google');
  const [selectedType, setSelectedType] = useState('Behavioral');
  const [jdContext, setJdContext] = useState('');

  // Media state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  // AI Conversation State
  const [messages, setMessages] = useState<{role: 'ai'|'user', text: string}[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);

  useEffect(() => {
    if (location.state) {
      const { role, company, jd } = location.state as any;
      if (role) setSelectedRole(role);
      if (company) setSelectedCompany(company);
      if (jd) setJdContext(jd);
    }
  }, [location.state]);

  // Handle media stream when interview starts/stops
  useEffect(() => {
    if (isInterviewStarted) {
      startMedia();
      initSpeechRecognition();
      
      // Initial greeting if no messages
      if (messages.length === 0) {
        const greeting = `Hello! Welcome to your mock interview for the ${selectedRole} position at ${selectedCompany}. I'm your AI interviewer. Are you ready to begin?`;
        setMessages([{ role: 'ai', text: greeting }]);
        speak(greeting);
      }
    } else {
      stopMedia();
      recognitionRef.current?.stop();
      synthRef.current?.cancel();
    }
    return () => {
      stopMedia();
      recognitionRef.current?.stop();
      synthRef.current?.cancel();
    };
  }, [isInterviewStarted]);

  const initSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US'; // Default to English for tech interviews

      recognition.onresult = (event: any) => {
        let current = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          current += event.results[i][0].transcript;
        }
        setTranscript(current);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a good English voice
    const voices = synthRef.current.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en-') && v.name.includes('Google')) || voices.find(v => v.lang.startsWith('en-'));
    if (englishVoice) utterance.voice = englishVoice;
    
    utterance.onstart = () => setIsAiSpeaking(true);
    utterance.onend = () => setIsAiSpeaking(false);
    utterance.onerror = () => setIsAiSpeaking(false);
    
    synthRef.current.speak(utterance);
  };

  const handleSend = async (userText: string) => {
    if (!userText.trim()) return;
    
    const newMessages = [...messages, { role: 'user' as const, text: userText }];
    setMessages(newMessages);
    setIsAiThinking(true);
    
    try {
      const response = await apiFetch('/api/ai/interview-chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: newMessages,
          role: selectedRole,
          company: selectedCompany,
          jd: jdContext,
          type: selectedType
        })
      });
      
      if (response.reply) {
        setMessages(prev => [...prev, { role: 'ai', text: response.reply }]);
        speak(response.reply);
      }
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsAiThinking(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      if (transcript.trim()) {
        handleSend(transcript);
        setTranscript('');
      }
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsListening(true);
      synthRef.current?.cancel(); // Stop AI from speaking if user interrupts
    }
  };

  const startMedia = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing media devices.", err);
      // Fallback or show error message to user
    }
  };

  const stopMedia = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const roles = ['Software Engineer', 'Product Manager', 'Data Scientist', 'UI/UX Designer', 'Quantitative Analyst', 'Software Engineer, New Grad 2026'];
  const companies = ['Google', 'Meta', 'Amazon', 'Apple', 'Netflix', 'Microsoft', 'TikTok', 'Jane Street'];
  const types = [
    { id: 'Behavioral', name: '行为面试 (BQ)', icon: MessageSquare, desc: '考察领导力、团队协作与冲突解决' },
    { id: 'Technical', name: '算法与数据结构', icon: Code2, desc: 'LeetCode 风格的算法题与代码实现' },
    { id: 'SystemDesign', name: '系统设计', icon: Layout, desc: '高并发、分布式系统架构设计' }
  ];

  if (isInterviewStarted) {
    const latestMessage = messages[messages.length - 1];

    return (
      <div className="pt-16 min-h-screen bg-gray-950 flex flex-col">
        {/* Interview Header */}
        <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <Bot className="text-primary w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">AI Interviewer - {selectedCompany}</h2>
              <p className="text-sm text-gray-400">{selectedRole} • {selectedType} Interview</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span>Recording</span>
            </div>
            <span className="text-gray-400 font-mono text-sm">00:14:32</span>
          </div>
        </div>

        {/* Active Interview Workspace */}
        <div className="flex-1 relative flex flex-col md:flex-row overflow-hidden">
          
          {/* Main Area: AI Interviewer (Visualizer) */}
          <div className="flex-1 relative flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-950 z-10">
             <div className={`w-40 h-40 rounded-full bg-primary/10 flex items-center justify-center ${isAiSpeaking ? 'animate-pulse' : ''}`}>
               <div className={`w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center ${isAiSpeaking ? 'animate-ping' : ''}`} style={{ animationDuration: '2s' }}>
                 <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.6)]">
                   <Bot className="w-12 h-12 text-white" />
                 </div>
               </div>
             </div>
             
             {isAiSpeaking && (
               <div className="mt-8 flex items-center space-x-1.5">
                  <span className="w-1.5 h-4 bg-primary rounded-full animate-pulse"></span>
                  <span className="w-1.5 h-8 bg-primary rounded-full animate-pulse delay-75"></span>
                  <span className="w-1.5 h-5 bg-primary rounded-full animate-pulse delay-150"></span>
                  <span className="w-1.5 h-10 bg-primary rounded-full animate-pulse delay-200"></span>
                  <span className="w-1.5 h-6 bg-primary rounded-full animate-pulse delay-300"></span>
               </div>
             )}
             
             <p className="mt-4 text-gray-400 text-sm font-medium tracking-widest uppercase">
               {isAiSpeaking ? 'Speaking...' : isAiThinking ? 'Thinking...' : isListening ? 'Listening...' : 'Waiting...'}
             </p>
             
             {/* Transcript Overlay */}
             <div className="absolute bottom-28 left-0 right-0 flex justify-center pointer-events-none z-20">
                <div className="max-w-3xl w-full mx-4 bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">
                   <p className="text-primary-light text-sm font-medium mb-2 flex items-center">
                     {isListening ? <User className="w-4 h-4 mr-2" /> : <Bot className="w-4 h-4 mr-2" />} 
                     {isListening ? "You (Speaking...)" : isAiThinking ? "AI 面试官 (Thinking...)" : (latestMessage?.role === 'ai' ? "AI 面试官" : "You")}
                   </p>
                   <p className="text-white text-xl leading-relaxed">
                     {isListening ? (transcript || "Listening...") : isAiThinking ? "..." : latestMessage?.text}
                   </p>
                </div>
             </div>
          </div>

          {/* Right Panel: Code Editor / Whiteboard / User Camera */}
          <div className="w-full md:w-1/3 bg-gray-900 flex flex-col relative border-l border-gray-800">
            
            {/* User Camera (PiP) */}
            <div className="h-64 bg-black relative overflow-hidden border-b border-gray-800 shrink-0">
               <video 
                 ref={videoRef} 
                 autoPlay 
                 playsInline 
                 muted 
                 className={`w-full h-full object-cover ${!isVideoEnabled ? 'hidden' : ''}`} 
               />
               {!isVideoEnabled && (
                 <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800">
                   <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-2">
                     <span className="text-2xl text-gray-400">You</span>
                   </div>
                   <span className="text-gray-500 text-sm">Camera Off</span>
                 </div>
               )}
               <div className="absolute bottom-3 left-3 bg-black/60 px-2.5 py-1 rounded-md text-xs font-medium text-white backdrop-blur-sm flex items-center">
                 You {(!isAudioEnabled) && <span className="ml-1.5 text-red-400">(Muted)</span>}
               </div>
            </div>

            {/* Workspace Area */}
            {selectedType === 'Technical' ? (
              <div className="flex-1 flex flex-col">
                <div className="bg-gray-800 px-4 py-2 flex items-center text-gray-300 text-sm border-b border-gray-700">
                  <Code2 className="w-4 h-4 mr-2" />
                  <span>main.py</span>
                </div>
                <div className="flex-1 p-6 font-mono text-sm text-gray-300 overflow-y-auto">
                  <div className="text-gray-500 mb-4"># Write your solution here</div>
                  <div className="text-blue-400 inline">def</div> <div className="text-yellow-200 inline">solve</div>(nums):<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<div className="text-gray-500 inline"># TODO: implement</div><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<div className="text-purple-400 inline">pass</div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                <h3 className="text-white font-medium mb-4 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2 text-primary" />
                  Interview Notes
                </h3>
                <textarea 
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl p-4 text-gray-300 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none mb-4"
                  placeholder="Use this space to organize your thoughts..."
                ></textarea>
                
                {/* Fallback Text Input */}
                <div className="mt-auto">
                  <p className="text-xs text-gray-500 mb-2">Or type your answer here:</p>
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && textInput.trim()) {
                          handleSend(textInput);
                          setTextInput('');
                        }
                      }}
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-primary outline-none"
                      placeholder="Type your response..."
                    />
                    <button 
                      onClick={() => {
                        if (textInput.trim()) {
                          handleSend(textInput);
                          setTextInput('');
                        }
                      }}
                      className="bg-primary text-white p-2 rounded-lg hover:bg-primary-hover transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gray-900/80 backdrop-blur-xl border-t border-gray-800 flex items-center justify-center space-x-6 z-40">
            <button 
              onClick={toggleVideo} 
              className={`p-4 rounded-full flex items-center justify-center transition-all ${isVideoEnabled ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/50'}`}
              title={isVideoEnabled ? "Stop Video" : "Start Video"}
            >
              {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>
            
            {/* Big Speak Button */}
            <button
              onClick={toggleListening}
              className={`px-8 py-3.5 rounded-full font-bold transition-all flex items-center ${
                isListening 
                  ? 'bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.4)]' 
                  : 'bg-primary text-white hover:bg-primary-hover shadow-[0_0_20px_rgba(79,70,229,0.3)]'
              }`}
            >
              {isListening ? (
                <><Square className="w-5 h-5 mr-2 fill-current" /> 结束发言 (Stop)</>
              ) : (
                <><Mic className="w-5 h-5 mr-2" /> 开始发言 (Speak)</>
              )}
            </button>

            <button 
              onClick={() => { setIsInterviewStarted(false); synthRef.current?.cancel(); }} 
              className="p-4 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-all flex items-center"
              title="End Interview"
            >
              <PhoneOff className="w-6 h-6 text-red-400" />
            </button>
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

                {/* JD Context (if passed from Job Detail) */}
                {jdContext && (
                  <div className="pt-4 border-t border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-1.5" />
                      已加载职位 JD 上下文
                    </label>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600 max-h-40 overflow-y-auto">
                      <div dangerouslySetInnerHTML={{ __html: jdContext }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">AI 面试官将根据此 JD 的要求为您量身定制面试问题。</p>
                  </div>
                )}

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
