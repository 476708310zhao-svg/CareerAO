import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Briefcase,
  Building2,
  ChevronRight,
  DollarSign,
  Home,
  MapPin,
  Navigation,
  TrendingUp,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

import SEO from '../components/SEO';
import { apiFetch } from '../lib/api';

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

const cityCoords: Record<string, { lat: number; lng: number; cost: number }> = {
  'San Francisco, CA': { lat: 37.7749, lng: -122.4194, cost: 185 },
  'San Jose, CA': { lat: 37.3382, lng: -121.8863, cost: 170 },
  'Mountain View, CA': { lat: 37.3861, lng: -122.0839, cost: 178 },
  'Sunnyvale, CA': { lat: 37.3688, lng: -122.0363, cost: 176 },
  'Santa Clara, CA': { lat: 37.3541, lng: -121.9552, cost: 168 },
  'Cupertino, CA': { lat: 37.323, lng: -122.0322, cost: 174 },
  'Palo Alto, CA': { lat: 37.4419, lng: -122.143, cost: 186 },
  'Menlo Park, CA': { lat: 37.453, lng: -122.1817, cost: 180 },
  'San Mateo, CA': { lat: 37.563, lng: -122.3255, cost: 166 },
  'Los Gatos, CA': { lat: 37.2358, lng: -121.9624, cost: 171 },
  'Los Angeles, CA': { lat: 34.0522, lng: -118.2437, cost: 150 },
  'San Diego, CA': { lat: 32.7157, lng: -117.1611, cost: 143 },
  'Seattle, WA': { lat: 47.6062, lng: -122.3321, cost: 152 },
  'Redmond, WA': { lat: 47.674, lng: -122.1215, cost: 148 },
  'Portland, OR': { lat: 45.5152, lng: -122.6784, cost: 130 },
  'New York, NY': { lat: 40.7128, lng: -74.006, cost: 185 },
  'Boston, MA': { lat: 42.3601, lng: -71.0589, cost: 158 },
  'Cambridge, MA': { lat: 42.3736, lng: -71.1097, cost: 160 },
  'Washington, DC': { lat: 38.9072, lng: -77.0369, cost: 148 },
  'Chicago, IL': { lat: 41.8781, lng: -87.6298, cost: 120 },
  'Austin, TX': { lat: 30.2672, lng: -97.7431, cost: 126 },
  'Dallas, TX': { lat: 32.7767, lng: -96.797, cost: 116 },
  'Houston, TX': { lat: 29.7604, lng: -95.3698, cost: 112 },
  'Atlanta, GA': { lat: 33.749, lng: -84.388, cost: 118 },
  'Miami, FL': { lat: 25.7617, lng: -80.1918, cost: 136 },
  'Raleigh, NC': { lat: 35.7796, lng: -78.6382, cost: 112 },
  'Charlotte, NC': { lat: 35.2271, lng: -80.8431, cost: 112 },
  'Denver, CO': { lat: 39.7392, lng: -104.9903, cost: 132 },
  'Phoenix, AZ': { lat: 33.4484, lng: -112.074, cost: 116 },
  'Philadelphia, PA': { lat: 39.9526, lng: -75.1652, cost: 122 },
  'Pittsburgh, PA': { lat: 40.4406, lng: -79.9959, cost: 104 },
  'Minneapolis, MN': { lat: 44.9778, lng: -93.265, cost: 110 },
  'Salt Lake City, UT': { lat: 40.7608, lng: -111.891, cost: 118 },
  Remote: { lat: 39.8283, lng: -98.5795, cost: 100 },
};

const cityAliases: Array<[string, string]> = [
  ['san francisco', 'San Francisco, CA'],
  ['sf bay', 'San Francisco, CA'],
  ['bay area', 'San Francisco, CA'],
  ['san jose', 'San Jose, CA'],
  ['mountain view', 'Mountain View, CA'],
  ['sunnyvale', 'Sunnyvale, CA'],
  ['santa clara', 'Santa Clara, CA'],
  ['cupertino', 'Cupertino, CA'],
  ['palo alto', 'Palo Alto, CA'],
  ['menlo park', 'Menlo Park, CA'],
  ['san mateo', 'San Mateo, CA'],
  ['los gatos', 'Los Gatos, CA'],
  ['los angeles', 'Los Angeles, CA'],
  ['san diego', 'San Diego, CA'],
  ['seattle', 'Seattle, WA'],
  ['redmond', 'Redmond, WA'],
  ['portland', 'Portland, OR'],
  ['new york', 'New York, NY'],
  ['nyc', 'New York, NY'],
  ['boston', 'Boston, MA'],
  ['cambridge', 'Cambridge, MA'],
  ['washington', 'Washington, DC'],
  ['district of columbia', 'Washington, DC'],
  ['chicago', 'Chicago, IL'],
  ['austin', 'Austin, TX'],
  ['dallas', 'Dallas, TX'],
  ['houston', 'Houston, TX'],
  ['atlanta', 'Atlanta, GA'],
  ['miami', 'Miami, FL'],
  ['raleigh', 'Raleigh, NC'],
  ['charlotte', 'Charlotte, NC'],
  ['denver', 'Denver, CO'],
  ['phoenix', 'Phoenix, AZ'],
  ['philadelphia', 'Philadelphia, PA'],
  ['pittsburgh', 'Pittsburgh, PA'],
  ['minneapolis', 'Minneapolis, MN'],
  ['salt lake', 'Salt Lake City, UT'],
  ['remote', 'Remote'],
];

