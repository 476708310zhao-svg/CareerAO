import React from 'react';
import { Users, Target, Zap, Heart, Shield, Globe } from 'lucide-react';

import SEO from '../components/SEO';

export default function AboutTeam() {
  const values = [
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      title: "用户导向",
      desc: "我们始终将求职者的需求放在首位，致力于打造真正解决痛点的产品功能。"
    },
    {
      icon: <Target className="w-6 h-6 text-emerald-500" />,
      title: "数据驱动",
      desc: "利用先进的AI和大数据分析，提供精准的求职建议和岗位匹配。"
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      title: "高效迭代",
      desc: "快速响应市场变化，不断优化产品体验，保持平台的领先优势。"
    },
    {
      icon: <Shield className="w-6 h-6 text-indigo-500" />,
      title: "安全可靠",
      desc: "严格保护用户隐私与数据安全，建立真实可靠的职业招聘环境。"
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 font-sans">
      <SEO
        title="团队介绍"
        description="了解职引团队、产品使命和服务理念。职引用 AI 和数据能力帮助留学生提升求职效率。"
        keywords="职引团队,留学生求职平台,AI求职,团队介绍"
        canonical="https://www.zhiyincareer.com/team"
      />
      {/* Hero Section */}
      <section className="bg-primary/5 py-20 border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            科技赋能，让每一次对视都充满期待
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            职引 创立于 2024 年，是一支由资深技术专家、前大厂HR高级总监以及AI算法工程师组成的充满激情的团队。我们致力于用先进的人工智能技术，打破信息差，让天下没有难找的工作。
          </p>
        </div>
      </section>

      {/* Our Mission & Vision */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">我们的使命与愿景</h2>
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                在信息爆炸的时代，优秀的求职者往往因为“简历不够亮眼”或“面试技巧欠缺”而错失良机；而优质企业也因为海量简历中难以筛选出合适的人才而头疼。
              </p>
              <p>
                我们的使命是：<strong className="text-primary">让 AI 成为每个人身边的专属职业规划师。</strong>
              </p>
              <p>
                从简历一键优化、AI 模拟真实面试，到精准的岗位双向匹配，我们希望通过技术的力量，提升社会的整体就业效率，帮助每一位有梦想的年轻人找到能闪闪发光的舞台。
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square max-h-[400px] bg-gradient-to-tr from-primary/20 to-blue-300/20 rounded-3xl mx-auto overflow-hidden relative border border-gray-100 shadow-2xl">
               <img 
                 src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60" 
                 alt="Team collaboration" 
                 className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80"
               />
               <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-gray-50 py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">我们的价值观</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">引导我们前行的原则与信念</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6">
                  {v.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Heart className="w-12 h-12 text-primary mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-6">加入我们，共创未来</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          我们正在寻找充满激情、热爱技术的你加入我们的分布式办公团队。不论你身在何处，只要你认同我们的愿景，都能在这里找到属于你的位置。
        </p>
        <button className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-primary/20">
          查看热招职位
        </button>
      </section>

    </div>
  );
}
