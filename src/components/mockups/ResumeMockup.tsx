import React from 'react';
import { motion } from 'motion/react';
import { Bot, FileText, CheckCircle2, Sparkles, Download, LayoutTemplate, AlignLeft } from 'lucide-react';

const ResumeMockup = () => (
  <div className="flex h-full w-full bg-slate-50 overflow-hidden">
    {/* Left Panel: Editor */}
    <div className="w-[45%] bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          <span className="font-semibold text-slate-800">Resume Builder</span>
        </div>
        <div className="flex space-x-2">
          <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
            <LayoutTemplate className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
            <AlignLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden p-3 space-y-4 flex flex-col">
        {/* Section: Personal Info */}
        <div className="shrink-0">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Personal Info</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[9px] font-medium text-slate-500 mb-0.5">Full Name</label>
              <input type="text" disabled value="Alex Chen" className="w-full h-6 px-1.5 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-700" />
            </div>
            <div>
              <label className="block text-[9px] font-medium text-slate-500 mb-0.5">Email</label>
              <input type="text" disabled value="alex.chen@email.com" className="w-full h-6 px-1.5 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-700" />
            </div>
          </div>
        </div>

        {/* Section: Experience */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-2 shrink-0">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Experience</div>
            <button className="text-[9px] text-indigo-600 font-medium hover:underline">+ Add New</button>
          </div>
          
          <div className="border border-indigo-100 rounded-lg p-2 bg-indigo-50/30 relative flex-1 flex flex-col min-h-0">
            <div className="absolute -left-[1px] top-3 bottom-3 w-[2px] bg-indigo-500 rounded-r-md"></div>
            <div className="grid grid-cols-2 gap-2 mb-2 shrink-0">
              <div>
                <label className="block text-[9px] font-medium text-slate-500 mb-0.5">Company</label>
                <input type="text" disabled value="ByteDance" className="w-full h-6 px-1.5 bg-white border border-slate-200 rounded text-[10px] text-slate-800" />
              </div>
              <div>
                <label className="block text-[9px] font-medium text-slate-500 mb-0.5">Role</label>
                <input type="text" disabled value="Software Engineer Intern" className="w-full h-6 px-1.5 bg-white border border-slate-200 rounded text-[10px] text-slate-800" />
              </div>
            </div>
            
            <div className="flex-1 flex flex-col min-h-0 relative">
              <label className="block text-[9px] font-medium text-slate-500 mb-1 flex justify-between items-center shrink-0">
                <span>Description</span>
                <span className="text-indigo-600 flex items-center cursor-pointer font-medium hover:text-indigo-700 bg-indigo-100/50 px-1 py-0.5 rounded text-[8px]">
                  <Sparkles className="w-2.5 h-2.5 mr-0.5" /> AI Optimize
                </span>
              </label>
              <div className="relative flex-1 min-h-0">
                <textarea 
                  disabled 
                  className="w-full h-full p-2 bg-white border border-indigo-200 rounded text-[10px] text-slate-600 resize-none leading-relaxed" 
                  value="• Developed a new feature for the user dashboard using React.&#10;• Improved page load speed by 20%.&#10;• Collaborated with backend team on API design."
                />
                
                {/* AI Suggestion Overlay */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                  className="absolute top-1 left-1 right-1 bg-white rounded shadow-md border border-indigo-100 p-2 z-10"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="text-[9px] font-bold text-indigo-600 flex items-center">
                      <Bot className="w-2.5 h-2.5 mr-1" /> AI Suggestion (STAR)
                    </div>
                    <span className="text-[8px] text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded font-medium border border-emerald-100 flex items-center">
                      <CheckCircle2 className="w-2 h-2 mr-0.5" /> +25% Impact
                    </span>
                  </div>
                  <div className="text-[9px] text-slate-700 space-y-1 leading-relaxed bg-slate-50 p-1.5 rounded border border-slate-100">
                    <p>• Spearheaded dynamic user dashboard using React/Redux, enhancing engagement by 15%.</p>
                    <p>• Optimized rendering pipelines, reducing load time by 20% (1.2s to 0.9s).</p>
                  </div>
                  <div className="mt-1.5 flex justify-end space-x-1.5">
                    <button className="text-[8px] px-1.5 py-0.5 text-slate-500 hover:text-slate-700 font-medium">Dismiss</button>
                    <button className="text-[8px] px-2 py-0.5 bg-indigo-600 text-white rounded shadow-sm hover:bg-indigo-700 font-medium transition-colors">Apply</button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Right Panel: Preview */}
    <div className="w-[55%] bg-slate-200/50 p-4 flex flex-col items-center overflow-hidden relative">
      <div className="absolute top-2 right-4 flex space-x-2 z-10">
        <button className="flex items-center text-[9px] font-medium bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded shadow-sm hover:bg-slate-50">
          <Download className="w-2.5 h-2.5 mr-1" /> PDF
        </button>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[320px] bg-white shadow-xl border border-slate-200 p-5 h-full overflow-hidden flex flex-col"
      >
        {/* Resume Header */}
        <div className="text-center mb-3 shrink-0">
          <h1 className="text-lg font-serif font-bold text-slate-900 tracking-tight">ALEX CHEN</h1>
          <div className="text-[8px] text-slate-500 mt-1 flex justify-center space-x-1.5">
            <span>alex.chen@email.com</span>
            <span>•</span>
            <span>(555) 123-4567</span>
            <span>•</span>
            <span>linkedin.com/in/alexchen</span>
          </div>
        </div>

        {/* Resume Education */}
        <div className="mb-3 shrink-0">
          <div className="text-[9px] font-bold text-slate-800 border-b border-slate-300 pb-0.5 mb-1.5 uppercase tracking-widest">Education</div>
          <div className="flex justify-between items-baseline">
            <span className="text-[9px] font-bold text-slate-800">University of California, Berkeley</span>
            <span className="text-[8px] text-slate-600">Expected May 2025</span>
          </div>
          <div className="flex justify-between items-baseline mt-0.5">
            <span className="text-[8px] italic text-slate-700">B.S. in Electrical Engineering & Computer Sciences (EECS)</span>
            <span className="text-[8px] text-slate-600">GPA: 3.8/4.0</span>
          </div>
        </div>

        {/* Resume Experience */}
        <div className="mb-3 shrink-0">
          <div className="text-[9px] font-bold text-slate-800 border-b border-slate-300 pb-0.5 mb-1.5 uppercase tracking-widest">Experience</div>
          
          <div className="mb-2">
            <div className="flex justify-between items-baseline">
              <span className="text-[9px] font-bold text-slate-800">ByteDance</span>
              <span className="text-[8px] text-slate-600">May 2023 - Aug 2023</span>
            </div>
            <div className="flex justify-between items-baseline mt-0.5 mb-1">
              <span className="text-[8px] italic text-slate-700">Software Engineer Intern</span>
              <span className="text-[8px] text-slate-600">San Jose, CA</span>
            </div>
            <ul className="list-disc pl-3 text-[8px] text-slate-700 space-y-0.5 leading-relaxed">
              <motion.li 
                initial={{ backgroundColor: "transparent" }}
                animate={{ backgroundColor: ["rgba(238,242,255,1)", "rgba(238,242,255,0)"] }}
                transition={{ delay: 1.5, duration: 2 }}
                className="rounded px-1 -ml-1"
              >
                Spearheaded dynamic user dashboard using React/Redux, enhancing engagement by 15%.
              </motion.li>
              <motion.li 
                initial={{ backgroundColor: "transparent" }}
                animate={{ backgroundColor: ["rgba(238,242,255,1)", "rgba(238,242,255,0)"] }}
                transition={{ delay: 1.7, duration: 2 }}
                className="rounded px-1 -ml-1"
              >
                Optimized rendering pipelines, reducing load time by 20% (1.2s to 0.9s).
              </motion.li>
              <li>Collaborated with backend team on API design, ensuring seamless data integration.</li>
            </ul>
          </div>
        </div>

        {/* Resume Skills */}
        <div className="shrink-0">
          <div className="text-[9px] font-bold text-slate-800 border-b border-slate-300 pb-0.5 mb-1.5 uppercase tracking-widest">Skills</div>
          <div className="text-[8px] text-slate-700 space-y-0.5">
            <p><span className="font-bold">Languages:</span> JavaScript/TypeScript, Python, Java, C++, SQL</p>
            <p><span className="font-bold">Frameworks:</span> React, Node.js, Express, Next.js, Tailwind CSS</p>
            <p><span className="font-bold">Tools:</span> Git, Docker, AWS (S3, EC2), Figma</p>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
);

export default ResumeMockup;
