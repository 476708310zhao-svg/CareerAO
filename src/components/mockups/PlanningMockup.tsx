import React from 'react';
import { motion } from 'motion/react';
import { Target, Map, CheckCircle2, Circle, ArrowRight, Bot, BookOpen, Users, Code } from 'lucide-react';

const PlanningMockup = () => (
  <div className="flex h-full w-full bg-slate-50 overflow-hidden">
    {/* Left Sidebar: Goals & Profile */}
    <div className="w-[30%] bg-white border-r border-slate-200 p-3 flex flex-col h-full overflow-hidden">
      <div className="mb-3 shrink-0">
        <h2 className="text-xs font-bold text-slate-900 flex items-center">
          <Target className="w-3.5 h-3.5 mr-1.5 text-rose-500" /> Career Profile
        </h2>
      </div>
      
      <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
          <div className="text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Role</div>
          <div className="font-semibold text-slate-800 text-[10px]">Software Engineer (New Grad)</div>
          <div className="text-[8px] text-slate-500 mt-0.5">North America • Tech / FinTech</div>
        </div>

        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
          <div className="text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-1">Current Status</div>
          <div className="space-y-1.5">
            <div>
              <div className="flex justify-between text-[8px] mb-0.5">
                <span className="text-slate-600">LeetCode Progress</span>
                <span className="font-medium text-slate-800">45/150</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1">
                <div className="bg-rose-500 h-1 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[8px] mb-0.5">
                <span className="text-slate-600">Resume Score</span>
                <span className="font-medium text-slate-800">82/100</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1">
                <div className="bg-emerald-500 h-1 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-rose-50/50 p-2 rounded-lg border border-rose-100">
          <div className="text-[8px] font-bold text-rose-600 uppercase tracking-wider mb-1 flex items-center">
            <Bot className="w-2.5 h-2.5 mr-1" /> AI Assessment
          </div>
          <p className="text-[8px] text-slate-700 leading-tight">
            Your resume is strong, but you need more practice on Dynamic Programming and System Design basics before starting mock interviews.
          </p>
        </div>
      </div>
    </div>

    {/* Right Panel: Roadmap */}
    <div className="w-[70%] bg-slate-50 p-3 flex flex-col h-full overflow-hidden">
      <div className="mb-3 flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-xs font-bold text-slate-900 flex items-center">
            <Map className="w-3.5 h-3.5 mr-1.5 text-indigo-600" /> 6-Month Action Plan
          </h2>
          <p className="text-[9px] text-slate-500 mt-0.5">AI-generated based on your profile and target roles.</p>
        </div>
        <button className="text-[8px] bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded font-medium shadow-sm hover:bg-slate-50 transition-colors">
          Regenerate Plan
        </button>
      </div>

      <div className="flex-1 overflow-y-auto relative pr-1">
        <div className="absolute left-2.5 top-1 bottom-2 w-0.5 bg-slate-200"></div>
        
        <div className="space-y-3 relative">
          {/* Month 1-2 */}
          <div className="pl-6 relative">
            <div className="absolute left-[8px] top-1 w-1.5 h-1.5 rounded-full border border-emerald-500 bg-emerald-500 z-10"></div>
            <div className="text-[8px] font-bold text-emerald-600 mb-0.5 uppercase tracking-wider">Month 1-2 • Completed</div>
            <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm opacity-70">
              <h3 className="font-bold text-slate-900 mb-1 flex items-center text-[10px]">
                <Code className="w-3 h-3 mr-1 text-slate-500" /> Skill Foundation & Resume
              </h3>
              <div className="space-y-0.5">
                <div className="flex items-center text-[9px] text-slate-600">
                  <CheckCircle2 className="w-2.5 h-2.5 mr-1 text-emerald-500" /> Complete Blind 75 LeetCode
                </div>
                <div className="flex items-center text-[9px] text-slate-600">
                  <CheckCircle2 className="w-2.5 h-2.5 mr-1 text-emerald-500" /> Finalize 2 full-stack projects
                </div>
                <div className="flex items-center text-[9px] text-slate-600">
                  <CheckCircle2 className="w-2.5 h-2.5 mr-1 text-emerald-500" /> Run AI Resume optimization
                </div>
              </div>
            </div>
          </div>

          {/* Month 3-4 (Active) */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="pl-6 relative"
          >
            <div className="absolute left-[6.5px] top-1 w-2 h-2 rounded-full border-[1.5px] border-indigo-500 bg-white z-10 ring-1 ring-indigo-50"></div>
            <div className="text-[8px] font-bold text-indigo-600 mb-0.5 uppercase tracking-wider">Month 3-4 • Current Focus</div>
            <div className="bg-white p-2 rounded-lg border-2 border-indigo-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-50 rounded-bl-full -z-10"></div>
              <h3 className="font-bold text-slate-900 mb-1.5 flex items-center text-[10px]">
                <Users className="w-3 h-3 mr-1 text-indigo-500" /> Networking & OA Prep
              </h3>
              
              <div className="space-y-1.5 mb-2">
                <div className="flex items-start">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[9px] font-medium text-slate-800">Reach out to 50 alumni</div>
                    <div className="text-[8px] text-slate-500">Currently at 32/50. Keep going!</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Circle className="w-3 h-3 mr-1 text-slate-300 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[9px] font-medium text-slate-800">Practice company-specific OAs</div>
                    <div className="text-[8px] text-slate-500">Focus on Amazon and TikTok tagged questions.</div>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50/50 p-2 rounded border border-indigo-100 flex items-start">
                <Bot className="w-3 h-3 text-indigo-600 mr-1 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[9px] font-semibold text-indigo-900 mb-0.5">AI Recommendation</div>
                  <p className="text-[8px] text-indigo-700/80 leading-tight">Based on recent trends, companies are asking more graph-related questions in OAs. I've added a custom practice set to your dashboard.</p>
                  <button className="mt-1 text-[8px] font-medium bg-indigo-600 text-white px-1.5 py-0.5 rounded hover:bg-indigo-700 transition-colors flex items-center">
                    View Practice Set <ArrowRight className="w-2 h-2 ml-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Month 5-6 */}
          <div className="pl-6 relative">
            <div className="absolute left-[8px] top-1 w-1.5 h-1.5 rounded-full border border-slate-300 bg-white z-10"></div>
            <div className="text-[8px] font-bold text-slate-400 mb-0.5 uppercase tracking-wider">Month 5-6 • Upcoming</div>
            <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-1 flex items-center text-[10px]">
                <BookOpen className="w-3 h-3 mr-1 text-slate-400" /> Mock Interviews & Onsites
              </h3>
              <div className="space-y-0.5">
                <div className="flex items-center text-[9px] text-slate-500">
                  <Circle className="w-2.5 h-2.5 mr-1 text-slate-300" /> Weekly AI Mock Interviews (BQ + Tech)
                </div>
                <div className="flex items-center text-[9px] text-slate-500">
                  <Circle className="w-2.5 h-2.5 mr-1 text-slate-300" /> System Design Basics
                </div>
                <div className="flex items-center text-[9px] text-slate-500">
                  <Circle className="w-2.5 h-2.5 mr-1 text-slate-300" /> Schedule real interviews
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PlanningMockup;
