import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Bell,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  FileText,
  Globe,
  HelpCircle,
  Search,
  ShieldCheck,
} from 'lucide-react';

import SEO from '../components/SEO';
import { useToast } from '../contexts/ToastContext';
import { apiFetch } from '../lib/api';

type VisaPolicy = {
  id: string;
  country: string;
  title: string;
  type: string;
  audience: string;
  summary: string;
  highlights: string[];
  steps: string[];
  materials: string[];
  timeline: string;
  officialUrl: string;
  tags: string[];
  lastReviewed?: string;
};

const fallbackPolicies: VisaPolicy[] = [
  {
    id: 'us-opt',
    country: '美国',
    title: 'F-1 OPT 工作许可',
    type: '毕业后工作许可',
    audience: '美国 F-1 留学生',
    summary: '适合毕业后在美国从事与专业相关工作的同学，普通 OPT 通常最长 12 个月，STEM 专业可继续申请延期。',
    highlights: ['毕业前 90 天可启动申请', '拿到带 OPT 推荐的 I-20 后再提交 I-765', 'EAD 生效前不能开始工作'],
    steps: ['向学校国际学生办公室提交 OPT 申请', '获取带 DSO 推荐的新版 I-20', '通过 USCIS 在线提交 I-765', '等待 EAD 审批并记录就业状态'],
    materials: ['护照与 F-1 签证页', '最新 I-94', '带 OPT 推荐的 I-20', 'I-765 申请', '证件照与申请费'],
    timeline: '建议在毕业前 90 天开始准备，避免错过毕业后 60 天宽限期。',
    officialUrl: 'https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/students-and-employment/optional-practical-training-opt-for-f-1-students',
    tags: ['OPT', 'F-1', 'EAD'],
  },
  {
    id: 'us-h1b',
    country: '美国',
    title: 'H-1B Specialty Occupation',
    type: '雇主担保工作签证',
    audience: '需要美国雇主 Sponsor 的求职者',
    summary: '适合专业岗位雇佣，通常由雇主发起电子注册、抽签和正式申请。',
    highlights: ['雇主主导申请', '每年注册窗口通常在春季', '中签后提交完整 I-129 申请包'],
    steps: ['确认岗位和雇主 Sponsor 意愿', '雇主完成电子注册', '中签后准备 LCA 与申请材料', 'USCIS 审批后按生效日期入职或转身份'],
    materials: ['Offer 与岗位说明', '学历与成绩材料', 'LCA', 'I-129 申请包', '雇主支持信'],
    timeline: '求职时就应确认 Sponsor 政策，抽签窗口和生效日以 USCIS 当年公告为准。',
    officialUrl: 'https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations',
    tags: ['H-1B', 'Sponsor', 'USCIS'],
  },
];

