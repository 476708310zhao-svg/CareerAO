import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, BookOpen, Bot, LineChart, FileEdit, Target, ShieldCheck, Calendar,
  CheckCircle2
} from 'lucide-react';

import ApplicationMockup from './mockups/ApplicationMockup';
import ExperienceMockup from './mockups/ExperienceMockup';
import InterviewMockup from './mockups/InterviewMockup';
import SalaryMockup from './mockups/SalaryMockup';
import ResumeMockup from './mockups/ResumeMockup';
import PlanningMockup from './mockups/PlanningMockup';
import AgencyMockup from './mockups/AgencyMockup';
import CalendarMockup from './mockups/CalendarMockup';

const colorMap: Record<string, { activeBg: string; activeText: string; check: string }> = {
  blue:    { activeBg: 'bg-blue-100',    activeText: 'text-blue-600',    check: 'text-blue-500' },
  indigo:  { activeBg: 'bg-indigo-100',  activeText: 'text-indigo-600',  check: 'text-indigo-500' },
  purple:  { activeBg: 'bg-purple-100',  activeText: 'text-purple-600',  check: 'text-purple-500' },
  emerald: { activeBg: 'bg-emerald-100', activeText: 'text-emerald-600', check: 'text-emerald-500' },
  amber:   { activeBg: 'bg-amber-100',   activeText: 'text-amber-600',   check: 'text-amber-500' },
  rose:    { activeBg: 'bg-rose-100',    activeText: 'text-rose-600',    check: 'text-rose-500' },
  cyan:    { activeBg: 'bg-cyan-100',    activeText: 'text-cyan-600',    check: 'text-cyan-500' },
  orange:  { activeBg: 'bg-orange-100',  activeText: 'text-orange-600',  check: 'text-orange-500' },
};

const featuresData = [
  {
    id: 'application',
    icon: <Send className="w-5 h-5" />,
    color: 'blue',
    title: "网申助手",
    desc: "告别繁琐的网申填表与 OQ (Open Questions)。",
    bullets: ["一键提取岗位 JD 核心要求", "基于你的简历自动生成高匹配度回答", "智能分析岗位匹配度与投递建议"],
    mockup: <ApplicationMockup />
  },
  {
    id: 'experience',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'indigo',
    title: "笔经面经",
    desc: "汇聚全网最新、最全的大厂面试真题与经验贴。",
    bullets: ["按公司、岗位、地区精准检索", "AI 自动总结高频考点与解题思路", "真实用户分享，拒绝过时信息"],
    mockup: <ExperienceMockup />
  },
  {
    id: 'interview',
    icon: <Bot className="w-5 h-5" />,
    color: 'purple',
    title: "AI 面试",
    desc: "随时随地开启全真模拟面试，克服面试紧张感。",
    bullets: ["支持 Behavioral 与 Technical 双模式", "实时语音对话，模拟真实面试压迫感", "面试后生成多维度雷达图评分报告"],
    mockup: <InterviewMockup />
  },
  {
    id: 'salary',
    icon: <LineChart className="w-5 h-5" />,
    color: 'emerald',
    title: "薪资查询",
    desc: "打破薪资信息差，谈薪更有底气。",
    bullets: ["提供最新 Base、Bonus、RSU 详细构成", "展示不同职级的分档水平", "分析影响薪资的关键因素（地区/学历）"],
    mockup: <SalaryMockup />
  },
  {
    id: 'resume',
    icon: <FileEdit className="w-5 h-5" />,
    color: 'amber',
    title: "我的简历",
    desc: "打造 ATS 友好的满分简历，提升过筛率。",
    bullets: ["沉浸式双栏编辑，实时 PDF 预览", "内置 DeepSeek AI，一键润色经历描述", "中英文双语模板，符合 STAR 法则"],
    mockup: <ResumeMockup />
  },
  {
    id: 'planning',
    icon: <Target className="w-5 h-5" />,
    color: 'rose',
    title: "求职规划",
    desc: "不再迷茫，为你定制专属的求职时间线。",
    bullets: ["根据背景生成 3/6/12 个月路线图", "明确每个阶段的技能提升与项目目标", "进度打卡，缓解求职焦虑"],
    mockup: <PlanningMockup />
  },
  {
    id: 'agency',
    icon: <ShieldCheck className="w-5 h-5" />,
    color: 'cyan',
    title: "机构测评",
    desc: "防坑指南，用数据还原真实的求职辅导机构。",
    bullets: ["基于全网真实用户评价与投诉数据", "AI 生成客观的优缺点与风险提示", "提供综合推荐度评分，避免踩雷"],
    mockup: <AgencyMockup />
  },
  {
    id: 'calendar',
    icon: <Calendar className="w-5 h-5" />,
    color: 'orange',
    title: "校招日历",
    desc: "不错过任何一个 Dream Company 的投递窗口。",
    bullets: ["实时更新北美/国内大厂校招时间表", "支持按岗位和地区筛选可投企业", "重要节点（网申/笔试）一键订阅提醒"],
    mockup: <CalendarMockup />
  }
];

