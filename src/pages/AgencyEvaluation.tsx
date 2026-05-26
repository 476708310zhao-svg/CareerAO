import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Building,
  ChevronDown,
  Filter,
  MessageSquare,
  Scale,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  TrendingUp,
  UserCircle2,
  X,
} from 'lucide-react';

import SEO from '../components/SEO';
import { useToast } from '../contexts/ToastContext';
import { apiFetch } from '../lib/api';

type AgencyReview = {
  id: number;
  agencyId: number;
  userName: string;
  userAvatar?: string;
  ratingOverall: number;
  ratingEffect?: number;
  ratingValue?: number;
  ratingService?: number;
  title?: string;
  content: string;
  pros?: string;
  cons?: string;
  isAnonymous: boolean;
  likesCount: number;
  createdAt?: string;
};

type Agency = {
  id: number;
  name: string;
  type?: string;
  description?: string;
  services?: string[];
  priceRange?: any;
  specialties?: string[];
  website?: string;
  city?: string;
  logo?: string;
  logoDomain?: string;
  isVerified?: boolean;
  ratingAvg?: number;
  reviewCount?: number;
  aiEval?: any;
  ratingDims?: {
    effect?: number;
    value?: number;
    service?: number;
  };
  reviews?: AgencyReview[];
  reviewsLoaded?: boolean;
};

type ReviewForm = {
  agencyId: string;
  ratingOverall: number;
  ratingEffect: number;
  ratingValue: number;
  ratingService: number;
  title: string;
  content: string;
  pros: string;
  cons: string;
  isAnonymous: boolean;
};

const filters = ['全部', 'CS/Tech', 'Finance/IB', 'Consulting', 'Data Science'];

const initialReviewForm: ReviewForm = {
  agencyId: '',
  ratingOverall: 5,
  ratingEffect: 5,
  ratingValue: 4,
  ratingService: 4,
  title: '',
  content: '',
  pros: '',
  cons: '',
  isAnonymous: true,
};

const priceText = (priceRange: any) => {
  if (!priceRange) return '待补充';
  if (typeof priceRange === 'string') return priceRange;
  if (Array.isArray(priceRange)) return priceRange.join(' / ');
  return [priceRange.china, priceRange.northAmerica, priceRange.uk, priceRange.min && priceRange.max ? `${priceRange.min}-${priceRange.max}` : '']
    .filter(Boolean)
    .join(' / ') || '待补充';
};

const normalizeAgency = (agency: Agency): Agency => ({
  ...agency,
  services: agency.services || [],
  specialties: agency.specialties || [],
  reviews: agency.reviews || [],
  ratingAvg: Number(agency.ratingAvg || 0),
  reviewCount: Number(agency.reviewCount || 0),
});

