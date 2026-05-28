import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Copy, Crown, History, Loader2, Sparkles, Zap } from 'lucide-react';

import SEO from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { apiFetch } from '../lib/api';

type BillingCycle = 'monthly' | 'quarterly' | 'annual';

type Plan = {
  id: number;
  key: BillingCycle;
  label: string;
  price: string;
  amount: number;
  period: string;
  description: string;
  badge?: string;
};

type Order = {
  order_no?: string;
  orderNo?: string;
  plan_name?: string;
  planName?: string;
  amount?: number;
  status?: string;
  created_at?: string;
  paid_at?: string;
};

const plans: Record<BillingCycle, Plan> = {
  monthly: {
    id: 0,
    key: 'monthly',
    label: '月度会员',
    price: '19.90',
    amount: 1990,
    period: '/ 月',
    description: '适合短期冲刺，解锁核心 AI 求职工具。',
  },
  quarterly: {
    id: 1,
    key: 'quarterly',
    label: '季度会员',
    price: '49.90',
    amount: 4990,
    period: '/ 季',
    description: '适合秋招/春招备战，覆盖完整投递周期。',
    badge: '更划算',
  },
  annual: {
    id: 2,
    key: 'annual',
    label: '年度会员',
    price: '199.00',
    amount: 19900,
    period: '/ 年',
    description: '覆盖求职全生命周期，从准备、投递到面试复盘。',
    badge: '最受欢迎',
  },
};

const features = [
  ['网申助手', '每月 3 次基础解析', '深度 JD 解析、OQ 智能生成与投递建议'],
  ['笔经面经', '查看部分公开面经', '访问更多真实面经、复盘和高频题库'],
  ['AI 面试', '基础模拟体验', '更高频模拟面试、追问和 STAR 优化反馈'],
  ['薪资查询', '基础薪资范围查看', '解锁更细粒度薪资构成和 offer 对比'],
  ['我的简历', '基础简历管理', '更多简历版本、AI 润色和岗位定制'],
  ['求职规划', '基础路线图生成', '阶段目标、时间线和行动清单持续更新'],
  ['机构测评', '查看基础评分', '更完整的避坑维度和真实评价辅助判断'],
  ['校招日历', '查看公开信息', '完整校招追踪、提醒和收藏能力'],
];

const formatAmount = (amount?: number) => {
  if (!amount) return '-';
  return `¥${(amount / 100).toFixed(2)}`;
};

