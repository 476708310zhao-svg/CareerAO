import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Menu,
  X,
  GraduationCap,
  Globe
} from 'lucide-react';

import Home from './pages/Home';
import ApplicationAssistant from './pages/ApplicationAssistant';
import InterviewPrep from './pages/InterviewPrep';
import AIInterview from './pages/AIInterview';
import SalaryInsights from './pages/SalaryInsights';
import MyResume from './pages/MyResume';
import CareerPlanning from './pages/CareerPlanning';
import AgencyEvaluation from './pages/AgencyEvaluation';
import CampusCalendar from './pages/CampusCalendar';
import Membership from './pages/Membership';
import Jobs from './pages/Jobs';
import AuthModal from './components/AuthModal';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const location = useLocation();

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
    setIsOpen(false); // close mobile menu if open
  };

  const navLinks = [
    { name: '职位搜索', href: '/jobs', isRoute: true },
    { name: '网申助手', href: '/application-assistant', isRoute: true },
    { name: '笔经面经', href: '/interview-prep', isRoute: true },
    { name: 'AI 面试', href: '/ai-interview', isRoute: true },
    { name: '薪资查询', href: '/salary-insights', isRoute: true },
    { name: '我的简历', href: '/my-resume', isRoute: true },
    { name: '求职规划', href: '/career-planning', isRoute: true },
    { name: '机构测评', href: '/agency-evaluation', isRoute: true },
    { name: '校招日历', href: '/campus-calendar', isRoute: true },
    { name: '会员权益', href: '/membership', isRoute: true },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-deep tracking-tight">CareerAI</span>
          </Link>
          
          <div className="hidden lg:flex items-center space-x-6 overflow-x-auto">
            {navLinks.map((link, index) => {
              const isActive = location.pathname === link.href;
              if (link.isRoute) {
                return (
                  <Link key={index} to={link.href} className={`transition-colors text-sm font-medium whitespace-nowrap ${isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}>
                    {link.name}
                  </Link>
                );
              }
              return (
                <a key={index} href={link.href} className="text-gray-600 hover:text-primary transition-colors text-sm font-medium whitespace-nowrap">
                  {link.name}
                </a>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-4 shrink-0 pl-4">
            <button onClick={() => openAuth('login')} className="text-deep font-medium text-sm hover:text-primary transition-colors">登录</button>
            <button onClick={() => openAuth('register')} className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
              免费注册
            </button>
          </div>

          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-4 space-y-1 shadow-lg max-h-[80vh] overflow-y-auto">
          {navLinks.map((link, index) => {
            if (link.isRoute) {
              return (
                <Link key={index} to={link.href} onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md">
                  {link.name}
                </Link>
              );
            }
            return (
              <a key={index} href={link.href} onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md">
                {link.name}
              </a>
            );
          })}
          <div className="pt-4 flex flex-col space-y-2">
            <button onClick={() => openAuth('login')} className="w-full text-center px-4 py-2 border border-gray-200 rounded-md text-deep font-medium bg-white">登录</button>
            <button onClick={() => openAuth('register')} className="w-full text-center px-4 py-2 rounded-md text-white font-medium bg-primary">免费注册</button>
          </div>
        </div>
      )}
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        defaultMode={authMode} 
      />
    </>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-deep tracking-tight">CareerAI</span>
            </div>
            <p className="text-gray-500 text-sm mb-6 max-w-md leading-relaxed">
              为留学生提供一站式全流程求职辅助，依托智能算法打造网申助手、笔经面经、AI 模拟面试、薪资查询、简历优化、求职规划、机构测评、校招日历八大核心功能，从网申填写、笔试面试备考、模拟面试演练，到简历优化、职业路线规划、薪资参考、机构甄别与校招信息追踪，全方位覆盖求职各环节，精准匹配岗位需求，高效助力用户轻松应对求职全流程。
            </p>
          </div>
          <div>
            <h4 className="font-bold text-deep mb-4">产品功能</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/application-assistant" className="hover:text-primary transition-colors">网申助手</Link></li>
              <li><Link to="/interview-prep" className="hover:text-primary transition-colors">笔经面经</Link></li>
              <li><Link to="/ai-interview" className="hover:text-primary transition-colors">AI 面试</Link></li>
              <li><Link to="/salary-insights" className="hover:text-primary transition-colors">薪资查询</Link></li>
              <li><Link to="/my-resume" className="hover:text-primary transition-colors">我的简历</Link></li>
              <li><Link to="/career-planning" className="hover:text-primary transition-colors">求职规划</Link></li>
              <li><Link to="/agency-evaluation" className="hover:text-primary transition-colors">机构测评</Link></li>
              <li><Link to="/campus-calendar" className="hover:text-primary transition-colors">校招日历</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-deep mb-4">资源中心</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="#" className="hover:text-primary transition-colors">求职干货博客</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">大厂面经库</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">签证政策解读</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">帮助中心</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-deep mb-4">关于我们</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="#" className="hover:text-primary transition-colors">团队介绍</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">联系我们</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">隐私政策</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">服务条款</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2026 CareerAI. All rights reserved.
          </p>
          <div className="flex space-x-4">
            {/* Social icons placeholders */}
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-600 cursor-pointer transition-colors">
              <Globe className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white font-sans text-deep selection:bg-primary/20 selection:text-primary">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/application-assistant" element={<ApplicationAssistant />} />
            <Route path="/interview-prep" element={<InterviewPrep />} />
            <Route path="/ai-interview" element={<AIInterview />} />
            <Route path="/salary-insights" element={<SalaryInsights />} />
            <Route path="/my-resume" element={<MyResume />} />
            <Route path="/career-planning" element={<CareerPlanning />} />
            <Route path="/agency-evaluation" element={<AgencyEvaluation />} />
            <Route path="/campus-calendar" element={<CampusCalendar />} />
            <Route path="/membership" element={<Membership />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