export default function FeatureShowcase() {
  const [activeIdx1, setActiveIdx1] = useState(0);
  const [activeIdx2, setActiveIdx2] = useState(4);

  const renderTabList = (startIndex: number, endIndex: number, activeIdx: number, setActiveIdx: (idx: number) => void) => {
    return featuresData.slice(startIndex, endIndex).map((feature, i) => {
      const actualIdx = startIndex + i;
      const isActive = activeIdx === actualIdx;
      const colors = colorMap[feature.color];
      return (
        <div
          key={feature.id}
          onClick={() => setActiveIdx(actualIdx)}
          className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
            isActive
              ? 'bg-white shadow-xl border-gray-200 ring-1 ring-gray-900/5'
              : 'bg-gray-50/50 border-transparent hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              isActive ? `${colors.activeBg} ${colors.activeText}` : 'bg-white text-gray-400 shadow-sm'
            }`}>
              {feature.icon}
            </div>
            <div>
              <h3 className={`text-lg font-bold transition-colors ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                {feature.title}
              </h3>
              {!isActive && <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{feature.desc}</p>}
            </div>
          </div>
          
          <AnimatePresence>
            {isActive && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-4 pl-16">
                  <p className="text-sm text-gray-700 mb-4 leading-relaxed">{feature.desc}</p>
                  <ul className="space-y-2.5">
                    {feature.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-600">
                        <CheckCircle2 className={`w-4 h-4 ${colors.check} mr-2 shrink-0 mt-0.5`} />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    });
  };

  return (
    <section id="features-showcase" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">8 大核心模块，覆盖求职全生命周期</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">点击列表，探索 职引 如何在每一个环节为你赋能。</p>
        </div>

        {/* Part 1: Features 1-4 */}
        <div className="flex flex-col lg:flex-row gap-12 mb-24 items-center">
          <div className="w-full lg:w-5/12 flex flex-col space-y-3">
            <div className="mb-2">
              <h3 className="text-xl font-bold text-gray-900 mb-1">前期准备与投递</h3>
              <p className="text-sm text-gray-500">从网申到面试，全方位提升你的竞争力。</p>
            </div>
            {renderTabList(0, 4, activeIdx1, setActiveIdx1)}
          </div>
          <div className="w-full lg:w-7/12">
            <div className="h-[550px] w-full rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden flex relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIdx1}
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full absolute inset-0"
                >
                  {featuresData[activeIdx1].mockup}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Part 2: Features 5-8 */}
        <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
          <div className="w-full lg:w-5/12 flex flex-col space-y-3">
            <div className="mb-2">
              <h3 className="text-xl font-bold text-gray-900 mb-1">规划与决策支持</h3>
              <p className="text-sm text-gray-500">打破信息差，制定科学的求职路线图。</p>
            </div>
            {renderTabList(4, 8, activeIdx2, setActiveIdx2)}
          </div>
          <div className="w-full lg:w-7/12">
            <div className="h-[550px] w-full rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden flex relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIdx2}
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full absolute inset-0"
                >
                  {featuresData[activeIdx2].mockup}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