const splitText = (value?: string, fallback: string[] = []) => {
  if (!value) return fallback;
  return value
    .split(/[,，;；\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);
};

const getPros = (agency: Agency) => {
  const aiStrengths = agency.aiEval?.strengths;
  if (Array.isArray(aiStrengths) && aiStrengths.length) return aiStrengths.slice(0, 3);
  return [
    agency.isVerified ? '平台已标记认证信息' : '可结合用户评价进一步核验',
    agency.reviewCount ? `已沉淀 ${agency.reviewCount} 条评价样本` : '评价样本仍在积累',
    ...(agency.specialties || []).slice(0, 1),
  ].filter(Boolean);
};

const getCons = (agency: Agency) => {
  const aiWeaknesses = agency.aiEval?.weaknesses;
  if (Array.isArray(aiWeaknesses) && aiWeaknesses.length) return aiWeaknesses.slice(0, 3);
  const risks = [];
  if (!agency.isVerified) risks.push('未认证机构，建议先核验导师背景与合同条款');
  if ((agency.reviewCount || 0) < 3) risks.push('评价数量较少，判断时需要更多样本');
  risks.push('价格、退款和服务边界需在签约前书面确认');
  return risks;
};

export default function AgencyEvaluation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('全部');
  const [isLoading, setIsLoading] = useState(false);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [compareList, setCompareList] = useState<Agency[]>([]);
  const [expandedAgency, setExpandedAgency] = useState<number | null>(null);
  const [isWriteReviewModalOpen, setWriteReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState<ReviewForm>(initialReviewForm);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          keyword: searchQuery.trim(),
          type: activeFilter === '全部' ? '' : activeFilter,
          page: '1',
          pageSize: '20',
          sort: 'rating',
        });
        const response = await apiFetch(`/api/proxy/agencies?${params.toString()}`);
        const list = response.data?.list || response.data || [];
        setAgencies(Array.isArray(list) ? list.map(normalizeAgency) : []);
      } catch (error) {
        console.warn('Failed to fetch agencies:', error);
        setAgencies([]);
        showToast('机构数据加载失败，请稍后重试', 'error');
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [activeFilter, searchQuery, showToast]);

  const topAgencies = useMemo(() => agencies.slice().sort((a, b) => (b.ratingAvg || 0) - (a.ratingAvg || 0)).slice(0, 5), [agencies]);

  const updateAgency = (agencyId: number, updater: (agency: Agency) => Agency) => {
    setAgencies((current) => current.map((agency) => (agency.id === agencyId ? updater(agency) : agency)));
    setCompareList((current) => current.map((agency) => (agency.id === agencyId ? updater(agency) : agency)));
  };

  const loadAgencyReviews = async (agencyId: number) => {
    const agency = agencies.find((item) => item.id === agencyId);
    if (agency?.reviewsLoaded) return;

    try {
      const response = await apiFetch(`/api/proxy/agencies/${agencyId}/reviews?page=1&pageSize=20`);
      const reviews = response.data || [];
      updateAgency(agencyId, (item) => ({ ...item, reviews: Array.isArray(reviews) ? reviews : [], reviewsLoaded: true }));
    } catch (error) {
      console.warn('Failed to fetch agency reviews:', error);
      showToast('评价加载失败，请稍后重试', 'error');
    }
  };

  const toggleExpand = async (agencyId: number) => {
    const next = expandedAgency === agencyId ? null : agencyId;
    setExpandedAgency(next);
    if (next) await loadAgencyReviews(next);
  };

  const toggleCompare = (agency: Agency) => {
    if (compareList.find((item) => item.id === agency.id)) {
      setCompareList(compareList.filter((item) => item.id !== agency.id));
      return;
    }
    if (compareList.length >= 3) {
      showToast('最多只能同时对比 3 家机构', 'info');
      return;
    }
    setCompareList([...compareList, agency]);
  };

  const openReviewModal = (agency?: Agency) => {
    setReviewForm({ ...initialReviewForm, agencyId: agency ? String(agency.id) : '' });
    setWriteReviewModalOpen(true);
  };

  const handleLikeReview = async (agencyId: number, reviewId: number) => {
    updateAgency(agencyId, (agency) => ({
      ...agency,
      reviews: (agency.reviews || []).map((review) => (review.id === reviewId ? { ...review, likesCount: review.likesCount + 1 } : review)),
    }));

    try {
      const response = await apiFetch(`/api/proxy/agencies/${agencyId}/reviews/${reviewId}/like`, { method: 'POST' });
      const likesCount = response.data?.likesCount;
      if (typeof likesCount === 'number') {
        updateAgency(agencyId, (agency) => ({
          ...agency,
          reviews: (agency.reviews || []).map((review) => (review.id === reviewId ? { ...review, likesCount } : review)),
        }));
      }
    } catch (error) {
      console.warn('Failed to like review:', error);
      showToast('需要登录后才能点赞评价', 'info');
    }
  };

  const handleDeleteReview = async (agencyId: number, reviewId: number) => {
    if (!window.confirm('确定删除这条评价吗？')) return;
    try {
      await apiFetch(`/api/proxy/agencies/reviews/${reviewId}`, { method: 'DELETE' });
      updateAgency(agencyId, (agency) => ({
        ...agency,
        reviewCount: Math.max(0, (agency.reviewCount || 0) - 1),
        reviews: (agency.reviews || []).filter((review) => review.id !== reviewId),
      }));
      showToast('评价已删除', 'success');
    } catch (error) {
      console.warn('Failed to delete review:', error);
      showToast('只能删除自己发布的评价', 'error');
    }
  };

  const submitReview = async () => {
    const agencyId = Number(reviewForm.agencyId);
    if (!agencyId) {
      showToast('请先选择机构', 'error');
      return;
    }
    if (reviewForm.content.trim().length < 10) {
      showToast('评价内容至少 10 个字', 'error');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const response = await apiFetch(`/api/proxy/agencies/${agencyId}/reviews`, {
        method: 'POST',
        body: JSON.stringify({
          ratingOverall: reviewForm.ratingOverall,
          ratingEffect: reviewForm.ratingEffect,
          ratingValue: reviewForm.ratingValue,
          ratingService: reviewForm.ratingService,
          title: reviewForm.title,
          content: reviewForm.content,
          pros: reviewForm.pros,
          cons: reviewForm.cons,
          isAnonymous: reviewForm.isAnonymous,
        }),
      });
      const review = response.data;
      updateAgency(agencyId, (agency) => ({
        ...agency,
        reviewCount: (agency.reviewCount || 0) + 1,
        reviewsLoaded: true,
        reviews: review ? [review, ...(agency.reviews || [])] : agency.reviews,
      }));
      setExpandedAgency(agencyId);
      setWriteReviewModalOpen(false);
      showToast('评价提交成功', 'success');
    } catch (error) {
      console.warn('Failed to submit review:', error);
      showToast('需要登录后才能提交评价，或你已评价过该机构', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <main className="pt-24 pb-16 min-h-screen bg-gray-50 flex flex-col relative">
      <SEO
        title="求职机构测评"
        description="查看留学生求职机构真实评价、评分、服务范围和用户反馈，支持多机构对比与评价提交。"
        keywords="求职机构测评, 留学中介评价, 求职中介避雷, 留学生求职辅导"
        canonical="https://www.zhiyincareer.com/agency-evaluation"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <section className="bg-deep rounded-3xl p-8 md:p-12 mb-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>真实评价 · 多维评分 · 机构对比</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">求职机构测评</h1>
            <p className="text-gray-300 text-lg mb-8">
              基于后端机构库和用户评价，集中展示机构服务范围、评分、优劣势和真实反馈，帮助你在签约前把风险看清楚。
            </p>

            <div className="bg-white rounded-2xl p-2 flex items-center shadow-lg max-w-xl">
              <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-transparent focus-within:border-primary/30 focus-within:bg-white transition-colors">
                <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="搜索机构名称、服务或关键词"
                  className="bg-transparent border-none outline-none w-full text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex items-center text-gray-500 mr-2 shrink-0">
                <Filter className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">行业筛选</span>
              </div>
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeFilter === filter ? 'bg-deep text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-white rounded-2xl h-64 border border-gray-100 animate-pulse" />
                ))}
              </div>
            ) : agencies.length ? (
              <div className="space-y-6">
                {agencies.map((agency) => {
                  const isComparing = compareList.some((item) => item.id === agency.id);
                  const isExpanded = expandedAgency === agency.id;
                  const tags = [agency.type, ...(agency.specialties || [])].filter(Boolean).slice(0, 5);

                  return (
                    <article key={agency.id} className={`bg-white rounded-2xl shadow-sm border transition-all ${isComparing ? 'border-primary shadow-md' : 'border-gray-100 hover:shadow-md'}`}>
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                          <div className="flex items-start gap-4 min-w-0">
                            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                              {agency.logo ? <img src={agency.logo} alt={agency.name} className="w-full h-full object-contain p-2" /> : <Building className="w-6 h-6 text-gray-400" />}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-xl font-bold text-deep">{agency.name}</h2>
                                {agency.isVerified && <ShieldCheck className="w-5 h-5 text-emerald-500" />}
                                {!agency.isVerified && <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700">未认证</span>}
                              </div>
                              <div className="flex flex-wrap items-center gap-3 mt-2">
                                <div className="flex items-center bg-amber-50 px-2 py-0.5 rounded text-amber-600 text-sm font-bold">
                                  <Star className="w-3.5 h-3.5 fill-current mr-1" />
                                  {agency.ratingAvg?.toFixed(1) || '0.0'}
                                </div>
                                <button className="text-sm text-gray-500 hover:text-primary" onClick={() => toggleExpand(agency.id)}>
                                  {agency.reviewCount || 0} 条真实评价
                                </button>
                                <span className="text-sm font-medium text-gray-600">价格：{priceText(agency.priceRange)}</span>
                                {agency.city && <span className="text-sm text-gray-500">{agency.city}</span>}
                              </div>
                              <div className="flex flex-wrap gap-2 mt-3">
                                {tags.length ? tags.map((tag) => (
                                  <span key={tag} className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-medium">{tag}</span>
                                )) : <span className="bg-gray-100 text-gray-500 px-2.5 py-1 rounded-md text-xs font-medium">服务信息待补充</span>}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => toggleCompare(agency)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border flex items-center justify-center shrink-0 ${
                              isComparing ? 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20' : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                            }`}
                          >
                            <Scale className="w-4 h-4 mr-1.5" />
                            {isComparing ? '取消对比' : '加入对比'}
                          </button>
                        </div>

                        {!agency.isVerified && (
                          <div className="mb-4 bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start">
                            <AlertTriangle className="w-5 h-5 text-amber-500 mr-2 shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-800 leading-relaxed font-medium">该机构尚未完成认证，建议重点核验导师背景、退款条款和服务交付边界。</p>
                          </div>
                        )}

                        <p className="text-sm text-gray-600 leading-relaxed mb-4">{agency.description || '暂无机构介绍，建议结合评价和官网信息进一步判断。'}</p>

                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <div className="flex items-center mb-3">
                            <Sparkles className="w-4 h-4 text-indigo-500 mr-2" />
                            <span className="text-sm font-bold text-gray-900">智能测评摘要</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-lg border border-emerald-100/50">
                              <div className="flex items-center text-emerald-600 mb-2 text-sm font-bold">
                                <ThumbsUp className="w-4 h-4 mr-1.5" /> 优势
                              </div>
                              <ul className="space-y-1.5">
                                {getPros(agency).map((item, index) => (
                                  <li key={index} className="text-xs text-gray-600 flex items-start leading-relaxed"><span className="text-emerald-500 mr-1.5">•</span>{item}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-red-100/50">
                              <div className="flex items-center text-red-500 mb-2 text-sm font-bold">
                                <ThumbsDown className="w-4 h-4 mr-1.5" /> 风险点
                              </div>
                              <ul className="space-y-1.5">
                                {getCons(agency).map((item, index) => (
                                  <li key={index} className="text-xs text-gray-600 flex items-start leading-relaxed"><span className="text-red-400 mr-1.5">•</span>{item}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-center">
                          <button onClick={() => toggleExpand(agency.id)} className="text-xs font-bold text-gray-500 hover:text-primary transition-colors flex items-center">
                            {isExpanded ? '收起评价' : '查看真实评价'} <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-gray-100 bg-gray-50/50 p-6 rounded-b-2xl space-y-4">
                          {(agency.reviews || []).length ? (agency.reviews || []).map((review) => (
                            <div key={review.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 overflow-hidden">
                                    {review.userAvatar ? <img src={review.userAvatar} alt={review.userName} className="w-full h-full object-cover" /> : review.isAnonymous ? <ShieldCheck className="w-4 h-4 text-gray-400" /> : <UserCircle2 className="w-5 h-5 text-indigo-500" />}
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold text-gray-900">
                                      {review.userName}
                                      {review.isAnonymous && <span className="text-xs font-medium text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded ml-1">匿名</span>}
                                    </div>
                                    <div className="flex items-center text-xs text-amber-500 mt-0.5">
                                      <Star className="w-3 h-3 fill-current mr-1" /> {review.ratingOverall || 0}
                                      {review.createdAt && <span className="text-gray-400 ml-2">{new Date(review.createdAt).toLocaleDateString()}</span>}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {review.title && <h3 className="text-sm font-bold text-gray-900 mt-3">{review.title}</h3>}
                              <p className="text-sm text-gray-700 leading-relaxed mt-2">{review.content}</p>
                              {(review.pros || review.cons) && (
                                <div className="grid sm:grid-cols-2 gap-3 mt-3">
                                  {splitText(review.pros).length > 0 && <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg p-2">优点：{splitText(review.pros).join('、')}</p>}
                                  {splitText(review.cons).length > 0 && <p className="text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg p-2">不足：{splitText(review.cons).join('、')}</p>}
                                </div>
                              )}
                              <div className="flex items-center justify-between mt-3">
                                <button onClick={() => handleLikeReview(agency.id, review.id)} className="flex items-center text-xs font-medium text-gray-500 hover:text-primary transition-colors">
                                  <ThumbsUp className="w-3.5 h-3.5 mr-1" /> 有帮助 ({review.likesCount || 0})
                                </button>
                                <button onClick={() => handleDeleteReview(agency.id, review.id)} className="text-xs font-medium text-red-500 hover:text-red-700 flex items-center transition-colors">
                                  <Trash2 className="w-3.5 h-3.5 mr-1" /> 删除
                                </button>
                              </div>
                            </div>
                          )) : (
                            <div className="bg-white rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                              暂无评价，欢迎分享你的真实体验。
                            </div>
                          )}

                          <button
                            onClick={() => openReviewModal(agency)}
                            className="w-full bg-white border border-dashed border-gray-300 text-gray-600 hover:text-primary hover:border-primary hover:bg-primary/5 py-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" /> 写下你的真实评价
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
                <Building className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <h2 className="text-lg font-bold text-gray-900">暂无匹配机构</h2>
                <p className="text-gray-500 text-sm mt-2">可以调整关键词或筛选条件再试。</p>
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <section className="bg-gradient-to-br from-primary to-primary-hover rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <h2 className="text-lg font-bold mb-2 relative z-10">分享你的报班经历</h2>
              <p className="text-primary-50 text-sm mb-6 relative z-10 leading-relaxed">匿名评价你使用过的求职机构，帮助更多同学避坑，也让靠谱服务被看见。</p>
              <button onClick={() => openReviewModal()} className="w-full bg-white text-primary hover:bg-gray-50 py-3 rounded-xl font-bold transition-colors relative z-10 shadow-sm">
                提交机构评价
              </button>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4 border-b border-gray-100 pb-4">
                <ShieldAlert className="w-5 h-5 text-red-500 mr-2" />
                <h2 className="font-bold text-gray-900">避坑检查清单</h2>
              </div>
              <div className="space-y-4">
                {[
                  ['Scam', '警惕“100% 保 offer”', '仔细阅读合同退款条件，确认 offer 口径是否包含外包、无薪实习或无关岗位。'],
                  ['Verify', '核验导师背景', '要求提供可验证的 LinkedIn、在职证明或公开履历，不只看销售话术。'],
                  ['Scope', '写清交付边界', '明确服务次数、导师资历、内推范围、退款条件和材料归属。'],
                ].map(([badge, title, desc]) => (
                  <div key={title} className="flex items-start">
                    <div className="bg-red-50 py-1 px-2 rounded-md mr-3 shrink-0">
                      <span className="text-red-700 font-black text-xs uppercase tracking-wider">{badge}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">{title}</h3>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 text-primary mr-2" />
                本月好评榜
              </h2>
              <div className="space-y-4">
                {topAgencies.map((item, index) => (
                  <button key={item.id} onClick={() => toggleExpand(item.id)} className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors text-left">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`font-black text-sm w-5 text-center ${index === 0 ? 'text-amber-500' : index === 1 ? 'text-gray-400' : 'text-amber-700'}`}>{index + 1}</span>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-gray-900 truncate">{item.name}</div>
                        <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">{item.type || 'Agency'}</div>
                      </div>
                    </div>
                    <div className="flex items-center text-amber-500 text-sm font-bold">
                      <Star className="w-3.5 h-3.5 fill-current mr-1" />
                      {item.ratingAvg?.toFixed(1) || '0.0'}
                    </div>
                  </button>
                ))}
                {!topAgencies.length && <p className="text-sm text-gray-500">暂无榜单数据。</p>}
              </div>
            </section>
          </aside>
        </div>
      </div>

      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                <span className="text-sm font-bold text-gray-500 mr-2 shrink-0">对比清单：</span>
                {compareList.map((agency) => (
                  <div key={agency.id} className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 flex items-center shrink-0">
                    <span className="text-sm font-bold text-gray-900 truncate max-w-[140px]">{agency.name}</span>
                    <button onClick={() => toggleCompare(agency)} className="ml-2 text-gray-400 hover:text-red-500">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {compareList.length < 3 && <div className="border border-dashed border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-400 shrink-0">还可添加 {3 - compareList.length} 家</div>}
              </div>
              <button onClick={() => setCompareList([])} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors">清空</button>
            </div>
          </div>
        </div>
      )}

      {isWriteReviewModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-primary" />
                发布机构评价
              </h2>
              <button onClick={() => setWriteReviewModalOpen(false)} className="text-gray-400 hover:text-gray-700 bg-white rounded-full p-1 border border-gray-200 shadow-sm transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">机构名称</label>
                  <select
                    value={reviewForm.agencyId}
                    onChange={(event) => setReviewForm({ ...reviewForm, agencyId: event.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  >
                    <option value="">选择你评价的机构</option>
                    {agencies.map((agency) => <option key={agency.id} value={agency.id}>{agency.name}</option>)}
                  </select>
                </div>

                {[
                  ['ratingOverall', '综合评分'],
                  ['ratingEffect', '求职效果'],
                  ['ratingValue', '性价比'],
                  ['ratingService', '服务体验'],
                ].map(([field, label]) => (
                  <div key={field}>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5">{label}</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <button
                          key={score}
                          onClick={() => setReviewForm({ ...reviewForm, [field]: score })}
                          className={(reviewForm[field as keyof ReviewForm] as number) >= score ? 'text-amber-400' : 'text-gray-200 hover:text-amber-300'}
                        >
                          <Star className="w-7 h-7 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">标题</label>
                  <input
                    value={reviewForm.title}
                    onChange={(event) => setReviewForm({ ...reviewForm, title: event.target.value })}
                    placeholder="例如：导师负责，但退款条款要看清"
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">详细评价</label>
                  <textarea
                    rows={5}
                    value={reviewForm.content}
                    onChange={(event) => setReviewForm({ ...reviewForm, content: event.target.value })}
                    placeholder="分享真实报班体验、交付质量、导师背景、价格和避坑点..."
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none font-medium leading-relaxed"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <textarea value={reviewForm.pros} onChange={(event) => setReviewForm({ ...reviewForm, pros: event.target.value })} placeholder="优点，用逗号分隔" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none" />
                  <textarea value={reviewForm.cons} onChange={(event) => setReviewForm({ ...reviewForm, cons: event.target.value })} placeholder="不足，用逗号分隔" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none" />
                </div>

                <label className="flex items-center text-sm font-bold text-gray-700 cursor-pointer select-none">
                  <input type="checkbox" className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary mb-0.5" checked={reviewForm.isAnonymous} onChange={(event) => setReviewForm({ ...reviewForm, isAnonymous: event.target.checked })} />
                  <ShieldCheck className="w-4 h-4 ml-2 mr-1 text-emerald-500" />
                  匿名发布
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0 flex justify-end gap-3">
              <button onClick={() => setWriteReviewModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors">取消</button>
              <button onClick={submitReview} disabled={isSubmittingReview} className="px-6 py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-primary-hover shadow-sm shadow-primary/30 transition-colors disabled:opacity-60">
                {isSubmittingReview ? '提交中...' : '提交评价'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
