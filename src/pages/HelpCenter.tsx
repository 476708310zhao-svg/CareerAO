import React, { useState } from 'react';
import { 
  Search, 
  Book, 
  HelpCircle, 
  MessageCircle, 
  PlayCircle, 
  ChevronRight,
  ChevronDown,
  HeadphonesIcon,
  FileText,
  Send,
  X,
  MessageSquare
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

// Mock Data
const CATEGORIES = ['热门问题', '新手指南', '简历优化', '职位申请', '面试准备', '账号权限'];

const FAQS = [
  {
    id: 1,
    category: '简历优化',
    q: '如何使用AI一键优化我的简历？',
    a: '进入“我的简历”页面，如果您还没有简历，可以选择导入或在线填写基础信息。然后在简历详情页点击“AI 一键诊断”按钮，系统会自动分析您的简历并给出排版、内容、关键词的优化建议。您可以一键采纳这些建议生成新版简历。',
    isVideoAvailable: true
  },
  {
    id: 2,
    category: '职位申请',
    q: '平台上的岗位都是真实有效的吗？',
    a: '是的，职引前程平台上的所有岗位均需经过企业资质认证和HR实名认证，确保数据的真实有效。我们每日会定时清理已失效或已下线的岗位。',
    isVideoAvailable: false
  },
  {
    id: 3,
    category: '面试准备',
    q: '如何开启一次AI模拟面试？',
    a: '请前往“AI 模拟面试”专区，选择您要投递的目标岗位或公司。系统将根据岗位要求生成一份包含专业知识、行为面试题的题库。点击“开始面试”即可进入包含语音和视频对话的沉浸式面试环境。面试结束后，您会收到详细的面评报告。',
    isVideoAvailable: true
  },
  {
    id: 4,
    category: '新手指南',
    q: '如何联系发布职位的HR或内推人？',
    a: '在职位详情页的右侧，如果该职位允许直接沟通，您会看到“立即沟通”按钮，点击即可与发布者发起在线聊天。如果只支持投递，请点击“申请职位”投递您的简历。',
    isVideoAvailable: false
  },
  {
    id: 5,
    category: '热门问题',
    q: '海外留学生如何使用校招日历？',
    a: '“校招日历”模块支持按地区筛选（如中国内地、北美、欧洲等），您可以选择目标地区，查看针对该地区的秋招和春招时间线。由于时差和网申要求差异，日历会自动为您提示重要的Deadline。',
    isVideoAvailable: false
  },
  {
    id: 6,
    category: '账号权限',
    q: '普通用户和VIP会员有什么区别？',
    a: 'VIP会员可以享受无限次的AI简历诊断、解锁全部大厂面经、每日无限制的简历投递次数，并可以加入内推专属社群。普通用户则对上述核心功能有一定的频次限制（如每日1次AI诊断等）。',
    isVideoAvailable: false
  }
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('热门问题');
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);
  
  // Chat Support State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'agent', text: '您好！我是职引前程的智能客服助理。请问有什么我可以帮您的？您可以简述您遇到的问题。' }
  ]);
  
  const { showToast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      showToast(`正在为您搜索与“${searchQuery}”相关的文档...`, 'info');
      // In a real app, this would trigger a backend API call
      setActiveCategory('全部');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    // Add user message
    const newHistory = [...chatHistory, { role: 'user', text: chatMessage }];
    setChatHistory(newHistory);
    setChatMessage('');

    // Simulate Agent response
    setTimeout(() => {
      setChatHistory(prev => [
        ...prev, 
        { role: 'agent', text: '已收到您的反馈！客服人员正在为您接入中，请稍候。如需上传图片或详细说明，请继续发送。' }
      ]);
    }, 1000);
  };

  const filteredFaqs = FAQS.filter(faq => {
    const matchCategory = activeCategory === '全部' || activeCategory === '热门问题' ? true : faq.category === activeCategory;
    const matchSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 font-sans relative">
      {/* Hero Section */}
      <div className="bg-primary/5 border-b border-primary/10 mb-8 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">随时为您提供帮助</h1>
          <p className="text-gray-600 mb-8">在这里寻找使用教程、常见问题解答，或与我们的客服团队取得联系</p>
          
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="搜索问题，例如：如何修改当前绑定的邮箱？" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none bg-white shadow-sm text-base"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors">
              搜索
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content */}
          <div className="lg:w-2/3 space-y-8">
            
            {/* Category Pills */}
            <div className="flex overflow-x-auto pb-2 scrollbar-hide space-x-2">
              <button
                onClick={() => setActiveCategory('全部')}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-colors border ${
                  activeCategory === '全部' 
                    ? 'bg-primary text-white border-primary shadow-sm' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                全部文档
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-colors border ${
                    activeCategory === cat 
                      ? 'bg-primary text-white border-primary shadow-sm' 
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* FAQs List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <Book className="w-5 h-5 mr-2 text-primary" /> 
                  {searchQuery ? '搜索结果' : (activeCategory === '全部' ? '全部帮助内容' : `${activeCategory} 相关问题`)}
                </h2>
              </div>
              
              {filteredFaqs.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {filteredFaqs.map((faq) => (
                    <div key={faq.id} className="group">
                      <div 
                        className="p-6 cursor-pointer flex justify-between items-start hover:bg-gray-50/50 transition-colors"
                        onClick={() => setExpandedFaqId(expandedFaqId === faq.id ? null : faq.id)}
                      >
                        <div className="pr-8">
                          <h3 className={`text-base font-medium transition-colors ${expandedFaqId === faq.id ? 'text-primary' : 'text-gray-900 group-hover:text-primary'}`}>
                            {faq.q}
                          </h3>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 mt-0.5 transition-transform duration-300 flex-shrink-0 ${expandedFaqId === faq.id ? 'rotate-180 text-primary' : ''}`} />
                      </div>
                      
                      {expandedFaqId === faq.id && (
                        <div className="px-6 pb-6 pt-0 text-sm text-gray-600 leading-relaxed bg-gray-50/50">
                          <p className="mb-4">{faq.a}</p>
                          
                          {faq.isVideoAvailable && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); showToast('正在加载视频教程...', 'info'); }}
                              className="inline-flex items-center text-primary bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors font-medium"
                            >
                              <PlayCircle className="w-4 h-4 mr-2" />
                              观看视频教程
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">没有找到相关的帮助文档</p>
                  <p className="text-sm text-gray-400 mt-2">您可以尝试更换搜索词，或者直接联系人工客服。</p>
                </div>
              )}
            </div>

          </div>

          {/* Sidebar / Support Area */}
          <div className="lg:w-1/3 space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
              <h3 className="text-lg font-bold text-gray-900 mb-4">快捷入口</h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all select-none">
                   <div className="flex items-center">
                     <FileText className="w-5 h-5 mr-3 text-blue-500" />
                     <span className="text-sm font-medium text-gray-700">平台用户协议</span>
                   </div>
                   <ChevronRight className="w-4 h-4 text-gray-400" />
                </a>
                <a href="#" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all select-none">
                   <div className="flex items-center">
                     <FileText className="w-5 h-5 mr-3 text-emerald-500" />
                     <span className="text-sm font-medium text-gray-700">隐私权政策</span>
                   </div>
                   <ChevronRight className="w-4 h-4 text-gray-400" />
                </a>
              </div>
            </div>

            {/* Need More Help / Chat Widget Teaser */}
            <div className="bg-gradient-to-br from-primary to-blue-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full pointer-events-none"></div>
              
              <div className="mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                  <HeadphonesIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">没找到想要的答案？</h3>
                <p className="text-sm text-blue-100 mb-6 leading-relaxed">
                  我们的专家客服团队提供7*24小时的在线支持，随时为您解答疑问、处理异常问题。
                </p>
              </div>

              <button 
                onClick={() => setIsChatOpen(true)}
                className="w-full bg-white text-primary hover:bg-gray-50 font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center shadow-md select-none"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                召唤人工客服
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Chat Support Modal/Popup */}
      {isChatOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-full max-w-[360px] h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-50 overflow-hidden translate-y-0 transition-transform origin-bottom-right">
          {/* Chat Header */}
          <div className="bg-primary p-4 flex justify-between items-center text-white">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3 backdrop-blur-sm relative">
                <HeadphonesIcon className="w-4 h-4" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-primary rounded-full"></span>
              </div>
              <div>
                <h4 className="font-bold text-sm">客服 - 小职</h4>
                <p className="text-[10px] text-blue-100 opacity-90">当前在线，随时解答</p>
              </div>
            </div>
            <button 
              onClick={() => setIsChatOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-4">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'agent' && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                    <HeadphonesIcon className="w-3 h-3 text-white" />
                  </div>
                )}
                <div 
                  className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-sm' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-gray-100 bg-white">
            <form onSubmit={handleSendMessage} className="flex items-end gap-2">
              <textarea 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder="在此输入您的问题..."
                className="flex-1 max-h-24 min-h-[40px] resize-none px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-colors"
                rows={1}
              />
              <button 
                type="submit"
                disabled={!chatMessage.trim()}
                className={`p-2.5 rounded-xl transition-colors flex-shrink-0 ${
                  chatMessage.trim() ? 'bg-primary text-white hover:bg-primary-hover shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
