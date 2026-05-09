import React, { useState } from 'react';
import { 
  Compass, 
  Target, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  MessageSquare, 
  ArrowRight, 
  Clock,
  Sparkles,
  Briefcase,
  GraduationCap,
  BrainCircuit,
  Map,
  BookOpen,
  Wrench,
  Rocket
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';
import SEO from '../components/SEO';

export default function CareerPlanning() {
  const [activePhase, setActivePhase] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [formState, setFormState] = useState({
    role: 'Software Engineer',
    timeline: '6 个月',
    background: 'Master in CS'
  });

  const mockSkills = [
    { subject: 'Algorithm', A: 50, B: 90, fullMark: 100 },
    { subject: 'System Design', A: 30, B: 80, fullMark: 100 },
    { subject: 'Frameworks', A: 70, B: 85, fullMark: 100 },
    { subject: 'Databases', A: 60, B: 80, fullMark: 100 },
    { subject: 'CI/CD & Cloud', A: 20, B: 70, fullMark: 100 },
    { subject: 'Behavioral', A: 40, B: 90, fullMark: 100 },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate AI thinking
    setTimeout(() => {
      setIsGenerating(false);
      setHasGenerated(true);
      setActivePhase(1); // Reset to first phase
    }, 2000);
  };

  const generatedRoadmap = [
    {
      id: 1,
      title: 'Month 1-2: 夯实基础与技能填补',
      focus: '算法突破 & 系统设计入门',
      status: 'current',
      progress: 35,
      tasks: [
        { name: '每日 2 题 LeetCode (中等为主，重点树/图/DP)', completed: true },
        { name: '学习《架构面面观》基础章节', completed: false },
        { name: '补充缺失的云原生知识 (部署一个 AWS 小项目)', completed: false },
        { name: '完成一份能过 ATS (90分+) 的初始简历', completed: false }
      ]
    },
    {
      id: 2,
      title: 'Month 3-4: 旗舰项目与面经突击',
      focus: '提升简历含金量 & 内推准备',
      status: 'upcoming',
      progress: 0,
      tasks: [
        { name: '完成一个高并发/全栈全量级开源或个人项目', completed: false },
        { name: '锁定 30 家 Target Companies 并寻找内推', completed: false },
        { name: '开始高频系统设计题刷题 (e.g. Rate Limiter, TinyURL)', completed: false },
        { name: '打磨 STAR 法则行为面试 (BQ) 故事库 (至少 5 个)', completed: false }
      ]
    },
    {
      id: 3,
      title: 'Month 5-6: 海投、面试与收割',
      focus: 'Mock Interview & Offer Negotiation',
      status: 'upcoming',
      progress: 0,
      tasks: [
        { name: '每周保障 3-5 场 Mock Interview 甚至录音复盘', completed: false },
        { name: '海投节奏维持在每周 50份+', completed: false },
        { name: '复盘每一场实战面试的弱项并查漏补缺', completed: false },
        { name: '进入 Offer 谈判期并决策', completed: false }
      ]
    }
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50 flex flex-col">
      <SEO
        title="AI 职业规划 (AI Career Planning)"
        description="基于目标拆解的个性化AI职业规划生成器。输入你的目标岗位与背景，一键生成从投递到拿Offer的完整路线图及能力雷达图。"
        keywords="AI职业规划, 简历修改推荐, 找实习时间线, 找工作规划, GPT求职"
        canonical="https://www.zhiyincareer.com/career-planning"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        
        {/* Header Summary */}
        <div className="bg-deep rounded-3xl p-8 md:p-12 mb-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/10">
                <BrainCircuit className="w-4 h-4 text-primary" />
                <span>AI 驱动规划引擎</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                 求职路线图 (Career Roadmap)
              </h1>
              <p className="text-gray-300 text-lg">
                基于数万真实大厂上岸者的足迹，AI 为你逆向推导需要具备的技能要求，并拆解为可操作的时间表。
              </p>
            </div>
            
            {/* Quick Overview Form Trigger */}
            {!hasGenerated && (
                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shrink-0 w-full md:w-80">
                  <h3 className="font-bold text-white mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-primary" />
                    定制你的方向
                  </h3>
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      value={formState.role} 
                      onChange={(e) => setFormState({...formState, role: e.target.value})}
                      placeholder="目标岗位 (e.g. SDE)" 
                      className="w-full bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50" 
                    />
                    <select 
                      value={formState.timeline}
                      onChange={(e) => setFormState({...formState, timeline: e.target.value})}
                      className="w-full bg-white text-gray-900 border-none rounded-lg px-3 py-2 text-sm outline-none"
                    >
                      <option value="3 个月">3 个月突击</option>
                      <option value="6 个月">6 个月系统准备</option>
                      <option value="12 个月">12 个月长线规划</option>
                    </select>
                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl font-bold transition-colors mt-2 shadow-sm flex items-center justify-center disabled:opacity-70"
                    >
                      {isGenerating ? (
                         <div className="flex items-center">
                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                           AI 计算中...
                         </div>
                      ) : (
                        <>一键生成路线图 <Rocket className="w-4 h-4 ml-2" /></>
                      )}
                    </button>
                  </div>
                </div>
            )}
            
            {hasGenerated && (
               <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shrink-0 text-center w-full md:w-64">
               <div className="text-gray-300 text-sm mb-2">整体进度概览</div>
               <div className="text-4xl font-bold text-white mb-4">15<span className="text-xl text-gray-400">%</span></div>
               <div className="w-full bg-gray-700/50 rounded-full h-2 mb-2">
                 <div className="bg-primary h-2 rounded-full" style={{ width: '15%' }}></div>
               </div>
               <div className="text-xs text-gray-400">目前阶段：Month 1-2 补基建</div>
             </div>
            )}
          </div>
        </div>

        {hasGenerated ? (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Left Column: Timeline & Skill Gap */}
           <div className="lg:col-span-2 space-y-8">
             
             {/* Skill Gap Analysis */}
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/2 h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={mockSkills}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 600 }} />
                      <Radar name="Current 你的现状" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                      <Radar name="Target 岗位要求" dataKey="B" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeDasharray="3 3"/>
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }}/>
                      <RechartsTooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2">
                   <h3 className="text-lg font-bold text-gray-900 flex items-center mb-4">
                     <Target className="w-5 h-5 mr-2 text-indigo-500" />
                     核心能力差距诊断
                   </h3>
                   <div className="space-y-4">
                      <div className="border border-red-100 bg-red-50 p-4 rounded-xl">
                         <h4 className="font-bold text-red-800 text-sm mb-1">🔴 严重不足：系统设计与云化</h4>
                         <p className="text-xs text-red-700 leading-relaxed">目标岗位 {formState.role} 对架构能力有基础考量，目前你的储备较弱。建议安排 40 小时优先填补。</p>
                      </div>
                      <div className="border border-green-100 bg-green-50 p-4 rounded-xl">
                         <h4 className="font-bold text-green-800 text-sm mb-1">🟢 优势地带：框架技能</h4>
                         <p className="text-xs text-green-700 leading-relaxed">你的 React/Node.js 生态掌握较好，面试中可将重点引导至前端工程化与性能调优。</p>
                      </div>
                   </div>
                </div>
             </div>

             {/* Roadmap Timeline */}
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
               <h2 className="text-xl font-bold text-deep mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
                 <div className="flex items-center">
                    <Map className="w-5 h-5 mr-2 text-primary" />
                    AI 月度作战路线图
                 </div>
                 <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">定制时长: {formState.timeline}</span>
               </h2>
               
               <div className="space-y-4">
                 {generatedRoadmap.map((phase) => (
                   <div 
                     key={phase.id}
                     onClick={() => setActivePhase(phase.id)}
                     className={`relative pl-8 py-5 cursor-pointer transition-all border ${
                       activePhase === phase.id ? 'bg-primary/5 rounded-xl border-primary/20 shadow-sm' : 'hover:bg-gray-50 rounded-xl border-transparent'
                     }`}
                   >
                     {/* Timeline Line */}
                     {phase.id !== generatedRoadmap.length && (
                       <div className="absolute left-[15px] top-12 bottom-[-30px] w-0.5 bg-gray-200"></div>
                     )}
                     
                     {/* Timeline Dot */}
                     <div className={`absolute left-3 top-6 w-3.5 h-3.5 rounded-full border-2 ${
                       phase.status === 'current' ? 'bg-primary border-primary ring-4 ring-primary/20' : 
                       'bg-white border-gray-300'
                     }`}></div>
 
                     <div className="ml-4">
                       <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                         <div>
                            <h3 className={`font-bold text-lg ${activePhase === phase.id ? 'text-primary-dark' : 'text-gray-900'}`}>
                              {phase.title}
                            </h3>
                            <p className="text-xs text-indigo-600 font-medium mt-0.5 uppercase tracking-wide">{phase.focus}</p>
                         </div>
                       </div>
                       
                       {/* Tasks for active phase */}
                       {activePhase === phase.id && (
                         <div className="mt-5 space-y-3">
                           <div className="flex items-center justify-between text-sm mb-2">
                             <span className="text-gray-600 font-medium">阶段子任务拆解</span>
                             <span className="text-primary font-bold">{phase.progress}%</span>
                           </div>
                           <div className="w-full bg-gray-200 rounded-full h-1.5 mb-5">
                             <div className="bg-primary h-1.5 rounded-full transition-all duration-500" style={{ width: `${phase.progress}%` }}></div>
                           </div>
                           
                           {phase.tasks.map((task, tIndex) => (
                             <div key={tIndex} className="flex items-start group">
                               <button className="mt-0.5 mr-3 shrink-0 focus:outline-none">
                                 {task.completed ? (
                                   <CheckCircle2 className="w-5 h-5 text-green-500" />
                                 ) : (
                                   <Circle className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                                 )}
                               </button>
                               <span className={`text-sm leading-relaxed ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                 {task.name}
                               </span>
                             </div>
                           ))}
                         </div>
                       )}
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           </div>
 
           {/* Right Column: AI Advisor & Daily Tasks & Resources */}
           <div className="space-y-6">
             
             {/* Target Refine */}
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-gray-900">重新标定方向</h3>
                   <button onClick={() => setHasGenerated(false)} className="text-xs font-bold text-indigo-600 hover:text-indigo-800">去修改</button>
                </div>
                <div className="space-y-3 text-sm">
                   <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                     <span className="text-gray-500">目标岗位</span>
                     <span className="font-semibold text-gray-900">{formState.role}</span>
                   </div>
                   <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                     <span className="text-gray-500">计划周期</span>
                     <span className="font-semibold text-gray-900">{formState.timeline}</span>
                   </div>
                </div>
             </div>
 
             {/* Recommended Resources Cards */}
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
               <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
                 <div className="flex items-center">
                    <BookOpen className="w-5 h-5 text-amber-500 mr-2" />
                    能力补给包 (Resources)
                 </div>
               </h3>
               
               <div className="space-y-3">
                 <div className="p-3 border border-gray-100 hover:border-amber-200 hover:shadow-sm transition-all rounded-xl cursor-pointer bg-amber-50/30">
                    <div className="flex items-center mb-2">
                       <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded mr-2">必读经典</span>
                       <h4 className="font-bold text-gray-900 text-sm truncate">Designing Data-Intensive Applications</h4>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">系统设计硬核神作，填平你的 🔴 严重不足项。</p>
                 </div>
                 
                 <div className="p-3 border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all rounded-xl cursor-pointer bg-blue-50/30">
                    <div className="flex items-center mb-2">
                       <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded mr-2">实战靶场</span>
                       <h4 className="font-bold text-gray-900 text-sm">LeetCode Top 150</h4>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">涵盖 80% 大厂面频，结合 NeetCode 路线食用佳。</p>
                 </div>

                 <div className="p-3 border border-gray-100 hover:border-purple-200 hover:shadow-sm transition-all rounded-xl cursor-pointer bg-purple-50/30">
                    <div className="flex items-center mb-2">
                       <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded mr-2">内功心法</span>
                       <h4 className="font-bold text-gray-900 text-sm">Cracking the PM Interview</h4>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">理解产品核心逻辑，培养你的 Behavior Question 叙事框架。</p>
                 </div>
               </div>
               
               <button className="w-full mt-4 py-2 text-sm font-medium text-gray-600 hover:text-amber-600 flex items-center justify-center transition-colors">
                 查看全部 24 个推荐资源 <ArrowRight className="w-4 h-4 ml-1" />
               </button>
             </div>
 
           </div>
         </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-60 pointer-events-none filter grayscale">
               {/* Show blurred placeholder when not generated */}
               <div className="md:col-span-2 bg-white rounded-2xl h-[400px] border border-gray-100 p-8 flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-t from-gray-100/50 to-transparent"></div>
                   <div className="text-center z-10">
                       <Compass className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                       <h2 className="text-xl font-bold text-gray-400">路线图构建中...</h2>
                       <p className="text-gray-400 mt-2">请在上方设定你的求职目标并点击生成</p>
                   </div>
               </div>
               <div className="bg-white rounded-2xl h-[400px] border border-gray-100"></div>
           </div>
        )}

      </div>
    </div>
  );
}
