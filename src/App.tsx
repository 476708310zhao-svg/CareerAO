import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, GraduationCap, Globe, User, LogOut, Bookmark, ChevronDown,
  Briefcase, Compass, DollarSign, Calendar, Edit3, Bot, ShieldCheck, 
  FileText, Users, BookOpen, Info, Settings, Globe2, 
  HelpCircle, MessageCircle, FileDown, Rocket, Crown, QrCode
} from 'lucide-react';

import Home from './pages/Home';
import ApplicationAssistant from './pages/ApplicationAssistant';
import InterviewPrep from './pages/InterviewPrep';
import AIInterview from './pages/AIInterview';
import SalaryInsights from './pages/SalaryInsights';
import MyResume from './pages/MyResume';
import ResumeEditor from './pages/ResumeEditor';
import JobDetail from './pages/JobDetail';
import CareerPlanning from './pages/CareerPlanning';
import AgencyEvaluation from './pages/AgencyEvaluation';
import CampusCalendar from './pages/CampusCalendar';
import CampusCalendarTable from './pages/CampusCalendarTable';
import Membership from './pages/Membership';
import Blog from './pages/Blog';
import JobNews from './pages/JobNews';
import InterviewExperiences from './pages/InterviewExperiences';
import VisaPolicies from './pages/VisaPolicies';
import HelpCenter from './pages/HelpCenter';
import AboutTeam from './pages/AboutTeam';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import NotFound from './pages/NotFound';
import Jobs from './pages/Jobs';
import CompanyDetail from './pages/CompanyDetail';
import Search from './pages/Search';
import JobMap from './pages/JobMap';
import AuthModal from './components/AuthModal';
import Logo from './components/Logo';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider, useToast } from './contexts/ToastContext';

