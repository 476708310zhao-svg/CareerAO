import React, { useState, useEffect } from 'react';
import { MapPin, Briefcase, Building2, ChevronRight, Navigation } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { motion } from 'motion/react';

// US map topojson
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Mock data for map visualization
const MOCK_MAP_DATA = [
  { id: 1, city: 'Mountain View, CA', lat: 37.3861, lng: -122.0839, count: 120, topCompanies: ['Google', 'LinkedIn', 'Intuit'] },
  { id: 2, city: 'San Francisco, CA', lat: 37.7749, lng: -122.4194, count: 350, topCompanies: ['Salesforce', 'Uber', 'Airbnb'] },
  { id: 3, city: 'Seattle, WA', lat: 47.6062, lng: -122.3321, count: 280, topCompanies: ['Amazon', 'Microsoft', 'Expedia'] },
  { id: 4, city: 'New York, NY', lat: 40.7128, lng: -74.0060, count: 410, topCompanies: ['Bloomberg', 'Goldman Sachs', 'Meta'] },
  { id: 5, city: 'Austin, TX', lat: 30.2672, lng: -97.7431, count: 150, topCompanies: ['Tesla', 'Dell', 'Oracle'] },
  { id: 6, city: 'Boston, MA', lat: 42.3601, lng: -71.0589, count: 180, topCompanies: ['Wayfair', 'HubSpot', 'TripAdvisor'] },
  { id: 7, city: 'Chicago, IL', lat: 41.8781, lng: -87.6298, count: 140, topCompanies: ['Grubhub', 'Boeing', 'Motorola'] },
  { id: 8, city: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437, count: 210, topCompanies: ['Snap', 'Hulu', 'Riot Games'] },
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

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-deep mb-2">求职地图</h1>
          <p className="text-gray-500">地理位置可视化职位分布，发现热门求职城市</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 flex-1">
          {/* Map Visualization Area */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 relative min-h-[500px] overflow-hidden flex items-center justify-center">
            
            <div className="w-full h-full max-w-4xl relative">
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
                      style={{ cursor: "pointer" }}
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
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md border border-gray-100 pointer-events-none">
                  <p className="font-bold text-gray-900 text-sm">{hoveredCity.city}</p>
                  <p className="text-xs text-primary font-medium mt-1">{hoveredCity.count} 个职位</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Details */}
          <div className="w-full lg:w-1/3 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-full flex flex-col">
              {selectedCity ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={selectedCity.id}
                  className="flex-1 flex flex-col"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <Navigation className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedCity.city}</h2>
                      <p className="text-sm text-primary font-medium mt-0.5">{selectedCity.count} 个开放职位</p>
                    </div>
                  </div>

                  <div className="space-y-6 flex-1">
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
                    
                    <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                      <h3 className="text-sm font-bold text-blue-900 mb-2 flex items-center">
                        <Briefcase className="w-4 h-4 mr-2 text-blue-500" /> 地区洞察
                      </h3>
                      <p className="text-sm text-blue-800 leading-relaxed">
                        {selectedCity.city.includes('CA') ? '科技大厂云集，薪资水平全美最高，但生活成本也相对较高。适合追求技术挑战和高薪的求职者。' : 
                         selectedCity.city.includes('WA') ? '云服务和电商巨头总部所在地，无需缴纳州个人所得税，性价比极高。' :
                         selectedCity.city.includes('NY') ? '金融科技（FinTech）和媒体公司的天堂，生活节奏快，机会多元。' :
                         '新兴科技中心，生活成本适中，近年来吸引了大量科技公司入驻或设立分部。'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-gray-100">
                    <button 
                      onClick={() => navigate(`/jobs?region=${encodeURIComponent(selectedCity.city.split(',')[0])}`)}
                      className="w-full flex items-center justify-center px-6 py-3.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-sm shadow-primary/20"
                    >
                      查看该地区所有职位 <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                    <button 
                      onClick={() => setSelectedCity(null)}
                      className="w-full mt-3 flex items-center justify-center px-6 py-2 text-gray-500 hover:text-gray-700 text-sm transition-colors"
                    >
                      取消选择
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center py-12">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">探索求职版图</h3>
                  <p className="text-sm max-w-[200px]">点击地图上的城市节点<br/>查看该地区的职位分布与洞察</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
