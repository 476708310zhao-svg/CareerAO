import React from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, MapPin, Bell, ChevronLeft, ChevronRight, Filter, Briefcase, GraduationCap } from 'lucide-react';

const CalendarMockup = () => (
  <div className="flex h-full w-full bg-slate-50 overflow-hidden">
    {/* Left Sidebar: Mini Calendar & Filters */}
    <div className="w-[30%] bg-white border-r border-slate-200 p-4 flex flex-col h-full overflow-hidden">
      <div className="mb-4 flex justify-between items-center shrink-0">
        <h2 className="text-xs font-bold text-slate-900 flex items-center">
          <CalendarIcon className="w-3.5 h-3.5 mr-1.5 text-orange-500" /> October 2026
        </h2>
        <div className="flex space-x-1">
          <button className="p-1 text-slate-400 hover:text-slate-600"><ChevronLeft className="w-3.5 h-3.5" /></button>
          <button className="p-1 text-slate-400 hover:text-slate-600"><ChevronRight className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      {/* Mini Calendar Grid (Static Mockup) */}
      <div className="mb-4 shrink-0">
        <div className="grid grid-cols-7 gap-0.5 text-center text-[9px] font-bold text-slate-400 mb-1.5">
          <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
        </div>
        <div className="grid grid-cols-7 gap-0.5 text-center text-[10px]">
          {Array.from({ length: 31 }).map((_, i) => {
            const day = i + 1;
            const isToday = day === 15;
            const hasEvent = [12, 15, 18, 22, 25].includes(day);
            return (
              <div 
                key={i} 
                className={`
                  aspect-square flex items-center justify-center rounded-full cursor-pointer text-[9px]
                  ${isToday ? 'bg-orange-500 text-white font-bold shadow-sm' : 'text-slate-700 hover:bg-slate-100'}
                  ${hasEvent && !isToday ? 'font-bold text-orange-600 bg-orange-50' : ''}
                `}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        <div className="text-[10px] font-bold text-slate-700 mb-2 flex items-center">
          <Filter className="w-3 h-3 mr-1 text-slate-400" /> Event Types
        </div>
        <div className="space-y-1.5">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="rounded border-slate-300 text-orange-500 focus:ring-orange-500 w-3 h-3" defaultChecked />
            <span className="text-[9px] text-slate-600 flex items-center"><Briefcase className="w-2.5 h-2.5 mr-1 text-blue-500" /> Application Deadlines</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="rounded border-slate-300 text-orange-500 focus:ring-orange-500 w-3 h-3" defaultChecked />
            <span className="text-[9px] text-slate-600 flex items-center"><GraduationCap className="w-2.5 h-2.5 mr-1 text-emerald-500" /> Campus Recruiting</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="rounded border-slate-300 text-orange-500 focus:ring-orange-500 w-3 h-3" defaultChecked />
            <span className="text-[9px] text-slate-600 flex items-center"><Clock className="w-2.5 h-2.5 mr-1 text-purple-500" /> Online Assessments</span>
          </label>
        </div>
      </div>
    </div>

    {/* Right Panel: Event List */}
    <div className="w-[70%] bg-slate-50 flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b border-slate-200 bg-white flex justify-between items-center shadow-sm z-10 shrink-0">
        <div>
          <h1 className="text-sm font-bold text-slate-900">Upcoming Events (North America)</h1>
          <p className="text-[9px] text-slate-500 mt-0.5">Showing events for SWE New Grad roles.</p>
        </div>
        <button className="text-[9px] bg-orange-500 text-white px-2 py-1 rounded font-medium shadow-sm hover:bg-orange-600 transition-colors flex items-center">
          <Bell className="w-3 h-3 mr-1" /> Subscribe
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pr-2">
        {/* This Week */}
        <div>
          <div className="text-[10px] font-bold text-slate-500 mb-2 border-b border-slate-200 pb-1 uppercase tracking-wider">This Week</div>
          <div className="space-y-2.5">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-orange-300 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-lg text-slate-700 mr-3 shrink-0">
                G
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-[11px] text-slate-900">Google SWE New Grad 2026</h4>
                  <div className="bg-red-50 text-red-700 text-[8px] px-1.5 py-0.5 rounded font-bold border border-red-100">URGENT</div>
                </div>
                <div className="flex flex-wrap gap-2 text-[9px] text-slate-500 mb-2">
                  <span className="flex items-center text-red-600 font-medium"><Clock className="w-2.5 h-2.5 mr-1"/> Closes in 2 days (Oct 15)</span>
                  <span className="flex items-center"><MapPin className="w-2.5 h-2.5 mr-1"/> US / Canada</span>
                  <span className="flex items-center"><Briefcase className="w-2.5 h-2.5 mr-1"/> Application</span>
                </div>
                <div className="flex space-x-2">
                  <button className="text-[9px] bg-slate-900 text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors">Apply Now</button>
                  <button className="text-[9px] bg-white border border-slate-300 text-slate-700 px-2 py-1 rounded hover:bg-slate-50 transition-colors">View Details</button>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-start p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-orange-300 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-lg text-white mr-3 shrink-0">
                M
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-[11px] text-slate-900">Meta Rotational Engineering Program</h4>
                  <div className="bg-emerald-50 text-emerald-700 text-[8px] px-1.5 py-0.5 rounded font-bold border border-emerald-100">NEW</div>
                </div>
                <div className="flex flex-wrap gap-2 text-[9px] text-slate-500 mb-1.5">
                  <span className="flex items-center text-emerald-600 font-medium"><Clock className="w-2.5 h-2.5 mr-1"/> Opens tomorrow (Oct 16)</span>
                  <span className="flex items-center"><MapPin className="w-2.5 h-2.5 mr-1"/> Menlo Park, CA</span>
                  <span className="flex items-center"><Briefcase className="w-2.5 h-2.5 mr-1"/> Application</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Next Month */}
        <div>
          <div className="text-[10px] font-bold text-slate-500 mb-2 border-b border-slate-200 pb-1 uppercase tracking-wider">Next Month (November)</div>
          <div className="space-y-2.5 opacity-70">
            <div className="flex items-start p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-not-allowed">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center font-bold text-lg text-white mr-3 shrink-0">
                A
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-[11px] text-slate-900 mb-1">Apple Hardware Engineering</h4>
                <div className="flex flex-wrap gap-2 text-[9px] text-slate-500">
                  <span className="flex items-center"><Clock className="w-2.5 h-2.5 mr-1"/> Nov 12 Deadline</span>
                  <span className="flex items-center"><MapPin className="w-2.5 h-2.5 mr-1"/> Cupertino, CA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CalendarMockup;
