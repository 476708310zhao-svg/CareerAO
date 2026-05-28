import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Briefcase, Building2, ChevronRight, DollarSign, Home, Navigation, TrendingUp, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

import SEO from '../components/SEO';
import { apiFetch } from '../lib/api';

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

const cityCoords: Record<string, { lat: number; lng: number }> = {
  'Mountain View, CA': { lat: 37.3861, lng: -122.0839 },
  'San Francisco, CA': { lat: 37.7749, lng: -122.4194 },
  'San Jose, CA': { lat: 37.3382, lng: -121.8863 },
  'Seattle, WA': { lat: 47.6062, lng: -122.3321 },
  'New York, NY': { lat: 40.7128, lng: -74.006 },
  'Austin, TX': { lat: 30.2672, lng: -97.7431 },
  'Boston, MA': { lat: 42.3601, lng: -71.0589 },
  'Chicago, IL': { lat: 41.8781, lng: -87.6298 },
  'Los Angeles, CA': { lat: 34.0522, lng: -118.2437 },
  'Washington, DC': { lat: 38.9072, lng: -77.0369 },
  'Atlanta, GA': { lat: 33.749, lng: -84.388 },
  'Dallas, TX': { lat: 32.7767, lng: -96.797 },
  'Denver, CO': { lat: 39.7392, lng: -104.9903 },
  'Raleigh, NC': { lat: 35.7796, lng: -78.6382 },
  'San Diego, CA': { lat: 32.7157, lng: -117.1611 },
  'Miami, FL': { lat: 25.7617, lng: -80.1918 },
  'Portland, OR': { lat: 45.5152, lng: -122.6784 },
  Remote: { lat: 39.8283, lng: -98.5795 },
};

type MapJob = {
  id: string | number;
  title: string;
  company: string;
  salary: string;
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
    lat: 37.7749,
    lng: -122.4194,
    count: 12,
    topCompanies: ['Google', 'Meta', 'Salesforce'],
    salaryRange: '$140k - $210k',
    costOfLiving: 194,
    trend: '+4.0%',
    jobs: [
      { id: 1, title: 'Software Engineer', company: 'Google', salary: '$140k - $210k' },
      { id: 2, title: 'Product Manager', company: 'Salesforce', salary: '$130k - $190k' },
    ],
  },
  {
    id: 'fallback-seattle',
    city: 'Seattle, WA',
    lat: 47.6062,
    lng: -122.3321,
    count: 9,
    topCompanies: ['Amazon', 'Microsoft'],
    salaryRange: '$130k - $190k',
    costOfLiving: 152,
    trend: '+6.0%',
    jobs: [{ id: 3, title: 'Backend Engineer', company: 'Amazon', salary: '$130k - $190k' }],
  },
];

const normalizeLocation = (job: any) => {
  const raw = job.location || job.job_city || job.region || job.job_country || 'Remote';
  const value = String(raw).trim();
  if (!value || /remote/i.test(value)) return 'Remote';
  const matched = Object.keys(cityCoords).find((city) => value.includes(city) || city.includes(value));
  return matched || value;
};

const formatSalary = (job: any) => {
  const min = job.minSalary || job.job_min_salary;
  const max = job.maxSalary || job.job_max_salary;
  if (min && max) return `$${Math.round(min / 1000)}k - $${Math.round(max / 1000)}k`;
  return '薪资待披露';
};

const buildMapPoints = (jobs: any[]): CityPoint[] => {
  const grouped = new Map<string, any[]>();
  jobs.forEach((job) => {
    const city = normalizeLocation(job);
    if (!cityCoords[city]) return;
    grouped.set(city, [...(grouped.get(city) || []), job]);
  });

  return Array.from(grouped.entries()).map(([city, cityJobs]) => {
    const coords = cityCoords[city];
    const companies = Array.from(new Set(cityJobs.map((job) => job.company || job.employer_name).filter(Boolean))).slice(0, 4);
    return {
      id: city,
      city,
      lat: coords.lat,
      lng: coords.lng,
      count: cityJobs.length,
      topCompanies: companies.length ? companies : ['多家公司'],
      salaryRange: cityJobs.map(formatSalary).find((salary) => salary !== '薪资待披露') || '薪资待披露',
      costOfLiving: city.includes('San Francisco') || city.includes('New York') ? 185 : city.includes('Seattle') ? 152 : 120,
      trend: '+5.0%',
      jobs: cityJobs.slice(0, 6).map((job) => ({
        id: job.id || job.job_id,
        title: job.title || job.job_title || '职位',
        company: job.company || job.employer_name || '公司',
        salary: formatSalary(job),
      })),
    };
  });
};

