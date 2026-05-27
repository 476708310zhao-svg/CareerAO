import React, { useMemo, useState } from 'react';
import { ArrowRight, Book, Briefcase, ChevronDown, FileText, HeadphonesIcon, HelpCircle, MessageCircle, Mic, RotateCcw, Search, Send, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';

import SEO from '../components/SEO';
import { useToast } from '../contexts/ToastContext';
import { apiFetch } from '../lib/api';

type Faq = {
  id: number;
  category: string;
  q: string;
  a: string;
};

type ChatMessage = {
  role: 'agent' | 'user';
  text: string;
};

const categories = ['热门问题', '新手指南', '简历优化', '职位申请', '面试准备', '账号权限'];

const faqs: Faq[] = [
  {
    id: 1,
    category: '简历优化',
    q: '如何使用 AI 优化我的简历？',
    a: '进入“我的简历”页面，选择一个简历版本后打开编辑器。你可以针对经历或项目使用 AI 润色，也可以粘贴目标 JD，让系统围绕关键词和岗位要求优化表达。',
  },
  {
    id: 2,
    category: '职位申请',
    q: '平台上的职位数据来自哪里？',
    a: '网页端通过统一代理接口读取后端职位数据，例如职位列表使用 /api/proxy/jobs，职位详情使用 /api/proxy/jobs/:id。后端会统一处理数据源、缓存和字段格式。',
  },
  {
    id: 3,
    category: '面试准备',
    q: '如何开启 AI 模拟面试？',
    a: '进入 AI 面试页面，选择目标岗位、公司和面试类型后即可开始。也可以从职位详情页带入 JD，让追问更贴合岗位要求。',
  },
  {
    id: 4,
    category: '新手指南',
    q: '校招日历适合哪些用户？',
    a: '校招日历适合正在准备秋招、春招、暑期实习和海外投递的同学，用来追踪网申开启、截止时间、笔试安排和官方申请入口。',
  },
  {
    id: 5,
    category: '账号权限',
    q: '会员和普通用户有什么区别？',
    a: '会员功能会逐步解锁更高频次的 AI 面试、简历优化、薪资对比和高级求职工具。具体权益以会员页面展示为准。',
  },
];

const quickLinks = [
  { label: '优化简历', desc: '进入简历库，按 JD 润色经历', href: '/my-resume', icon: Sparkles },
  { label: '找职位', desc: '搜索职位并记录投递进展', href: '/jobs', icon: Briefcase },
  { label: 'AI 面试', desc: '用目标岗位开启模拟面试', href: '/ai-interview', icon: Mic },
  { label: '联系团队', desc: '提交合作或服务问题', href: '/contact', icon: HeadphonesIcon },
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('热门问题');
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(1);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'agent', text: '你好，我是职引客服助手。请描述你遇到的问题，我会把它提交给支持团队跟进。' },
  ]);
  const { showToast } = useToast();

  const filteredFaqs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return faqs.filter((faq) => {
      const matchesCategory = activeCategory === '全部' || activeCategory === '热门问题' || faq.category === activeCategory;
      const matchesSearch = !query || faq.q.toLowerCase().includes(query) || faq.a.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    const content = chatMessage.trim();
    if (!content) return;

    setChatHistory((current) => [...current, { role: 'user', text: content }]);
    setChatMessage('');
    setIsSending(true);

    try {
      await apiFetch('/api/proxy/feedback', {
        method: 'POST',
        body: JSON.stringify({
          type: '帮助中心',
          content,
          contact: 'web-help-center',
        }),
      });
      setChatHistory((current) => [...current, { role: 'agent', text: '已收到你的问题，并同步到后台反馈系统。支持团队会结合账号信息尽快跟进。' }]);
      showToast('问题已提交', 'success');
    } catch (error) {
      console.warn('Help feedback failed:', error);
      setChatHistory((current) => [...current, { role: 'agent', text: '暂时无法写入后台反馈。请先登录后重试，或发送邮件到 support@zhiyincareer.com。' }]);
      showToast('提交失败，请先登录或发送邮件', 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12 relative">
      <SEO
        title="帮助中心"
        description="查看职引常见问题、功能说明、账号权限、简历优化和 AI 面试使用指南。"
        keywords="帮助中心,职引客服,简历优化帮助,AI面试帮助"
        canonical="https://www.zhiyincareer.com/help-center"
      />

      <section className="bg-primary/5 border-b border-primary/10 mb-8 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
          <h1 className="text-3xl font-black text-gray-900 mb-4">帮助中心</h1>
          <p className="text-gray-600 mb-8">查找使用教程、常见问题，或联系职引客服。</p>
          <form onSubmit={(event) => { event.preventDefault(); showToast('已根据关键词筛选帮助内容', 'info'); }} className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="搜索问题，例如：如何修改简历？" className="w-full pl-12 pr-24 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white shadow-sm" />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-xl text-sm font-medium">搜索</button>
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_360px] gap-8">
        <section className="space-y-6">
          <div className="flex overflow-x-auto pb-2 gap-2">
            <button onClick={() => setActiveCategory('全部')} className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium border ${activeCategory === '全部' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200'}`}>全部</button>
            {categories.map((category) => (
              <button key={category} onClick={() => setActiveCategory(category)} className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium border ${activeCategory === category ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200'}`}>{category}</button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center"><Book className="w-5 h-5 mr-2 text-primary" />常见问题</h2>
            </div>
            {filteredFaqs.length ? (
              <div className="divide-y divide-gray-50">
                {filteredFaqs.map((faq) => (
                  <div key={faq.id}>
                    <button onClick={() => setExpandedFaqId(expandedFaqId === faq.id ? null : faq.id)} className="w-full p-6 text-left flex justify-between items-start hover:bg-gray-50 transition-colors">
                      <span className={`font-medium ${expandedFaqId === faq.id ? 'text-primary' : 'text-gray-900'}`}>{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedFaqId === faq.id ? 'rotate-180 text-primary' : ''}`} />
                    </button>
                    {expandedFaqId === faq.id && <p className="px-6 pb-6 text-sm text-gray-600 leading-relaxed bg-gray-50/50">{faq.a}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">没有找到相关帮助内容</p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('热门问题'); }}
                  className="mt-5 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-hover"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  清空筛选
                </button>
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">快捷入口</h2>
            <div className="space-y-2 mb-4">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} to={item.href} className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3 hover:border-primary/20 hover:bg-primary/5 transition-colors">
                    <div className="flex items-center min-w-0">
                      <Icon className="w-5 h-5 mr-3 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{item.desc}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary shrink-0" />
                  </Link>
                );
              })}
            </div>
            <Link to="/terms" className="flex items-center p-3 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700"><FileText className="w-5 h-5 mr-3 text-blue-500" />服务条款</Link>
            <Link to="/privacy" className="flex items-center p-3 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700"><FileText className="w-5 h-5 mr-3 text-emerald-500" />隐私政策</Link>
          </div>
          <div className="bg-primary rounded-2xl p-6 text-white shadow-lg">
            <HeadphonesIcon className="w-10 h-10 mb-4" />
            <h2 className="text-xl font-bold mb-2">还需要帮助？</h2>
            <p className="text-sm text-blue-100 mb-6">联系在线客服，描述你遇到的问题。</p>
            <button onClick={() => setIsChatOpen(true)} className="w-full bg-white text-primary hover:bg-gray-50 font-bold py-3 px-4 rounded-xl flex items-center justify-center"><MessageCircle className="w-5 h-5 mr-2" />打开客服</button>
          </div>
        </aside>
      </div>

      {isChatOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100%-2rem)] max-w-[360px] h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-50 overflow-hidden">
          <div className="bg-primary p-4 flex justify-between items-center text-white">
            <div className="font-bold text-sm">职引客服助手</div>
            <button onClick={() => setIsChatOpen(false)} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {chatHistory.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed ${message.role === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'}`}>
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 bg-white flex gap-2">
            <input value={chatMessage} onChange={(event) => setChatMessage(event.target.value)} placeholder="输入你的问题..." className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary" />
            <button type="submit" disabled={!chatMessage.trim() || isSending} className="p-2.5 rounded-xl bg-primary text-white disabled:bg-gray-100 disabled:text-gray-400"><Send className="w-4 h-4" /></button>
          </form>
        </div>
      )}
    </main>
  );
}
