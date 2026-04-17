import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiFetch } from '../lib/api';

interface User {
  id?: string;
  nickname: string;
  email?: string;
  phone?: string;
  avatar?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (account: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  // 手机号验证码登录相关接口
  sendPhoneCode: (phone: string) => Promise<void>;
  loginWithPhone: (phone: string, code: string) => Promise<void>;
  // 微信扫码登录相关接口
  getWeChatQRCode: () => Promise<{ ticket: string; url: string }>;
  checkWeChatLoginStatus: (ticket: string) => Promise<{ status: 'pending' | 'success' | 'expired'; token?: string; user?: User }>;
  // 全局 AuthModal 状态
  isAuthModalOpen: boolean;
  authMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user data');
      }
    }
  }, []);

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleAuthSuccess = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const login = async (account: string, password: string) => {
    const data = await apiFetch('/api/proxy/users/login', {
      method: 'POST',
      body: JSON.stringify({ phone: account, password }), // Assuming account is phone for now based on API docs
    });
    handleAuthSuccess(data.token, data.user);
  };

  const register = async (registerData: any) => {
    const data = await apiFetch('/api/proxy/users/register', {
      method: 'POST',
      body: JSON.stringify(registerData),
    });
    handleAuthSuccess(data.token, data.user);
  };

  // --- 真实接口预留：发送手机验证码 ---
  const sendPhoneCode = async (phone: string) => {
    await apiFetch('/api/auth/send-code', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  };

  // --- 真实接口预留：手机号验证码登录 ---
  const loginWithPhone = async (phone: string, code: string) => {
    const data = await apiFetch('/api/auth/phone-login', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    });
    handleAuthSuccess(data.token, data.user);
  };

  // --- 真实接口预留：获取微信登录二维码 ---
  const getWeChatQRCode = async () => {
    const data = await apiFetch('/api/auth/wechat-qrcode', {
      method: 'GET',
    });
    return { ticket: data.ticket, url: data.url };
  };

  // --- 真实接口预留：轮询微信登录状态 ---
  const checkWeChatLoginStatus = async (ticket: string) => {
    const data = await apiFetch(`/api/auth/wechat-status?ticket=${ticket}`, {
      method: 'GET',
    });
    
    if (data.status === 'success' && data.token && data.user) {
      handleAuthSuccess(data.token, data.user);
    }
    
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, token, login, register, logout, isAuthenticated: !!token,
      sendPhoneCode, loginWithPhone, getWeChatQRCode, checkWeChatLoginStatus,
      isAuthModalOpen, authMode, openAuthModal, closeAuthModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
