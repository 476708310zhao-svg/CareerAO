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
  Building,
  Scale,
  X,
  ChevronDown,
  UserCircle2,
  Trash2
} from 'lucide-react';
import { apiFetch } from '../lib/api';
import SEO from '../components/SEO';

export default function AgencyEvaluation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  
  const [isLoading, setIsLoading] = useState(false);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [compareList, setCompareList] = useState<any[]>([]);
  
  const [isWriteReviewModalOpen, setWriteReviewModalOpen] = useState(false);
  const [expandedAgency, setExpandedAgency] = useState<number | null>(null);

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
            priceRange: '$$$',
            verified: item.isVerified,
            aiSummary: {
              pros: ['服务专业', '导师负责'],
              cons: ['价格较高']
            },
            recentReview: item.description || '暂无评价',
            detailedReviews: []
          }));
          setAgencies(mappedAgencies);
        } else {
          // Fallback to mock data with detailed reviews
          setAgencies([
            { id: 1, name: 'TechCareer Pro', rating: 4.8, reviews: 156, tags: ['CS/Tech', 'Data Science'], priceRange: '¥30,000 - ¥50,000', verified: true, aiSummary: { pros: ['导师背景真实 (多为大厂 L5+)', '内推资源丰富', '算法辅导体系完善'], cons: ['价格偏高', '部分热门导师预约困难'] }, recentReview: '报名了 VIP 项目，匹配的 Google 导师非常负责，最后成功拿到了 Meta 的 Offer。', detailedReviews: [
               { id: 101, user: '匿名用户', avatar: null, text: '报名了 VIP 项目，匹配的 Google 导师非常负责，Mock Interview 帮我指出了很多沟通上的问题，最后成功拿到了 Meta 的 Offer。', likes: 24, isMine: false, isAnonymous: true },
               { id: 102, user: 'CS_Master_99', avatar: null, text: '纯刷题的话其实不用报班，自己刷 leetcode 够了。但如果是为了系统设计和内推，他们家确实资源还可以。', likes: 12, isMine: true, isAnonymous: false }
            ] },
            { id: 2, name: 'WallStreet Pathway', rating: 4.5, reviews: 89, tags: ['Finance/IB', 'Consulting'], priceRange: '¥50,000+', verified: true, aiSummary: { pros: ['投行/咨询 Network 强大', 'Resume 修改非常专业', 'Behavioral 辅导细致'], cons: ['销售环节承诺过高', '退款流程较慢'] }, recentReview: 'Networking 资源确实不错，帮我推到了几个 Boutique Bank 的面试。', detailedReviews: [
                { id: 201, user: '匿名用户', avatar: null, text: 'Networking 资源确实不错，帮我推到了几个 Boutique Bank 的面试。但是价格确实肉疼，建议按需购买单次服务。', likes: 45, isMine: false, isAnonymous: true }
            ] },
            { id: 3, name: 'OfferGo Consulting', rating: 2.4, reviews: 45, tags: ['All'], priceRange: '¥10,000 - ¥25,000', verified: false, warning: '近期收到多起关于 "保 Offer 虚假宣传" 的投诉，请谨慎选择。', aiSummary: { pros: ['价格相对便宜', '基础求职课程覆盖面广'], cons: ['"保 Offer" 条款存在文字游戏', '导师匹配随机，质量参差不齐', '售后服务差'] }, recentReview: '要求退款时被各种理由推脱，大家避雷！', detailedReviews: [
                { id: 301, user: 'AngryBird', avatar: null, text: '签了所谓的保 Offer 协议，结果推的都是外包或者不知名小公司，要求退款时被各种理由推脱，大家避雷！', likes: 120, isMine: false, isAnonymous: false }
            ] },
            { id: 4, name: 'DataCamp Mentorship', rating: 4.7, reviews: 112, tags: ['Data Science', 'CS/Tech'], priceRange: '¥15,000 - ¥30,000', verified: true, aiSummary: { pros: ['项目实战含金量高', 'SQL/Python 强化训练有效', '性价比高'], cons: ['纯算法辅导较弱', '主要针对初中级岗位'] }, recentReview: '带做的工业级推荐系统项目直接写进了简历，非常加分。', detailedReviews: [
                 { id: 401, user: '匿名用户', avatar: null, text: '带做的工业级推荐系统项目直接写进了简历，面试时被问了很久，非常加分。适合缺乏实习经历的同学。', likes: 8, isMine: false, isAnonymous: true }
            ] }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch agencies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgencies();
  }, [searchQuery, activeFilter]);

  const toggleCompare = (agency: any) => {
    if (compareList.find(a => a.id === agency.id)) {
      setCompareList(compareList.filter(a => a.id !== agency.id));
    } else {
      if (compareList.length >= 3) {
        alert("最多只能同时对比 3 家机构！");
        return;
      }
      setCompareList([...compareList, agency]);
    }
  };

  const handleLikeReview = (agencyId: number, reviewId: number) => {
      // Optimistic update
      setAgencies(agencies.map(agency => {
          if (agency.id === agencyId) {
              return {
                  ...agency,
                  detailedReviews: agency.detailedReviews.map((r: any) => 
                      r.id === reviewId ? { ...r, likes: r.likes + 1 } : r
                  )
              };
          }
          return agency;
      }));
  };

  const handleDeleteReview = (agencyId: number, reviewId: number) => {
    if (window.confirm("确定删除这条评价吗？")) {
       setAgencies(agencies.map(agency => {
           if (agency.id === agencyId) {
               return {
                   ...agency,
                   detailedReviews: agency.detailedReviews.filter((r: any) => r.id !== reviewId)
               };
           }
           return agency;
       }));
    }
  };


  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50 flex flex-col relative">
      <SEO 
        title="中介避雷 (Agency Evaluation)" 
        description="最全留学中介真实评价库。查看留学生对各大留学中介的红黑榜，防坑避雷，支持提交自己的真实被坑或好评经历。" 
        keywords="留学中介, 留学机构评价, 中介避雷, 怎么选留学中心, 靠谱留学中介" 
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
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
                打破信息差，拒绝被割韭菜。基于全网真实留学生评价，AI 智能提炼机构优缺点，帮你找到最靠谱的辅导资源。
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
                      ? 'bg-deep text-white shadow-sm' 
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Agency Cards */}
            <div className="space-y-6">
              {agencies.map((agency) => {
                const isComparing = compareList.find(a => a.id === agency.id);
                const isExpanded = expandedAgency === agency.id;

                return (
                <div key={agency.id} className={`bg-white rounded-2xl shadow-sm border transition-all ${isComparing ? 'border-primary shadow-md' : 'border-gray-100 hover:shadow-md'}`}>
                  <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                            <Building className="w-6 h-6 text-gray-400" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h2 className="text-xl font-bold text-deep">{agency.name}</h2>
                              {agency.verified && (
                                <span title="已认证真实评价" className="flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-emerald-500" /></span>
                              )}
                            </div>
                            <div className="flex items-center space-x-3 mt-1">
                              <div className="flex items-center bg-amber-50 px-2 py-0.5 rounded text-amber-600 text-sm font-bold">
                                <Star className="w-3.5 h-3.5 fill-current mr-1" />
                                {agency.rating}
                              </div>
                              <span className="text-sm text-gray-500 hover:text-primary cursor-pointer transition-colors" onClick={() => setExpandedAgency(isExpanded ? null : agency.id)}>{agency.reviews} 条真实评价</span>
                              <span className="text-sm text-gray-400">•</span>
                              <span className="text-sm font-medium text-gray-600">价格: {agency.priceRange}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {agency.tags.map((tag: string) => (
                                <span key={tag} className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-medium">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row md:flex-col gap-2 shrink-0">
                          <button 
                             onClick={() => toggleCompare(agency)}
                             className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border flex items-center justify-center ${isComparing ? 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20' : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'}`}
                          >
                            <Scale className="w-4 h-4 mr-1.5" />
                            {isComparing ? '取消对比' : '加入对比'}
                          </button>
                        </div>
                      </div>

                      {/* Warning Banner if any */}
                      {agency.warning && (
                        <div className="mb-4 bg-red-50 border border-red-100 rounded-xl p-3 flex items-start">
                          <AlertTriangle className="w-5 h-5 text-red-500 mr-2 shrink-0 mt-0.5" />
                          <p className="text-sm text-red-700 leading-relaxed font-medium">{agency.warning}</p>
                        </div>
                      )}

                      {/* AI Summary */}
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="flex items-center mb-3">
                          <SparklesIcon className="w-4 h-4 text-indigo-500 mr-2" />
                          <span className="text-sm font-bold text-gray-900">AI 智能提炼总结</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white p-3 rounded-lg border border-emerald-100/50">
                            <div className="flex items-center text-emerald-600 mb-2 text-sm font-bold">
                              <ThumbsUp className="w-4 h-4 mr-1.5" /> 优势 (Pros)
                            </div>
                            <ul className="space-y-1.5">
                              {agency.aiSummary.pros.map((pro: string, i: number) => (
                                <li key={i} className="text-xs text-gray-600 flex items-start leading-relaxed">
                                  <span className="text-emerald-500 mr-1.5 shrink-0 mt-0.5">•</span> {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-red-100/50">
                            <div className="flex items-center text-red-500 mb-2 text-sm font-bold">
                              <ThumbsDown className="w-4 h-4 mr-1.5" /> 劣势 (Cons)
                            </div>
                            <ul className="space-y-1.5">
                              {agency.aiSummary.cons.map((con: string, i: number) => (
                                <li key={i} className="text-xs text-gray-600 flex items-start leading-relaxed">
                                  <span className="text-red-400 mr-1.5 shrink-0 mt-0.5">•</span> {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-center">
                         <button 
                           onClick={() => setExpandedAgency(isExpanded ? null : agency.id)}
                           className="text-xs font-bold text-gray-500 hover:text-primary transition-colors flex items-center"
                         >
                            {isExpanded ? '收起评价' : '查看全部真实评价'} <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                         </button>
                      </div>
                  </div>

                  {/* Expandable Reviews Section */}
                  {isExpanded && (
                     <div className="border-t border-gray-100 bg-gray-50/50 p-6 rounded-b-2xl space-y-4">
                         {agency.detailedReviews.map((review: any) => (
                            <div key={review.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center">
                                      {review.isAnonymous ? (
                                         <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                            <ShieldCheck className="w-4 h-4 text-gray-400" />
                                         </div>
                                      ) : (
                                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                            <UserCircle2 className="w-5 h-5 text-indigo-500" />
                                         </div>
                                      )}
                                      <div>
                                         <div className="text-sm font-bold text-gray-900">{review.user} {review.isAnonymous && <span className="text-xs font-medium text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded ml-1">Verified</span>}</div>
                                      </div>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed mt-2">{review.text}</p>
                                <div className="flex items-center justify-between mt-3">
                                   <button 
                                      onClick={() => handleLikeReview(agency.id, review.id)}
                                      className="flex items-center text-xs font-medium text-gray-500 hover:text-primary transition-colors"
                                   >
                                      <ThumbsUp className="w-3.5 h-3.5 mr-1" /> 有帮助 ({review.likes})
                                   </button>
                                   {review.isMine && (
                                     <button 
                                        onClick={() => handleDeleteReview(agency.id, review.id)}
                                        className="text-xs font-medium text-red-500 hover:text-red-700 flex items-center transition-colors"
                                     >
                                         <Trash2 className="w-3.5 h-3.5 mr-1" /> 删除
                                     </button>
                                   )}
                                </div>
                            </div>
                         ))}
                         
                         <button 
                           onClick={() => setWriteReviewModalOpen(true)}
                           className="w-full bg-white border border-dashed border-gray-300 text-gray-600 hover:text-primary hover:border-primary hover:bg-primary/5 py-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center"
                         >
                            <MessageSquare className="w-4 h-4 mr-2" /> 写下的你的真实评价 (可匿名)
                         </button>
                     </div>
                  )}
                </div>
              )})}
            </div>
          </div>

          {/* Right Column: Guides & CTA */}
          <div className="space-y-6">
            
            {/* Write Review CTA */}
            <div className="bg-gradient-to-br from-primary to-primary-hover rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <h3 className="text-lg font-bold mb-2 relative z-10">分享你的报班经历</h3>
              <p className="text-primary-50 text-sm mb-6 relative z-10 leading-relaxed">
                匿名评价你使用过的求职机构，帮助更多留学生避坑，共建透明的求职生态。
              </p>
              <button 
                onClick={() => setWriteReviewModalOpen(true)}
                className="w-full bg-white text-primary hover:bg-gray-50 py-3 rounded-xl font-bold transition-colors relative z-10 shadow-sm"
              >
                提供排雷线索 / 推荐好机构
              </button>
            </div>

            {/* Anti-Scam Guide */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4 border-b border-gray-100 pb-4">
                <ShieldAlert className="w-5 h-5 text-red-500 mr-2" />
                <h3 className="font-bold text-gray-900">求职机构避坑指南</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-red-50 py-1 px-2 rounded-md mr-3 shrink-0">
                    <span className="text-red-700 font-black text-xs uppercase tracking-wider">Scam</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">"100% 保 Offer，不过全退"</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">仔细阅读合同条款！很多机构会用 ICC (外包)、无薪实习或不知名小公司来凑数，退款条件极其苛刻。</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-amber-50 py-1 px-2 rounded-md mr-3 shrink-0">
                    <span className="text-amber-700 font-black text-xs uppercase tracking-wider">Fake</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">导师背景造假</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">要求在 LinkedIn 上验证导师身份。有些机构宣称的 "大厂高管" 实际上只是刚入职的初级员工。</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-amber-50 py-1 px-2 rounded-md mr-3 shrink-0">
                    <span className="text-amber-700 font-black text-xs uppercase tracking-wider">Trap</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">制造焦虑式营销</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">"再不报名秋招就结束了"、"你的背景完全拿不到面试"。遇到 PUA 式销售，请立刻拉黑。</p>
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
                  <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <span className={`font-black text-sm w-5 text-center ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-gray-400' : 'text-amber-700'}`}>{i + 1}</span>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{item.name}</div>
                        <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">{item.category}</div>
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

       {/* Floating Compare Bar */}
       {compareList.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 animate-in slide-in-from-bottom pb-safe">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                   <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                      <span className="text-sm font-bold text-gray-500 mr-2 shrink-0">对比清单:</span>
                      {compareList.map((c, i) => (
                         <div key={c.id} className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 flex items-center shrink-0">
                            <span className="text-sm font-bold text-gray-900 truncate max-w-[120px]">{c.name}</span>
                            <button onClick={() => toggleCompare(c)} className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none">
                               <X className="w-3.5 h-3.5" />
                            </button>
                         </div>
                      ))}
                      {compareList.length < 3 && (
                         <div className="border border-dashed border-gray-300 rounded-lg px-3 py-1.5 flex items-center text-sm font-medium text-gray-400 shrink-0 select-none">
                            还可添加 {3 - compareList.length} 家
                         </div>
                      )}
                   </div>
                   <div className="flex items-center space-x-3 w-full md:w-auto shrink-0 mt-2 md:mt-0">
                       <button 
                         onClick={() => setCompareList([])}
                         className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                       >
                         清空
                       </button>
                       <button className="flex-1 md:flex-none px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-colors shadow-sm shadow-primary/30 flex items-center justify-center">
                          <Scale className="w-4 h-4 mr-2" /> 开始多维横评 (VS)
                       </button>
                   </div>
                </div>
             </div>
          </div>
       )}

       {/* Write Review Modal (Simple placeholder for UI) */}
       {isWriteReviewModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
             <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 fade-in duration-200 overflow-hidden flex flex-col max-h-[90vh]">
                 <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <MessageSquare className="w-5 h-5 mr-2 text-primary" />
                        发布机构评价
                    </h3>
                    <button onClick={() => setWriteReviewModalOpen(false)} className="text-gray-400 hover:text-gray-700 bg-white rounded-full p-1 border border-gray-200 shadow-sm transition-colors">
                       <X className="w-5 h-5" />
                    </button>
                 </div>
                 <div className="p-6 overflow-y-auto">
                    <div className="space-y-5">
                       <div>
                          <label className="block text-sm font-bold text-gray-900 mb-1.5">机构名称</label>
                          <select className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium">
                             <option>选择你报名的机构</option>
                             <option>TechCareer Pro</option>
                             <option>WallStreet Pathway</option>
                             <option>OfferGo Consulting</option>
                             <option>DataCamp Mentorship</option>
                             <option>其他 (手动输入)</option>
                          </select>
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-gray-900 mb-1.5">综合评分</label>
                          <div className="flex space-x-1">
                             {[1, 2, 3, 4, 5].map(s => (
                                <Star key={s} className="w-8 h-8 text-gray-200 hover:text-amber-400 cursor-pointer transition-colors" />
                             ))}
                          </div>
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-gray-900 mb-1.5">详细评价 (优缺点/避坑点/花费)</label>
                          <textarea 
                             rows={5} 
                             placeholder="分享你真实的报班体验，越详细越能帮助后来者..." 
                             className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none font-medium leading-relaxed"
                          ></textarea>
                       </div>
                       <div className="flex items-center">
                          <input type="checkbox" id="anonymous" className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary mb-0.5" defaultChecked />
                          <label htmlFor="anonymous" className="ml-2 text-sm font-bold text-gray-700 flex items-center cursor-pointer select-none">
                             <ShieldCheck className="w-4 h-4 mr-1 text-emerald-500" />
                             匿名发布 (保护隐私，仅标记为 verified)
                          </label>
                       </div>
                    </div>
                 </div>
                 <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0 flex justify-end space-x-3">
                    <button onClick={() => setWriteReviewModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors">
                       取消
                    </button>
                    <button onClick={() => setWriteReviewModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-primary-hover shadow-sm shadow-primary/30 transition-colors">
                       提交评价
                    </button>
                 </div>
             </div>
          </div>
       )}

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
