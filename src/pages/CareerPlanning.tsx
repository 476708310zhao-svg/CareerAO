import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Calendar, CheckCircle2, Circle, Compass, Rocket, Sparkles, Target } from 'lucide-react';
import { Legend, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';

import SEO from '../components/SEO';

const skillData = [
  { subject: '算法', current: 55, target: 85 },
  { subject: '系统设计', current: 35, target: 80 },
  { subject: '项目表达', current: 70, target: 88 },
  { subject: '数据库', current: 58, target: 78 },
  { subject: '云服务', current: 32, target: 72 },
  { subject: '行为面试', current: 45, target: 86 },
];

const buildRoadmap = (role: string, timeline: string) => [
  {
    title: `第 1 阶段：夯实 ${role || '目标岗位'} 基础`,
    focus: '岗位关键词、简历主线、算法基础',
    tasks: ['梳理目标岗位 JD 高频关键词', '完成一版 ATS 友好的简历', '每周完成 8-12 道基础算法题', '准备 3 个可复用 STAR 案例'],
    progress: 35,
  },
  {
    title: '第 2 阶段：项目和面试能力强化',
    focus: '项目包装、系统设计、模拟面试',
    tasks: ['补齐一个能体现工程深度的项目', '每周完成 2 次 AI 模拟面试', '整理目标公司面经和题库', '建立投递公司优先级列表'],
    progress: 10,
  },
  {
    title: `第 3 阶段：投递、复盘和 offer 决策`,
    focus: `${timeline} 内稳定推进投递和复盘`,
    tasks: ['每周稳定投递 30-50 个岗位', '每场面试结束后记录复盘', '跟踪薪资、签证和团队匹配度', '准备 offer 谈判话术和备选方案'],
    progress: 0,
  },
];

export default function CareerPlanning() {
  const [activePhase, setActivePhase] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [formState, setFormState] = useState({
    role: 'Software Engineer',
    timeline: '6 个月',
    background: 'CS 硕士，1 段实习经历',
  });

  const roadmap = useMemo(() => buildRoadmap(formState.role, formState.timeline), [formState.role, formState.timeline]);

  const handleGenerate = () => {
    setIsGenerating(true);
    window.setTimeout(() => {
      setIsGenerating(false);
      setHasGenerated(true);
      setActivePhase(0);
    }, 800);
  };

  return (
    <main className="pt-24 pb-16 min-h-screen bg-gray-50">
      <SEO
        title="AI 求职规划"
        description="输入目标岗位、准备周期和背景，职引为留学生生成求职路线图、技能差距分析和阶段任务清单。"
        keywords="AI求职规划,职业规划,留学生找工作,求职路线图,秋招规划"
        canonical="https://www.zhiyincareer.com/career-planning"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="bg-gray-900 rounded-3xl p-8 md:p-12 mb-8 text-white shadow-xl">
          <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm font-medium mb-6">
                <Compass className="w-4 h-4 text-primary" />
                AI 求职路线图
              </div>
              <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">把求职目标拆成每周行动</h1>
              <p className="text-gray-300 text-lg max-w-2xl">
                根据目标岗位、准备周期和当前背景，生成技能差距、阶段任务和复盘重点，让求职不再靠临时焦虑推进。
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-primary" />
                定制你的方向
              </h3>
              <div className="space-y-3">
                <input value={formState.role} onChange={(event) => setFormState({ ...formState, role: event.target.value })} className="w-full bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50" placeholder="目标岗位" />
                <select value={formState.timeline} onChange={(event) => setFormState({ ...formState, timeline: event.target.value })} className="w-full bg-white text-gray-900 border-none rounded-lg px-3 py-2 text-sm outline-none">
                  <option value="3 个月">3 个月冲刺</option>
                  <option value="6 个月">6 个月系统准备</option>
                  <option value="12 个月">12 个月长期规划</option>
                </select>
                <textarea value={formState.background} onChange={(event) => setFormState({ ...formState, background: event.target.value })} className="w-full bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50 h-20 resize-none" placeholder="当前背景" />
                <button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl font-bold transition-colors mt-2 flex items-center justify-center disabled:opacity-70">
                  {isGenerating ? '生成中...' : <><Rocket className="w-4 h-4 mr-2" />生成路线图</>}
                </button>
              </div>
            </div>
          </div>
        </section>

        {hasGenerated ? (
          <div className="grid lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 grid md:grid-cols-2 gap-8 items-center">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={skillData}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                      <Radar name="当前能力" dataKey="current" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.35} />
                      <Radar name="目标要求" dataKey="target" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.12} />
                      <Legend iconType="circle" />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center mb-4">
                    <Target className="w-5 h-5 mr-2 text-primary" />
                    核心差距诊断
                  </h2>
                  <div className="space-y-3">
                    <div className="border border-amber-100 bg-amber-50 p-4 rounded-xl">
                      <h3 className="font-bold text-amber-800 text-sm mb-1">优先补强：系统设计与云服务</h3>
                      <p className="text-xs text-amber-700 leading-relaxed">目标岗位对工程深度和架构理解有要求，建议每周安排固定时间补齐。</p>
                    </div>
                    <div className="border border-green-100 bg-green-50 p-4 rounded-xl">
                      <h3 className="font-bold text-green-800 text-sm mb-1">可放大优势：项目表达</h3>
                      <p className="text-xs text-green-700 leading-relaxed">你已有项目基础，下一步应把结果指标、技术决策和个人贡献讲清楚。</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-deep mb-6 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary" />
                  阶段路线图
                </h2>
                <div className="space-y-4">
                  {roadmap.map((phase, index) => (
                    <button
                      key={phase.title}
                      onClick={() => setActivePhase(index)}
                      className={`w-full text-left rounded-xl border p-5 transition-all ${activePhase === index ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-white border-gray-100 hover:bg-gray-50'}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{phase.title}</h3>
                          <p className="text-xs text-primary font-medium mt-1">{phase.focus}</p>
                        </div>
                        <span className="text-sm font-bold text-primary">{phase.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: `${phase.progress}%` }} />
                      </div>
                      {activePhase === index && (
                        <div className="space-y-3">
                          {phase.tasks.map((task, taskIndex) => (
                            <div key={task} className="flex items-start text-sm text-gray-700">
                              {taskIndex === 0 ? <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0" /> : <Circle className="w-5 h-5 text-gray-300 mr-3 shrink-0" />}
                              {task}
                            </div>
                          ))}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">当前目标</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg"><span className="text-gray-500">岗位</span><span className="font-semibold text-gray-900">{formState.role}</span></div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg"><span className="text-gray-500">周期</span><span className="font-semibold text-gray-900">{formState.timeline}</span></div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 text-amber-500 mr-2" />
                  推荐资源
                </h3>
                {['系统设计入门清单', 'LeetCode 高频 150 题', '行为面试 STAR 案例库'].map((item) => (
                  <div key={item} className="p-3 border border-gray-100 rounded-xl mb-3 text-sm font-medium text-gray-700 bg-gray-50">
                    {item}
                  </div>
                ))}
                <Link to="/interview-prep" className="inline-flex items-center text-primary font-bold text-sm mt-2">
                  查看备考资源
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </aside>
          </div>
        ) : (
          <div className="bg-white rounded-2xl h-[360px] border border-gray-100 p-8 flex items-center justify-center text-center">
            <div>
              <Compass className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-500">路线图等待生成</h2>
              <p className="text-gray-400 mt-2">请先设定求职目标和准备周期。</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