type MapJob = {
  id: string | number;
  title: string;
  company: string;
  salary: string;
  sourceLabel?: string;
};

type CityPoint = {
  id: string;
  city: string;
  lat: number;
  lng: number;
  count: number;
  topCompanies: string[];
  salaryRange: string;
  costOfLiving: number;
  trend: string;
  jobs: MapJob[];
};

const fallbackPoints: CityPoint[] = [
  {
    id: 'fallback-sf',
    city: 'San Francisco, CA',
    lat: cityCoords['San Francisco, CA'].lat,
    lng: cityCoords['San Francisco, CA'].lng,
    count: 12,
    topCompanies: ['Google', 'Meta', 'Salesforce'],
    salaryRange: '$140k - $210k',
    costOfLiving: cityCoords['San Francisco, CA'].cost,
    trend: '+4.0%',
    jobs: [
      { id: 1, title: 'Software Engineer', company: 'Google', salary: '$140k - $210k' },
      { id: 2, title: 'Product Manager', company: 'Salesforce', salary: '$130k - $190k' },
    ],
  },
  {
    id: 'fallback-seattle',
    city: 'Seattle, WA',
    lat: cityCoords['Seattle, WA'].lat,
    lng: cityCoords['Seattle, WA'].lng,
    count: 9,
    topCompanies: ['Amazon', 'Microsoft'],
    salaryRange: '$130k - $190k',
    costOfLiving: cityCoords['Seattle, WA'].cost,
    trend: '+6.0%',
    jobs: [{ id: 3, title: 'Backend Engineer', company: 'Amazon', salary: '$130k - $190k' }],
  },
];

const normalizeLocation = (job: any) => {
  const raw = job.location || job.job_city || job.region || job.job_country || '';
  const value = String(raw).trim().toLowerCase();
  if (!value) return '';
  const alias = cityAliases.find(([pattern]) => value.includes(pattern));
  return alias?.[1] || '';
};

const formatSalary = (job: any) => {
  if (job.salary) return job.salary;
  const min = job.minSalary || job.job_min_salary;
  const max = job.maxSalary || job.job_max_salary;
  const currency = job.job_salary_currency || '$';
  if (min && max) return `${currency}${Math.round(min / 1000)}k - ${currency}${Math.round(max / 1000)}k`;
  if (min || max) return `${currency}${Math.round((min || max) / 1000)}k+`;
  return '薪资待披露';
};

const buildMapPoints = (jobs: any[]): CityPoint[] => {
  const grouped = new Map<string, any[]>();
  jobs.forEach((job) => {
    const city = normalizeLocation(job);
    if (!city || !cityCoords[city]) return;
    grouped.set(city, [...(grouped.get(city) || []), job]);
  });

  return Array.from(grouped.entries())
    .map(([city, cityJobs]) => {
      const coords = cityCoords[city];
      const companies = Array.from(new Set(cityJobs.map((job) => job.company || job.employer_name).filter(Boolean))).slice(0, 5);
      return {
        id: city,
        city,
        lat: coords.lat,
        lng: coords.lng,
        count: cityJobs.length,
        topCompanies: companies.length ? companies : ['多家公司'],
        salaryRange: cityJobs.map(formatSalary).find((salary) => salary !== '薪资待披露') || '薪资待披露',
        costOfLiving: coords.cost,
        trend: cityJobs.length >= 10 ? '+8.0%' : cityJobs.length >= 5 ? '+5.0%' : '+2.0%',
        jobs: cityJobs.slice(0, 8).map((job) => ({
          id: job.id || job.job_id,
          title: job.title || job.job_title || '职位',
          company: job.company || job.employer_name || '公司待确认',
          salary: formatSalary(job),
          sourceLabel: job.sourceLabel,
        })),
      };
    })
    .sort((a, b) => b.count - a.count);
};

