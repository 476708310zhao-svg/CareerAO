import React, { useState, useEffect } from 'react';
import { MapPin, Briefcase, Building2, ChevronRight, Navigation, TrendingUp, DollarSign, Home, ArrowRight, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { motion, AnimatePresence } from 'motion/react';

// US map topojson
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Mock data for map visualization
const MOCK_MAP_DATA = [
  { id: 1, city: 'Mountain View, CA', lat: 37.3861, lng: -122.0839, count: 120, topCompanies: ['Google', 'LinkedIn', 'Intuit'], salaryRange: '$140k - $220k', costOfLiving: 185, trend: '+5.2%' },
  { id: 2, city: 'San Francisco, CA', lat: 37.7749, lng: -122.4194, count: 350, topCompanies: ['Salesforce', 'Uber', 'Airbnb'], salaryRange: '$150k - $210k', costOfLiving: 194, trend: '+3.1%' },
  { id: 3, city: 'Seattle, WA', lat: 47.6062, lng: -122.3321, count: 280, topCompanies: ['Amazon', 'Microsoft', 'Expedia'], salaryRange: '$130k - $190k', costOfLiving: 152, trend: '+8.4%' },
  { id: 4, city: 'New York, NY', lat: 40.7128, lng: -74.0060, count: 410, topCompanies: ['Bloomberg', 'Goldman Sachs', 'Meta'], salaryRange: '$140k - $200k', costOfLiving: 180, trend: '+4.5%' },
  { id: 5, city: 'Austin, TX', lat: 30.2672, lng: -97.7431, count: 150, topCompanies: ['Tesla', 'Dell', 'Oracle'], salaryRange: '$110k - $160k', costOfLiving: 119, trend: '+12.5%' },
  { id: 6, city: 'Boston, MA', lat: 42.3601, lng: -71.0589, count: 180, topCompanies: ['Wayfair', 'HubSpot', 'TripAdvisor'], salaryRange: '$120k - $180k', costOfLiving: 148, trend: '+6.0%' },
  { id: 7, city: 'Chicago, IL', lat: 41.8781, lng: -87.6298, count: 140, topCompanies: ['Grubhub', 'Boeing', 'Motorola'], salaryRange: '$100k - $150k', costOfLiving: 120, trend: '+2.8%' },
  { id: 8, city: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437, count: 210, topCompanies: ['Snap', 'Hulu', 'Riot Games'], salaryRange: '$120k - $170k', costOfLiving: 148, trend: '+4.0%' },
  { id: 9, city: 'San Jose, CA', lat: 37.3382, lng: -121.8863, count: 310, topCompanies: ['Cisco', 'PayPal', 'Adobe'], salaryRange: '$145k - $210k', costOfLiving: 180, trend: '+4.8%' },
  { id: 10, city: 'Washington, DC', lat: 38.9072, lng: -77.0369, count: 260, topCompanies: ['Capital One', 'Fannie Mae', 'AWS'], salaryRange: '$110k - $160k', costOfLiving: 160, trend: '+3.5%' },
  { id: 11, city: 'Atlanta, GA', lat: 33.7490, lng: -84.3880, count: 190, topCompanies: ['Home Depot', 'Delta', 'NCR'], salaryRange: '$95k - $145k', costOfLiving: 105, trend: '+7.2%' },
  { id: 12, city: 'Dallas, TX', lat: 32.7767, lng: -96.7970, count: 220, topCompanies: ['AT&T', 'TI', 'Match Group'], salaryRange: '$100k - $150k', costOfLiving: 108, trend: '+6.1%' },
  { id: 13, city: 'Denver, CO', lat: 39.7392, lng: -104.9903, count: 160, topCompanies: ['Palantir', 'Zoom', 'Slack'], salaryRange: '$115k - $165k', costOfLiving: 128, trend: '+8.0%' },
  { id: 14, city: 'Raleigh, NC', lat: 35.7796, lng: -78.6382, count: 140, topCompanies: ['IBM', 'Red Hat', 'Epic Games'], salaryRange: '$105k - $155k', costOfLiving: 102, trend: '+9.5%' },
  { id: 15, city: 'San Diego, CA', lat: 32.7157, lng: -117.1611, count: 170, topCompanies: ['Qualcomm', 'ServiceNow', 'Illumina'], salaryRange: '$120k - $180k', costOfLiving: 150, trend: '+4.2%' },
  { id: 16, city: 'Miami, FL', lat: 25.7617, lng: -80.1918, count: 130, topCompanies: ['Chewy', 'Kaseya', 'Magic Leap'], salaryRange: '$95k - $140k', costOfLiving: 125, trend: '+11.2%' },
  { id: 17, city: 'Salt Lake City, UT', lat: 40.7608, lng: -111.8910, count: 110, topCompanies: ['Qualtrics', 'Pluralsight', 'Adobe'], salaryRange: '$100k - $145k', costOfLiving: 115, trend: '+10.0%' },
  { id: 18, city: 'Portland, OR', lat: 45.5152, lng: -122.6784, count: 125, topCompanies: ['Intel', 'Nike', 'AWS'], salaryRange: '$110k - $160k', costOfLiving: 135, trend: '+2.5%' },
  { id: 19, city: 'Phoenix, AZ', lat: 33.4484, lng: -112.0740, count: 145, topCompanies: ['Intel', 'Carvana', 'GoDaddy'], salaryRange: '$100k - $145k', costOfLiving: 110, trend: '+8.8%' },
  { id: 20, city: 'Philadelphia, PA', lat: 39.9526, lng: -75.1652, count: 135, topCompanies: ['Comcast', 'Vanguard', 'EPAM'], salaryRange: '$95k - $140k', costOfLiving: 112, trend: '+1.5%' },
];

const MOCK_CITY_JOBS: Record<number, any[]> = {
  1: [
    { id: 1, title: 'Software Engineer, New Grad 2026', company: 'Google', salary: '$130k - $180k' },
    { id: 2, title: 'Data Scientist', company: 'LinkedIn', salary: '$150k - $200k' }
  ],
  2: [
    { id: 3, title: 'Frontend Developer', company: 'Uber', salary: '$140k - $190k' },
    { id: 4, title: 'Product Manager', company: 'Salesforce', salary: '$160k - $210k' }
  ],
  3: [
    { id: 4, title: 'Backend Engineer', company: 'Amazon', salary: '$150k - $190k' },
    { id: 5, title: 'Cloud Architect', company: 'Microsoft', salary: '$160k - $220k' }
  ]
};

// Fallback jobs for other cities
const FALLBACK_JOBS = [
  { id: 6, title: 'Software Development Engineer', company: 'Tech Corp', salary: '$120k - $160k' },
  { id: 7, title: 'Data Analyst', company: 'Global Systems', salary: '$90k - $130k' }
];

export default function JobMap() {
  const [mapData, setMapData] = useState(MOCK_MAP_DATA);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [hoveredCity, setHoveredCity] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, fetch aggregated job data by location
    // apiFetch('/api/proxy/jobs/map-distribution').then(...)
  }, []);

  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (selectedCity) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [selectedCity]);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex flex-col relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-deep mb-2">求职地图</h1>
          <p className="text-gray-500">地理位置可视化职位分布，发现热门求职城市</p>
        </div>

        <div className="flex flex-col flex-1 pb-16">
          {/* Map Visualization Area - Full Width */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 relative min-h-[600px] overflow-hidden flex items-center justify-center">
            
            <div className="w-full h-full max-w-5xl relative">
              <ComposableMap projection="geoAlbersUsa" className="w-full h-full">
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map(geo => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#f3f4f6"
                        stroke="#e5e7eb"
                        strokeWidth={1}
                        style={{
                          default: { outline: "none" },
                          hover: { fill: "#e5e7eb", outline: "none" },
                          pressed: { outline: "none" },
                        }}
                      />
                    ))
                  }
                </Geographies>
                
                {mapData.map((point) => {
                  const isSelected = selectedCity?.id === point.id;
                  const isHovered = hoveredCity?.id === point.id;
                  
                  // Base radius on count, min 6, max 24
                  const radius = Math.max(6, Math.min(24, point.count / 15));

                  return (
                    <Marker 
                      key={point.id} 
                      coordinates={[point.lng, point.lat]}
                      onClick={() => setSelectedCity(point)}
                      onMouseEnter={() => setHoveredCity(point)}
                      onMouseLeave={() => setHoveredCity(null)}
                      className="cursor-pointer"
                    >
                      <circle 
                        r={radius} 
                        fill={isSelected ? "#2563eb" : (isHovered ? "#3b82f6" : "#60a5fa")} 
                        opacity={0.8}
                        stroke="#ffffff"
                        strokeWidth={2}
                        className="transition-all duration-300"
                      />
                      {(isSelected || isHovered) && (
                        <circle 
                          r={radius + 6} 
                          fill="transparent" 
                          stroke={isSelected ? "#2563eb" : "#93c5fd"} 
                          strokeWidth={2}
                          strokeDasharray="4 4"
                          className="animate-[spin_4s_linear_infinite]"
                        />
                      )}
                    </Marker>
                  );
                })}
              </ComposableMap>

              {/* Tooltip for hovering */}
              {hoveredCity && !selectedCity && (
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md border border-gray-100 pointer-events-none z-10 transition-all">
                  <p className="font-bold text-gray-900 text-sm">{hoveredCity.city}</p>
                  <p className="text-xs text-primary font-medium mt-1">{hoveredCity.count} 个职位</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Modal logic using AnimatePresence */}
      <AnimatePresence>
        {selectedCity && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCity(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />
            
            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-3xl shadow-[0_-20px_60px_rgba(0,0,0,0.15)] flex flex-col max-h-[85vh] md:max-h-[75vh]"
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              {/* Drag Handle Area */}
              <div 
                className="w-full flex items-center justify-center pt-4 pb-2 cursor-pointer"
                onClick={() => setSelectedCity(null)}
              >
                <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setSelectedCity(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="px-6 pb-6 pt-2 flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-4xl mx-auto w-full">
                  <div className="flex flex-col md:flex-row md:items-start gap-8">
                    
                    {/* Left side: Stats & Info */}
                    <div className="md:w-1/3 shrink-0 space-y-6">
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
                        <div className="bg-green-50 rounded-xl p-3 border border-green-100 flex flex-col justify-center">
                          <div className="text-xs text-green-700 flex items-center mb-1">
                            <DollarSign className="w-3.5 h-3.5 mr-1" />
                            薪资中位数
                          </div>
                          <div className="font-bold text-green-800">{selectedCity.salaryRange.split(' - ')[0]}</div>
                        </div>
                        <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 flex flex-col justify-center">
                          <div className="text-xs text-amber-700 flex items-center mb-1">
                            <Home className="w-3.5 h-3.5 mr-1" />
                            生活成本指数
                          </div>
                          <div className="font-bold text-amber-800">{selectedCity.costOfLiving} <span className="text-[10px] font-normal text-amber-600 ml-1">/100</span></div>
                        </div>
                        <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100 flex flex-col justify-center col-span-2">
                          <div className="text-xs text-indigo-700 flex items-center justify-between">
                            <div className="flex items-center">
                              <TrendingUp className="w-3.5 h-3.5 mr-1" />
                              就业趋势 (YoY)
                            </div>
                            <span className="font-bold text-indigo-800">{selectedCity.trend}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                          <Building2 className="w-4 h-4 mr-2 text-gray-400" /> 热门招聘公司
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedCity.topCompanies.map((company: string) => (
                            <span key={company} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 shadow-sm">
                              {company}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => navigate(`/jobs?region=${encodeURIComponent(selectedCity.city.split(',')[0])}`)}
                        className="w-full flex items-center justify-center px-6 py-3.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-sm shadow-primary/20"
                      >
                        查看该地区所有职位 <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>

                    {/* Right side: Job List */}
                    <div className="md:w-2/3 flex-1 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                       <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                         <Briefcase className="w-5 h-5 mr-2 text-gray-400" /> 最新精选岗位
                       </h3>
                       <div className="space-y-4">
                         {(MOCK_CITY_JOBS[selectedCity.id] || FALLBACK_JOBS).map((job) => (
                           <div 
                             key={job.id} 
                             onClick={() => navigate(`/jobs/${job.id}`)}
                             className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-primary transition-colors hover:shadow-md group flex justify-between items-center"
                           >
                             <div>
                               <h4 className="font-bold text-base text-gray-900 group-hover:text-primary transition-colors mb-1">
                                 {job.title}
                               </h4>
                               <div className="flex items-center text-sm text-gray-500">
                                 <Building2 className="w-3.5 h-3.5 mr-1.5" />
                                 {job.company}
                               </div>
                             </div>
                             <div className="flex flex-col items-end">
                               <span className="text-green-600 font-bold mb-1">{job.salary}</span>
                               <span className="text-[11px] font-medium text-gray-400 flex items-center">
                                 点击查看 <ArrowRight className="w-3 h-3 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                               </span>
                             </div>
                           </div>
                         ))}
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
