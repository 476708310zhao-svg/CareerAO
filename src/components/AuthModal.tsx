import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Eye, EyeOff, Lock, Mail, User, X } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const { loginWithPassword, registerWithPassword } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [agreed, setAgreed] = useState(false);
  const [showAgreementError, setShowAgreementError] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState({
    nickname: '',
    account: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setApiError('');
      setShowAgreementError(false);
      setShowPassword(false);
    }
  }, [defaultMode, isOpen]);

  const ensureAgreement = () => {
    if (agreed) return true;
    setShowAgreementError(true);
    return false;
  };

  const handlePasswordAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!ensureAgreement()) return;
    setIsLoading(true);
    setApiError('');

    try {
      if (mode === 'login') {
        await loginWithPassword(formState.account.trim(), formState.password);
      } else {
        await registerWithPassword({
          nickname: formState.nickname.trim() || '新用户',
          email: formState.email.trim(),
          password: formState.password,
        });
      }
      onClose();
    } catch (err: any) {
      setApiError(err.message || (mode === 'login' ? '登录失败，请重试' : '注册失败，请重试'));
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (nextMode: 'login' | 'register') => {
    setMode(nextMode);
    setApiError('');
    setShowAgreementError(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100]" />

          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden pointer-events-auto relative"
            >
              <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10" aria-label="关闭登录窗口">
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 sm:p-8">
                <div className="text-center mb-7">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {mode === 'login' ? '登录职引' : '创建职引账号'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    登录后可保存简历、提交评价、同步反馈和使用更多求职工具
                  </p>
                </div>

                <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-xl mb-5">
                  <button onClick={() => switchMode('login')} className={`py-2 text-sm font-bold rounded-lg transition-colors ${mode === 'login' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}>登录</button>
                  <button onClick={() => switchMode('register')} className={`py-2 text-sm font-bold rounded-lg transition-colors ${mode === 'register' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}>注册</button>
                </div>

                {apiError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                    {apiError}
                  </div>
                )}

                <form onSubmit={handlePasswordAuth} className="space-y-4">
                  {mode === 'register' && (
                    <label className="block">
                      <span className="block text-sm font-medium text-gray-700 mb-1.5">昵称</span>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          value={formState.nickname}
                          onChange={(event) => setFormState({ ...formState, nickname: event.target.value })}
                          className="w-full h-11 pl-10 pr-3 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          placeholder="你的昵称"
                        />
                      </div>
                    </label>
                  )}

                  <label className="block">
                    <span className="block text-sm font-medium text-gray-700 mb-1.5">{mode === 'login' ? '邮箱或手机号' : '邮箱'}</span>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={mode === 'login' ? 'text' : 'email'}
                        value={mode === 'login' ? formState.account : formState.email}
                        onChange={(event) => setFormState(mode === 'login' ? { ...formState, account: event.target.value } : { ...formState, email: event.target.value })}
                        className="w-full h-11 pl-10 pr-3 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder={mode === 'login' ? 'name@example.com / 手机号' : 'name@example.com'}
                        required
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="block text-sm font-medium text-gray-700 mb-1.5">密码</span>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formState.password}
                        onChange={(event) => setFormState({ ...formState, password: event.target.value })}
                        className="w-full h-11 pl-10 pr-10 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder={mode === 'register' ? '至少 6 位密码' : '请输入密码'}
                        minLength={6}
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label={showPassword ? '隐藏密码' : '显示密码'}>
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </label>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    {isLoading ? '处理中...' : mode === 'login' ? '登录' : '注册并登录'}
                  </button>
                </form>

                <div className="mt-6 flex items-start">
                  <button
                    type="button"
                    onClick={() => {
                      setAgreed(!agreed);
                      setShowAgreementError(false);
                    }}
                    className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      agreed ? 'bg-primary border-primary text-white' : showAgreementError ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    aria-label="同意用户协议"
                  >
                    {agreed && <Check className="w-3 h-3" />}
                  </button>
                  <div className="ml-2 text-xs text-gray-500 leading-relaxed">
                    我已阅读并同意
                    <Link to="/terms" onClick={onClose} className="text-primary hover:underline mx-1">《用户服务协议》</Link>
                    和
                    <Link to="/privacy" onClick={onClose} className="text-primary hover:underline mx-1">《隐私政策》</Link>
                  </div>
                </div>
                {showAgreementError && !agreed && (
                  <p className="text-xs text-red-500 mt-1 ml-6">请先阅读并同意相关协议</p>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