export default function JobMap() {
  const [mapData, setMapData] = useState<CityPoint[]>(fallbackPoints);
  const [selectedCity, setSelectedCity] = useState<CityPoint | null>(null);
  const [hoveredCity, setHoveredCity] = useState<CityPoint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState('数据加载中');
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await apiFetch('/api/proxy/jobs/map?pageSize=180');
        const jobs = response.data?.list || [];
        const points = buildMapPoints(jobs);
        if (!cancelled && points.length) {
          setMapData(points);
          setDataSource(response.data?.source === 'live' ? '实时职位源' : '实时职位源 + 历史补充');
        }
      } catch (error) {
        console.warn('Job map fallback:', error);
        if (!cancelled) setDataSource('历史职位库兜底');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchJobs();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedCity ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedCity]);

  const totalJobs = useMemo(() => mapData.reduce((sum, point) => sum + point.count, 0), [mapData]);
  const topCities = useMemo(() => [...mapData].sort((a, b) => b.count - a.count).slice(0, 7), [mapData]);
  const topCompanies = useMemo(
    () => Array.from(new Set(mapData.flatMap((point) => point.topCompanies))).slice(0, 10),
    [mapData],
  );

  return (
    <main className="min-h-screen pt-24 pb-12 bg-gray-50 flex flex-col relative">
      <SEO
        title="求职地图"
        description="用地图查看热门城市职位分布、招聘公司、职位来源和薪资参考，帮助留学生规划投递城市。"
        canonical="https://www.zhiyincareer.com/job-map"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col">
        <section className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-deep mb-2">求职地图</h1>
            <p className="text-gray-500">聚合真实职位源，按城市查看岗位密度、热门公司和投递入口。</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
              <div className="text-xs text-gray-500">当前聚合职位</div>
              <div className="text-2xl font-black text-primary">{isLoading ? '...' : totalJobs}</div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
              <div className="text-xs text-gray-500">覆盖城市</div>
              <div className="text-2xl font-black text-primary">{isLoading ? '...' : mapData.length}</div>
            </div>
          </div>
        </section>

        <section className="grid flex-1 gap-6 pb-16 lg:grid-cols-[1fr_360px]">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 relative min-h-[620px] overflow-hidden flex items-center justify-center">
            <div className="absolute left-5 top-5 z-10 rounded-xl border border-gray-100 bg-white/95 px-4 py-3 shadow-sm">
              <div className="text-xs text-gray-500">数据来源</div>
              <div className="text-sm font-bold text-gray-900">{isLoading ? '同步中...' : dataSource}</div>
            </div>
            <div className="w-full h-full max-w-5xl relative">
              <ComposableMap projection="geoAlbersUsa" className="w-full h-full">
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#f3f4f6"
                        stroke="#e5e7eb"
                        strokeWidth={1}
                        style={{ default: { outline: 'none' }, hover: { fill: '#e5e7eb', outline: 'none' }, pressed: { outline: 'none' } }}
                      />
                    ))
                  }
                </Geographies>
                {mapData.map((point) => {
                  const isSelected = selectedCity?.id === point.id;
                  const isHovered = hoveredCity?.id === point.id;
                  const radius = Math.max(7, Math.min(26, 6 + Math.sqrt(point.count) * 4));
                  return (
                    <Marker
                      key={point.id}
                      coordinates={[point.lng, point.lat]}
                      onClick={() => setSelectedCity(point)}
                      onMouseEnter={() => setHoveredCity(point)}
                      onMouseLeave={() => setHoveredCity(null)}
                      className="cursor-pointer"
                    >
                      <circle r={radius} fill={isSelected ? '#2563eb' : isHovered ? '#3b82f6' : '#60a5fa'} opacity={0.84} stroke="#ffffff" strokeWidth={2} />
                      {point.count >= 8 && (
                        <text textAnchor="middle" y={4} className="pointer-events-none fill-white text-[10px] font-black">
                          {point.count}
                        </text>
                      )}
                    </Marker>
                  );
                })}
              </ComposableMap>

              {hoveredCity && !selectedCity && (
                <div className="absolute top-20 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-md border border-gray-100 pointer-events-none z-10">
                  <p className="font-bold text-gray-900 text-sm">{hoveredCity.city}</p>
                  <p className="text-xs text-primary font-medium mt-1">{hoveredCity.count} 个职位</p>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-base font-bold text-gray-900">热门城市排行</h2>
              <p className="mt-1 text-sm text-gray-500">点击城市可以查看岗位分布、热门公司和精选职位。</p>
              <div className="mt-4 space-y-3">
                {topCities.map((point, index) => (
                  <button
                    key={point.id}
                    type="button"
                    onClick={() => setSelectedCity(point)}
                    className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-left hover:border-primary/30 hover:bg-white"
                  >
                    <span className="min-w-0">
                      <span className="mr-2 text-xs font-black text-primary">#{index + 1}</span>
                      <span className="font-semibold text-gray-900">{point.city}</span>
                    </span>
                    <span className="text-sm font-bold text-gray-500">{point.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-base font-bold text-gray-900">聚合公司</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {topCompanies.map((company) => (
                  <button
                    key={company}
                    type="button"
                    onClick={() => navigate(`/jobs?keyword=${encodeURIComponent(company)}`)}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 hover:border-primary/30 hover:text-primary"
                  >
                    {company}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-gray-900 p-5 text-white shadow-sm">
              <h2 className="text-base font-bold">城市策略建议</h2>
              <p className="mt-2 text-sm leading-6 text-gray-300">先锁定岗位密度高的城市，再结合薪资、生活成本和签证友好度安排投递优先级。</p>
              <button onClick={() => navigate('/career-planning')} className="mt-4 flex w-full items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-blue-50">
                生成求职规划 <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </aside>
        </section>
      </div>

      <AnimatePresence>
        {selectedCity && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCity(null)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-3xl shadow-[0_-20px_60px_rgba(0,0,0,0.15)] flex flex-col max-h-[85vh] md:max-h-[75vh]"
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              <div className="w-full flex items-center justify-center pt-4 pb-2 cursor-pointer" onClick={() => setSelectedCity(null)}>
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>
              <button onClick={() => setSelectedCity(null)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors" aria-label="关闭城市详情">
                <X className="w-5 h-5" />
              </button>
              <div className="px-6 pb-6 pt-2 flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto w-full">
                  <div className="flex flex-col md:flex-row md:items-start gap-8">
                    <aside className="md:w-1/3 shrink-0 space-y-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                          <Navigation className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">{selectedCity.city}</h2>
                          <p className="text-sm text-primary font-medium mt-0.5">{selectedCity.count} 个开放职位</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                          <div className="text-xs text-green-700 flex items-center mb-1"><DollarSign className="w-3.5 h-3.5 mr-1" />薪资参考</div>
                          <div className="font-bold text-green-800">{selectedCity.salaryRange}</div>
                        </div>
                        <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                          <div className="text-xs text-amber-700 flex items-center mb-1"><Home className="w-3.5 h-3.5 mr-1" />生活成本</div>
                          <div className="font-bold text-amber-800">{selectedCity.costOfLiving}</div>
                        </div>
                        <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100 col-span-2">
                          <div className="text-xs text-indigo-700 flex items-center justify-between">
                            <span className="flex items-center"><TrendingUp className="w-3.5 h-3.5 mr-1" />岗位热度</span>
                            <span className="font-bold text-indigo-800">{selectedCity.trend}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center"><Building2 className="w-4 h-4 mr-2 text-gray-400" />热门招聘公司</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedCity.topCompanies.map((company) => (
                            <span key={company} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 shadow-sm">{company}</span>
                          ))}
                        </div>
                      </div>

                      <button onClick={() => navigate(`/jobs?keyword=${encodeURIComponent(selectedCity.city.split(',')[0])}`)} className="w-full flex items-center justify-center px-6 py-3.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-sm shadow-primary/20">
                        查看该地区职位 <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </aside>

                    <section className="md:w-2/3 flex-1 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center"><Briefcase className="w-5 h-5 mr-2 text-gray-400" />最新精选岗位</h3>
                      <div className="space-y-4">
                        {selectedCity.jobs.map((job) => (
                          <button key={String(job.id)} onClick={() => navigate(`/jobs/${encodeURIComponent(String(job.id))}`)} className="w-full text-left bg-white border border-gray-200 rounded-xl p-4 hover:border-primary transition-colors hover:shadow-md group flex justify-between items-center gap-4">
                            <div className="min-w-0">
                              <h4 className="font-bold text-base text-gray-900 group-hover:text-primary transition-colors mb-1 line-clamp-2">{job.title}</h4>
                              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                                <span className="inline-flex items-center"><Building2 className="w-3.5 h-3.5 mr-1.5" />{job.company}</span>
                                {job.sourceLabel && <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">{job.sourceLabel}</span>}
                              </div>
                            </div>
                            <div className="flex shrink-0 flex-col items-end">
                              <span className="text-green-600 font-bold mb-1">{job.salary}</span>
                              <span className="text-[11px] font-medium text-gray-400 flex items-center">查看 <ArrowRight className="w-3 h-3 ml-0.5 group-hover:translate-x-0.5 transition-transform" /></span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
