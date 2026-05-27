import React, { useEffect, useMemo, useState } from 'react';
import { Briefcase, CalendarClock, ExternalLink, FileText, Inbox, LogIn, RotateCcw, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import SEO from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../lib/api';

type ApplicationItem = {
  id: number;
  jobId: string | number;
  jobSnapshot?: {
    title?: string;
    company?: string;
    location?: string;
    salary?: string;
    applyUrl?: string;
  };
  job?: {
    title?: string;
    company?: string;
    location?: string;
    salary?: string;
    applyUrl?: string;
  };
  status: string;
  statusText?: string;
  appliedAt?: string;
  viewedAt?: string;
};

type ApplicationStats = {
  total?: number;
  applied?: number;
  viewed?: number;
  interview?: number;
  offer?: number;
  rejected?: number;
};

const statusTabs = [
  { key: '', label: '全部' },
  { key: 'applied', label: '已投递' },
  { key: 'viewed', label: '已查看' },
  { key: 'interview', label: '面试中' },
  { key: 'offer', label: 'Offer' },
  { key: 'rejected', label: '未通过' },
];

const statusStyles: Record<string, string> = {
  applied: 'bg-blue-50 text-blue-700 border-blue-100',
  viewed: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  interview: 'bg-amber-50 text-amber-700 border-amber-100',
  offer: 'bg-green-50 text-green-700 border-green-100',
  rejected: 'bg-gray-100 text-gray-600 border-gray-200',
};

const formatDate = (value?: string) => {
  if (!value) return '时间待同步';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
};

export default function Applications() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [statistics, setStatistics] = useState<ApplicationStats>({});
  const [activeStatus, setActiveStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const statCards = useMemo(() => [
    { label: '全部投递', value: statistics.total || 0 },
    { label: '已查看', value: statistics.viewed || 0 },
    { label: '面试中', value: statistics.interview || 0 },
    { label: 'Offer', value: statistics.offer || 0 },
  ], [statistics]);

  const loadApplications = async (status = activeStatus) => {
    if (!isAuthenticated) {
      setApplications([]);
      setStatistics({});
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const query = status ? `?status=${encodeURIComponent(status)}` : '';
      const response = await apiFetch(`/api/proxy/applications${query}`);
      setApplications(Array.isArray(response.data?.list) ? response.data.list : []);
      setStatistics(response.data?.statistics || {});
    } catch (error) {
      console.warn('Failed to load applications:', error);
      setApplications([]);
      setStatistics({});
      setErrorMessage('投递记录加载失败，请确认已登录后重试。');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications(activeStatus);
  }, [activeStatus, isAuthenticated]);

  const withdrawApplication = async (item: ApplicationItem) => {
    try {
      await apiFetch(`/api/proxy/applications/${item.id}`, { method: 'DELETE' });
      await loadApplications(activeStatus);
    } catch (error) {
      console.warn('Failed to withdraw application:', error);
      setErrorMessage('撤回失败：只有仍处于已投递状态的申请可以撤回。');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12">
      <SEO
        title="投递追踪"
        description="集中管理已投递职位，查看申请状态、投递时间和后续跟进节点。"
        canonical="https://www.zhiyincareer.com/applications"
        noindex
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full mb-4">
              <FileText className="w-4 h-4" />
              Application Tracker
            </div>
            <h1 className="text-3xl font-black text-gray-900">投递追踪</h1>
            <p className="text-gray-500 mt-3">记录官网投递动作，集中查看申请状态和后续跟进节点。</p>
          </div>

          {isAuthenticated && (
            <button
              onClick={() => loadApplications(activeStatus)}
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:border-primary/30 hover:text-primary transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              刷新记录
            </button>
          )}
        </section>

        {!isAuthenticated ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
            <LogIn className="mx-auto mb-4 h-12 w-12 text-primary/40" />
            <h2 className="text-lg font-bold text-gray-900">登录后查看投递记录</h2>
            <p className="mt-2 mb-6 text-sm text-gray-500">记录官网投递动作后，你可以在这里持续追踪申请进度。</p>
            <button onClick={() => openAuthModal('login')} className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-hover">
              立即登录
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {statCards.map((card) => (
                <div key={card.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="mt-2 text-2xl font-black text-gray-900">{card.value}</p>
                </div>
              ))}
            </div>

            <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
              {statusTabs.map((tab) => (
                <button
                  key={tab.key || 'all'}
                  onClick={() => setActiveStatus(tab.key)}
                  className={`shrink-0 rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                    activeStatus === tab.key ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {errorMessage && (
              <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
                {errorMessage}
              </div>
            )}

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-32 rounded-2xl border border-gray-100 bg-white animate-pulse" />
                ))}
              </div>
            ) : applications.length ? (
              <div className="space-y-4">
                {applications.map((item) => {
              const job = item.jobSnapshot?.title ? item.jobSnapshot : item.job || {};
              const statusLabel = item.statusText || statusTabs.find((tab) => tab.key === item.status)?.label || item.status || '已投递';
              return (
                <article key={item.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="font-bold text-gray-900 line-clamp-1">{job.title || `职位 #${item.jobId}`}</h2>
                        <p className="mt-1 text-sm text-gray-500">
                          {job.company || '公司待同步'}{job.location ? ` · ${job.location}` : ''}{job.salary ? ` · ${job.salary}` : ''}
                        </p>
                        <p className="mt-2 inline-flex items-center text-xs text-gray-400">
                          <CalendarClock className="mr-1 h-3.5 w-3.5" />
                          投递于 {formatDate(item.appliedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                      <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusStyles[item.status] || statusStyles.applied}`}>
                        {statusLabel}
                      </span>
                      <Link to={`/jobs/${item.jobId}`} className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-bold text-gray-700 hover:border-primary/30 hover:text-primary">
                        职位详情
                      </Link>
                      {job.applyUrl && (
                        <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-lg bg-gray-900 px-3 py-2 text-sm font-bold text-white hover:bg-black">
                          官网
                          <ExternalLink className="ml-1.5 h-4 w-4" />
                        </a>
                      )}
                      {item.status === 'applied' && (
                        <button
                          onClick={() => withdrawApplication(item)}
                          className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-bold text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="mr-1.5 h-4 w-4" />
                          撤回
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
                <Inbox className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                <h2 className="text-lg font-bold text-gray-900">暂无投递记录</h2>
                <p className="mt-2 text-sm text-gray-500">在职位详情页点击“记录投递并打开官网”后，记录会同步到这里。</p>
                <Link to="/jobs" className="mt-6 inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-hover">
                  去找职位
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
