import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bookmark, ChevronDown, LogOut, Menu, Search, User, X } from 'lucide-react';

import { navCategories } from '../../config/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Logo from '../Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeNavDropdown, setActiveNavDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    setIsOpen(false);
    setActiveNavDropdown(null);
  }, [location.pathname]);

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

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const keyword = searchQuery.trim();
    if (!keyword) return;
    navigate(`/search?q=${encodeURIComponent(keyword)}`);
    setSearchQuery('');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <Logo className="w-8 h-8" />
            <span className="font-bold text-xl text-deep tracking-tight text-primary">职引</span>
          </Link>

          <div className="hidden lg:flex items-center space-x-8" ref={navRef}>
            {navCategories.map((category) => {
              const isActiveDropdown = activeNavDropdown === category.title;
              const hasActiveLink = category.sections.some((section) =>
                section.links.some((link) => location.pathname === link.href),
              );

              return (
                <div
                  key={category.title}
                  className="static"
                  onMouseEnter={() => setActiveNavDropdown(category.title)}
                  onMouseLeave={() => setActiveNavDropdown(null)}
                >
                  <button
                    onClick={() => setActiveNavDropdown(isActiveDropdown ? null : category.title)}
                    className={`flex items-center space-x-1 transition-colors text-[15px] font-medium whitespace-nowrap py-5 relative ${
                      hasActiveLink || isActiveDropdown ? 'text-primary' : 'text-gray-600 hover:text-primary'
                    }`}
                  >
                    <span>{category.title}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isActiveDropdown ? 'rotate-180' : ''}`} />
                    {(hasActiveLink || isActiveDropdown) && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-sm" />
                    )}
                  </button>

                  {isActiveDropdown && (
                    <div className="absolute left-0 right-0 top-[64px] bg-white shadow-xl shadow-black/[0.03] border-t border-gray-100 pb-12 pt-10 z-40 animate-in slide-in-from-top-2 fade-in duration-200">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-start gap-x-16 gap-y-8">
                          {category.sections.map((section) => (
                            <div key={section.title} className="w-80">
                              <div className="flex items-center space-x-2 text-primary font-bold text-[17px] mb-6 pb-4 border-b border-gray-100">
                                {section.icon}
                                <span>{section.title}</span>
                              </div>
                              <div className="flex flex-col space-y-6">
                                {section.links.map((link) => {
                                  const isLinkActive = location.pathname === link.href;
                                  return (
                                    <Link key={link.href} to={link.href} className="group block">
                                      <div className="flex items-center">
                                        <span
                                          className={`font-bold text-base ${
                                            isLinkActive
                                              ? 'text-primary'
                                              : 'text-gray-900 group-hover:text-primary transition-colors'
                                          }`}
                                        >
                                          {link.name}
                                        </span>
                                        {link.badge && (
                                          <span
                                            className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                                              link.badge === 'HOT'
                                                ? 'bg-red-50 text-red-500 border border-red-200/50'
                                                : link.badge === 'PRO'
                                                  ? 'bg-orange-50 text-orange-500 border border-orange-200/50'
                                                  : 'bg-green-50 text-green-500 border border-green-200/50'
                                            }`}
                                          >
                                            {link.badge}
                                          </span>
                                        )}
                                      </div>
                                      <p className="mt-1.5 text-sm text-gray-500 line-clamp-1 group-hover:text-gray-600 transition-colors">
                                        {link.desc}
                                      </p>
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
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="搜索职位、公司..."
                className="w-48 h-9 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-full text-sm focus:w-64 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                      <Link
                        to="/my-resume"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                      >
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
                <button onClick={() => openAuthModal('login')} className="text-deep font-medium text-sm hover:text-primary transition-colors">
                  登录
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                >
                  免费注册
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-50"
            aria-label={isOpen ? '关闭导航' : '打开导航'}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 px-4 pt-4 pb-6 space-y-6 shadow-lg max-h-[80vh] overflow-y-auto">
          {navCategories.map((category) => (
            <div key={category.title} className="space-y-3">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2">{category.title}</h3>
              {category.sections.map((section) => (
                <div key={section.title} className="space-y-1 mb-4 pl-2">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{section.title}</h4>
                  <div className="space-y-1">
                    {section.links.map((link) => {
                      const isLinkActive = location.pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          to={link.href}
                          className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            isLinkActive ? 'text-primary bg-primary/5' : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center">
                            {link.name}
                            {link.badge && (
                              <span
                                className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  link.badge === 'HOT' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                                }`}
                              >
                                {link.badge}
                              </span>
                            )}
                          </div>
                        </Link>
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
                <Link to="/my-resume" className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md font-medium">
                  <User className="w-5 h-5 mr-3 text-gray-400" />
                  个人中心
                </Link>
                <button className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md font-medium">
                  <Bookmark className="w-5 h-5 mr-3 text-gray-400" />
                  我的收藏
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md font-medium"
                >
                  <LogOut className="w-5 h-5 mr-3 text-red-400" />
                  退出登录
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => openAuthModal('login')}
                  className="w-full text-center px-4 py-2 border border-gray-200 rounded-md text-deep font-medium bg-white"
                >
                  登录
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="w-full text-center px-4 py-2 rounded-md text-white font-medium bg-primary"
                >
                  免费注册
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
