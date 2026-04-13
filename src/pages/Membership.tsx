import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Sparkles, Crown, Zap, ArrowRight } from 'lucide-react';

export default function Membership() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly' | 'annual'>('annual');

  const plans = {
    monthly: {
      price: '99',
      period: '/ 月',
      description: '适合短期冲刺，全面提升求职效率。',
    },
    quarterly: {
      price: '259',
      period: '/ 季',
      description: '适合秋招/春招备战，性价比之选。',
      badge: '立省 ￥38',
    },
    annual: {
      price: '799',
      period: '/ 年',
      description: '覆盖求职全生命周期，从准备到入职。',
      badge: '最受欢迎 · 立省 ￥389',
    }
  };

  const features = [
    {
      name: '网申助手',
      free: '每月 3 次基础解析',
      pro: '无限次深度解析与 OQ 智能生成',
    },
    {
      name: '笔经面经',
      free: '查看部分公开面经',
      pro: '无限制访问全量大厂真题库',
    },
    {
      name: 'AI 面试',
      free: '每月 1 次基础模拟',
      pro: '无限次沉浸式模拟与 STAR 深度优化',
    },
    {
      name: '薪资查询',
      free: '基础薪资范围查看',
      pro: '解锁详细薪资构成与 Offer 比较',
    },
    {
      name: '我的简历',
      free: '1 份基础简历模板',
      pro: '无限次 ATS 优化与多版本管理',
    },
    {
      name: '求职规划',
      free: '基础路线图生成',
      pro: '动态更新专属 6 个月时间线与打卡',
    },
    {
      name: '机构测评',
      free: '查看机构基础评分',
      pro: '解锁完整避坑指南与真实学员评价',
    },
    {
      name: '校招日历',
      free: '仅查看本周校招信息',
      pro: '全量校招追踪与一键订阅提醒',
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <Crown className="w-10 h-10 text-amber-500 mr-3" />
              会员权益
            </h1>
            <p className="text-lg text-gray-600">
              升级 Pro 会员，全面解锁 8 大核心求职功能，为你的 Dream Offer 保驾护航。
            </p>
          </motion.div>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1.5 rounded-xl border border-gray-200 inline-flex shadow-sm relative">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`relative px-6 py-2.5 text-sm font-medium rounded-lg transition-colors z-10 ${
                billingCycle === 'monthly' ? 'text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              月度会员
            </button>
            <button
              onClick={() => setBillingCycle('quarterly')}
              className={`relative px-6 py-2.5 text-sm font-medium rounded-lg transition-colors z-10 ${
                billingCycle === 'quarterly' ? 'text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              季度会员
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`relative px-6 py-2.5 text-sm font-medium rounded-lg transition-colors z-10 ${
                billingCycle === 'annual' ? 'text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              年度会员
            </button>
            
            {/* Animated Background Pill */}
            <motion.div
              className="absolute top-1.5 bottom-1.5 w-[100px] bg-blue-600 rounded-lg z-0"
              initial={false}
              animate={{
                x: billingCycle === 'monthly' ? 6 : billingCycle === 'quarterly' ? 106 : 206,
                width: billingCycle === 'monthly' ? 96 : billingCycle === 'quarterly' ? 96 : 96
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">基础版</h3>
              <p className="text-gray-500 text-sm">适合初期探索，体验基础求职工具。</p>
            </div>
            <div className="mb-8">
              <span className="text-4xl font-bold text-gray-900">￥0</span>
              <span className="text-gray-500"> / 永久</span>
            </div>
            <button className="w-full py-3.5 px-4 bg-gray-100 text-gray-800 font-bold rounded-xl hover:bg-gray-200 transition-colors mb-8">
              当前计划
            </button>
            <div className="space-y-4 flex-1">
              <p className="text-sm font-bold text-gray-900 mb-4">包含基础权益：</p>
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">{feature.name}</span>
                    <p className="text-xs text-gray-500 mt-0.5">{feature.free}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-b from-blue-600 to-indigo-800 rounded-3xl p-8 border border-blue-500 shadow-xl shadow-blue-900/20 flex flex-col relative overflow-hidden"
          >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
            
            {plans[billingCycle].badge && (
              <div className="absolute top-0 right-8 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-b-lg shadow-sm">
                {plans[billingCycle].badge}
              </div>
            )}

            <div className="mb-6 relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                Pro 会员 <Sparkles className="w-5 h-5 ml-2 text-amber-300" />
              </h3>
              <p className="text-blue-200 text-sm">{plans[billingCycle].description}</p>
            </div>
            <div className="mb-8 relative z-10">
              <span className="text-4xl font-bold text-white">￥{plans[billingCycle].price}</span>
              <span className="text-blue-200">{plans[billingCycle].period}</span>
            </div>
            <button className="w-full py-3.5 px-4 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors mb-8 shadow-md flex items-center justify-center relative z-10">
              <Zap className="w-5 h-5 mr-2 text-amber-500" /> 立即升级 Pro
            </button>
            <div className="space-y-4 flex-1 relative z-10">
              <p className="text-sm font-bold text-white mb-4">解锁全部高级权益：</p>
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 mr-3 shrink-0" />
                  <div>
                    <span className="text-sm font-bold text-white">{feature.name}</span>
                    <p className="text-xs text-blue-100 mt-0.5">{feature.pro}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Feature Comparison Table (Optional, but good for detailed view) */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-gray-50">
            <h3 className="text-xl font-bold text-gray-900 text-center">核心功能详细对比</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="py-4 px-6 font-bold text-gray-900 border-b border-gray-200 bg-white w-1/3">核心功能</th>
                  <th className="py-4 px-6 font-bold text-gray-500 border-b border-gray-200 bg-white w-1/3">基础版</th>
                  <th className="py-4 px-6 font-bold text-blue-700 border-b border-gray-200 bg-blue-50/50 w-1/3">Pro 会员</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {features.map((feature, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 border-b border-gray-100 font-medium text-gray-900 flex items-center">
                      {feature.name}
                    </td>
                    <td className="py-4 px-6 border-b border-gray-100 text-gray-600">
                      {feature.free}
                    </td>
                    <td className="py-4 px-6 border-b border-gray-100 text-blue-800 font-medium bg-blue-50/30">
                      {feature.pro}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
