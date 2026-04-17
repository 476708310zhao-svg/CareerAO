import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Star, 
  ShieldCheck, 
  ShieldAlert, 
  Filter, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Building
} from 'lucide-react';
import { apiFetch } from '../lib/api';

export default function AgencyEvaluation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  
  const [isLoading, setIsLoading] = useState(false);
  const [agencies, setAgencies] = useState<any[]>([]);

  const filters = ['All', 'CS/Tech', 'Finance/IB', 'Consulting', 'Data Science'];

  useEffect(() => {
    const fetchAgencies = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          keyword: searchQuery,
          type: activeFilter === 'All' ? '' : activeFilter,
          page: '1',
          pageSize: '10'
        }).toString();
        const response = await apiFetch(`/api/proxy/agencies?${params}`);
        
        if (!response.useMock && response.data && response.data.list) {
          const mappedAgencies = response.data.list.map((item: any) => ({
            id: item.id,
            name: item.name,
            rating: item.ratingAvg || 0,
            reviews: item.reviewCount || 0,
            tags: [item.type, ...(item.specialties || [])],
            priceRange: '$$$', // API doesn't return exact format, mock for now
            verified: item.isVerified,
            aiSummary: {
              pros: ['服务专业', '导师负责'], // Mock AI summary as API doesn't provide it
              cons: ['价格较高']
            },
            recentReview: item.description || '暂无评价'
          }));
          setAgencies(mappedAgencies);
        } else {
          // Fallback to mock data
          setAgencies([
            { id: 1, name: 'TechCareer Pro', rating: 4.8, reviews: 156, tags: ['CS/Tech', 'Data Science'], priceRange: '$$$', verified: true, aiSummary: { pros: ['导师背景真实 (多为大厂 L5+)', '内推资源丰富', '算法辅导体系完善'], cons: ['价格偏高', '部分热门导师预约困难'] }, recentReview: '报名了 VIP 项目，匹配的 Google 导师非常负责，Mock Interview 帮我指出了很多沟通上的问题，最后成功拿到了 Meta 的 Offer。' },
            { id: 2, name: 'WallStreet Pathway', rating: 4.5, reviews: 89, tags: ['Finance/IB', 'Consulting'], priceRange: '$$$$', verified: true, aiSummary: { pros: ['投行/咨询 Network 强大', 'Resume 修改非常专业', 'Behavioral 辅导细致'], cons: ['销售环节承诺过高', '退款流程较慢'] }, recentReview: 'Networking 资源确实不错，帮我推到了几个 Boutique Bank 的面试。但是价格确实肉疼，建议按需购买单次服务。' },
            { id: 3, name: 'OfferGo Consulting', rating: 2.4, reviews: 45, tags: ['All'], priceRange: '$$', verified: false, warning: '近期收到多起关于 "保 Offer 虚假宣传" 的投诉，请谨慎选择。', aiSummary: { pros: ['价格相对便宜', '基础求职课程覆盖面广'], cons: ['"保 Offer" 条款存在文字游戏', '导师匹配随机，质量参差不齐', '售后服务差'] }, recentReview: '签了所谓的保 Offer 协议，结果推的都是外包或者不知名小公司，要求退款时被各种理由推脱，大家避雷！' },
            { id: 4, name: 'DataCamp Mentorship', rating: 4.7, reviews: 112, tags: ['Data Science', 'CS/Tech'], priceRange: '$$', verified: true, aiSummary: { pros: ['项目实战含金量高', 'SQL/Python 强化训练有效', '性价比高'], cons: ['纯算法辅导较弱', '主要针对初中级岗位'] }, recentReview: '带做的工业级推荐系统项目直接写进了简历，面试时被问了很久，非常加分。适合缺乏实习经历的同学。' }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch agencies:', error);
        setAgencies([
          { id: 1, name: 'TechCareer Pro', rating: 4.8, reviews: 156, tags: ['CS/Tech', 'Data Science'], priceRange: '$$$', verified: true, aiSummary: { pros: ['导师背景真实 (多为大厂 L5+)', '内推资源丰富', '算法辅导体系完善'], cons: ['价格偏高', '部分热门导师预约困难'] }, recentReview: '报名了 VIP 项目，匹配的 Google 导师非常负责，Mock Interview 帮我指出了很多沟通上的问题，最后成功拿到了 Meta 的 Offer。' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgencies();
  }, [searchQuery, activeFilter]);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="bg-deep rounded-3xl p-8 md:p-12 mb-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>全网真实评价 · AI 智能防坑</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                求职机构测评 (Agency Reviews)
              </h1>
              <p className="text-gray-300 text-lg mb-8">
                打破信息差，拒绝被割韭菜。基于全网真实留学生评价，AI 智能提炼机构优缺点，帮你找到最靠谱的求职辅导资源。
              </p>

              {/* Search Bar */}
              <div className="bg-white rounded-2xl p-2 flex items-center shadow-lg max-w-xl">
                <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-transparent focus-within:border-primary/30 focus-within:bg-white transition-colors">
                  <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索机构名称 (e.g. WallStreet...)" 
                    className="bg-transparent border-none outline-none w-full text-gray-900 placeholder-gray-400"
                  />
                </div>
                <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-medium transition-colors ml-2 shrink-0">
                  搜索
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Agency List */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Filters */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex items-center text-gray-500 mr-2 shrink-0">
                <Filter className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">行业筛选:</span>
              </div>
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeFilter === filter 
                      ? 'bg-deep text-white' 
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Agency Cards */}
            <div className="space-y-6">
              {agencies.map((agency) => (
                <div key={agency.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                        <Building className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h2 className="text-xl font-bold text-deep">{agency.name}</h2>
                          {agency.verified && (
                            <ShieldCheck className="w-5 h-5 text-emerald-500" title="已认证真实评价" />
                          )}
                        </div>
                        <div className="flex items-center space-x-3 mt-1">
                          <div className="flex items-center bg-amber-50 px-2 py-0.5 rounded text-amber-600 text-sm font-bold">
                            <Star className="w-3.5 h-3.5 fill-current mr-1" />
                            {agency.rating}
                          </div>
                          <span className="text-sm text-gray-500">{agency.reviews} 条真实评价</span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm font-medium text-gray-600">价格: {agency.priceRange}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {agency.tags.map(tag => (
                            <span key={tag} className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button className="bg-white border border-gray-200 hover:border-primary hover:text-primary text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors shrink-0">
                      查看详情
                    </button>
                  </div>

                  {/* Warning Banner if any */}
                  {agency.warning && (
                    <div className="mb-4 bg-red-50 border border-red-100 rounded-xl p-3 flex items-start">
                      <AlertTriangle className="w-5 h-5 text-red-500 mr-2 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{agency.warning}</p>
                    </div>
                  )}

                  {/* AI Summary */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100">
                    <div className="flex items-center mb-3">
                      <SparklesIcon className="w-4 h-4 text-primary mr-2" />
                      <span className="text-sm font-bold text-gray-900">AI 评价总结</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center text-emerald-600 mb-2 text-sm font-medium">
                          <ThumbsUp className="w-4 h-4 mr-1.5" /> 优点 (Pros)
                        </div>
                        <ul className="space-y-1.5">
                          {agency.aiSummary.pros.map((pro, i) => (
                            <li key={i} className="text-xs text-gray-600 flex items-start">
                              <span className="text-emerald-500 mr-1.5">•</span> {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="flex items-center text-red-500 mb-2 text-sm font-medium">
                          <ThumbsDown className="w-4 h-4 mr-1.5" /> 缺点 (Cons)
                        </div>
                        <ul className="space-y-1.5">
                          {agency.aiSummary.cons.map((con, i) => (
                            <li key={i} className="text-xs text-gray-600 flex items-start">
                              <span className="text-red-400 mr-1.5">•</span> {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Highlighted Review */}
                  <div className="border-t border-gray-50 pt-4">
                    <div className="flex items-start">
                      <MessageSquare className="w-4 h-4 text-gray-400 mr-2 mt-0.5 shrink-0" />
                      <p className="text-sm text-gray-600 italic">
                        "{agency.recentReview}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Guides & CTA */}
          <div className="space-y-6">
            
            {/* Write Review CTA */}
            <div className="bg-gradient-to-br from-primary to-primary-hover rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <h3 className="text-lg font-bold mb-2 relative z-10">分享你的报班经历</h3>
              <p className="text-primary-50 text-sm mb-6 relative z-10">
                匿名评价你使用过的求职机构，帮助更多留学生避坑，共建透明的求职生态。
              </p>
              <button className="w-full bg-white text-primary hover:bg-gray-50 py-3 rounded-xl font-bold transition-colors relative z-10 shadow-sm">
                写匿名评价
              </button>
            </div>

            {/* Anti-Scam Guide */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <ShieldAlert className="w-5 h-5 text-red-500 mr-2" />
                <h3 className="font-bold text-gray-900">求职机构避坑指南</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-red-50 p-1.5 rounded-md mr-3 shrink-0 mt-0.5">
                    <span className="text-red-600 font-bold text-xs">雷区 1</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">"100% 保 Offer，不过全退"</h4>
                    <p className="text-xs text-gray-500 mt-1">仔细阅读合同条款！很多机构会用 ICC (外包)、无薪实习或不知名小公司来凑数，退款条件极其苛刻。</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-amber-50 p-1.5 rounded-md mr-3 shrink-0 mt-0.5">
                    <span className="text-amber-600 font-bold text-xs">雷区 2</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">导师背景造假</h4>
                    <p className="text-xs text-gray-500 mt-1">要求在 LinkedIn 上验证导师身份。有些机构宣称的 "大厂高管" 实际上只是刚入职的初级员工。</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-amber-50 p-1.5 rounded-md mr-3 shrink-0 mt-0.5">
                    <span className="text-amber-600 font-bold text-xs">雷区 3</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">制造焦虑式营销</h4>
                    <p className="text-xs text-gray-500 mt-1">"再不报名秋招就结束了"、"你的背景完全拿不到面试"。遇到 PUA 式销售，请立刻拉黑。</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Agencies List */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 text-primary mr-2" />
                本月好评榜
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'TechCareer Pro', score: 4.8, category: 'CS/Tech' },
                  { name: 'DataCamp Mentorship', score: 4.7, category: 'Data Science' },
                  { name: 'WallStreet Pathway', score: 4.5, category: 'Finance' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400 font-bold text-sm w-4">{i + 1}</span>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center text-amber-500 text-sm font-bold">
                      <Star className="w-3.5 h-3.5 fill-current mr-1" />
                      {item.score}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// Helper icon component
function SparklesIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  )
}
