import React from 'react';
import { motion } from 'motion/react';
import { Send, Bot, Copy, CheckCircle2, FileText, ChevronRight, Sparkles } from 'lucide-react';

const ApplicationMockup = () => (
  <div className="flex h-full bg-gray-50 w-full overflow-hidden">
    {/* Left Sidebar - Job Info */}
    <div className="w-1/3 border-r border-gray-200 bg-white p-4 hidden md:block">
      <div className="flex items-center space-x-3 mb-5">
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-lg text-gray-700">G</div>
        <div>
          <h3 className="font-bold text-gray-900 text-xs">Software Engineer</h3>
          <p className="text-[10px] text-gray-500">Google · New Grad 2026</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Application Progress</div>
          <div className="space-y-2">
            <div className="flex items-center text-xs text-gray-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mr-2" /> Personal Info
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mr-2" /> Education
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mr-2" /> Experience
            </div>
            <div className="flex items-center text-xs font-bold text-blue-600 bg-blue-50 p-1.5 rounded-md border border-blue-100">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-600 mr-2 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div></div> Open Questions
            </div>
            <div className="flex items-center text-xs text-gray-400">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 mr-2"></div> Review & Submit
            </div>
          </div>
        </div>
        
        <div className="pt-3 border-t border-gray-100">
          <div className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Reference Resume</div>
          <div className="flex items-center p-1.5 bg-gray-50 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-100">
            <FileText className="w-3.5 h-3.5 text-gray-500 mr-2" />
            <span className="text-[10px] text-gray-700 flex-1 truncate">Alex_Chen_SWE_Resume.pdf</span>
            <ChevronRight className="w-3 h-3 text-gray-400" />
          </div>
        </div>
      </div>
    </div>

    {/* Right Content - OQ Generation */}
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
        <div className="font-bold text-xs text-gray-800 flex items-center">
          <Send className="w-3.5 h-3.5 mr-1.5 text-blue-600" /> 网申 OQ 智能生成
        </div>
        <div className="flex space-x-2">
          <button className="text-[10px] px-2.5 py-1 bg-gray-100 text-gray-600 rounded font-medium hover:bg-gray-200">Regenerate</button>
        </div>
      </div>
      <div className="p-4 flex-1 overflow-hidden flex flex-col space-y-3">
        <div className="shrink-0">
          <div className="text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider flex items-center">
            Question 1 of 3 <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-[9px]">Required</span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200 text-xs text-gray-800 shadow-sm font-medium">
            "Describe a time when you had to learn a new technology quickly to complete a project. What was the situation and how did you handle it?"
          </div>
        </div>
        
        <div className="flex justify-center shrink-0">
          <div className="bg-blue-50 text-blue-700 text-[10px] px-3 py-1.5 rounded-full flex items-center border border-blue-100 shadow-sm">
            <Sparkles className="w-3 h-3 mr-1.5 text-blue-500" /> AI 正在深度分析您的简历经历，匹配最佳 STAR 案例...
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex-1 overflow-hidden flex flex-col"
        >
          <div className="text-[10px] font-bold text-blue-600 mb-1.5 uppercase tracking-wider flex justify-between items-center shrink-0">
            <span className="flex items-center"><Bot className="w-3.5 h-3.5 mr-1"/> AI Generated Answer (STAR Method)</span>
            <div className="flex space-x-1.5">
              <button className="flex items-center text-gray-500 hover:text-blue-600 transition-colors bg-white px-1.5 py-0.5 rounded border border-gray-200 text-[9px]">
                <Copy className="w-2.5 h-2.5 mr-1" /> Copy
              </button>
              <button className="flex items-center text-white bg-blue-600 hover:bg-blue-700 transition-colors px-1.5 py-0.5 rounded text-[9px]">
                Apply Answer
              </button>
            </div>
          </div>
          <div className="bg-white p-3.5 rounded-lg border border-blue-200 text-[11px] text-gray-800 shadow-md leading-relaxed relative flex-1 overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-lg"></div>
            <div className="space-y-2 h-full flex flex-col justify-center">
              <p><strong className="text-blue-700 bg-blue-50 px-1 rounded">Situation:</strong> During my internship at ByteDance, our team migrated a legacy dashboard to a modern tech stack within a strict 3-week deadline.</p>
              <p><strong className="text-blue-700 bg-blue-50 px-1 rounded">Task:</strong> I was assigned to implement the real-time data visualization module using D3.js, a complex library I had no prior experience with.</p>
              <p><strong className="text-blue-700 bg-blue-50 px-1 rounded">Action:</strong> I dedicated my first weekend to a D3.js crash course. To accelerate development, I broke down requirements into smaller components and set up daily 15-minute syncs with a senior engineer to unblock hurdles.</p>
              <p><strong className="text-blue-700 bg-blue-50 px-1 rounded">Result:</strong> I delivered the module 2 days early. The dashboard improved rendering by 40%, and my proactive learning was commended in my review.</p>
            </div>
          </div>
          
          <div className="mt-3 bg-gray-50 p-2.5 rounded-lg border border-gray-200 shrink-0">
            <div className="text-[10px] font-bold text-gray-600 mb-0.5">AI 匹配度分析: <span className="text-green-600">95%</span></div>
            <p className="text-[9px] text-gray-500">此回答完美契合了 Google 对 "Learnability" 和 "Deliver Results" 的考察点，并成功提取了高光数据。</p>
          </div>
        </motion.div>
      </div>
    </div>
  </div>
);

export default ApplicationMockup;
