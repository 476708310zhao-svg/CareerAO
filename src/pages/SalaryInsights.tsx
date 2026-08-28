import React, { useEffect, useMemo, useState } from 'react';
import { Award, BarChart3, Building2, Calculator, Copy, DollarSign, MapPin, Search, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import SEO from '../components/SEO';
import { useToast } from '../contexts/ToastContext';
import { apiFetch } from '../lib/api';

type SalaryStats = {
  avgTotal?: number;
  avgBase?: number;
  avgStock?: number;
  avgBonus?: number;
  minTotal?: number;
  maxTotal?: number;
  p25?: number;
  p50?: number;
  p75?: number;
  count?: number;
  currency?: string;
  dataSource?: string;
  marketNote?: string;
};

type Offer = {
  company: string;
  role: string;
  level: string;
  location: string;
  tc: string;
  yoe: string;
  date: string;
  currency?: string;
};

type MarketSalary = {
  min_salary?: number;
  max_salary?: number;
  median_salary?: number;
  p25_salary?: number;
  p75_salary?: number;
  currency?: string;
  data_source?: string;
  sample_size?: number;
  market_note?: string;
  breakdown?: {
    base_pct?: number;
    bonus_pct?: number;
    equity_pct?: number;
  } | null;
};

const fallbackLevels = [
  { level: 'L3', total: 195, base: 135, stock: 40, bonus: 20 },
  { level: 'L4', total: 285, base: 170, stock: 85, bonus: 30 },
  { level: 'L5', total: 390, base: 210, stock: 140, bonus: 40 },
  { level: 'L6', total: 540, base: 250, stock: 230, bonus: 60 },
];

const fallbackOffers: Offer[] = [
  { company: 'Google', role: 'SWE', level: 'L4', location: 'San Francisco, CA', tc: '$290,000', yoe: '3 yrs', date: '2 天前' },
  { company: 'Meta', role: 'SWE', level: 'E4', location: 'Menlo Park, CA', tc: '$310,000', yoe: '4 yrs', date: '3 天前' },
  { company: 'Amazon', role: 'SDE II', level: 'L5', location: 'Seattle, WA', tc: '$275,000', yoe: '3.5 yrs', date: '1 周前' },
];

const currencySymbol = (currency = 'USD') => {
  if (currency === 'CNY') return '¥';
  if (currency === 'GBP') return '£';
  if (currency === 'EUR') return '€';
  return '$';
};

const detectRegion = (value = '') => (
  /中国|北京|上海|深圳|广州|杭州|成都|武汉|南京|苏州|香港|人民币|CNY/i.test(value) ? 'CN' : 'NA'
);

const formatMoney = (value?: number, fallback?: number, currency = 'USD') => {
  const source = value || fallback || 0;
  return `${currencySymbol(currency)}${Math.round(source / (source > 1000 ? 1000 : 1))}k`;
};

const formatAnnualAmount = (value?: number, currency = 'USD') => {
  const amount = Number(value) || 0;
  return amount ? `${currencySymbol(currency)}${amount.toLocaleString()}` : 'N/A';
};

const salarySourceText = (source?: string) => {
  if (source === 'community') return '社区真实样本';
  if (source === 'rapidapi') return '市场薪资接口';
  if (source === 'ai') return 'AI 市场估算';
  if (source === 'statistics') return '社区统计';
  if (source === 'fallback') return '参考样例';
  return '数据已同步';
};

const normalizeMarketStats = (market: MarketSalary, fallbackCurrency: string): SalaryStats | null => {
  const total = Number(market.median_salary) || 0;
  if (!total) return null;
  const basePct = Number(market.breakdown?.base_pct) || (fallbackCurrency === 'CNY' ? 75 : 65);
  const bonusPct = Number(market.breakdown?.bonus_pct) || 15;
  const stockPct = Number(market.breakdown?.equity_pct) || Math.max(0, 100 - basePct - bonusPct);

  return {
    avgTotal: total,
    avgBase: Math.round(total * (basePct / 100)),
    avgBonus: Math.round(total * (bonusPct / 100)),
    avgStock: Math.round(total * (stockPct / 100)),
    minTotal: Number(market.min_salary) || undefined,
    maxTotal: Number(market.max_salary) || undefined,
    p25: Number(market.p25_salary) || undefined,
    p50: total,
    p75: Number(market.p75_salary) || undefined,
    count: Number(market.sample_size) || undefined,
    currency: market.currency || fallbackCurrency,
    dataSource: market.data_source || 'market',
    marketNote: market.market_note || '',
  };
};

const normalizeCommunityStats = (data: any, currency: string): SalaryStats | null => {
  const total = Number(data?.avgTotal) || Number(data?.avg) || 0;
  if (!total && !Number(data?.count)) return null;
  return {
    avgTotal: total,
    avgBase: Number(data?.avgBase) || undefined,
    avgBonus: Number(data?.avgBonus) || undefined,
    avgStock: Number(data?.avgStock) || undefined,
    minTotal: Number(data?.minTotal) || undefined,
    maxTotal: Number(data?.maxTotal) || undefined,
    p25: Number(data?.p25) || undefined,
    p50: Number(data?.p50) || undefined,
    p75: Number(data?.p75) || undefined,
    count: Number(data?.count) || undefined,
    currency,
    dataSource: 'statistics',
  };
};

const buildSalaryChartData = (stats: SalaryStats | null) => {
  if (!stats?.avgTotal) {
    return fallbackLevels.map((item) => ({ level: item.level, Base: item.base, Stock: item.stock, Bonus: item.bonus }));
  }

  const total = stats.avgTotal;
  const baseRatio = stats.avgBase && total ? stats.avgBase / total : 0.65;
  const bonusRatio = stats.avgBonus && total ? stats.avgBonus / total : 0.15;
  const stockRatio = Math.max(0, 1 - baseRatio - bonusRatio);
  const split = (label: string, totalValue: number) => {
    const totalK = Math.round(totalValue / 1000);
    const base = Math.round(totalK * baseRatio);
    const bonus = Math.round(totalK * bonusRatio);
    return {
      level: label,
      Base: base,
      Stock: Math.max(0, totalK - base - bonus),
      Bonus: bonus || Math.round(totalK * stockRatio * 0.4),
    };
  };

  const percentileRows = [
    stats.p25 ? split('P25', stats.p25) : null,
    split('P50', stats.p50 || total),
    stats.p75 ? split('P75', stats.p75) : null,
    stats.maxTotal ? split('High', stats.maxTotal) : null,
  ].filter(Boolean) as Array<{ level: string; Base: number; Stock: number; Bonus: number }>;

  if (percentileRows.length >= 3) return percentileRows;
  return [
    split('Entry', total * 0.72),
    split('Mid', total),
    split('Senior', total * 1.35),
    split('Lead', total * 1.75),
  ];
};

const isReactSnapPrerender = () =>
  typeof navigator !== 'undefined' && navigator.userAgent === 'ReactSnap';

export default function SalaryInsights() {
  const isPrerender = isReactSnapPrerender();
  const { showToast } = useToast();
  const [company, setCompany] = useState('Google');
  const [role, setRole] = useState('Software Engineer');
  const [location, setLocation] = useState('San Francisco, CA');
  const [query, setQuery] = useState({ company: 'Google', role: 'Software Engineer', location: 'San Francisco, CA' });
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<SalaryStats | null>(null);
  const [offers, setOffers] = useState<Offer[]>(fallbackOffers);
  const [errorMessage, setErrorMessage] = useState('');
  const [offerTotal, setOfferTotal] = useState('280000');

  const selectedFallback = fallbackLevels[1];
  const effectiveCurrency = stats?.currency || (detectRegion(query.location) === 'CN' ? 'CNY' : 'USD');
  const chartData = useMemo(() => buildSalaryChartData(stats), [stats]);
  const isInitialSalaryLoading = isLoading && !stats;
  const effectiveTotal = stats?.avgTotal || selectedFallback.total * 1000;
  const sampleLabel = isInitialSalaryLoading
    ? '正在同步小程序薪资接口'
    : stats?.count ? `样本数 ${stats.count}` : stats ? '市场估算' : `样本数 ${offers.length}`;
  const offerAmount = Number(offerTotal.replace(/[^0-9.]/g, '')) || 0;
  const offerDelta = !isInitialSalaryLoading && offerAmount ? Math.round(((offerAmount - effectiveTotal) / effectiveTotal) * 100) : 0;
  const offerAdvice = isInitialSalaryLoading
    ? '正在同步小程序薪资接口，完成后自动更新对标结果。'
    : offerDelta >= 10
      ? '高于当前参考区间，可以重点确认股票归属、签证支持和团队成长空间。'
      : offerDelta >= -5
        ? '接近市场参考，可以围绕 Base、签字费和搬家补贴做温和谈判。'
        : '低于当前参考区间，建议准备同类岗位数据和个人匹配点，争取上调。';

  const submitSearch = () => {
    setQuery({
      company: company.trim() || 'Google',
      role: role.trim() || 'Software Engineer',
      location: location.trim() || 'San Francisco, CA',
    });
  };

  const applyPreset = (nextCompany: string, nextRole: string, nextLocation: string) => {
    setCompany(nextCompany);
    setRole(nextRole);
    setLocation(nextLocation);
    setQuery({ company: nextCompany, role: nextRole, location: nextLocation });
  };

  const copySummary = async () => {
    const summary = [
      `${query.company} · ${query.role} · ${query.location}`,
      `Total: ${formatMoney(stats?.avgTotal, selectedFallback.total, effectiveCurrency)}`,
      `Base: ${formatMoney(stats?.avgBase, selectedFallback.base, effectiveCurrency)} / Stock: ${formatMoney(stats?.avgStock, selectedFallback.stock, effectiveCurrency)} / Bonus: ${formatMoney(stats?.avgBonus, selectedFallback.bonus, effectiveCurrency)}`,
      offerAmount ? `我的 Offer: $${offerAmount.toLocaleString()}，相对参考值 ${offerDelta >= 0 ? '+' : ''}${offerDelta}%` : '',
      offerAmount ? `建议：${offerAdvice}` : '',
    ].filter(Boolean).join('\n');
    await navigator.clipboard.writeText(summary);
    showToast('薪资摘要已复制', 'success');
  };

  useEffect(() => {
    let cancelled = false;
    const fetchSalaryData = async () => {
      if (isPrerender) {
        setStats(null);
        setOffers(fallbackOffers);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage('');
      setStats(null);
      setOffers([]);

      try {
        const region = detectRegion(query.location);
        const currency = region === 'CN' ? 'CNY' : 'USD';
        let nextStats: SalaryStats | null = null;
        let nextOffers: Offer[] = [];
        let hasApiData = false;

        try {
          const marketParams = new URLSearchParams({ job_title: query.role, company: query.company, location: query.location, region });
          const marketResponse = await apiFetch(`/api/proxy/salaries/market?${marketParams}`);
          const market = marketResponse.data?.[0] || null;
          const marketStats = market ? normalizeMarketStats(market, currency) : null;
          if (marketStats) {
            nextStats = marketStats;
            hasApiData = true;
          }
        } catch (marketError) {
          console.warn('Salary market fallback:', marketError);
        }

        try {
          const params = new URLSearchParams({ position: query.role, currency });
          const statsResponse = await apiFetch(`/api/proxy/salaries/statistics?${params}`);
          const communityStats = normalizeCommunityStats(statsResponse.data, currency);
          if (communityStats && !statsResponse.useMock) {
            nextStats = nextStats
              ? {
                  ...nextStats,
                  count: communityStats.count || nextStats.count,
                  minTotal: nextStats.minTotal || communityStats.minTotal,
                  maxTotal: nextStats.maxTotal || communityStats.maxTotal,
                  p25: nextStats.p25 || communityStats.p25,
                  p75: nextStats.p75 || communityStats.p75,
                }
              : communityStats;
            hasApiData = true;
          }
        } catch (statsError) {
          console.warn('Salary statistics fallback:', statsError);
        }

        try {
          const listParams = new URLSearchParams({ position: query.role, company: query.company, location: query.location, page: '1', pageSize: '10' });
          let listResponse = await apiFetch(`/api/proxy/salaries?${listParams}`);
          let list = Array.isArray(listResponse.data?.list) ? listResponse.data.list : [];

          if (!list.length && query.location) {
            const broadListParams = new URLSearchParams({ position: query.role, company: query.company, page: '1', pageSize: '10' });
            listResponse = await apiFetch(`/api/proxy/salaries?${broadListParams}`);
            list = Array.isArray(listResponse.data?.list) ? listResponse.data.list : [];
          }

          if (list.length) {
            nextOffers = list.map((item: any) => {
              const itemCurrency = item.currency || currency;
              return {
                company: item.company || query.company,
                role: item.position || query.role,
                level: item.level || 'N/A',
                location: item.location || query.location,
                tc: formatAnnualAmount(item.totalCompensation, itemCurrency),
                yoe: `${item.yearsOfExperience || 0} yrs`,
                date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('zh-CN') : '近期',
                currency: itemCurrency,
              };
            });
            hasApiData = true;
          }
        } catch (listError) {
          console.warn('Salary list fallback:', listError);
        }

        if (cancelled) return;
        if (nextStats) setStats(nextStats);
        setOffers(nextOffers.length ? nextOffers : hasApiData ? [] : fallbackOffers);
        if (!hasApiData) {
          setErrorMessage('薪资接口暂时不可用，当前展示参考样例数据。');
        }
      } catch (error) {
        console.error('Failed to fetch salary data:', error);
        if (!cancelled) {
          setOffers(fallbackOffers);
          setErrorMessage('薪资接口暂时不可用，当前展示参考样例数据。');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchSalaryData();
    return () => {
      cancelled = true;
    };
  }, [query, isPrerender]);

  return (
    <main className="zy-page-shell min-h-screen bg-white pb-16 pt-28">
      <SEO
        title="薪资查询"
        description="查询科技、金融、咨询等行业岗位薪资，查看 Base、Stock、Bonus 和总包参考，帮助留学生判断 offer 和谈薪。"
        keywords="留学生薪资,大厂薪资,levels薪资,科技公司待遇,薪水查询,offer谈判"
        canonical="https://www.zhiyincareer.com/salary-insights"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="bg-gray-900 rounded-3xl p-8 md:p-12 mb-8 text-white shadow-xl">
          <p className="text-sm font-semibold text-primary mb-2">Salary Insights</p>
          <h1 className="zy-page-title mb-4 text-3xl md:text-5xl">薪资查询与 Offer 参考</h1>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl">查看不同公司、岗位和地区的薪资构成，辅助你做 offer 判断和谈薪准备。</p>
          <div className="bg-white rounded-2xl p-2 grid md:grid-cols-[1fr_1fr_1fr_auto] gap-2 shadow-lg">
            <label className="flex items-center bg-gray-50 rounded-xl px-4 py-3">
              <Building2 className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
              <input value={company} onChange={(event) => setCompany(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && submitSearch()} placeholder="公司" className="bg-transparent border-none outline-none w-full text-gray-900" />
            </label>
            <label className="flex items-center bg-gray-50 rounded-xl px-4 py-3">
              <BarChart3 className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
              <input value={role} onChange={(event) => setRole(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && submitSearch()} placeholder="岗位" className="bg-transparent border-none outline-none w-full text-gray-900" />
            </label>
            <label className="flex items-center bg-gray-50 rounded-xl px-4 py-3">
              <MapPin className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
              <input value={location} onChange={(event) => setLocation(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && submitSearch()} placeholder="地区" className="bg-transparent border-none outline-none w-full text-gray-900" />
            </label>
            <button onClick={submitSearch} className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-medium flex items-center justify-center">
              <Search className="w-5 h-5 mr-2" />
              搜索薪资
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              ['Google', 'Software Engineer', 'San Francisco, CA'],
              ['Meta', 'Product Manager', 'New York, NY'],
              ['Amazon', 'Data Scientist', 'Seattle, WA'],
            ].map(([presetCompany, presetRole, presetLocation]) => (
              <button key={`${presetCompany}-${presetRole}`} onClick={() => applyPreset(presetCompany, presetRole, presetLocation)} className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold text-white transition-colors">
                {presetCompany} · {presetRole}
              </button>
            ))}
          </div>
        </section>

        {errorMessage && <div className="mb-6 bg-amber-50 border border-amber-100 text-amber-700 rounded-2xl p-4 text-sm">{errorMessage}</div>}

        <div className="grid lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-deep">{query.company} · {query.role}</h2>
                  <p className="text-gray-500 mt-1 flex items-center"><MapPin className="w-4 h-4 mr-1" />{query.location} · {sampleLabel}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={copySummary} className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium flex items-center w-fit transition-colors">
                    <Copy className="w-4 h-4 mr-1" />
                    复制摘要
                  </button>
                  <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium flex items-center w-fit">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {isLoading ? '更新中' : salarySourceText(stats?.dataSource)}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-1 bg-primary/10 rounded-xl p-5 border border-primary/10">
                  <div className="text-primary font-medium mb-1 flex items-center"><DollarSign className="w-4 h-4 mr-1" />Total</div>
                  <div className="text-4xl font-black text-deep">{isInitialSalaryLoading ? '同步中' : formatMoney(stats?.avgTotal, selectedFallback.total, effectiveCurrency)}</div>
                  <div className="text-sm text-gray-500 mt-1">平均总包</div>
                </div>
                {[
                  ['Base', stats?.avgBase, selectedFallback.base, 'bg-blue-500'],
                  ['Stock', stats?.avgStock, selectedFallback.stock, 'bg-purple-500'],
                  ['Bonus', stats?.avgBonus, selectedFallback.bonus, 'bg-green-500'],
                ].map(([label, value, fallback, color]) => (
                  <div key={label as string} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <div className="text-gray-500 text-sm mb-1">{label as string}</div>
                    <div className="text-2xl font-bold text-deep">{isInitialSalaryLoading ? '--' : formatMoney(value as number, fallback as number, effectiveCurrency)}</div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3">
                      <div className={`${color as string} h-1.5 rounded-full`} style={{ width: `${label === 'Base' ? 60 : label === 'Stock' ? 30 : 12}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              {stats?.marketNote && (
                <p className="mt-5 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700 border border-blue-100">
                  {stats.marketNote}
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-deep flex items-center mb-6"><BarChart3 className="w-5 h-5 mr-2 text-primary" />薪资构成参考</h2>
              {isPrerender ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {chartData.map((item) => (
                    <div key={item.level} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                      <div className="mb-3 flex items-center justify-between text-sm">
                        <span className="font-bold text-gray-900">{item.level}</span>
                        <span className="font-semibold text-primary">{currencySymbol(effectiveCurrency)}{item.Base + item.Stock + item.Bonus}k</span>
                      </div>
                      <div className="flex h-3 overflow-hidden rounded-full bg-gray-200">
                        <div className="bg-blue-500" style={{ width: `${(item.Base / (item.Base + item.Stock + item.Bonus)) * 100}%` }} />
                        <div className="bg-purple-500" style={{ width: `${(item.Stock / (item.Base + item.Stock + item.Bonus)) * 100}%` }} />
                        <div className="bg-green-500" style={{ width: `${(item.Bonus / (item.Base + item.Stock + item.Bonus)) * 100}%` }} />
                      </div>
                      <p className="mt-3 text-xs text-gray-500">
                        Base {currencySymbol(effectiveCurrency)}{item.Base}k · Stock {currencySymbol(effectiveCurrency)}{item.Stock}k · Bonus {currencySymbol(effectiveCurrency)}{item.Bonus}k
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[360px] min-h-[360px] w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="level" />
                      <YAxis tickFormatter={(value) => `${currencySymbol(effectiveCurrency)}${value}k`} />
                      <Tooltip formatter={(value) => `${currencySymbol(effectiveCurrency)}${value}k`} />
                      <Bar dataKey="Base" stackId="a" fill="#3b82f6" />
                      <Bar dataKey="Stock" stackId="a" fill="#a855f7" />
                      <Bar dataKey="Bonus" stackId="a" fill="#22c55e" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-lg">
              <Award className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">贡献你的薪资数据</h3>
              <p className="text-gray-300 text-sm mb-5">匿名分享 offer 信息，帮助更多留学生打破信息差。</p>
              <button onClick={() => showToast('薪资贡献入口正在接入账号系统，当前可先使用下方 Offer 对标。', 'info')} className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold">匿名添加薪资</button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-deep mb-4 flex items-center">
                <Calculator className="w-5 h-5 text-primary mr-2" />
                Offer 对标
              </h3>
              <p className="text-sm text-gray-500 mb-4">输入你的总包，快速判断和当前参考值的差距，辅助谈薪准备。</p>
              <label className="flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                <DollarSign className="w-5 h-5 text-gray-400 mr-2" />
                <input value={offerTotal} onChange={(event) => setOfferTotal(event.target.value)} className="bg-transparent border-none outline-none w-full text-gray-900 font-bold" placeholder="例如 280000" />
              </label>
              <div className={`mt-4 p-4 rounded-xl border ${offerDelta >= 0 ? 'bg-green-50 border-green-100 text-green-800' : 'bg-amber-50 border-amber-100 text-amber-800'}`}>
                <div className="text-xs font-bold uppercase tracking-wider opacity-70">相对参考值</div>
                <div className="text-3xl font-black mt-1">{offerDelta >= 0 ? '+' : ''}{offerDelta}%</div>
                <p className="text-xs leading-relaxed mt-2">{offerAdvice}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-deep mb-4">最新 Offer 爆料</h3>
              <div className="space-y-4">
                {offers.length > 0 ? (
                  offers.map((offer, index) => (
                    <article key={`${offer.company}-${offer.level}-${index}`} className="p-4 rounded-xl border border-gray-100 hover:border-primary/30 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-bold text-deep">{offer.company} · {offer.level}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{offer.role} · {offer.yoe}</div>
                        </div>
                        <div className="font-bold text-green-600">{offer.tc}</div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 text-xs text-gray-500">
                        <span>{offer.location}</span>
                        <span>{offer.date}</span>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-5 text-sm text-gray-500 leading-6">
                    暂无该公司、岗位和地区组合的用户薪资样本。上方薪资区间来自市场薪资接口，后续有用户匿名分享后会自动出现在这里。
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
