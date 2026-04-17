import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Smartphone, QrCode, ShieldCheck, ArrowRight, Check, User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

const WeChatIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 1024 1024" fill="currentColor">
    <path d="M682.666667 213.333333c-188.586667 0-341.333333 126.293333-341.333334 281.6 0 155.306667 152.746667 281.6 341.333334 281.6 38.4 0 75.093333-5.546667 109.226666-15.786666l95.573334 47.786666-27.306667-85.333333c56.32-47.786667 93.866667-114.346667 93.866667-188.16 0-155.306667-152.746667-281.6-341.333334-281.6z m-85.333334 170.666667c23.466667 0 42.666667 19.2 42.666667 42.666667s-19.2 42.666667-42.666667 42.666666-42.666667-19.2-42.666666-42.666666 19.2-42.666667 42.666666-42.666667z m170.666667 0c23.466667 0 42.666667 19.2 42.666667 42.666667s-19.2 42.666667-42.666667 42.666666-42.666667-19.2-42.666667-42.666666 19.2-42.666667 42.666667-42.666667z" />
    <path d="M362.666667 128c-200.533333 0-362.666667 135.253333-362.666667 302.933333 0 92.16 46.933333 174.933333 121.173333 232.106667l-34.133333 102.4 116.053333-56.32c49.493333 14.933333 103.253333 23.893333 159.573334 23.893333 11.946667 0 23.893333-0.426667 35.84-1.28-23.893333-31.573333-38.4-70.4-38.4-111.786666 0-106.666667 100.693333-192.853333 224.426667-192.853334 11.946667 0 23.893333 0.853333 35.84 2.56C580.266667 256 481.28 128 362.666667 128z m-106.666667 192c-29.44 0-53.333333-23.893333-53.333333-53.333333s23.893333-53.333333 53.333333-53.333334 53.333333 23.893333 53.333333 53.333334-23.893333 53.333333-53.333333 53.333333z m213.333333 0c-29.44 0-53.333333-23.893333-53.333333-53.333333s23.893333-53.333333 53.333333-53.333334 53.333333 23.893333 53.333333 53.333334-23.893333 53.333333-53.333333 53.333333z" />
  </svg>
);

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const { login, register, sendPhoneCode, loginWithPhone, getWeChatQRCode, checkWeChatLoginStatus } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [loginMethod, setLoginMethod] = useState<'account' | 'phone' | 'wechat'>('account');
  
  // Form fields
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  
  // Phone login state
  const [countdown, setCountdown] = useState(0);
  const [isSendingCode, setIsSendingCode] = useState(false);

  // WeChat login state
  const [weChatQrUrl, setWeChatQrUrl] = useState('');
  const [weChatTicket, setWeChatTicket] = useState('');
  const [weChatStatus, setWeChatStatus] = useState<'pending' | 'success' | 'expired'>('pending');
  
  const [agreed, setAgreed] = useState(false);
  const [showError, setShowError] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setApiError('');
      if (loginMethod === 'wechat') {
        initWeChatLogin();
      }
    } else {
      setWeChatStatus('pending');
      setWeChatTicket('');
    }
  }, [defaultMode, isOpen, loginMethod]);

  // Handle phone verification code countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Handle WeChat login polling
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && loginMethod === 'wechat' && weChatTicket && weChatStatus === 'pending') {
      timer = setInterval(async () => {
        try {
          const result = await checkWeChatLoginStatus(weChatTicket);
          if (result.status === 'success') {
            setWeChatStatus('success');
            clearInterval(timer);
            setTimeout(() => {
              onClose();
            }, 1000); // Close after showing success briefly
          } else if (result.status === 'expired') {
            setWeChatStatus('expired');
            clearInterval(timer);
          }
        } catch (error) {
          console.error("WeChat polling error:", error);
        }
      }, 3000); // Poll every 3 seconds
    }
    return () => clearInterval(timer);
  }, [isOpen, loginMethod, weChatTicket, weChatStatus]);

  const initWeChatLogin = async () => {
    try {
      setWeChatStatus('pending');
      // In a real app, this fetches the QR code URL from your backend
      // const { ticket, url } = await getWeChatQRCode();
      // setWeChatTicket(ticket);
      // setWeChatQrUrl(url);
      
      // Mocking the response for demonstration:
      setWeChatTicket('mock_ticket_123');
      setWeChatQrUrl('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://careerai.com/wechat-login-mock');
    } catch (err: any) {
      setApiError('获取微信登录二维码失败');
    }
  };

  const handleSendCode = async () => {
    if (!phone || phone.length < 11) {
      setApiError('请输入有效的手机号');
      return;
    }
    setIsSendingCode(true);
    setApiError('');
    try {
      // await sendPhoneCode(phone);
      // Mock success
      setCountdown(60);
    } catch (err: any) {
      setApiError(err.message || '发送验证码失败');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setShowError(true);
      return;
    }
    
    setIsLoading(true);
    setApiError('');
    
    try {
      if (mode === 'login') {
        if (loginMethod === 'phone') {
          // await loginWithPhone(phone, verifyCode);
          // Mock success
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          await login(account, password);
        }
      } else {
        await register({ nickname, email, phone, password });
      }
      onClose();
    } catch (err: any) {
      setApiError(err.message || '操作失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMethod = (method: 'account' | 'phone' | 'wechat') => {
    setLoginMethod(method);
    setApiError('');
  };

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
    setApiError('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100]"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden pointer-events-auto relative"
            >
              {/* Close button */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 sm:p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {mode === 'register' ? '注册 CareerAI' : '登录 CareerAI'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {loginMethod === 'wechat' 
                      ? '使用微信扫一扫快速安全登录' 
                      : (mode === 'login' 
                          ? (loginMethod === 'phone' ? '使用手机号和验证码登录' : '使用邮箱或手机号登录') 
                          : '创建您的账号')}
                  </p>
                </div>

                {apiError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                    {apiError}
                  </div>
                )}

                {loginMethod !== 'wechat' ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'register' && (
                      <>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="请输入昵称"
                            required
                            className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                          />
                        </div>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="请输入邮箱"
                            required
                            className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                          />
                        </div>
                        <div className="relative">
                          <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="请输入手机号"
                            required
                            className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                          />
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="请输入密码"
                            required
                            className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                          />
                        </div>
                      </>
                    )}

                    {mode === 'login' && loginMethod === 'account' && (
                      <>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={account}
                            onChange={(e) => setAccount(e.target.value)}
                            placeholder="请输入邮箱或手机号"
                            required
                            className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                          />
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="请输入密码"
                            required
                            className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                          />
                        </div>
                      </>
                    )}

                    {mode === 'login' && loginMethod === 'phone' && (
                      <>
                        <div className="relative">
                          <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="请输入手机号"
                            required
                            className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                          />
                        </div>
                        <div className="relative flex space-x-2">
                          <div className="relative flex-1">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              value={verifyCode}
                              onChange={(e) => setVerifyCode(e.target.value)}
                              placeholder="请输入验证码"
                              required
                              className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleSendCode}
                            disabled={countdown > 0 || isSendingCode || !phone}
                            className="h-12 px-4 bg-primary/10 text-primary rounded-xl text-sm font-medium hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                          >
                            {countdown > 0 ? `${countdown}s 后重试` : '获取验证码'}
                          </button>
                        </div>
                      </>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center mt-2"
                    >
                      {isLoading ? '处理中...' : (mode === 'register' ? '注册并登录' : '登录')}
                      {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                    </button>
                    
                    <div className="text-center mt-4">
                      <button 
                        type="button" 
                        onClick={toggleMode}
                        className="text-sm text-primary hover:underline"
                      >
                        {mode === 'login' ? '没有账号？立即注册' : '已有账号？直接登录'}
                      </button>
                    </div>
                  </form>
                ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                      <div className="w-48 h-48 bg-gray-50 border border-gray-200 rounded-2xl p-2 mb-6 relative group">
                        {weChatQrUrl ? (
                          <img 
                            src={weChatQrUrl} 
                            alt="WeChat Login QR" 
                            className={`w-full h-full rounded-xl transition-opacity ${weChatStatus === 'expired' ? 'opacity-30' : 'opacity-90 group-hover:opacity-100'}`}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                        
                        {weChatStatus === 'expired' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl">
                            <button onClick={initWeChatLogin} className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg shadow-sm">
                              二维码已过期，点击刷新
                            </button>
                          </div>
                        )}
                        
                        {weChatStatus === 'success' && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                              <Check className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-green-600">登录成功</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-full">
                        <WeChatIcon className="w-5 h-5 text-[#07C160] mr-2" />
                        打开微信扫一扫
                      </div>
                    </div>
                )}

                {/* Agreement Checkbox */}
                <div className="mt-6 flex items-start">
                  <button
                    type="button"
                    onClick={() => {
                      setAgreed(!agreed);
                      setShowError(false);
                    }}
                    className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      agreed 
                        ? 'bg-primary border-primary text-white' 
                        : showError 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-gray-300 bg-white'
                    }`}
                  >
                    {agreed && <Check className="w-3 h-3" />}
                  </button>
                  <div className="ml-2 text-xs text-gray-500 leading-relaxed">
                    我已阅读并同意
                    <a href="#" className="text-primary hover:underline mx-1">《用户服务协议》</a>
                    和
                    <a href="#" className="text-primary hover:underline mx-1">《隐私政策》</a>
                  </div>
                </div>
                {showError && !agreed && (
                  <p className="text-xs text-red-500 mt-1 ml-6">请先阅读并同意相关协议</p>
                )}

                {/* Switch Method */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap justify-center gap-4">
                  {loginMethod !== 'wechat' && (
                    <button
                      onClick={() => toggleMethod('wechat')}
                      className="flex items-center text-sm text-gray-500 hover:text-[#07C160] transition-colors"
                    >
                      <WeChatIcon className="w-5 h-5 mr-1.5" />
                      微信登录
                    </button>
                  )}
                  {loginMethod !== 'phone' && mode === 'login' && (
                    <button
                      onClick={() => toggleMethod('phone')}
                      className="flex items-center text-sm text-gray-500 hover:text-primary transition-colors"
                    >
                      <Smartphone className="w-4 h-4 mr-1.5" />
                      手机号登录
                    </button>
                  )}
                  {loginMethod !== 'account' && (
                    <button
                      onClick={() => toggleMethod('account')}
                      className="flex items-center text-sm text-gray-500 hover:text-primary transition-colors"
                    >
                      <User className="w-4 h-4 mr-1.5" />
                      账号密码登录
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
