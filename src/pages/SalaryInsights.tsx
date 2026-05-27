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
  count?: number;
};

type Offer = {
  company: string;
  role: string;
  level: string;
  location: string;
  tc: string;
  yoe: string;
  date: string;
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

const formatMoney = (value?: number, fallback?: number) => {
  const source = value || fallback || 0;
  return `$${Math.round(source / (source > 1000 ? 1000 : 1))}k`;
};

export default function SalaryInsights() {
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
  const chartData = useMemo(
    () => fallbackLevels.map((item) => ({ level: item.level, Base: item.base, Stock: item.stock, Bonus: item.bonus })),
    [],
  );
  const effectiveTotal = stats?.avgTotal || selectedFallback.total * 1000;
  const offerAmount = Number(offerTotal.replace(/[^0-9.]/g, '')) || 0;
  const offerDelta = offerAmount ? Math.round(((offerAmount - effectiveTotal) / effectiveTotal) * 100) : 0;
  const offerAdvice = offerDelta >= 10
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
      `Total: ${formatMoney(stats?.avgTotal, selectedFallback.total)}`,
      `Base: ${formatMoney(stats?.avgBase, selectedFallback.base)} / Stock: ${formatMoney(stats?.avgStock, selectedFallback.stock)} / Bonus: ${formatMoney(stats?.avgBonus, selectedFallback.bonus)}`,
      offerAmount ? `我的 Offer: $${offerAmount.toLocaleString()}，相对参考值 ${offerDelta >= 0 ? '+' : ''}${offerDelta}%` : '',
      offerAmount ? `建议：${offerAdvice}` : '',
    ].filter(Boolean).join('\n');
    await navigator.clipboard.writeText(summary);
    showToast('薪资摘要已复制', 'success');
  };

  useEffect(() => {
    let cancelled = false;
    const fetchSalaryData = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        let market: any = null;
        try {
          const marketParams = new URLSearchParams({ job_title: query.role, company: query.company, location: query.location, region: 'NA' });
          const marketResponse = await apiFetch(`/api/proxy/salaries/market?${marketParams}`);
          market = marketResponse.data?.[0] || null;
        } catch (marketError) {
          console.warn('Salary market fallback:', marketError);
        }
        if (!cancelled && market) {
          setStats({
            avgTotal: market.median_salary,
            avgBase: Math.round((market.median_salary || 0) * ((market.breakdown?.base_pct || 65) / 100)),
            avgStock: Math.round((market.median_salary || 0) * ((market.breakdown?.equity_pct || 20) / 100)),
            avgBonus: Math.round((market.median_salary || 0) * ((market.breakdown?.bonus_pct || 15) / 100)),
            count: market.sample_size || undefined,
          });
        }

        const params = new URLSearchParams({ position: query.role, company: query.company, region: query.location });
        const statsResponse = await apiFetch(`/api/proxy/salaries/statistics?${params}`);
        if (!cancelled && !market && statsResponse.data && !statsResponse.useMock) {
          setStats(statsResponse.data);
        }

        const listParams = new URLSearchParams({ position: query.role, company: query.company, region: query.location, page: '1', pageSize: '10' });
        const listResponse = await apiFetch(`/api/proxy/salaries?${listParams}`);
        if (!cancelled && listResponse.data?.list?.length) {
          setOffers(
            listResponse.data.list.map((item: any) => ({
              company: item.company || query.company,
              role: item.position || query.role,
              level: item.level || 'N/A',
              location: item.location || query.location,
              tc: `$${Number(item.totalCompensation || 0).toLocaleString()}`,
              yoe: `${item.yearsOfExperience || 0} yrs`,
              date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '近期',
            })),
          );
        }
      } catch (error) {
        console.error('Failed to fetch salary data:', error);
        if (!cancelled) setErrorMessage('薪资接口暂时不可用，当前展示参考样例数据。');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchSalaryData();
    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <main className="pt-24 pb-16 min-h-screen bg-gray-50">
      <SEO
        title="薪资查询"
        description="查询科技、金融、咨询等行业岗位薪资，查看 Base、Stock、Bonus 和总包参考，帮助留学生判断 offer 和谈薪。"
        keywords="留学生薪资,大厂薪资,levels薪资,科技公司待遇,薪水查询,offer谈判"
        canonical="https://www.zhiyincareer.com/salary-insights"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="bg-gray-900 rounded-3xl p-8 md:p-12 mb-8 text-white shadow-xl">
          <p className="text-sm font-semibold text-primary mb-2">Salary Insights</p>
          <h1 className="text-3xl md:text-5xl font-black mb-4">薪资查询与 Offer 参考</h1>
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
                  <p className="text-gray-500 mt-1 flex items-center"><MapPin className="w-4 h-4 mr-1" />{query.location} · 样本数 {stats?.count || offers.length}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={copySummary} className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium flex items-center w-fit transition-colors">
                    <Copy className="w-4 h-4 mr-1" />
                    复制摘要
                  </button>
                  <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium flex items-center w-fit">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {isLoading ? '更新中' : '数据已同步'}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-1 bg-primary/10 rounded-xl p-5 border border-primary/10">
                  <div className="text-primary font-medium mb-1 flex items-center"><DollarSign className="w-4 h-4 mr-1" />Total</div>
                  <div className="text-4xl font-black text-deep">{formatMoney(stats?.avgTotal, selectedFallback.total)}</div>
                  <div className="text-sm text-gray-500 mt-1">平均总包</div>
                </div>
                {[
                  ['Base', stats?.avgBase, selectedFallback.base, 'bg-blue-500'],
                  ['Stock', stats?.avgStock, selectedFallback.stock, 'bg-purple-500'],
                  ['Bonus', stats?.avgBonus, selectedFallback.bonus, 'bg-green-500'],
                ].map(([label, value, fallback, color]) => (
                  <div key={label as string} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <div className="text-gray-500 text-sm mb-1">{label as string}</div>
                    <div className="text-2xl font-bold text-deep">{formatMoney(value as number, fallback as number)}</div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3">
                      <div className={`${color as string} h-1.5 rounded-full`} style={{ width: `${label === 'Base' ? 60 : label === 'Stock' ? 30 : 12}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-deep flex items-center mb-6"><BarChart3 className="w-5 h-5 mr-2 text-primary" />职级薪资构成参考</h2>
              <div className="h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="level" />
                    <YAxis tickFormatter={(value) => `$${value}k`} />
                    <Tooltip formatter={(value) => `$${value}k`} />
                    <Bar dataKey="Base" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="Stock" stackId="a" fill="#a855f7" />
                    <Bar dataKey="Bonus" stackId="a" fill="#22c55e" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
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
                {offers.map((offer, index) => (
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
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
