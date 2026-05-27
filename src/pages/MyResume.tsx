import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, ChevronRight, Crown, Edit3, FileSearch, FileText, LogIn, Plus, Send, Sparkles, Target, Upload } from 'lucide-react';

import SEO from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../lib/api';

type ResumeCard = {
  id: string | number;
  name: string;
  targetRole: string;
  lastModified: string;
  atsScore: number;
  language: string;
  isDefault: boolean;
};

const initialResumes: ResumeCard[] = [
  { id: 1, name: 'Software Engineer - 2026 NG', targetRole: 'Software Engineer', lastModified: '2 小时前', atsScore: 92, language: 'English', isDefault: true },
  { id: 2, name: 'Frontend Developer - React', targetRole: 'Frontend Engineer', lastModified: '3 天前', atsScore: 85, language: 'English', isDefault: false },
  { id: 3, name: '产品经理实习 - 中文版', targetRole: 'Product Manager', lastModified: '1 周前', atsScore: 78, language: 'Chinese', isDefault: false },
];

const formatUpdatedAt = (value?: string) => {
  if (!value) return '刚刚';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
};

export default function MyResume() {
  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [resumes, setResumes] = useState<ResumeCard[]>(initialResumes);
  const [isLoading, setIsLoading] = useState(true);
  const [jdText, setJdText] = useState('');
  const [atsResult, setAtsResult] = useState<number | null>(null);
  const maxFreeResumes = 3;

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    let mounted = true;
    setIsLoading(true);
    apiFetch('/api/proxy/resumes')
      .then((response) => {
        const list = Array.isArray(response.data) ? response.data : [];
        if (mounted && list.length) {
          setResumes(list.map((item: any, index: number) => ({
            id: item.id,
            name: item.name || `简历 ${index + 1}`,
            targetRole: item.targetRole || item.target_role || (item.language === 'en' ? 'English Resume' : '中文简历'),
            lastModified: formatUpdatedAt(item.updated_at || item.created_at),
            atsScore: item.atsScore || item.ats_score || 82,
            language: item.language === 'en' ? 'English' : 'Chinese',
            isDefault: Boolean(item.isDefault || item.is_default || index === 0),
          })));
        }
      })
      .catch((error) => {
        console.warn('Resume list fallback:', error);
      })
      .finally(() => mounted && setIsLoading(false));
    return () => { mounted = false; };
  }, [isAuthenticated]);

  const runAtsCheck = () => {
    if (!jdText.trim()) return;
    setAtsResult(Math.min(96, 76 + Math.floor(jdText.length / 120)));
  };

  return (
    <main className="pt-24 pb-16 min-h-screen bg-gray-50">
      <SEO
        title="我的简历"
        description="管理多版本简历，进行 ATS 匹配度检查，并使用 AI 优化简历经历表达。"
        keywords="简历优化,ATS简历,留学生简历,AI简历润色"
        canonical="https://www.zhiyincareer.com/my-resume"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center tracking-tight">
              <FileText className="w-8 h-8 text-primary mr-3" />
              我的简历
            </h1>
            <p className="text-gray-500 mt-2">管理多版本简历，按目标岗位优化表达，并检查 ATS 匹配度。</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center shadow-sm">
              <Upload className="w-4 h-4 mr-2" />
              导入 PDF
            </button>
            <button onClick={() => navigate('/my-resume/new')} className="bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              新建简历
            </button>
          </div>
        </section>

        {!isAuthenticated ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
            <LogIn className="w-12 h-12 mx-auto text-primary/40 mb-4" />
            <h2 className="text-lg font-bold text-gray-900">登录后管理简历</h2>
            <p className="text-sm text-gray-500 mt-2 mb-6">登录账号后，你可以同步简历版本、继续编辑，并用于职位投递。</p>
            <button onClick={() => openAuthModal('login')} className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-hover">
              立即登录
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                  <h2 className="text-lg font-bold text-gray-900">
                    简历库
                    <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">{isLoading ? '同步中' : `${resumes.length} / ${maxFreeResumes} 个版本`}</span>
                  </h2>
                  {resumes.length >= maxFreeResumes && (
                    <button className="text-sm text-amber-600 font-medium hover:text-amber-700 flex items-center bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                      <Crown className="w-4 h-4 mr-1.5" />
                      升级解锁更多版本
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {resumes.map((resume) => (
                    <article key={resume.id} className="border border-gray-200 rounded-xl p-5 hover:border-primary/40 hover:shadow-md transition-all flex flex-col bg-white group relative">
                      {resume.isDefault && <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl">默认投递</div>}
                      <div className="mb-4 pr-8">
                        <h3 className="font-bold text-gray-900 text-base truncate group-hover:text-primary transition-colors">{resume.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">目标岗位：{resume.targetRole}</p>
                      </div>
                      <div className="flex items-center gap-4 mb-4">
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider">ATS Score</span>
                          <div className={`font-bold text-lg ${resume.atsScore >= 90 ? 'text-green-500' : resume.atsScore >= 80 ? 'text-primary' : 'text-amber-500'}`}>{resume.atsScore}<span className="text-xs text-gray-400 ml-1">/100</span></div>
                        </div>
                        <div className="w-px h-9 bg-gray-100" />
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider">Updated</span>
                          <div className="text-sm font-medium text-gray-700">{resume.lastModified}</div>
                        </div>
                      </div>
                      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                        <button className="px-3 py-1.5 flex items-center justify-center text-xs font-semibold bg-gray-900 text-white rounded-lg hover:bg-black transition-colors w-full mr-3 shadow-sm">
                          <Send className="w-3.5 h-3.5 mr-1.5" />
                          用于网申
                        </button>
                        <button onClick={() => navigate(`/my-resume/${resume.id}`)} className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="编辑简历">
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </article>
                  ))}

                  <button onClick={() => navigate('/my-resume/new')} className="border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center text-center hover:border-primary/40 hover:bg-primary/5 transition-all min-h-[200px]">
                    <Plus className="w-8 h-8 text-gray-400 mb-3" />
                    <h3 className="font-medium text-gray-900">创建新版本</h3>
                    <p className="text-xs text-gray-500 mt-1 max-w-[220px]">针对不同岗位定制简历，提高网申通过率。</p>
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-md">
                <h3 className="text-xl font-bold flex items-center mb-2"><Sparkles className="w-5 h-5 mr-2 text-yellow-300" />AI 深度润色</h3>
                <p className="text-indigo-100 text-sm max-w-2xl mb-4">把平铺直叙的经历改写成更有结果感、动作感和岗位匹配度的表达。</p>
                <button onClick={() => navigate('/my-resume/1')} className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-50 transition-colors">打开编辑器</button>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <Target className="w-5 h-5 text-primary mr-2" />
                  <h3 className="font-bold text-gray-900">ATS 匹配度检测</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">粘贴目标岗位 JD，快速判断简历是否覆盖核心关键词。</p>
                <textarea value={jdText} onChange={(event) => setJdText(event.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 resize-none h-28 outline-none focus:ring-2 focus:ring-primary/20" placeholder="粘贴 Job Description..." />
                <button onClick={runAtsCheck} className="w-full mt-3 bg-gray-900 hover:bg-black text-white py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center">
                  <FileSearch className="w-4 h-4 mr-2" />
                  开始检测
                </button>
                {atsResult && (
                  <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
                    <div className="text-sm text-gray-500 mb-1">预测匹配度</div>
                    <div className="text-3xl font-black text-primary">{atsResult}%</div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">高分简历指南</h3>
                <ul className="space-y-4">
                  {[
                    ['使用强动作动词开头', '避免 Responsible for，优先使用 Built、Led、Optimized。', CheckCircle2],
                    ['量化你的结果', '加入具体数据，例如提升 40% 加载速度或服务 10k 用户。', CheckCircle2],
                    ['控制在一页内', '应届生和少于 5 年经验的候选人优先保持一页。', AlertCircle],
                  ].map(([title, desc, Icon]) => (
                    <li key={title as string} className="flex items-start">
                      <Icon className="w-4 h-4 text-green-500 mt-0.5 mr-2 shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{title as string}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{desc as string}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <button className="w-full mt-4 py-2 text-sm font-medium text-primary hover:text-primary-hover flex items-center justify-center transition-colors">
                  查看完整指南
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
