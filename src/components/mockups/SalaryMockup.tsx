import React from 'react';
import { motion } from 'motion/react';
import { Building, MapPin, TrendingUp, Info, Briefcase, DollarSign, BarChart3 } from 'lucide-react';

const SalaryMockup = () => (
  <div className="flex flex-col h-full bg-gray-50 w-full">
    <div className="p-6 border-b border-gray-200 bg-white shadow-sm z-10">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Software Engineer (L3)</h2>
          <div className="text-sm text-gray-500 flex items-center mt-2 space-x-4">
            <span className="flex items-center"><Building className="w-4 h-4 mr-1.5 text-gray-400" /> Google</span>
            <span className="flex items-center"><MapPin className="w-4 h-4 mr-1.5 text-gray-400" /> San Francisco Bay Area</span>
            <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1.5 text-gray-400" /> Entry Level (0-2 yrs)</span>
          </div>
        </div>
        <button className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-emerald-100 transition-colors flex items-center">
          <DollarSign className="w-4 h-4 mr-1" /> Add Your Salary
        </button>
      </div>
    </div>

    <div className="flex-1 overflow-hidden p-4 flex space-x-4">
      {/* Left Column - Main Stats */}
      <div className="w-2/3 space-y-4 flex flex-col">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10"></div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center">
              Total Compensation (Avg) <Info className="w-3.5 h-3.5 ml-1 text-gray-400" />
            </div>
            <div className="bg-emerald-100 text-emerald-700 text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center">
              <TrendingUp className="w-2.5 h-2.5 mr-1" /> +4.2% YoY
            </div>
          </div>
          
          <div className="flex items-end space-x-3 mb-5">
            <div className="text-4xl font-extrabold text-gray-900 tracking-tight">$189,000</div>
            <div className="text-xs text-gray-500 mb-1.5">/ year</div>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="font-medium text-gray-600 flex items-center"><div className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></div>Base Salary</span>
                <span className="font-bold text-gray-900">$142,000 <span className="text-gray-400 font-normal ml-1">(75%)</span></span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} transition={{ duration: 1, ease: "easeOut" }} className="bg-blue-500 h-full rounded-full"></motion.div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="font-medium text-gray-600 flex items-center"><div className="w-2 h-2 rounded-full bg-purple-500 mr-1.5"></div>Stock (RSU) / yr</span>
                <span className="font-bold text-gray-900">$32,000 <span className="text-gray-400 font-normal ml-1">(17%)</span></span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '17%' }} transition={{ duration: 1, delay: 0.2, ease: "easeOut" }} className="bg-purple-500 h-full rounded-full"></motion.div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="font-medium text-gray-600 flex items-center"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></div>Bonus</span>
                <span className="font-bold text-gray-900">$15,000 <span className="text-gray-400 font-normal ml-1">(8%)</span></span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '8%' }} transition={{ duration: 1, delay: 0.4, ease: "easeOut" }} className="bg-emerald-500 h-full rounded-full"></motion.div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex-1 flex flex-col overflow-hidden">
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center shrink-0">
            <BarChart3 className="w-4 h-4 mr-1.5 text-indigo-500" /> Salary Distribution
          </h3>
          <div className="flex-1 flex items-end space-x-1.5 min-h-0">
            {[10, 25, 45, 80, 100, 60, 30, 15, 5].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end">
                <motion.div 
                  initial={{ height: 0 }} 
                  animate={{ height: `${height}%` }} 
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className={`w-full rounded-t-sm transition-colors ${i === 4 ? 'bg-emerald-500' : 'bg-indigo-100 group-hover:bg-indigo-200'}`}
                ></motion.div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[9px] text-gray-400 mt-1.5 font-medium shrink-0">
            <span>$150k</span>
            <span className="text-emerald-600 font-bold">Median $189k</span>
            <span>$230k+</span>
          </div>
        </div>
      </div>

      {/* Right Column - Related & Details */}
      <div className="w-1/3 space-y-4 flex flex-col">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm shrink-0">
          <h3 className="text-[10px] font-bold text-gray-900 mb-2 uppercase tracking-wider">Related Levels</h3>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center p-1.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <div>
                <div className="font-bold text-[11px] text-gray-800">L4 (Mid-Level)</div>
                <div className="text-[9px] text-gray-500">2-5 yrs exp</div>
              </div>
              <div className="font-bold text-[11px] text-emerald-600">$265k</div>
            </div>
            <div className="flex justify-between items-center p-1.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <div>
                <div className="font-bold text-[11px] text-gray-800">L5 (Senior)</div>
                <div className="text-[9px] text-gray-500">5+ yrs exp</div>
              </div>
              <div className="font-bold text-[11px] text-emerald-600">$350k</div>
            </div>
            <div className="flex justify-between items-center p-1.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <div>
                <div className="font-bold text-[11px] text-gray-800">L6 (Staff)</div>
                <div className="text-[9px] text-gray-500">8+ yrs exp</div>
              </div>
              <div className="font-bold text-[11px] text-emerald-600">$490k</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex-1 overflow-hidden flex flex-col">
          <h3 className="text-[10px] font-bold text-gray-900 mb-2 uppercase tracking-wider shrink-0">Top Benefits</h3>
          <ul className="space-y-2 text-[11px] text-gray-600 flex-1 overflow-y-auto">
            <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></div> Free Meals & Snacks</li>
            <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></div> 401k Match (50%)</li>
            <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></div> Mega Backdoor Roth</li>
            <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></div> Health Insurance (100%)</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default SalaryMockup;
