import React from 'react';
import { motion } from 'motion/react';
import { Search, ShieldCheck, Star, AlertTriangle, Filter, TrendingUp, Users, MessageSquare, CheckCircle2, XCircle } from 'lucide-react';

const AgencyMockup = () => (
  <div className="flex h-full w-full bg-slate-50 overflow-hidden">
    {/* Left Sidebar: Filters */}
    <div className="w-[25%] bg-white border-r border-slate-200 p-4 flex flex-col h-full overflow-hidden">
      <div className="mb-4 flex items-center justify-between shrink-0">
        <h2 className="text-xs font-bold text-slate-900 flex items-center">
          <Filter className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Filters
        </h2>
        <button className="text-[9px] text-indigo-600 hover:underline">Clear All</button>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pr-2">
        <div>
          <div className="text-[10px] font-bold text-slate-700 mb-2">Service Type</div>
          <div className="space-y-1.5">
            {['Resume Review', 'Mock Interview', '1-on-1 Mentorship', 'Referral Guarantee'].map((item, i) => (
              <label key={i} className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3 h-3" defaultChecked={i === 1 || i === 2} />
                <span className="text-[10px] text-slate-600">{item}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[10px] font-bold text-slate-700 mb-2">Target Industry</div>
          <div className="space-y-1.5">
            {['Tech / SWE', 'Data Science', 'Finance / Quant', 'Consulting'].map((item, i) => (
              <label key={i} className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3 h-3" defaultChecked={i === 0} />
                <span className="text-[10px] text-slate-600">{item}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[10px] font-bold text-slate-700 mb-2">AI Risk Rating</div>
          <div className="space-y-1.5">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 w-3 h-3" defaultChecked />
              <span className="text-[10px] text-slate-600 flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></div> Low Risk</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 w-3 h-3" defaultChecked />
              <span className="text-[10px] text-slate-600 flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></div> Medium Risk</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-rose-500 focus:ring-rose-500 w-3 h-3" />
              <span className="text-[10px] text-slate-600 flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></div> High Risk</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    {/* Right Panel: Results */}
    <div className="w-[75%] bg-slate-50 p-4 flex flex-col h-full overflow-hidden">
      <div className="relative mb-4 shrink-0">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
        <input type="text" disabled placeholder="Search agencies by name or keyword..." className="w-full h-7 pl-8 pr-2 bg-white border border-slate-200 shadow-sm rounded-md text-[10px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {/* Agency Card 1 (High Risk) */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="p-3 border-b border-slate-100 flex justify-between items-start bg-gradient-to-r from-white to-rose-50/30">
            <div>
              <div className="flex items-center space-x-1.5 mb-0.5">
                <h2 className="text-sm font-bold text-slate-900">OfferGo Consulting</h2>
                <span className="bg-slate-100 text-slate-600 text-[9px] px-1.5 py-0.5 rounded font-medium">Tech & Finance</span>
              </div>
              <div className="flex items-center mt-0.5">
                <div className="flex text-amber-400"><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 text-slate-200"/><Star className="w-3 h-3 text-slate-200"/></div>
                <span className="text-[10px] font-bold text-slate-700 ml-1.5">2.8 / 5.0</span>
                <span className="text-[9px] text-slate-500 ml-1.5 underline cursor-pointer">(124 verified reviews)</span>
              </div>
            </div>
            <div className="bg-rose-50 text-rose-700 px-2 py-1 rounded text-[10px] font-bold flex items-center border border-rose-200 shadow-sm">
              <AlertTriangle className="w-3 h-3 mr-1" /> High Risk Warning
            </div>
          </div>
          
          <div className="p-3 grid grid-cols-3 gap-4">
            {/* AI Analysis */}
            <div className="col-span-2 space-y-3">
              <div>
                <h3 className="text-[10px] font-bold text-slate-800 mb-1.5 flex items-center">
                  <ShieldCheck className="w-3 h-3 mr-1 text-indigo-500" /> AI Sentiment Analysis
                </h3>
                <ul className="space-y-1.5 text-[10px] text-slate-600">
                  <li className="flex items-start bg-rose-50/50 p-1.5 rounded border border-rose-100">
                    <XCircle className="w-3 h-3 text-rose-500 mt-0.5 mr-1.5 shrink-0" /> 
                    <span><strong>Refund Issues:</strong> Over 40% of negative reviews mention "refusal to refund" despite "guarantee" claims.</span>
                  </li>
                  <li className="flex items-start bg-amber-50/50 p-1.5 rounded border border-amber-100">
                    <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 mr-1.5 shrink-0" /> 
                    <span><strong>Mentor Quality:</strong> Users report mentors are often not from FAANG as advertised, but junior contractors.</span>
                  </li>
                  <li className="flex items-start bg-emerald-50/50 p-1.5 rounded border border-emerald-100">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 mr-1.5 shrink-0" /> 
                    <span><strong>Resume Service:</strong> The basic resume formatting service receives generally positive feedback.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Stats */}
            <div className="col-span-1 border-l border-slate-100 pl-4 space-y-3">
              <div>
                <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">Price Range</div>
                <div className="text-xs font-semibold text-slate-800">$3,000 - $8,000</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">Success Rate Claim</div>
                <div className="text-xs font-semibold text-slate-800 flex items-center">
                  95% <span className="text-[9px] text-rose-500 ml-1.5 font-normal bg-rose-50 px-1 rounded">Unverified</span>
                </div>
              </div>
              <button className="w-full mt-1 text-[10px] bg-white border border-slate-300 text-slate-700 py-1 rounded hover:bg-slate-50 transition-colors font-medium">
                Read Full Report
              </button>
            </div>
          </div>
        </motion.div>

        {/* Agency Card 2 (Low Risk) */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden opacity-75 shrink-0"
        >
          <div className="p-3 border-b border-slate-100 flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-1.5 mb-0.5">
                <h2 className="text-sm font-bold text-slate-900">TechMentor Pro</h2>
                <span className="bg-slate-100 text-slate-600 text-[9px] px-1.5 py-0.5 rounded font-medium">SWE Only</span>
              </div>
              <div className="flex items-center mt-0.5">
                <div className="flex text-amber-400"><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 text-amber-400 fill-current opacity-50"/></div>
                <span className="text-[10px] font-bold text-slate-700 ml-1.5">4.6 / 5.0</span>
                <span className="text-[9px] text-slate-500 ml-1.5">(89 verified reviews)</span>
              </div>
            </div>
            <div className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold flex items-center border border-emerald-200 shadow-sm">
              <ShieldCheck className="w-3 h-3 mr-1" /> Highly Recommended
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </div>
);

export default AgencyMockup;
