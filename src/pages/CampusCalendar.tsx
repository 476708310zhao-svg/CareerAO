import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Calendar as CalendarIcon,
  MapPin,
  Building2,
  Clock,
  Bell,
  Filter,
  Search,
  ExternalLink,
  Briefcase,
  ChevronDown,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { apiFetch } from '../lib/api';

// ── 筛选常量 ──────────────────────────────────────────────────────────────────
const REGION_LIST     = ['全部', '中国内地', '北美', '英国', '澳洲/新加坡'];
const TYPE_LIST       = ['全部', '秋招', '春招', '暑期实习'];
const INDUSTRY_LIST   = ['全部', '互联网', '金融', '国央企', '事业单位', '新能源', '通信/硬件', '咨询', '生物医药', '快消零售', '教育', '其他'];
const WRITTEN_LIST    = ['全部', '含免笔试', '需要笔试'];

// 招聘类型颜色
const TYPE_COLORS: Record<string, string> = {
  '秋招':   'bg-orange-50 text-orange-700 border-orange-200',
  '春招':   'bg-indigo-50 text-indigo-700 border-indigo-200',
  '暑期实习': 'bg-green-50 text-green-700 border-green-200',
};

// 行业颜色（前几个）
const INDUSTRY_COLORS: Record<string, string> = {
  '互联网':   'bg-blue-50 text-blue-700',
  '金融':     'bg-amber-50 text-amber-700',
  '国央企':   'bg-red-50 text-red-700',
  '新能源':   'bg-emerald-50 text-emerald-700',
  '通信/硬件': 'bg-purple-50 text-purple-700',
  '咨询':     'bg-pink-50 text-pink-700',
};

interface CampusItem {
  id: number;
  company: string;
  industry: string;
  recruitType: string;
  locations: string[];
  positionName: string;
  startDate: string;
  deadlineDate: string;
  writtenTest: string;
  applyUrl: string;
  announceUrl: string;
  gradYear: number;
  region: string;
  notes: string;
  isHot: boolean;
  isVerified: boolean;
}

