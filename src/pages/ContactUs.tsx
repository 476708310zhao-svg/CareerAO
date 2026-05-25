import React, { useState } from 'react';
import { Mail, MapPin, MessageSquare, Send } from 'lucide-react';

import SEO from '../components/SEO';
import { useToast } from '../contexts/ToastContext';

export default function ContactUs() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'business', message: '' });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('请填写完整的联系信息', 'error');
      return;
    }
    showToast('留言提交成功，我们会尽快与你联系。', 'success');
    setFormData({ name: '', email: '', subject: 'business', message: '' });
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12">
      <SEO title="联系我们" description="联系职引团队，提交商务合作、媒体采访、用户支持和产品反馈。" keywords="联系职引,商务合作,用户支持,产品反馈" canonical="https://www.zhiyincareer.com/contact" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="text-center max-w-2xl mx-auto mb-16 pt-8">
          <h1 className="text-4xl font-black text-gray-900 mb-4">联系我们</h1>
          <p className="text-gray-600">无论是商务合作、媒体采访、功能反馈，还是使用问题，我们都期待听到你的声音。</p>
        </section>

        <div className="grid lg:grid-cols-[360px_1fr] gap-12">
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6"><Mail className="w-6 h-6 text-blue-600" /></div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">电子邮件</h2>
              <p className="text-gray-600 text-sm mb-4">通常会在 24 小时内回复。</p>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">商务合作：</span><a href="mailto:bd@zhiyincareer.com" className="text-primary hover:underline">bd@zhiyincareer.com</a></p>
                <p><span className="text-gray-500">用户支持：</span><a href="mailto:support@zhiyincareer.com" className="text-primary hover:underline">support@zhiyincareer.com</a></p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6"><MapPin className="w-6 h-6 text-emerald-600" /></div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">服务范围</h2>
              <p className="text-gray-600 text-sm leading-relaxed">面向中国、北美、英国、新加坡和香港等地区的留学生求职用户。</p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6"><MessageSquare className="w-6 h-6 text-amber-600" /></div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">在线客服</h2>
              <p className="text-gray-600 text-sm">工作日 9:00 - 18:00，紧急问题请优先发送邮件。</p>
            </div>
          </aside>

          <section className="bg-white rounded-2xl p-8 lg:p-12 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">给我们留言</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-2">你的姓名</span>
                  <input value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" placeholder="张三" />
                </label>
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-2">联系邮箱</span>
                  <input type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" placeholder="name@example.com" />
                </label>
              </div>
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">咨询类型</span>
                <select value={formData.subject} onChange={(event) => setFormData({ ...formData, subject: event.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white">
                  <option value="business">商务合作</option>
                  <option value="support">用户支持</option>
                  <option value="media">媒体采访</option>
                  <option value="feedback">产品建议</option>
                </select>
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">内容描述</span>
                <textarea value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none h-40 resize-none" placeholder="请详细描述你的需求..." />
              </label>
              <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold transition-all flex justify-center items-center shadow-lg shadow-primary/20">
                发送消息
                <Send className="w-4 h-4 ml-2" />
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