import { db } from './lib/firebase';
import { doc, getDocFromServer } from 'firebase/firestore';
import { seedMockData } from './lib/firestore_api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, openAuthModal, isAuthModalOpen, closeAuthModal, authMode } = useAuth();
  const { showToast } = useToast();

  const navCategories = [
    {
      title: '找工作',
      sections: [
        {
          title: '核心求职模块',
          icon: <Briefcase className="w-5 h-5 text-primary" />,
          links: [
            { name: '职位搜索', href: '/jobs', desc: '海量全职/实习机会快速触达', badge: 'HOT' },
            { name: '求职地图', href: '/job-map', desc: '基于LBS的周边全职机会一网打尽' },
          ]
        },
        {
          title: '信息与规划',
          icon: <Compass className="w-5 h-5 text-primary" />,
          links: [
            { name: '薪资查询', href: '/salary-insights', desc: '全网高薪Offer薪水大揭秘' },
            { name: '校招日历', href: '/campus-calendar', desc: '第一时间掌握大厂秋招网申时间', badge: 'NEW' },
          ]
        }
      ]
    },
    {
      title: '面试备考',
      sections: [
        {
          title: '经验与交流',
          icon: <Edit3 className="w-5 h-5 text-primary" />,
          links: [
            { name: '笔经面经', href: '/interview-prep', desc: '大量还原真实的面试场景及笔试回顾' },
            { name: '机构测评', href: '/agency-evaluation', desc: '红黑榜中介防坑指南与真实评价' },
          ]
        },
        {
          title: '实战模拟',
          icon: <Bot className="w-5 h-5 text-primary" />,
          links: [
            { name: 'AI 面试', href: '/ai-interview', desc: '智能AI导师一对一还原真实面试', badge: 'NEW' },
          ]
        }
      ]
    },
    {
      title: '求职工具',
      sections: [
        {
          title: '效率提升',
          icon: <Rocket className="w-5 h-5 text-primary" />,
          links: [
            { name: '网申助手', href: '/application-assistant', desc: '化繁为简，一键自动填写海量网申表' },
            { name: '我的简历', href: '/my-resume', desc: '从小白到高阶全覆盖的简历生成神器', badge: 'HOT' },
          ]
        },
        {
          title: '职场与规划导师',
          icon: <Globe className="w-5 h-5 text-primary" />,
          links: [
            { name: '求职规划', href: '/career-planning', desc: '利用AI为你定制求职时间线规划' },
          ]
        }
      ]
    },
    {
      title: '资源中心',
      sections: [
        {
          title: '行业大咖建议',
          icon: <BookOpen className="w-5 h-5 text-primary" />,
          links: [
            { name: '求职干货博客', href: '/blog', desc: '资深HR分享如何脱颖而出' },
            { name: '求职资讯', href: '/news', desc: '订阅最新前沿职场和雇主新闻动态' },
            { name: '大厂面经库', href: '/interview-experiences', desc: '各类公司全岗位的面经汇总' },
          ]
        },
        {
          title: '留学生政策与帮扶',
          icon: <ShieldCheck className="w-5 h-5 text-primary" />,
          links: [
            { name: '签证政策解读', href: '/visa-policies', desc: '深度解读H1B/OPT最新政策风向' },
            { name: '帮助中心', href: '/help-center', desc: '关于职引你必须知道的常见问题回答' },
          ]
        }
      ]
    },
    {
      title: '关于我们',
      sections: [
        {
          title: '了解平台',
          icon: <Info className="w-5 h-5 text-primary" />,
          links: [
            { name: '团队介绍', href: '/team', desc: '由湾区资深工程师研发运营' },
            { name: '联系我们', href: '/contact', desc: '提供商务合作与求职指导反馈' },
          ]
        },
        {
          title: '服务条款',
          icon: <FileText className="w-5 h-5 text-primary" />,
          links: [
            { name: '隐私政策', href: '/privacy', desc: '您的个人隐私受到绝对保密与保护' },
            { name: '服务条款', href: '/terms', desc: '用户社区礼仪与内容发布协议和规范' },
            { name: '会员权益', href: '/membership', desc: '成为高级会员解锁全部高级服务与内推', badge: 'PRO' },
          ]
        }
      ]
    }
  ];

  const [activeNavDropdown, setActiveNavDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveNavDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    showToast('已成功退出登录', 'success');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 shrink-0">
            <Logo className="w-8 h-8" />
            <span className="font-bold text-xl text-deep tracking-tight text-primary">职引</span>
          </Link>
          
          <div className="hidden lg:flex items-center space-x-8" ref={navRef}>
            {navCategories.map((category, index) => {
              const isActiveDropdown = activeNavDropdown === category.title;
              const hasActiveLink = category.sections.some(section => section.links.some((link: any) => location.pathname === link.href));

              return (
                <div 
                  key={index} 
                  className="static"
                  onMouseEnter={() => setActiveNavDropdown(category.title)}
                  onMouseLeave={() => setActiveNavDropdown(null)}
                >
                  <button 
                    onClick={() => setActiveNavDropdown(isActiveDropdown ? null : category.title)}
                    className={`flex items-center space-x-1 transition-colors text-[15px] font-medium whitespace-nowrap py-5 relative ${hasActiveLink || isActiveDropdown ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
                  >
                    <span>{category.title}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isActiveDropdown ? 'rotate-180' : ''}`} />
                    
                    {/* Active Indicator Underline */}
                    {(hasActiveLink || isActiveDropdown) && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-sm" />
                    )}
                  </button>
                  
                  {isActiveDropdown && (
                    <div className="absolute left-0 right-0 top-[64px] bg-white shadow-xl shadow-black/[0.03] border-t border-gray-100 pb-12 pt-10 z-40 animate-in slide-in-from-top-2 fade-in duration-200">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-start gap-x-16 gap-y-8">
                          {category.sections.map((section, secIdx) => (
                            <div key={secIdx} className="w-80">
                              <div className="flex items-center space-x-2 text-primary font-bold text-[17px] mb-6 pb-4 border-b border-gray-100">
                                {section.icon}
                                <span>{section.title}</span>
                              </div>
                              <div className="flex flex-col space-y-6">
                                {section.links.map((link: any, linkIdx: number) => {
                                  const isLinkActive = location.pathname === link.href;
                                  return (
                                    <Link
                                      key={linkIdx}
                                      to={link.href}
                                      onClick={() => setActiveNavDropdown(null)}
                                      className="group block"
                                    >
                                      <div className="flex items-center">
                                        <span className={`font-bold text-base ${isLinkActive ? 'text-primary' : 'text-gray-900 group-hover:text-primary transition-colors'}`}>
                                          {link.name}
                                        </span>
                                        {link.badge && (
                                          <span className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                                            link.badge === 'HOT' ? 'bg-red-50 text-red-500 border border-red-200/50' : 
                                            link.badge === 'PRO' ? 'bg-orange-50 text-orange-500 border border-orange-200/50' : 
                                            'bg-green-50 text-green-500 border border-green-200/50'
                                          }`}>
                                            {link.badge}
                                          </span>
                                        )}
                                      </div>
                                      <p className="mt-1.5 text-sm text-gray-500 line-clamp-1 group-hover:text-gray-600 transition-colors">{link.desc}</p>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-4 shrink-0 pl-4">
            <form onSubmit={handleSearch} className="relative hidden xl:block">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索职位、公司..." 
                className="w-48 h-9 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-full text-sm focus:w-64 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </form>

            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm">
                    {user.nickname ? user.nickname.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">{user.nickname || 'User'}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.nickname}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{user.email || user.phone || '已登录'}</p>
                    </div>
                    <div className="py-1">
                      <Link to="/my-resume" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                        <User className="w-4 h-4 mr-2" />
                        个人中心
                      </Link>
                      <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                        <Bookmark className="w-4 h-4 mr-2" />
                        我的收藏
                      </button>
                    </div>
                    <div className="py-1 border-t border-gray-50">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        退出登录
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button onClick={() => openAuthModal('login')} className="text-deep font-medium text-sm hover:text-primary transition-colors">登录</button>
                <button onClick={() => openAuthModal('register')} className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
                  免费注册
                </button>
              </>
            )}
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
        <div className="lg:hidden bg-white border-b border-gray-100 px-4 pt-4 pb-6 space-y-6 shadow-lg max-h-[80vh] overflow-y-auto">
          {navCategories.map((category, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2">{category.title}</h3>
              {category.sections.map((section, secIdx) => (
                <div key={secIdx} className="space-y-1 mb-4 pl-2">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{section.title}</h4>
                  <div className="space-y-1">
                    {section.links.map((link: any, linkIdx: number) => {
                      const isLinkActive = location.pathname === link.href;
                      if (link.href.startsWith('/')) {
                        return (
                          <Link 
                            key={linkIdx} 
                            to={link.href} 
                            onClick={() => setIsOpen(false)} 
                            className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${isLinkActive ? 'text-primary bg-primary/5' : 'text-gray-600 hover:text-primary hover:bg-gray-50'}`}
                          >
                            <div className="flex items-center">
                              {link.name}
                              {link.badge && (
                                <span className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded ${link.badge === 'HOT' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                  {link.badge}
                                </span>
                              )}
                            </div>
                          </Link>
                        );
                      }
                      return (
                        <a 
                          key={linkIdx} 
                          href={link.href} 
                          onClick={() => setIsOpen(false)} 
                          className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
                        >
                          <div className="flex items-center">
                            {link.name}
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3">
            {isAuthenticated && user ? (
              <>
                <div className="px-4 py-3 bg-gray-50 rounded-lg mb-2">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.nickname}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{user.email || user.phone || '已登录'}</p>
                </div>
                <Link to="/my-resume" onClick={() => setIsOpen(false)} className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md font-medium">
                  <User className="w-5 h-5 mr-3 text-gray-400" />
                  个人中心
                </Link>
                <button className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md font-medium">
                  <Bookmark className="w-5 h-5 mr-3 text-gray-400" />
                  我的收藏
                </button>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md font-medium">
                  <LogOut className="w-5 h-5 mr-3 text-red-400" />
                  退出登录
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { openAuthModal('login'); setIsOpen(false); }} className="w-full text-center px-4 py-2 border border-gray-200 rounded-md text-deep font-medium bg-white">登录</button>
                <button onClick={() => { openAuthModal('register'); setIsOpen(false); }} className="w-full text-center px-4 py-2 rounded-md text-white font-medium bg-primary">免费注册</button>
              </>
            )}
          </div>
        </div>
      )}
      </nav>
    </>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between gap-y-12 gap-x-8 mb-16 mt-4">
          <div className="w-full lg:w-[280px]">
            <div className="flex items-center space-x-2 mb-6">
              <Logo className="w-8 h-8" />
              <span className="font-bold text-xl text-deep tracking-tight text-primary">职引</span>
            </div>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              为留学生提供一站式全流程求职辅助，依托智能算法打造网申助手、笔经面经、AI 模拟面试、薪资查询、简历优化、求职规划、机构测评、校招日历八大核心功能，从网申填写、笔试面试备考、模拟面试演练，到简历优化、职业路线规划、薪资参考、机构甄别与校招信息追踪，全方位覆盖求职各环节，精准匹配岗位需求，高效助力用户轻松应对求职全流程。
            </p>
          </div>
          
          <div className="w-full xl:ml-12 grid grid-cols-2 md:grid-cols-5 gap-8 flex-1">
            <div>
              <h4 className="font-bold text-gray-900 mb-6 font-sans">找工作</h4>
              <ul className="space-y-4 text-[15px] text-gray-500">
                <li><Link to="/jobs" className="hover:text-primary transition-colors">职位搜索</Link></li>
                <li><Link to="/job-map" className="hover:text-primary transition-colors">求职地图</Link></li>
                <li><Link to="/salary-insights" className="hover:text-primary transition-colors">薪资查询</Link></li>
                <li><Link to="/campus-calendar" className="hover:text-primary transition-colors">校招日历</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-6 font-sans">面试备考</h4>
              <ul className="space-y-4 text-[15px] text-gray-500">
                <li><Link to="/interview-prep" className="hover:text-primary transition-colors">笔经面经</Link></li>
                <li><Link to="/ai-interview" className="hover:text-primary transition-colors">AI 面试</Link></li>
                <li><Link to="/agency-evaluation" className="hover:text-primary transition-colors">机构测评</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-6 font-sans">求职工具</h4>
              <ul className="space-y-4 text-[15px] text-gray-500">
                <li><Link to="/application-assistant" className="hover:text-primary transition-colors">网申助手</Link></li>
                <li><Link to="/my-resume" className="hover:text-primary transition-colors">我的简历</Link></li>
                <li><Link to="/career-planning" className="hover:text-primary transition-colors">求职规划</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-6 font-sans">资源中心</h4>
              <ul className="space-y-4 text-[15px] text-gray-500">
                <li><Link to="/blog" className="hover:text-primary transition-colors">求职干货博客</Link></li>
                <li><Link to="/news" className="hover:text-primary transition-colors">求职资讯</Link></li>
                <li><Link to="/interview-experiences" className="hover:text-primary transition-colors">大厂面经库</Link></li>
                <li><Link to="/visa-policies" className="hover:text-primary transition-colors">签证政策解读</Link></li>
                <li><Link to="/help-center" className="hover:text-primary transition-colors">帮助中心</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-6 font-sans">关于我们</h4>
              <ul className="space-y-4 text-[15px] text-gray-500">
                <li><Link to="/team" className="hover:text-primary transition-colors">团队介绍</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">联系我们</Link></li>
                <li><Link to="/privacy" className="hover:text-primary transition-colors">隐私政策</Link></li>
                <li><Link to="/terms" className="hover:text-primary transition-colors">服务条款</Link></li>
              </ul>
            </div>
          </div>

          <div className="w-full lg:w-48 flex flex-col items-start lg:items-end lg:text-right">
            <div className="mb-3 bg-white p-2.5 rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.08)] border border-gray-100 inline-block overflow-hidden relative group">
              {/* Replace the URL below with your actual WeChat QR code image URL if you have one, e.g. /wechat-qr.jpg */}
              <div className="w-[120px] h-[120px] bg-gray-50 flex flex-col items-center justify-center text-gray-400 group-hover:bg-primary/5 transition-colors">
                <img 
                  src="/wechat-qr.jpg" 
                  alt="WeChat QR" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <QrCode className="w-12 h-12 hidden mb-1" />
                <span className="text-[10px] hidden text-gray-400">请替换二维码</span>
              </div>
            </div>
            <p className="text-base font-bold text-gray-900 mb-1">扫码添加微信</p>
            <p className="text-sm text-primary font-medium">领取专属求职攻略</p>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <div className="flex flex-col md:flex-row items-center md:space-x-6 space-y-4 md:space-y-0 mb-4 md:mb-0">
            <p>© 2026 职引. All rights reserved.</p>
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
              蜀ICP备2026003605号
            </a>
          </div>
          <div className="flex space-x-4">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 hover:text-gray-600 cursor-pointer transition-colors">
              <Globe className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

function AppLayout() {
  const { isAuthModalOpen, closeAuthModal, authMode } = useAuth();

  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
        await seedMockData();
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-white font-sans text-deep selection:bg-primary/20 selection:text-primary overflow-x-hidden">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/job-map" element={<JobMap />} />
          <Route path="/companies/:id" element={<CompanyDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/application-assistant" element={<ApplicationAssistant />} />
          <Route path="/interview-prep" element={<InterviewPrep />} />
          <Route path="/ai-interview" element={<AIInterview />} />
          <Route path="/salary-insights" element={<SalaryInsights />} />
          <Route path="/my-resume" element={<MyResume />} />
          <Route path="/my-resume/:id" element={<ResumeEditor />} />
          <Route path="/career-planning" element={<CareerPlanning />} />
          <Route path="/agency-evaluation" element={<AgencyEvaluation />} />
          <Route path="/campus-calendar" element={<CampusCalendar />} />
          <Route path="/campus-calendar/table" element={<CampusCalendarTable />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/news" element={<JobNews />} />
          <Route path="/interview-experiences" element={<InterviewExperiences />} />
          <Route path="/visa-policies" element={<VisaPolicies />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/team" element={<AboutTeam />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
      
      {/* Global Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
        defaultMode={authMode} 
      />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AppLayout />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

