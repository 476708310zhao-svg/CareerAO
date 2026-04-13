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
  GraduationCap
} from 'lucide-react';

export default function CareerPlanning() {
  const [activePhase, setActivePhase] = useState(1);

  const phases = [
    {
      id: 1,
      title: '探索与准备期 (Preparation)',
      timeframe: '毕业前 9-12 个月',
      status: 'current',
      progress: 50,
      tasks: [
        { name: '确定目标岗位与行业', completed: true },
        { name: '完成中英文简历初稿', completed: true },
        { name: '更新 LinkedIn 个人主页', completed: false },
        { name: '开始 LeetCode 刷题 (每日 2 题)', completed: false }
      ]
    },
    {
      id: 2,
      title: '秋招/春招网申期 (Application)',
      timeframe: '毕业前 6-9 个月',
      status: 'upcoming',
      progress: 0,
      tasks: [
        { name: '整理 Target Company 清单', completed: false },
        { name: '寻找校友内推 (Referral)', completed: false },
        { name: '海投简历 (每周 20+)', completed: false },
        { name: '参加校园招聘会 (Career Fair)', completed: false }
      ]
    },
    {
      id: 3,
      title: '面试冲刺期 (Interview)',
      timeframe: '毕业前 3-6 个月',
      status: 'upcoming',
      progress: 0,
      tasks: [
        { name: '完成 5 次 Mock Interview', completed: false },
        { name: '准备 Behavioral Questions (STAR 法则)', completed: false },
        { name: '复盘笔试/面试经验', completed: false }
      ]
    },
    {
      id: 4,
      title: 'Offer 与签证期 (Offer & Visa)',
      timeframe: '毕业前 1-3 个月',
      status: 'upcoming',
      progress: 0,
      tasks: [
        { name: 'Offer 薪资谈判 (Negotiation)', completed: false },
        { name: '申请 OPT/CPT (留学生专属)', completed: false },
        { name: '背景调查准备 (Background Check)', completed: false }
      ]
    }
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="bg-deep rounded-3xl p-8 md:p-12 mb-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/10">
                <Compass className="w-4 h-4 text-primary" />
                <span>AI 驱动的个性化求职路线图</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                你的专属求职规划 (Career Roadmap)
              </h1>
              <p className="text-gray-300 text-lg">
                告别求职焦虑。根据你的毕业时间、专业和目标岗位，AI 为你量身定制从准备到拿 Offer 的每一步行动指南。
              </p>
            </div>
            
            {/* Overall Progress */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shrink-0 text-center w-full md:w-64">
              <div className="text-gray-300 text-sm mb-2">整体求职进度</div>
              <div className="text-4xl font-bold text-white mb-4">12<span className="text-xl text-gray-400">%</span></div>
              <div className="w-full bg-gray-700/50 rounded-full h-2 mb-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '12%' }}></div>
              </div>
              <div className="text-xs text-gray-400">距离秋招开启还有 45 天</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Timeline Roadmap */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-deep mb-6 flex items-center">
                <Target className="w-5 h-5 mr-2 text-primary" />
                求职时间线 (Timeline)
              </h2>
              
              <div className="space-y-4">
                {phases.map((phase, index) => (
                  <div 
                    key={phase.id}
                    onClick={() => setActivePhase(phase.id)}
                    className={`relative pl-6 py-4 cursor-pointer transition-all ${
                      activePhase === phase.id ? 'bg-primary/5 rounded-xl' : 'hover:bg-gray-50 rounded-xl'
                    }`}
                  >
                    {/* Timeline Line */}
                    {index !== phases.length - 1 && (
                      <div className="absolute left-[11px] top-10 bottom-[-20px] w-0.5 bg-gray-200"></div>
                    )}
                    
                    {/* Timeline Dot */}
                    <div className={`absolute left-2 top-5 w-3 h-3 rounded-full border-2 ${
                      phase.status === 'current' ? 'bg-primary border-primary ring-4 ring-primary/20' : 
                      phase.status === 'completed' ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'
                    }`}></div>

                    <div className="ml-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <h3 className={`font-bold text-lg ${activePhase === phase.id ? 'text-primary-dark' : 'text-gray-900'}`}>
                          {phase.title}
                        </h3>
                        <span className="text-sm text-gray-500 flex items-center mt-1 md:mt-0">
                          <Clock className="w-4 h-4 mr-1" />
                          {phase.timeframe}
                        </span>
                      </div>
                      
                      {/* Tasks for active phase */}
                      {activePhase === phase.id && (
                        <div className="mt-4 space-y-3">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600 font-medium">阶段任务完成度</span>
                            <span className="text-primary font-bold">{phase.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
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
                              <span className={`text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
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

          {/* Right Column: AI Advisor & Daily Tasks */}
          <div className="space-y-6">
            
            {/* AI Career Advisor Form */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 shadow-sm border border-indigo-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-24 h-24 text-indigo-500" />
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-indigo-900 mb-2 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-indigo-600" />
                  定制专属规划
                </h3>
                <p className="text-sm text-indigo-700/80 mb-4">
                  告诉 AI 你的背景，生成精确到周的求职行动指南。
                </p>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-indigo-900 mb-1">毕业时间 (Graduation)</label>
                    <select className="w-full bg-white border border-indigo-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none">
                      <option>2026 年 5 月 (Spring)</option>
                      <option>2026 年 12 月 (Fall)</option>
                      <option>2027 年 5 月 (Spring)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-indigo-900 mb-1">目标岗位 (Target Role)</label>
                    <input type="text" placeholder="e.g. Data Scientist" className="w-full bg-white border border-indigo-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" defaultValue="Software Engineer" />
                  </div>
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-medium transition-colors mt-2 shadow-sm shadow-indigo-200">
                    重新生成规划
                  </button>
                </div>
              </div>
            </div>

            {/* Daily Focus */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
                <span>今日专注 (Daily Focus)</span>
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">2 待办</span>
              </h3>
              
              <div className="space-y-3">
                <div className="p-3 rounded-xl border border-gray-100 bg-gray-50 flex items-start">
                  <div className="bg-white p-2 rounded-lg shadow-sm mr-3 shrink-0">
                    <Briefcase className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">投递 5 家科技公司</h4>
                    <p className="text-xs text-gray-500 mt-1">优先投递内推池中的岗位，注意查看截止日期。</p>
                  </div>
                </div>
                
                <div className="p-3 rounded-xl border border-gray-100 bg-gray-50 flex items-start">
                  <div className="bg-white p-2 rounded-lg shadow-sm mr-3 shrink-0">
                    <MessageSquare className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">发送 3 封 Coffee Chat 邀请</h4>
                    <p className="text-xs text-gray-500 mt-1">在 LinkedIn 上寻找同校校友进行 Networking。</p>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-4 py-2 text-sm font-medium text-gray-600 hover:text-primary flex items-center justify-center transition-colors border border-gray-200 rounded-xl hover:border-primary/30 hover:bg-primary/5">
                查看完整任务库 <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
