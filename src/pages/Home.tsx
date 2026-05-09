import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { Helmet } from 'react-helmet-async';
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
  Sparkles,
  Globe2,
  Crown,
  Info
} from 'lucide-react';
import FeatureShowcase from '../components/FeatureShowcase';
import AuthModal from '../components/AuthModal';

const HeroMockup = () => (
  <motion.div 
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay: 0.2 }}
    className="relative w-full max-w-5xl mx-auto mt-16 rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.03)] overflow-hidden"
  >
    {/* Browser Header */}
    <div className="h-12 bg-white/80 backdrop-blur border-b border-gray-100 flex items-center px-4 space-x-2">
      <div className="flex space-x-2 w-16">
        <div className="w-3 h-3 rounded-full bg-red-400"></div>
        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
        <div className="w-3 h-3 rounded-full bg-green-400"></div>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="h-6 w-1/2 max-w-sm bg-gray-50/80 border border-gray-100 rounded-md text-[11px] text-gray-500 font-medium flex items-center justify-center">
          <Globe2 className="w-3.5 h-3.5 mr-1.5 opacity-50" /> app.zhiyin.com
        </div>
      </div>
      <div className="w-16"></div>
    </div>
    {/* App Content Mockup */}
    <div className="flex h-[450px]">
      {/* Sidebar */}
      <div className="w-56 border-r border-gray-100/50 bg-white/50 p-4 hidden md:flex flex-col">
        <div className="flex items-center space-x-2 mb-6 px-2 shrink-0">
          <Logo className="w-7 h-7" />
          <span className="font-bold text-base text-gray-900">职引</span>
        </div>
        <div className="space-y-1 flex-1 overflow-y-auto pr-1">
          <div className="h-9 bg-primary/10 rounded-lg text-primary flex items-center px-3 text-[13px] font-bold">
            <Send className="w-4 h-4 mr-2.5" /> 网申助手
          </div>
          <div className="h-9 hover:bg-white rounded-lg text-gray-600 flex items-center px-3 text-[13px] font-medium transition-colors cursor-pointer">
            <BookOpen className="w-4 h-4 mr-2.5 opacity-70" /> 笔经面经
          </div>
          <div className="h-9 hover:bg-white rounded-lg text-gray-600 flex items-center px-3 text-[13px] font-medium transition-colors cursor-pointer">
            <Bot className="w-4 h-4 mr-2.5 opacity-70" /> AI 面试
          </div>
          <div className="h-9 hover:bg-white rounded-lg text-gray-600 flex items-center px-3 text-[13px] font-medium transition-colors cursor-pointer">
            <LineChart className="w-4 h-4 mr-2.5 opacity-70" /> 薪资查询
          </div>
          <div className="h-9 hover:bg-white rounded-lg text-gray-600 flex items-center px-3 text-[13px] font-medium transition-colors cursor-pointer">
            <FileEdit className="w-4 h-4 mr-2.5 opacity-70" /> 我的简历
          </div>
          <div className="h-9 hover:bg-white rounded-lg text-gray-600 flex items-center px-3 text-[13px] font-medium transition-colors cursor-pointer">
            <Target className="w-4 h-4 mr-2.5 opacity-70" /> 求职规划
          </div>
          <div className="h-9 hover:bg-white rounded-lg text-gray-600 flex items-center px-3 text-[13px] font-medium transition-colors cursor-pointer">
            <ShieldCheck className="w-4 h-4 mr-2.5 opacity-70" /> 机构测评
          </div>
        </div>
        <div className="mt-2 pt-4 border-t border-gray-100/50 shrink-0">
          <div className="flex items-center px-2 bg-white rounded-xl p-2 border border-gray-100 shadow-sm cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-indigo-500 text-white flex items-center justify-center font-bold text-xs">AC</div>
            <div className="ml-2.5">
              <div className="text-[13px] font-bold text-gray-900 leading-none">Alex Chen</div>
              <div className="text-[10px] text-gray-500 mt-1 font-medium flex items-center">
                <Crown className="w-3 h-3 text-amber-500 mr-1" /> Pro Plan
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content - Job Board Dual Column */}
      <div className="flex-1 flex bg-white/80 overflow-hidden">
        {/* Job List */}
        <div className="w-full sm:w-[40%] border-r border-gray-100/50 p-5 flex flex-col h-full bg-gray-50/30">
          <div className="relative mb-4 shrink-0">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input type="text" disabled placeholder="搜索职位、公司..." className="w-full h-10 pl-10 pr-3 bg-white border border-gray-200 shadow-sm rounded-lg text-[13px] focus:outline-none" />
          </div>
          <div className="flex space-x-2 mb-5 overflow-hidden shrink-0">
            <span className="px-3 py-1 bg-white border border-gray-200 text-gray-600 text-xs rounded-full whitespace-nowrap shadow-sm font-medium">New York</span>
            <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs rounded-full whitespace-nowrap font-bold">Sponsor H1B</span>
          </div>
          <div className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
            {[1, 2, 3].map(i => (
              <div key={i} className={`p-4 rounded-xl border relative overflow-hidden cursor-pointer transition-all ${i === 1 ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20' : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'}`}>
                {i === 1 && <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>}
                <div className="flex items-start justify-between mb-1.5">
                  <div className="font-bold text-[14px] text-gray-900 leading-tight">{i === 1 ? 'Frontend Engineer' : i === 2 ? 'Full Stack Developer' : 'Data Scientist'}</div>
                  <div className="text-[10px] text-gray-400 shrink-0 ml-2 font-medium">1d ago</div>
                </div>
                <div className="text-[12px] text-gray-500 mb-3 truncate font-medium">{i === 1 ? 'TechFlow Inc.' : i === 2 ? 'Global Systems' : 'AI Dynamics'} · New York, NY</div>
                <div className="flex space-x-2">
                  <span className="px-2 py-0.5 bg-green-50 text-green-600 border border-green-100 text-[10px] rounded font-bold">OPT</span>
                  <span className="px-2 py-0.5 bg-blue-50 text-primary border border-blue-100 text-[10px] rounded font-bold">H1B</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Job Detail */}
        <div className="flex-1 p-6 hidden sm:flex flex-col h-full overflow-hidden relative bg-white">
          <div className="flex justify-between items-start mb-6 shrink-0 gap-3">
            <div className="flex items-start space-x-4 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md shrink-0">
                T
              </div>
              <div className="min-w-0 pt-0.5">
                <h2 className="text-xl font-black text-gray-900 truncate">Frontend Engineer, React</h2>
                <div className="text-[13px] font-medium text-gray-500 flex items-center mt-1.5 flex-wrap gap-y-1">
                  <span className="flex items-center whitespace-nowrap"><Briefcase className="w-3.5 h-3.5 mr-1.5 text-gray-400" /> TechFlow Inc.</span>
                  <span className="mx-2 hidden lg:inline text-gray-300">|</span>
                  <span className="flex items-center whitespace-nowrap"><Globe className="w-3.5 h-3.5 mr-1.5 text-gray-400" /> New York, NY (Hybrid)</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2 shrink-0 pt-1">
              <button className="h-9 px-4 bg-white border border-gray-200 text-gray-700 rounded-lg text-[13px] font-bold hover:bg-gray-50 whitespace-nowrap shadow-sm">收藏</button>
              <button className="h-9 px-4 bg-gray-900 text-white rounded-lg text-[13px] font-bold hover:bg-black shadow-sm whitespace-nowrap">一键投递</button>
            </div>
          </div>
          
          <div className="flex space-x-6 border-b border-gray-100 mb-6 shrink-0">
            <div className="pb-2 flex flex-col justify-between relative cursor-pointer group">
              <span className="text-[13px] font-bold text-gray-900">职位详情</span>
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 rounded-t-sm"></div>
            </div>
            <div className="pb-2 flex flex-col justify-between relative cursor-pointer group">
              <span className="text-[13px] font-medium text-gray-500 group-hover:text-gray-900 transition-colors">公司信息</span>
            </div>
            <div className="pb-2 flex flex-col justify-between relative cursor-pointer group">
              <span className="text-[13px] font-medium text-gray-500 group-hover:text-gray-900 transition-colors">薪资洞察</span>
            </div>
          </div>

          <div className="space-y-6 flex-1 overflow-hidden pr-2">
            <div>
              <h3 className="text-[14px] font-bold text-gray-900 mb-3 flex items-center">
                <Info className="w-4 h-4 mr-2 text-primary" /> About the role
              </h3>
              <div className="space-y-2.5">
                <div className="h-3 w-full bg-gray-100 rounded-full"></div>
                <div className="h-3 w-[95%] bg-gray-100 rounded-full"></div>
                <div className="h-3 w-[85%] bg-gray-100 rounded-full"></div>
              </div>
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-gray-900 mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2 text-primary" /> Requirements
              </h3>
              <div className="space-y-3 pl-2">
                <div className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-3"></div><div className="h-3 w-3/4 bg-gray-100 rounded-full"></div></div>
                <div className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-3"></div><div className="h-3 w-4/5 bg-gray-100 rounded-full"></div></div>
                <div className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-3"></div><div className="h-3 w-2/3 bg-gray-100 rounded-full"></div></div>
              </div>
            </div>
          </div>

          {/* AI Banner */}
          <div className="absolute bottom-6 left-6 right-6 p-4 bg-gradient-to-r from-indigo-50/80 to-blue-50/80 backdrop-blur-md rounded-xl border border-indigo-100 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3 shadow-sm">
                <Bot className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <div className="text-[13px] font-bold text-indigo-900">AI 模拟面试准备</div>
                <div className="text-[11px] text-indigo-600 mt-0.5 font-medium">基于此职位描述，生成 5 道高频面试题</div>
              </div>
            </div>
            <button className="h-8 px-3.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm flex items-center">
              <Play className="w-3 h-3 mr-1.5 fill-current" /> 开始模拟
            </button>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
        <div className="w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl translate-y-[-20%]"></div>
        <div className="absolute w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl translate-y-[20%] translate-x-[20%]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-medium mb-8 shadow-sm hover:shadow-md transition-shadow cursor-default"
        >
          <span className="flex h-2.5 w-2.5 rounded-full bg-primary mr-2.5 animate-pulse"></span>
          Web 端全新上线，支持沉浸式宽屏体验
          <ArrowRight className="ml-2 w-4 h-4 text-gray-400" />
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight mb-8 leading-[1.1]">
          留学生求职，<br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-purple-600 relative inline-block">
            一站式通关
            <svg className="absolute -bottom-2 left-0 w-full h-3 text-indigo-200/50 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
            </svg>
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          专为留学生打造的全链路求职神器。从网申助手、笔经面经到 AI 模拟面试，再到专属求职规划与校招日历，8大核心功能助你高效斩获 Dream Offer。
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/jobs" className="group w-full sm:w-auto px-8 py-4 bg-gray-900 hover:bg-black text-white rounded-xl text-base font-bold transition-all shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] flex items-center justify-center hover:-translate-y-0.5">
            开始搜索职位 <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/ai-interview" className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-900 rounded-xl text-base font-bold transition-all flex items-center justify-center shadow-sm">
            体验 AI 模拟面试 <Bot className="ml-2 w-5 h-5 text-gray-400" />
          </Link>
        </div>
        
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 font-medium">
          <div className="flex items-center"><CheckCircle2 className="w-5 h-5 text-gray-400 mr-2" /> 实时职位数据</div>
          <div className="flex items-center"><CheckCircle2 className="w-5 h-5 text-gray-400 mr-2" /> 专属面经题库</div>
          <div className="flex items-center"><CheckCircle2 className="w-5 h-5 text-gray-400 mr-2" /> 全流程 AI 辅助</div>
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
    <section className="py-24 relative overflow-hidden bg-gray-900 border-t border-gray-800">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 border-white/10"></div>
        <div className="absolute -top-[300px] -right-[300px] w-[800px] h-[800px] bg-primary/30 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[200px] -left-[200px] w-[600px] h-[600px] bg-indigo-600/30 rounded-full blur-[100px]"></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
            准备好斩获你的 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Dream Offer</span> 了吗？
          </h2>
          <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            加入数万名北美留学生的行列，用最专业的工具武装自己。现在注册，即刻体验 AI 带来的求职效率飞跃。
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-5">
            <button onClick={() => onOpenAuth('register')} className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 hover:scale-105 active:scale-95 rounded-xl text-lg font-bold transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center">
              免费注册账号 <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button onClick={() => onOpenAuth('login')} className="w-full sm:w-auto px-8 py-4 bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 hover:border-gray-600 rounded-xl text-lg font-bold transition-colors flex items-center justify-center">
              微信扫码登录
            </button>
          </div>
        </motion.div>
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
        const { fetchJobsList } = await import('../lib/firestore_api');
        const dbJobs = await fetchJobsList();
        
        let allJobs: any[] = [];
        if (dbJobs && dbJobs.length > 0) {
          const formattedDbJobs = dbJobs.map((j: any) => ({
            id: j.id,
            title: j.title || '',
            company: j.companyName || '',
            location: j.location || '',
            salary: j.salary || '',
            type: j.type || '全职',
            matchScore: Math.floor(Math.random() * 20) + 80
          }));
          allJobs = formattedDbJobs.slice(0, 3);
        } else {
          allJobs = [
            { id: 1, title: 'Software Engineer, New Grad 2026', company: 'Google', location: 'Mountain View, CA', salary: '$130k - $180k', type: '全职', matchScore: 98 },
            { id: 3, title: 'Product Manager', company: 'ByteDance', location: 'San Jose, CA', salary: '$150k - $200k', type: '全职', matchScore: 92 },
            { id: 4, title: 'Frontend Developer', company: 'Amazon', location: 'Seattle, WA', salary: '$120k - $160k', type: '全职', matchScore: 88 },
          ];
        }
        setJobs(allJobs);
      } catch (error) {
        console.error('Failed to fetch recommended jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommended();
  }, []);

  return (
    <section className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-5 shadow-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              为您推荐
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">智能职位推荐</h2>
            <p className="text-gray-500 mt-3 text-lg font-medium">基于您的简历和求职意向，为您精准匹配的高薪机会</p>
          </div>
          <Link to="/jobs" className="hidden sm:flex items-center text-primary hover:text-primary-hover font-bold transition-colors">
            查看更多 <ArrowRight className="w-5 h-5 ml-1.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse h-[220px]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {jobs.map(job => (
              <Link key={job.id} to={`/jobs/${job.id}`} className="block bg-white rounded-2xl p-7 border border-gray-100 shadow-[0_5px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:border-primary/20 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-gradient-to-bl from-green-50 to-emerald-50 text-emerald-600 px-4 py-1.5 rounded-bl-2xl text-xs font-black shadow-sm flex items-center">
                  匹配度 {job.matchScore}%
                </div>
                <div className="flex items-start space-x-5 mb-5">
                  <div className="w-14 h-14 bg-gradient-to-tr from-gray-50 to-gray-100 border border-gray-200 rounded-2xl flex items-center justify-center text-2xl font-black text-gray-400 shrink-0 group-hover:scale-105 transition-transform duration-300">
                    {job.company.charAt(0)}
                  </div>
                  <div className="pt-1">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{job.title}</h3>
                    <p className="text-[15px] font-medium text-gray-500 mt-1">{job.company}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2.5 mb-6">
                  <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold border border-gray-100">{job.location}</span>
                  <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold border border-gray-100">{job.type}</span>
                </div>
                <div className="flex justify-between items-center pt-5 border-t border-gray-50">
                  <span className="text-primary font-black text-base tracking-tight">{job.salary}</span>
                  <span className="text-xs font-bold text-gray-400">刚刚推荐</span>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="mt-10 text-center sm:hidden">
          <Link to="/jobs" className="inline-flex items-center text-primary font-bold">
            查看更多 <ArrowRight className="w-5 h-5 ml-1.5" />
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
      <Helmet>
        <title>职引 - 留学生一站式求职平台 | 校招日历、AI面试、薪资查询</title>
        <meta name="description" content="职引为留学生提供一站式求职服务，涵盖8000+校招日历、AI模拟面试、薪资查询、笔经面经、网申助手、机构测评、求职规划等核心功能，助力留学生高效应对求职全流程。" />
        <meta name="keywords" content="留学生求职,校招日历,AI面试,薪资查询,笔经面经,网申助手,机构测评,求职规划,留学生找工作,秋招春招,暑期实习" />
        <link rel="canonical" href="https://www.zhiyincareer.com/" />
        <meta property="og:title" content="职引 - 留学生一站式求职平台" />
        <meta property="og:description" content="校招日历、AI模拟面试、薪资查询、笔经面经、网申助手，留学生求职全流程一站搞定。" />
        <meta property="og:url" content="https://www.zhiyincareer.com/" />
        <meta property="og:image" content="https://www.zhiyincareer.com/og-image.svg" />
        <meta name="twitter:title" content="职引 - 留学生一站式求职平台" />
        <meta name="twitter:description" content="校招日历、AI模拟面试、薪资查询、笔经面经，留学生求职全流程一站搞定。" />
        <meta name="twitter:image" content="https://www.zhiyincareer.com/og-image.svg" />
      </Helmet>
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