export default function JobMap() {
  const [mapData, setMapData] = useState<CityPoint[]>(fallbackPoints);
  const [selectedCity, setSelectedCity] = useState<CityPoint | null>(null);
  const [hoveredCity, setHoveredCity] = useState<CityPoint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await apiFetch('/api/proxy/jobs?page=1&pageSize=100');
        const jobs = response.data?.list || [];
        const points = buildMapPoints(jobs);
        if (!cancelled && points.length) setMapData(points);
      } catch (error) {
        console.warn('Job map fallback:', error);
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
  const topCities = useMemo(() => [...mapData].sort((a, b) => b.count - a.count).slice(0, 5), [mapData]);
  const topCompanies = useMemo(
    () => Array.from(new Set(mapData.flatMap((point) => point.topCompanies))).slice(0, 8),
    [mapData],
  );

  return (
    <main className="min-h-screen pt-24 pb-12 bg-gray-50 flex flex-col relative">
      <SEO
        title="求职地图"
        description="用地图查看热门城市职位分布、招聘公司和薪资参考。"
        canonical="https://www.zhiyincareer.com/job-map"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col">
        <section className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-deep mb-2">求职地图</h1>
            <p className="text-gray-500">基于后端职位数据聚合城市分布，发现热门求职城市和岗位机会。</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
            <div className="text-xs text-gray-500">当前聚合职位</div>
            <div className="text-2xl font-black text-primary">{isLoading ? '...' : totalJobs}</div>
          </div>
        </section>

        <section className="grid flex-1 gap-6 pb-16 lg:grid-cols-[1fr_320px]">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 relative min-h-[600px] overflow-hidden flex items-center justify-center">
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
                  const radius = Math.max(7, Math.min(24, point.count * 2.2));
                  return (
                    <Marker
                      key={point.id}
                      coordinates={[point.lng, point.lat]}
                      onClick={() => setSelectedCity(point)}
                      onMouseEnter={() => setHoveredCity(point)}
                      onMouseLeave={() => setHoveredCity(null)}
                      className="cursor-pointer"
                    >
                      <circle r={radius} fill={isSelected ? '#2563eb' : isHovered ? '#3b82f6' : '#60a5fa'} opacity={0.82} stroke="#ffffff" strokeWidth={2} />
                    </Marker>
                  );
                })}
              </ComposableMap>

              {hoveredCity && !selectedCity && (
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-md border border-gray-100 pointer-events-none z-10">
                  <p className="font-bold text-gray-900 text-sm">{hoveredCity.city}</p>
                  <p className="text-xs text-primary font-medium mt-1">{hoveredCity.count} 个职位</p>
                </div>
              )}
            </div>
          </div>
          <aside className="space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-base font-bold text-gray-900">热门城市排行</h2>
              <p className="mt-1 text-sm text-gray-500">点击城市可以直接查看岗位分布和精选职位。</p>
              <div className="mt-4 space-y-3">
                {topCities.map((point, index) => (
                  <button
                    key={point.id}
                    type="button"
                    onClick={() => setSelectedCity(point)}
                    className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-left hover:border-primary/30 hover:bg-white"
                  >
                    <span>
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
              <p className="mt-2 text-sm leading-6 text-gray-300">先锁定岗位密度高的城市，再结合薪资、生活成本和签证支持情况筛选投递优先级。</p>
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
              <button onClick={() => setSelectedCity(null)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
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
                          <div className="text-xs text-amber-700 flex items-center mb-1"><Home className="w-3.5 h-3.5 mr-1" />生活成本指数</div>
                          <div className="font-bold text-amber-800">{selectedCity.costOfLiving}</div>
                        </div>
                        <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100 col-span-2">
                          <div className="text-xs text-indigo-700 flex items-center justify-between">
                            <span className="flex items-center"><TrendingUp className="w-3.5 h-3.5 mr-1" />就业趋势</span>
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
                          <button key={job.id} onClick={() => navigate(`/jobs/${job.id}`)} className="w-full text-left bg-white border border-gray-200 rounded-xl p-4 hover:border-primary transition-colors hover:shadow-md group flex justify-between items-center">
                            <div>
                              <h4 className="font-bold text-base text-gray-900 group-hover:text-primary transition-colors mb-1">{job.title}</h4>
                              <div className="flex items-center text-sm text-gray-500"><Building2 className="w-3.5 h-3.5 mr-1.5" />{job.company}</div>
                            </div>
                            <div className="flex flex-col items-end">
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
