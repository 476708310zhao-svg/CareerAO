import React from 'react';
import { motion } from 'motion/react';
import { Bot, Menu, Mic, Video, MonitorUp, PhoneOff, Settings, MessageSquareText, Activity, CheckCircle2 } from 'lucide-react';

const InterviewMockup = () => (
  <div className="relative bg-[#0B1426] w-full h-full flex flex-col overflow-hidden font-sans">
    {/* Top Bar */}
    <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-[#111D36] z-10">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-red-400 text-xs font-bold tracking-wider">REC</span>
        </div>
        <span className="text-white/90 text-sm font-medium">Mock Interview: Senior Frontend Engineer</span>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1 text-green-400">
          <Activity className="w-4 h-4" />
          <span className="text-xs font-medium">Network Excellent</span>
        </div>
        <span className="text-white/50 text-sm font-mono">12:45 / 45:00</span>
      </div>
    </div>

    <div className="flex-1 flex relative">
      {/* Main Video Area (AI Interviewer) */}
      <div className="flex-1 relative flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#111D36]/50 to-[#0B1426]"></div>
        
        {/* AI Avatar/Video Placeholder */}
        <div className="relative w-full max-w-2xl aspect-video bg-[#1A2B4C] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-white/80 flex items-center">
            <Bot className="w-4 h-4 mr-2 text-blue-400" /> AI Interviewer (Sarah)
          </div>
          
          {/* Pulsing Avatar */}
          <div className="relative">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"
            ></motion.div>
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-[#0B1426] relative z-10 shadow-xl">
              <Bot className="w-16 h-16 text-white" />
            </div>
          </div>
          
          {/* Live Captions */}
          <div className="absolute bottom-6 left-0 right-0 px-12 flex justify-center">
            <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10 max-w-xl text-center">
              <p className="text-white/90 text-sm leading-relaxed">
                "That's a great approach to state management. Now, could you explain how you would optimize a React application that is experiencing performance issues due to frequent re-renders?"
              </p>
            </div>
          </div>
        </div>

        {/* User Mini Video */}
        <div className="absolute bottom-6 right-6 w-48 aspect-video bg-gray-800 rounded-xl border-2 border-blue-500 shadow-2xl overflow-hidden">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="User" className="w-full h-full object-cover opacity-80" />
          <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-[10px] text-white flex items-center">
            <Mic className="w-3 h-3 mr-1 text-green-400" /> You
          </div>
          {/* Audio Waveform for User */}
          <div className="absolute top-2 right-2 flex items-center space-x-0.5">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: [4, Math.random() * 12 + 4, 4] }}
                transition={{ repeat: Infinity, duration: 0.3 + Math.random() * 0.2 }}
                className="w-1 bg-green-400 rounded-full"
                style={{ height: '4px' }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Live Feedback & Chat */}
      <div className="w-80 bg-[#111D36] border-l border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-white/90 font-medium text-sm flex items-center">
            <MessageSquareText className="w-4 h-4 mr-2 text-blue-400" /> Live Analysis
          </h3>
          <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-1 rounded font-bold uppercase">Beta</span>
        </div>
        
        <div className="flex-1 overflow-hidden p-3 space-y-3 flex flex-col">
          <div className="bg-white/5 rounded-lg p-2.5 border border-white/10 shrink-0">
            <div className="text-[10px] text-white/50 mb-1">Current Topic</div>
            <div className="text-xs text-white/90 font-medium">React Performance Optimization</div>
            <div className="mt-1.5 flex flex-wrap gap-1">
              <span className="text-[9px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">useMemo</span>
              <span className="text-[9px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">useCallback</span>
              <span className="text-[9px] bg-white/10 text-white/50 px-1.5 py-0.5 rounded">React.memo</span>
            </div>
          </div>

          <div className="space-y-2 flex-1 overflow-hidden flex flex-col">
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider shrink-0">AI Real-time Feedback</div>
            
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2.5 shrink-0">
              <div className="flex items-start">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400 mr-2 shrink-0 mt-0.5" />
                <p className="text-[10px] text-green-100/80 leading-relaxed">
                  Good explanation of Redux vs Context API. You clearly articulated the trade-offs regarding boilerplate and performance.
                </p>
              </div>
            </div>
            
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5 shrink-0">
              <div className="flex items-start">
                <Bot className="w-3.5 h-3.5 text-amber-400 mr-2 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-100/80 leading-relaxed">
                  Tip: Try to structure your answers using the STAR method when asked behavioral questions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom Controls */}
    <div className="h-20 bg-[#0B1426] border-t border-white/10 flex items-center justify-center space-x-4 px-6 z-10">
      <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors group relative">
        <Mic className="w-5 h-5 text-white" />
        <span className="absolute -top-8 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Mute</span>
      </button>
      <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors group relative">
        <Video className="w-5 h-5 text-white" />
        <span className="absolute -top-8 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Stop Video</span>
      </button>
      <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors group relative">
        <MonitorUp className="w-5 h-5 text-white" />
        <span className="absolute -top-8 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Share Screen</span>
      </button>
      <div className="w-px h-8 bg-white/10 mx-2"></div>
      <button className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 group relative">
        <PhoneOff className="w-5 h-5 text-white" />
        <span className="absolute -top-8 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">End Interview</span>
      </button>
    </div>
  </div>
);

export default InterviewMockup;