function FilterChip({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all whitespace-nowrap ${
        active
          ? 'bg-gray-900 text-white border-gray-900'
          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
      }`}
    >
      {label}
    </button>
  );
}

function CampusCard({ item }: { item: CampusItem }) {
  const typeClass = TYPE_COLORS[item.recruitType] || 'bg-gray-50 text-gray-700 border-gray-200';
  const industryClass = INDUSTRY_COLORS[item.industry] || 'bg-gray-50 text-gray-700';
  const locations = Array.isArray(item.locations) ? item.locations : [];
  const hasUrl = item.applyUrl || item.announceUrl;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold border ${typeClass}`}>
            {item.recruitType}
          </span>
          {item.industry && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${industryClass}`}>
              {item.industry}
            </span>
          )}
          {item.writtenTest === '免笔试' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-sky-50 text-sky-700">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              免笔试
            </span>
          )}
          {item.isHot && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-red-50 text-red-600">
              🔥 热门
            </span>
          )}
        </div>
        {item.gradYear && (
          <span className="text-xs text-gray-400 shrink-0">{item.gradYear}届</span>
        )}
      </div>

      {/* Company */}
      <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
        <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
        {item.company}
      </h3>

      {/* Position */}
      {item.positionName && (
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">{item.positionName}</p>
      )}

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
        {locations.length > 0 && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {locations.slice(0, 3).join(' / ')}
            {locations.length > 3 && ` +${locations.length - 3}`}
          </span>
        )}
        {item.deadlineDate && (
          <span className="flex items-center gap-1 text-orange-600 font-medium">
            <Clock className="w-3.5 h-3.5" />
            截止 {item.deadlineDate}
          </span>
        )}
        {item.startDate && !item.deadlineDate && (
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {item.startDate}
          </span>
        )}
      </div>

      {/* Notes preview */}
      {item.notes && (
        <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2 mb-4 line-clamp-2">
          {item.notes}
        </p>
      )}

      {/* Actions */}
      {hasUrl && (
        <div className="flex items-center gap-2 mt-auto">
          {item.announceUrl && (
            <a
              href={item.announceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              查看公告
            </a>
          )}
          {item.applyUrl && (
            <a
              href={item.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center bg-white border border-gray-200 hover:border-gray-400 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              立即投递
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function CampusCalendar() {
  const [region,      setRegion]      = useState('中国内地');
  const [recruitType, setRecruitType] = useState('全部');
  const [industry,    setIndustry]    = useState('全部');
  const [writtenTest, setWrittenTest] = useState('全部');
  const [keyword,     setKeyword]     = useState('');
  const [inputKw,     setInputKw]     = useState('');
  const [showFilter,  setShowFilter]  = useState(false);

  const [list,     setList]     = useState<CampusItem[]>([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(0);
  const [hasMore,  setHasMore]  = useState(true);
  const [loading,  setLoading]  = useState(false);
  const [initDone, setInitDone] = useState(false);

  const PAGE_SIZE = 20;
  const loadingRef = useRef(false);

  const buildParams = useCallback((p: number) => {
    const params: Record<string, string> = {
      page: String(p),
      pageSize: String(PAGE_SIZE),
    };
    if (region      !== '全部') params.region      = region;
    if (recruitType !== '全部') params.recruit_type = recruitType;
    if (industry    !== '全部') params.industry     = industry;
    if (writtenTest !== '全部') params.written_test = writtenTest === '含免笔试' ? '免笔试' : writtenTest;
    if (keyword)                params.keyword      = keyword;
    return new URLSearchParams(params).toString();
  }, [region, recruitType, industry, writtenTest, keyword]);

  const loadData = useCallback(async (reset: boolean) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    const targetPage = reset ? 0 : page;
    try {
      const qs = buildParams(targetPage);
      const res = await apiFetch(`/api/proxy/campus?${qs}`);

      if (res?.useMock || res?.code !== 0) {
        // backend not reachable or error
        setList([]);
        setTotal(0);
        setHasMore(false);
      } else {
        // 服务器返回格式: { code: 0, data: [...], total: N }
        const rawList = Array.isArray(res.data) ? res.data
          : Array.isArray(res.data?.list) ? res.data.list : [];
        const totalCount = typeof res.total === 'number' ? res.total
          : typeof res.data?.total === 'number' ? res.data.total : 0;

        const items: CampusItem[] = rawList.map((item: any) => ({
          ...item,
          locations: Array.isArray(item.locations) ? item.locations
            : (() => { try { return JSON.parse(item.locations || '[]'); } catch { return []; } })(),
        }));
        setList(prev => reset ? items : [...prev, ...items]);
        setTotal(totalCount);
        setPage(targetPage + 1);
        setHasMore(items.length === PAGE_SIZE);
      }
    } catch (e) {
      console.error('campus fetch error:', e);
    } finally {
      setLoading(false);
      setInitDone(true);
      loadingRef.current = false;
    }
  }, [buildParams, page]);

  // 筛选条件变化时重置
  useEffect(() => {
    setPage(0);
    setList([]);
    setHasMore(true);
    loadData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region, recruitType, industry, writtenTest, keyword]);

  const handleSearch = () => setKeyword(inputKw.trim());

  // 统计数字（近似展示）
  const totalDisplay = total >= 1000 ? `${(total / 1000).toFixed(1)}k+` : String(total);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Hero ── */}
        <div className="bg-deep rounded-3xl p-8 md:p-12 mb-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-orange-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/10">
                <CalendarIcon className="w-4 h-4 text-orange-400" />
                <span>实时同步飞书校招日历 · 8000+ 条招聘信息</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                校招日历 Campus Calendar
              </h1>
              <p className="text-gray-300 text-lg mb-6">
                国内外秋招/春招/暑期实习一站汇总，覆盖互联网、金融、国央企、新能源等热门行业，网申链接直达。
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
                  <div className="text-2xl font-bold">{totalDisplay}</div>
                  <div className="text-xs text-gray-300">招聘条目</div>
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
                  <div className="text-2xl font-bold">10+</div>
                  <div className="text-xs text-gray-300">覆盖行业</div>
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
                  <div className="text-2xl font-bold">每日</div>
                  <div className="text-xs text-gray-300">同步更新</div>
                </div>
              </div>
            </div>

            {/* Quick stats card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shrink-0 w-full md:w-60 space-y-3">
              <div className="text-gray-300 text-sm font-medium mb-2">招聘类型分布</div>
              {[
                { label: '秋招', color: 'bg-orange-400', pct: 52 },
                { label: '春招', color: 'bg-indigo-400', pct: 41 },
                { label: '暑期实习', color: 'bg-green-400', pct: 7 },
              ].map(({ label, color, pct }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                  <span className="text-white text-sm flex-1">{label}</span>
                  <span className="text-gray-300 text-sm">{pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Filters + Search ── */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 space-y-4">
          {/* Search row */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={inputKw}
                onChange={e => setInputKw(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="搜索公司、岗位、行业..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400"
              />
              {inputKw && (
                <button onClick={() => { setInputKw(''); setKeyword(''); }} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-black transition-colors"
            >
              搜索
            </button>
            <button
              onClick={() => setShowFilter(v => !v)}
              className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors flex items-center gap-2 ${
                showFilter ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
              }`}
            >
              <Filter className="w-4 h-4" />
              筛选
            </button>
          </div>

          {/* Filter chips — 地区 always shown */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-400 self-center mr-1">地区</span>
            {REGION_LIST.map(r => (
              <FilterChip key={r} label={r} active={region === r} onClick={() => setRegion(r)} />
            ))}
          </div>

          {/* Expandable filters */}
          {showFilter && (
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-400 self-center mr-1 w-10">类型</span>
                {TYPE_LIST.map(t => (
                  <FilterChip key={t} label={t} active={recruitType === t} onClick={() => setRecruitType(t)} />
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-400 self-center mr-1 w-10">行业</span>
                {INDUSTRY_LIST.map(i => (
                  <FilterChip key={i} label={i} active={industry === i} onClick={() => setIndustry(i)} />
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-400 self-center mr-1 w-10">笔试</span>
                {WRITTEN_LIST.map(w => (
                  <FilterChip key={w} label={w} active={writtenTest === w} onClick={() => setWrittenTest(w)} />
                ))}
              </div>
            </div>
          )}

          {/* Active filters summary */}
          {(recruitType !== '全部' || industry !== '全部' || writtenTest !== '全部' || keyword) && (
            <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-gray-100">
              <span className="text-xs text-gray-500">已筛选：</span>
              {recruitType !== '全部' && <span className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full">{recruitType}</span>}
              {industry    !== '全部' && <span className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full">{industry}</span>}
              {writtenTest !== '全部' && <span className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full">{writtenTest}</span>}
              {keyword     &&           <span className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full">"{keyword}"</span>}
              <button
                onClick={() => { setRecruitType('全部'); setIndustry('全部'); setWrittenTest('全部'); setKeyword(''); setInputKw(''); }}
                className="text-xs text-red-500 hover:text-red-700 ml-1"
              >
                清除全部
              </button>
            </div>
          )}
        </div>

        {/* ── Result count ── */}
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-sm text-gray-500">
            {initDone ? `共找到 ${total.toLocaleString()} 条校招信息` : '加载中...'}
          </span>
          <button
            onClick={() => { setPage(0); setList([]); setHasMore(true); loadData(true); }}
            className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            刷新
          </button>
        </div>

        {/* ── Card Grid ── */}
        {!initDone && (
          <div className="flex items-center justify-center py-24 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mr-3" />
            <span>正在加载校招数据...</span>
          </div>
        )}

        {initDone && list.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <AlertCircle className="w-12 h-12 mb-4 opacity-40" />
            <p className="text-lg font-medium">暂无匹配的校招信息</p>
            <p className="text-sm mt-2">尝试调整筛选条件或搜索关键词</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map(item => (
            <CampusCard key={item.id} item={item} />
          ))}
        </div>

        {/* ── Load More ── */}
        {initDone && hasMore && list.length > 0 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => loadData(false)}
              disabled={loading}
              className="px-8 py-3 bg-white border border-gray-200 hover:border-gray-400 text-gray-700 rounded-2xl font-medium transition-all flex items-center gap-2 shadow-sm hover:shadow"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> 加载中...</>
              ) : (
                <><ChevronDown className="w-4 h-4" /> 加载更多</>
              )}
            </button>
          </div>
        )}

        {initDone && !hasMore && list.length > 0 && (
          <p className="text-center text-sm text-gray-400 mt-8">已显示全部 {total.toLocaleString()} 条结果</p>
        )}

        {/* ── Bottom Info ── */}
        <div className="mt-12 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
          <div className="flex items-center mb-3">
            <Briefcase className="w-5 h-5 text-orange-500 mr-2" />
            <h3 className="font-bold text-orange-900">校招节奏参考</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {[
              { title: '暑期实习', time: '3月 - 6月', tip: '互联网、金融大厂 5-6 月截止，尽早投递' },
              { title: '秋招提前批', time: '6月 - 8月', tip: '大厂提前批 7-8 月开放，性价比极高' },
              { title: '秋招正式批', time: '9月 - 11月', tip: '国央企、事业单位集中在 10-11 月' },
            ].map(({ title, time, tip }) => (
              <div key={title} className="bg-white/70 rounded-xl p-4">
                <div className="font-bold text-orange-900 mb-1">{title}</div>
                <div className="text-orange-700 font-medium text-xs mb-1">{time}</div>
                <div className="text-orange-800/70 text-xs">{tip}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
