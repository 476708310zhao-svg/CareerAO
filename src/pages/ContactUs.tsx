import React, { useState } from 'react';
import { Mail, MapPin, Phone, MessageSquare, Send } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export default function ContactUs() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'business',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('请填写完整的联系信息', 'error');
      return;
    }
    // Simulate API call
    showToast('留言提交成功！我们的团队会尽快与您联系。', 'success');
    setFormData({ name: '', email: '', subject: 'business', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 pt-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">联系我们</h1>
          <p className="text-gray-600">
            无论是商务合作、媒体采访、还是使用反馈，我们都非常期待听到您的声音。
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Contact Info */}
          <div className="lg:w-1/3 space-y-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">电子邮件</h3>
              <p className="text-gray-600 text-sm mb-4">通常我们会在 24 小时内给您回复。</p>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">商务合作：</span> <a href="mailto:bd@careerai.com" className="text-primary hover:underline">bd@careerai.com</a></p>
                <p><span className="text-gray-500">用户支持：</span> <a href="mailto:support@careerai.com" className="text-primary hover:underline">support@careerai.com</a></p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">办公地址</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                中国北京市海淀区<br />
                中关村科技园区 8 号智造大街<br />
                A座 12 层 1201 室
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">在线客服</h3>
              <p className="text-gray-600 text-sm mb-4">
                工作日 9:00 - 18:00
              </p>
              <button className="text-primary font-medium hover:underline text-sm focus:outline-none">
                点击召唤在线客服 &rarr;
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl p-8 lg:p-12 border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">给我们留言</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">您的姓名</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      placeholder="张三"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">联系邮箱</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      placeholder="zhangsan@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">咨询类型</label>
                  <select 
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none bg-white"
                  >
                    <option value="business">商务合作 (B端入驻、广告等)</option>
                    <option value="support">用户支持 (账号问题、功能异常等)</option>
                    <option value="media">媒体采访</option>
                    <option value="feedback">产品建议</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">内容描述</label>
                  <textarea 
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none h-40 resize-none"
                    placeholder="请详细描述您的来意..."
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold transition-all flex justify-center items-center shadow-lg shadow-primary/20"
                >
                  发送消息 <Send className="w-4 h-4 ml-2" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
