import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  FileEdit, 
  Bot, 
  LineChart, 
  ArrowRight, 
  CheckCircle2, 
  Briefcase,
  Globe,
  Play,
  Send,
  BookOpen,
  Target,
  ShieldCheck,
  Calendar,
  GraduationCap,
  Filter,
  Building2,
  Sparkles
} from 'lucide-react';
import FeatureShowcase from '../components/FeatureShowcase';
import AuthModal from '../components/AuthModal';

const HeroMockup = () => (
  <motion.div 
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay: 0.2 }}
    className="relative w-full max-w-5xl mx-auto mt-16 rounded-xl border border-gray-200 bg-white shadow-2xl overflow-hidden"
  >
    {/* Browser Header */}
    <div className="h-10 bg-gray-50 border-b border-gray-200 flex items-center px-4 space-x-2">
      <div className="w-3 h-3 rounded-full bg-red-400"></div>
      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
      <div className="w-3 h-3 rounded-full bg-green-400"></div>
      <div className="ml-4 flex-1 flex justify-center">
        <div className="h-5 w-1/2 max-w-sm bg-white border border-gray-200 rounded text-[10px] text-gray-400 flex items-center justify-center">
          <Search className="w-3 h-3 mr-1" /> app.careerai.com
        </div>
      </div>
    </div>
    {/* App Content Mockup */}
    <div className="flex h-[450px]">
      {/* Sidebar */}
      <div className="w-48 border-r border-gray-100 bg-gray-50 p-3 hidden md:flex flex-col">
        <div className="flex items-center space-x-2 mb-4 px-2 shrink-0">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <GraduationCap className="text-white w-3 h-3" />
          </div>
          <span className="font-bold text-sm text-deep">CareerAI</span>
        </div>
        <div className="space-y-0.5 flex-1 overflow-y-auto pr-1">
          <div className="h-8 bg-primary/10 rounded-md text-primary flex items-center px-2.5 text-xs font-medium">
            <Send className="w-3.5 h-3.5 mr-2" /> 网申助手
          </div>
          <div className="h-8 hover:bg-gray-100 rounded-md text-gray-600 flex items-center px-2.5 text-xs transition-colors">
            <BookOpen className="w-3.5 h-3.5 mr-2" /> 笔经面经
          </div>
          <div className="h-8 hover:bg-gray-100 rounded-md text-gray-600 flex items-center px-2.5 text-xs transition-colors">
            <Bot className="w-3.5 h-3.5 mr-2" /> AI 面试
          </div>
          <div className="h-8 hover:bg-gray-100 rounded-md text-gray-600 flex items-center px-2.5 text-xs transition-colors">
            <LineChart className="w-3.5 h-3.5 mr-2" /> 薪资查询
          </div>
          <div className="h-8 hover:bg-gray-100 rounded-md text-gray-600 flex items-center px-2.5 text-xs transition-colors">
            <FileEdit className="w-3.5 h-3.5 mr-2" /> 我的简历
          </div>
          <div className="h-8 hover:bg-gray-100 rounded-md text-gray-600 flex items-center px-2.5 text-xs transition-colors">
            <Target className="w-3.5 h-3.5 mr-2" /> 求职规划
          </div>
          <div className="h-8 hover:bg-gray-100 rounded-md text-gray-600 flex items-center px-2.5 text-xs transition-colors">
            <ShieldCheck className="w-3.5 h-3.5 mr-2" /> 机构测评
          </div>
          <div className="h-8 hover:bg-gray-100 rounded-md text-gray-600 flex items-center px-2.5 text-xs transition-colors">
            <Calendar className="w-3.5 h-3.5 mr-2" /> 校招日历
          </div>
        </div>
        <div className="mt-2 pt-3 border-t border-gray-200 shrink-0">
          <div className="flex items-center px-2">
            <div className="w-7 h-7 rounded-full bg-gray-200"></div>
            <div className="ml-2">
              <div className="text-xs font-medium text-deep">Alex Chen</div>
              <div className="text-[9px] text-gray-500">Pro Plan</div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content - Job Board Dual Column */}
      <div className="flex-1 flex bg-white overflow-hidden">
        {/* Job List */}
        <div className="w-full sm:w-[35%] border-r border-gray-100 p-4 flex flex-col h-full">
          <div className="relative mb-4 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input type="text" disabled placeholder="Software Engineer..." className="w-full h-9 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-md text-sm" />
          </div>
          <div className="flex space-x-2 mb-4 overflow-hidden shrink-0">
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full whitespace-nowrap">New York</span>
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full whitespace-nowrap">Sponsor H1B</span>
          </div>
          <div className="space-y-3 overflow-y-auto flex-1 pr-1">
            {[1, 2, 3].map(i => (
              <div key={i} className={`p-3 rounded-lg border cursor-pointer transition-colors ${i === 1 ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}>
                <div className="flex items-start justify-between mb-1">
                  <div className="font-medium text-[13px] text-deep leading-tight">{i === 1 ? 'Frontend Engineer' : i === 2 ? 'Full Stack Developer' : 'Data Scientist'}</div>
                  <div className="text-[10px] text-gray-400 shrink-0 ml-2">1d ago</div>
                </div>
                <div className="text-[11px] text-gray-500 mb-2 truncate">{i === 1 ? 'TechFlow Inc.' : i === 2 ? 'Global Systems' : 'AI Dynamics'} · New York, NY</div>
                <div className="flex space-x-2">
                  <span className="px-1.5 py-0.5 bg-success/10 text-success text-[9px] rounded font-medium">OPT</span>
                  <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[9px] rounded font-medium">H1B</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Job Detail */}
        <div className="flex-1 p-5 hidden sm:flex flex-col h-full overflow-hidden relative">
          <div className="flex justify-between items-start mb-5 shrink-0 gap-3">
            <div className="flex items-start space-x-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
                T
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-deep truncate">Frontend Engineer, React</h2>
                <div className="text-xs text-gray-500 flex items-center mt-1 flex-wrap gap-y-1">
                  <span className="flex items-center whitespace-nowrap"><Briefcase className="w-3 h-3 mr-1" /> TechFlow Inc.</span>
                  <span className="mx-1.5 hidden lg:inline">·</span>
                  <span className="flex items-center whitespace-nowrap"><Globe className="w-3 h-3 mr-1" /> New York, NY (Hybrid)</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2 shrink-0">
              <button className="h-8 px-3 bg-white border border-gray-200 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-50 whitespace-nowrap">收藏</button>
              <button className="h-8 px-3 bg-primary text-white rounded-md text-xs font-medium hover:bg-primary-hover shadow-sm whitespace-nowrap">一键投递</button>
            </div>
          </div>
          
          <div className="flex space-x-5 border-b border-gray-100 mb-5 shrink-0">
            <div className="pb-1.5 border-b-2 border-primary text-xs font-medium text-primary cursor-pointer">职位详情</div>
            <div className="pb-1.5 text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700">公司信息</div>
            <div className="pb-1.5 text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700">薪资洞察</div>
          </div>

          <div className="space-y-4 flex-1 overflow-hidden">
            <div>
              <h3 className="text-sm font-bold text-deep mb-2">About the role</h3>
              <div className="space-y-2">
                <div className="h-2.5 w-full bg-gray-100 rounded"></div>
                <div className="h-2.5 w-full bg-gray-100 rounded"></div>
                <div className="h-2.5 w-5/6 bg-gray-100 rounded"></div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-deep mb-2">Requirements</h3>
              <div className="space-y-2 pl-4">
                <div className="flex items-center"><div className="w-1 h-1 rounded-full bg-gray-400 mr-2"></div><div className="h-2.5 w-3/4 bg-gray-100 rounded"></div></div>
                <div className="flex items-center"><div className="w-1 h-1 rounded-full bg-gray-400 mr-2"></div><div className="h-2.5 w-4/5 bg-gray-100 rounded"></div></div>
                <div className="flex items-center"><div className="w-1 h-1 rounded-full bg-gray-400 mr-2"></div><div className="h-2.5 w-2/3 bg-gray-100 rounded"></div></div>
              </div>
            </div>
          </div>

          {/* AI Banner */}
          <div className="absolute bottom-6 left-6 right-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                <Bot className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-indigo-900">AI 模拟面试准备</div>
                <div className="text-xs text-indigo-700 mt-0.5">基于此职位描述，生成 5 道高频面试题</div>
              </div>
            </div>
            <button className="h-8 px-3 bg-indigo-600 text-white rounded-md text-xs font-medium hover:bg-indigo-700 flex items-center">
              <Play className="w-3 h-3 mr-1" /> 开始模拟
            </button>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
          Web 端全新上线，支持沉浸式宽屏体验
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-deep tracking-tight mb-6 leading-tight">
          留学生求职，<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">一站式通关</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
          专为留学生打造的全链路求职神器。从网申助手、笔经面经到 AI 模拟面试，再到专属求职规划与校招日历，8大核心功能助你高效斩获 Dream Offer。✓
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/jobs" className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-base font-medium transition-all shadow-lg shadow-primary/30 flex items-center justify-center">
            开始搜索职位 <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link to="/ai-interview" className="w-full sm:w-auto px-8 py-3.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-deep rounded-lg text-base font-medium transition-all flex items-center justify-center">
            体验 AI 模拟面试 <Bot className="ml-2 w-4 h-4 text-gray-500" />
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-gray-500">
          <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-success mr-1.5" /> 实时职位数据</div>
          <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-success mr-1.5" /> 专属面经题库</div>
          <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-success mr-1.5" /> 全流程 AI 辅助</div>
        </div>
      </motion.div>

      <HeroMockup />
    </section>
  );
};

const JobSearchIntro = () => {
  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:w-1/2"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
              <Search className="w-4 h-4 mr-2" />
              海量名企岗位
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-deep mb-6 leading-tight">
              公司与职位精准搜索，<br />
              <span className="text-primary">发现你的下一个机会</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              聚合全网最新大厂、独角兽及初创公司招聘信息。支持按地区、行业、签证政策（H1B/OPT）进行多维度高级筛选，助你快速锁定目标岗位。
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mt-1">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-deep">海量真实岗位</h4>
                  <p className="text-base text-gray-500 mt-1">实时同步各大名企官网及招聘平台最新 JD。</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 mt-1">
                  <Filter className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-deep">留学生专属筛选</h4>
                  <p className="text-base text-gray-500 mt-1">一键筛选支持 H1B、OPT/CPT 或 E-Verify 的神仙公司。</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 mt-1">
                  <Building2 className="w-5 h-5 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-deep">全方位公司透视</h4>
                  <p className="text-base text-gray-500 mt-1">结合面经、薪资与机构测评，全面了解目标企业。</p>
                </div>
              </div>
            </div>

            <Link to="/jobs" className="inline-flex items-center justify-center px-6 py-3 bg-deep text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-sm">
              立即搜索职位 <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-1/2 w-full"
          >
            {/* Mockup UI */}
            <div className="relative rounded-2xl bg-gray-50 border border-gray-200 p-3 shadow-xl">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-100 rounded-full blur-2xl opacity-60"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-100 rounded-full blur-2xl opacity-60"></div>
              
              <div className="relative bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Search Bar Mockup */}
                <div className="p-4 border-b border-gray-50 flex items-center space-x-3">
                  <div className="flex-1 bg-gray-50 rounded-lg h-10 flex items-center px-3">
                    <Search className="w-4 h-4 text-gray-400 mr-2" />
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Filter className="w-4 h-4 text-white" />
                  </div>
                </div>
                {/* Filters Mockup */}
                <div className="p-4 border-b border-gray-50 flex space-x-2 overflow-hidden">
                  <div className="px-3 py-1.5 bg-primary/10 text-primary text-xs rounded-full font-medium border border-primary/20 whitespace-nowrap">支持 H1B</div>
                  <div className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-200 whitespace-nowrap">全职</div>
                  <div className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-200 whitespace-nowrap">加州 (CA)</div>
                </div>
                {/* Job List Mockup */}
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-50 hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="h-4 w-3/4 bg-gray-800 rounded mb-2"></div>
                        <div className="h-3 w-1/2 bg-gray-300 rounded mb-2"></div>
                        <div className="flex space-x-2">
                          <div className="h-4 w-16 bg-green-100 rounded"></div>
                          <div className="h-4 w-12 bg-blue-100 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Send className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-100",
      title: "网申助手",
      description: "根据岗位 JD，生成最匹配的网申回答、岗位匹配度分析和投递建议。"
    },
    {
      icon: <BookOpen className="w-6 h-6 text-indigo-600" />,
      bg: "bg-indigo-100",
      title: "笔经面经",
      description: "根据目标岗位和地区，生成高质量笔经/面经内容，并总结高频考点。"
    },
    {
      icon: <Bot className="w-6 h-6 text-purple-600" />,
      bg: "bg-purple-100",
      title: "AI 面试",
      description: "模拟真实面试官，与用户进行完整行为面试/技术面试，并给出评分与改进建议。"
    },
    {
      icon: <LineChart className="w-6 h-6 text-emerald-600" />,
      bg: "bg-emerald-100",
      title: "薪资查询",
      description: "根据岗位与地区，提供最新薪资区间、分档水平和影响薪资的关键因素。"
    },
    {
      icon: <FileEdit className="w-6 h-6 text-amber-600" />,
      bg: "bg-amber-100",
      title: "我的简历",
      description: "根据岗位需求优化用户简历，指出问题并提供可直接替换的改写版本。"
    },
    {
      icon: <Target className="w-6 h-6 text-rose-600" />,
      bg: "bg-rose-100",
      title: "求职规划",
      description: "根据地区、岗位和背景，生成 3 / 6 / 12 个月求职路线图（技能、项目、简历、面试）。"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-cyan-600" />,
      bg: "bg-cyan-100",
      title: "机构测评",
      description: "基于用户评价与公开信息，生成求职机构的测评结果、风险提示与推荐度。"
    },
    {
      icon: <Calendar className="w-6 h-6 text-orange-600" />,
      bg: "bg-orange-100",
      title: "校招日历",
      description: "根据地区和岗位生成校招时间表、重要节点提醒和可投企业列表。"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-deep mb-4">专为留学生设计的核心功能</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">打破信息差，用 AI 赋能求职全流程，让每一次投递都更有底气。</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-deep mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = ({ onOpenAuth }: { onOpenAuth: (mode: 'login' | 'register') => void }) => {
  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          准备好斩获你的 Dream Offer 了吗？
        </h2>
        <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
          加入数万名北美留学生的行列，用最专业的工具武装自己。现在注册，即刻体验 AI 带来的求职效率飞跃。
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button onClick={() => onOpenAuth('register')} className="w-full sm:w-auto px-8 py-4 bg-white text-primary hover:bg-gray-50 rounded-lg text-lg font-bold transition-colors shadow-lg">
            免费注册账号
          </button>
          <button onClick={() => onOpenAuth('login')} className="w-full sm:w-auto px-8 py-4 bg-primary-hover text-white border border-blue-400 hover:bg-blue-700 rounded-lg text-lg font-medium transition-colors">
            微信扫码登录
          </button>
        </div>
      </div>
    </section>
  );
};

const RecommendedJobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        // Mocking recommended jobs based on user profile
        await new Promise(resolve => setTimeout(resolve, 800));
        setJobs([
          { id: 1, title: 'Software Engineer, New Grad 2026', company: 'Google', location: 'Mountain View, CA', salary: '$130k - $180k', type: '全职', matchScore: 98 },
          { id: 3, title: 'Product Manager', company: 'ByteDance', location: 'San Jose, CA', salary: '$150k - $200k', type: '全职', matchScore: 92 },
          { id: 4, title: 'Frontend Developer', company: 'Amazon', location: 'Seattle, WA', salary: '$120k - $160k', type: '全职', matchScore: 88 },
        ]);
      } catch (error) {
        console.error('Failed to fetch recommended jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommended();
  }, []);

  return (
    <section className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              为您推荐
            </div>
            <h2 className="text-3xl font-bold text-deep">智能职位推荐</h2>
            <p className="text-gray-500 mt-2">基于您的简历和求职意向，为您精准匹配的高薪机会</p>
          </div>
          <Link to="/jobs" className="hidden sm:flex items-center text-primary hover:text-primary-hover font-medium transition-colors">
            查看更多 <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse h-48"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jobs.map(job => (
              <Link key={job.id} to={`/jobs/${job.id}`} className="block bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-green-50 text-green-600 px-3 py-1 rounded-bl-xl text-xs font-bold border-b border-l border-green-100">
                  匹配度 {job.matchScore}%
                </div>
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl font-bold text-gray-400 shrink-0">
                    {job.company.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{job.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{job.company}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-md text-xs font-medium border border-gray-100">{job.location}</span>
                  <span className="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-md text-xs font-medium border border-gray-100">{job.type}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                  <span className="text-primary font-bold text-sm">{job.salary}</span>
                  <span className="text-xs text-gray-400">刚刚推荐</span>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="mt-8 text-center sm:hidden">
          <Link to="/jobs" className="inline-flex items-center text-primary font-medium">
            查看更多 <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <main>
      <Hero />
      <JobSearchIntro />
      <RecommendedJobs />
      <Features />
      <FeatureShowcase />
      <CTA onOpenAuth={handleOpenAuth} />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        defaultMode={authMode} 
      />
    </main>
  );
}