export default function VisaPolicies() {
  const [policies, setPolicies] = useState<VisaPolicy[]>(fallbackPolicies);
  const [countries, setCountries] = useState<string[]>(['美国']);
  const [activeCountry, setActiveCountry] = useState('美国');
  const [expandedVisaId, setExpandedVisaId] = useState<string | null>('us-opt');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedVisaIds, setSavedVisaIds] = useState<string[]>([]);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState('后端政策接口');
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('careerai_saved_visas');
      if (saved) setSavedVisaIds(JSON.parse(saved));
    } catch (error) {
      console.warn('Visa saved list fallback:', error);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadPolicies = async () => {
      setIsLoading(true);
      try {
        const response = await apiFetch('/api/proxy/content/visa-policies');
        const data = response.data || {};
        const items = Array.isArray(data.items) && data.items.length ? data.items : fallbackPolicies;
        if (cancelled) return;
        setPolicies(items);
        const nextCountries = Array.isArray(data.countries) && data.countries.length
          ? data.countries
          : [...new Set(items.map((item: VisaPolicy) => item.country))];
        setCountries(nextCountries);
        setActiveCountry((current) => nextCountries.includes(current) ? current : nextCountries[0]);
        setExpandedVisaId(items[0]?.id || null);
        setDataSource(data.source === 'curated_official_links' ? '官方链接政策库' : '本地兜底政策');
      } catch (error) {
        console.warn('Visa policy fallback:', error);
        if (!cancelled) {
          setPolicies(fallbackPolicies);
          setCountries(['美国']);
          setDataSource('本地兜底政策');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    loadPolicies();
    return () => {
      cancelled = true;
    };
  }, []);

  const persistSavedVisas = (next: string[]) => {
    setSavedVisaIds(next);
    localStorage.setItem('careerai_saved_visas', JSON.stringify(next));
  };

  const toggleSavedVisa = (visaId: string) => {
    const next = savedVisaIds.includes(visaId)
      ? savedVisaIds.filter((id) => id !== visaId)
      : [...savedVisaIds, visaId];
    persistSavedVisas(next);
    showToast(next.includes(visaId) ? '已加入签证关注清单' : '已从关注清单移除', 'success');
  };

  const copyMaterials = async (visa: VisaPolicy) => {
    const text = [
      visa.title,
      `适用人群：${visa.audience}`,
      `申请要点：${visa.summary}`,
      '',
      '必备材料：',
      ...visa.materials.map((item, index) => `${index + 1}. ${item}`),
      '',
      '申请流程：',
      ...visa.steps.map((step, index) => `${index + 1}. ${step}`),
      '',
      `官方链接：${visa.officialUrl}`,
    ].join('\n');
    await navigator.clipboard.writeText(text);
    showToast('材料清单已复制', 'success');
  };

  const handleSetReminder = () => {
    showToast('签证提醒已设置，后续可接入账号级通知。', 'success');
  };

  const handleTrackStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber) {
      showToast('请输入申请受理号 / Receipt Number', 'error');
      return;
    }
    showToast(`受理号 ${trackingNumber} 已记录。正式查询请以对应移民局官网为准。`, 'info');
  };

  const filteredVisas = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return policies.filter((visa) => {
      const matchesCountry = visa.country === activeCountry;
      const matchesSearch =
        !query ||
        visa.title.toLowerCase().includes(query) ||
        visa.summary.toLowerCase().includes(query) ||
        visa.tags.join(' ').toLowerCase().includes(query);
      return matchesCountry && matchesSearch;
    });
  }, [activeCountry, policies, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 font-sans">
      <SEO
        title="签证政策解读"
        description="整理 OPT、H-1B、Graduate Route、PGWP、485 等留学生求职常见签证政策、申请材料、时间节点和官方资源。"
        keywords="OPT,H1B,留学生签证,工作签证,签证政策,Graduate Route,PGWP"
        canonical="https://www.zhiyincareer.com/visa-policies"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-100 p-3 rounded-xl border border-emerald-200">
              <Globe className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">签证政策解读</h1>
              <p className="text-gray-500 mt-1">从后端政策接口读取常见工作签证清单，并保留官方核验入口。</p>
              <p className="text-xs text-gray-400 mt-1">{policies.length} 条政策 · {dataSource}</p>
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索签证类型或关键词..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none bg-white shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-6">
            <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex overflow-x-auto scrollbar-hide space-x-2">
              {countries.map((country) => (
                <button
                  key={country}
                  onClick={() => {
                    setActiveCountry(country);
                    const first = policies.find((item) => item.country === country);
                    setExpandedVisaId(first?.id || null);
                  }}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeCountry === country
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {country}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 text-gray-500">正在同步签证政策内容...</div>
            ) : filteredVisas.length > 0 ? (
              <div className="space-y-4">
                {filteredVisas.map((visa) => (
                  <div key={visa.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:border-emerald-200">
                    <div
                      className="p-6 cursor-pointer flex justify-between items-center bg-white"
                      onClick={() => setExpandedVisaId(expandedVisaId === visa.id ? null : visa.id)}
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                          <h2 className="text-xl font-bold text-gray-900">{visa.title}</h2>
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded text-xs font-semibold">{visa.type}</span>
                          {savedVisaIds.includes(visa.id) && (
                            <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded text-xs font-semibold">已关注</span>
                          )}
                        </div>
                        <p className="text-gray-500 text-sm line-clamp-1">{visa.summary}</p>
                      </div>
                      <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-300 flex-shrink-0 ${expandedVisaId === visa.id ? 'rotate-180' : ''}`} />
                    </div>

                    {expandedVisaId === visa.id && (
                      <div className="px-6 pb-6 pt-2 border-t border-gray-50 bg-gray-50/50">
                        <div className="mb-6 mt-4">
                          <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                            <h3 className="text-sm font-bold text-gray-900 flex items-center">
                              <ShieldCheck className="w-5 h-5 mr-2 text-emerald-600" /> 适用人群
                            </h3>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => toggleSavedVisa(visa.id)}
                                className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                  savedVisaIds.includes(visa.id)
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-200 hover:text-blue-700'
                                }`}
                              >
                                <Bookmark className="mr-1.5 h-3.5 w-3.5" fill={savedVisaIds.includes(visa.id) ? 'currentColor' : 'none'} />
                                {savedVisaIds.includes(visa.id) ? '已关注' : '关注政策'}
                              </button>
                              <button
                                type="button"
                                onClick={() => copyMaterials(visa)}
                                className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-emerald-200 hover:text-emerald-700"
                              >
                                <Copy className="mr-1.5 h-3.5 w-3.5" />
                                复制清单
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed bg-white p-4 rounded-xl border border-gray-100">
                            {visa.audience}。{visa.summary}
                          </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                          <div>
                            <h3 className="text-sm font-bold text-gray-900 flex items-center mb-3">
                              <FileText className="w-5 h-5 mr-2 text-emerald-600" /> 必备材料
                            </h3>
                            <ul className="space-y-2">
                              {visa.materials.map((item) => (
                                <li key={item} className="flex items-start text-sm text-gray-600">
                                  <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500 flex-shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h3 className="text-sm font-bold text-gray-900 flex items-center mb-3">
                              <Clock className="w-5 h-5 mr-2 text-emerald-600" /> 申请流程
                            </h3>
                            <div className="space-y-4">
                              {visa.steps.map((step, idx) => (
                                <div key={step} className="flex flex-col relative before:absolute before:left-[11px] before:top-6 before:w-px before:h-full before:bg-gray-200 last:before:hidden">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold border border-emerald-200 z-10">
                                      {idx + 1}
                                    </div>
                                    <h4 className="font-semibold text-gray-900 text-sm">{step}</h4>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-gray-900 flex items-center mb-3">
                            <HelpCircle className="w-5 h-5 mr-2 text-emerald-600" /> 时间节点与官方入口
                          </h3>
                          <div className="space-y-3">
                            <div className="bg-white p-4 rounded-xl border border-gray-100 text-sm text-gray-600">{visa.timeline}</div>
                            <a href={visa.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                              查看官方页面
                              <ExternalLink className="ml-1.5 h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                <Globe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">该地区签证政策完善中</h3>
                <p className="text-gray-500">我们将继续补充该地区的最新政策解读和官方入口。</p>
              </div>
            )}
          </div>

          <div className="lg:w-1/3 space-y-6">
            <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full pointer-events-none" />
              <div className="flex items-center space-x-2 mb-2">
                <Search className="w-5 h-5 text-emerald-400" />
                <h3 className="text-xl font-bold">签证状态记录</h3>
              </div>
              <p className="text-sm text-gray-400 mb-6">记录 USCIS、UKVI、IRCC 等官方受理号，正式状态请以官方系统为准。</p>
              <form onSubmit={handleTrackStatus}>
                <input
                  type="text"
                  placeholder="Receipt Number / Application Number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors mb-3"
                />
                <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                  记录并提醒
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-16 h-16 bg-blue-50 rounded-bl-full flex items-start justify-end p-3">
                <Bell className="w-5 h-5 text-blue-400 group-hover:animate-bounce" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">设置签证提醒</h3>
              <p className="text-sm text-gray-500 mb-5 max-w-[85%]">
                关注政策后可按清单准备材料，后续可以继续接入账号级截止日期提醒。
              </p>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700 flex items-center"><AlertCircle className="w-4 h-4 mr-1 text-orange-400" /> H-1B 注册窗口</span>
                  <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded">以 USCIS 公告为准</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700 flex items-center"><AlertCircle className="w-4 h-4 mr-1 text-red-400" /> OPT 申请窗口</span>
                  <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded">毕业前后重点关注</span>
                </div>
              </div>
              {savedVisaIds.length > 0 && (
                <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800">
                  已关注 {savedVisaIds.length} 个签证政策，可按清单安排材料和截止日期。
                </div>
              )}

              <button onClick={handleSetReminder} className="w-full text-blue-600 bg-blue-50 hover:bg-blue-100 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center">
                <Bell className="w-4 h-4 mr-2" /> 订阅官方节点提醒
              </button>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
              <h3 className="text-sm font-bold text-emerald-900 mb-4 uppercase tracking-wider">官方资源链接</h3>
              <ul className="space-y-3">
                {filteredVisas.slice(0, 5).map((visa) => (
                  <li key={visa.id}>
                    <a href={visa.officialUrl} target="_blank" rel="noopener noreferrer" className="flex justify-between items-center text-sm text-gray-700 hover:text-emerald-700 group transition-colors">
                      <span className="inline-flex items-center"><ExternalLink className="mr-2 h-4 w-4 text-emerald-400" />{visa.title}</span>
                      <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