export default function Membership() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('annual');
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [paymentConfig, setPaymentConfig] = useState<{ configured?: boolean; mock?: boolean } | null>(null);
  const { isAuthenticated, user, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const selectedPlan = plans[billingCycle];
  const isVip = Number(user?.vipLevel || user?.vip_level || 0) > 0;
  const vipExpiresAt = user?.vipExpiresAt || user?.vip_expires_at;

  const orderedPlans = useMemo(() => [plans.monthly, plans.quarterly, plans.annual], []);

  useEffect(() => {
    apiFetch('/api/proxy/payment/config')
      .then((response) => setPaymentConfig(response))
      .catch(() => setPaymentConfig(null));
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    apiFetch('/api/proxy/payment/orders')
      .then((response) => setOrders(response.orders || []))
      .catch((error) => console.warn('Failed to load payment orders:', error));
  }, [isAuthenticated, currentOrder]);

  const createOrder = async () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      showToast('请先登录后购买会员', 'info');
      return;
    }

    setIsCreatingOrder(true);
    try {
      const response = await apiFetch('/api/proxy/payment/create-order', {
        method: 'POST',
        body: JSON.stringify({ planId: selectedPlan.id }),
      });

      setCurrentOrder(response);

      if (response.mock && response.orderNo) {
        const confirm = await apiFetch('/api/proxy/payment/mock-confirm', {
          method: 'POST',
          body: JSON.stringify({ orderNo: response.orderNo }),
        });
        setCurrentOrder({ ...response, ...confirm, status: 'paid' });
        showToast(`模拟支付成功，会员有效期至 ${confirm.expireDate || '后台已更新'}`, 'success');
        return;
      }

      showToast('订单已创建，请在微信支付环境中完成支付', 'success');
    } catch (error: any) {
      console.warn('Create order failed:', error);
      showToast(error?.message || '创建订单失败，请稍后重试', 'error');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const verifyOrder = async () => {
    const orderNo = currentOrder?.orderNo;
    if (!orderNo) return;
    try {
      const response = await apiFetch(`/api/proxy/payment/verify/${orderNo}`);
      setCurrentOrder({ ...currentOrder, ...response });
      showToast(response.status === 'paid' ? '订单已支付' : '订单仍待支付', response.status === 'paid' ? 'success' : 'info');
    } catch (error: any) {
      showToast(error?.message || '订单状态查询失败', 'error');
    }
  };

  const copyOrderInfo = async () => {
    if (!currentOrder) return;
    const text = [
      '职引会员订单',
      `订单号：${currentOrder.orderNo || currentOrder.order_no || '-'}`,
      `套餐：${currentOrder.planName || currentOrder.plan_name || selectedPlan.label}`,
      `金额：${formatAmount(currentOrder.amount)}`,
      `状态：${currentOrder.status || (currentOrder.mock ? '模拟支付已确认' : '待支付')}`,
    ].join('\n');
    await navigator.clipboard.writeText(text);
    showToast('订单信息已复制', 'success');
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-20">
      <SEO
        title="会员权益"
        description="升级职引 Pro 会员，解锁 AI 面试、简历优化、薪资查询、网申助手和求职规划等高级工具。"
        canonical="https://www.zhiyincareer.com/membership"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="text-center max-w-3xl mx-auto mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black text-gray-900 mb-4 flex items-center justify-center">
              <Crown className="w-10 h-10 text-amber-500 mr-3" />
              会员权益
            </h1>
            <p className="text-lg text-gray-600">
              升级 Pro 会员，解锁核心求职工具，让简历、投递、面试和规划形成完整闭环。
            </p>
          </motion.div>
        </section>

        {isAuthenticated && isVip && (
          <section className="max-w-5xl mx-auto mb-8 bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="font-bold text-emerald-900">你当前已是 Pro 会员</h2>
              <p className="text-sm text-emerald-700 mt-1">{vipExpiresAt ? `有效期至 ${vipExpiresAt}` : '会员状态已激活'}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </section>
        )}

        <section className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-xl border border-gray-200 inline-flex shadow-sm relative">
            {orderedPlans.map((plan) => (
              <button
                key={plan.key}
                onClick={() => setBillingCycle(plan.key)}
                className={`relative px-5 sm:px-6 py-2.5 text-sm font-medium rounded-lg transition-colors z-10 ${
                  billingCycle === plan.key ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {plan.label}
              </button>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">基础版</h2>
              <p className="text-gray-500 text-sm">适合初期探索，体验基础求职工具。</p>
            </div>
            <div className="mb-8">
              <span className="text-4xl font-bold text-gray-900">¥0</span>
              <span className="text-gray-500"> / 永久</span>
            </div>
            <button className="w-full py-3.5 px-4 bg-gray-100 text-gray-800 font-bold rounded-xl mb-8 cursor-default">
              当前可用
            </button>
            <div className="space-y-4 flex-1">
              <p className="text-sm font-bold text-gray-900 mb-4">包含基础权益：</p>
              {features.map(([name, free]) => (
                <div key={name} className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">{name}</span>
                    <p className="text-xs text-gray-500 mt-0.5">{free}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-gradient-to-b from-blue-600 to-indigo-800 rounded-3xl p-8 border border-blue-500 shadow-xl shadow-blue-900/20 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-50 pointer-events-none" />
            {selectedPlan.badge && (
              <div className="absolute top-0 right-8 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-b-lg shadow-sm">
                {selectedPlan.badge}
              </div>
            )}

            <div className="mb-6 relative z-10">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
                Pro 会员 <Sparkles className="w-5 h-5 ml-2 text-amber-300" />
              </h2>
              <p className="text-blue-200 text-sm">{selectedPlan.description}</p>
            </div>
            <div className="mb-8 relative z-10">
              <span className="text-4xl font-bold text-white">¥{selectedPlan.price}</span>
              <span className="text-blue-200">{selectedPlan.period}</span>
            </div>
            <button
              onClick={createOrder}
              disabled={isCreatingOrder}
              className="w-full py-3.5 px-4 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors mb-8 shadow-md flex items-center justify-center relative z-10 disabled:opacity-70"
            >
              {isCreatingOrder ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Zap className="w-5 h-5 mr-2 text-amber-500" />}
              {isAuthenticated ? '立即升级 Pro' : '登录后升级'}
            </button>
            <div className="space-y-4 flex-1 relative z-10">
              <p className="text-sm font-bold text-white mb-4">解锁全部高级权益：</p>
              {features.map(([name, , pro]) => (
                <div key={name} className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 mr-3 shrink-0" />
                  <div>
                    <span className="text-sm font-bold text-white">{name}</span>
                    <p className="text-xs text-blue-100 mt-0.5">{pro}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {currentOrder && (
          <section className="max-w-5xl mx-auto mb-12 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-bold text-gray-900">当前订单</h2>
              <button onClick={copyOrderInfo} className="inline-flex w-fit items-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-bold text-gray-600 hover:border-blue-200 hover:text-blue-700">
                <Copy className="mr-1.5 h-4 w-4" />
                复制订单信息
              </button>
            </div>
            <div className="grid sm:grid-cols-4 gap-4 text-sm">
              <div><span className="text-gray-500">订单号</span><p className="font-mono text-gray-900 mt-1 break-all">{currentOrder.orderNo}</p></div>
              <div><span className="text-gray-500">套餐</span><p className="font-bold text-gray-900 mt-1">{currentOrder.planName}</p></div>
              <div><span className="text-gray-500">金额</span><p className="font-bold text-gray-900 mt-1">{formatAmount(currentOrder.amount)}</p></div>
              <div><span className="text-gray-500">状态</span><p className="font-bold text-primary mt-1">{currentOrder.status || (currentOrder.mock ? 'mock 已确认' : '待支付')}</p></div>
            </div>
            {!currentOrder.mock && (
              <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-sm text-blue-800">真实微信支付需要在微信支付环境内拉起支付。完成支付后可点击查询订单状态。</p>
                <button onClick={verifyOrder} className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">
                  查询状态 <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </section>
        )}

        <section className="max-w-5xl mx-auto bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900 text-center">核心功能详细对比</h2>
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
                {features.map(([name, free, pro]) => (
                  <tr key={name} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 border-b border-gray-100 font-medium text-gray-900">{name}</td>
                    <td className="py-4 px-6 border-b border-gray-100 text-gray-600">{free}</td>
                    <td className="py-4 px-6 border-b border-gray-100 text-blue-800 font-medium bg-blue-50/30">{pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {isAuthenticated && (
          <section className="max-w-5xl mx-auto mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center"><History className="w-5 h-5 mr-2 text-primary" />最近订单</h2>
            {orders.length ? (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.order_no || order.orderNo} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border border-gray-100 rounded-xl p-3 text-sm">
                    <div>
                      <p className="font-bold text-gray-900">{order.plan_name || order.planName}</p>
                      <p className="text-gray-400 font-mono text-xs mt-1">{order.order_no || order.orderNo}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-gray-900">{formatAmount(order.amount)}</span>
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${order.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {order.status === 'paid' ? '已支付' : '待支付'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">暂无订单记录。</p>
            )}
          </section>
        )}

        {paymentConfig && (
          <p className="max-w-5xl mx-auto mt-4 text-xs text-gray-400">
            支付环境：{paymentConfig.mock ? 'Mock 模式' : paymentConfig.configured ? '微信支付已配置' : '未配置'}
          </p>
        )}
      </div>
    </main>
  );
}
