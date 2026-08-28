import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  Copy,
  ExternalLink,
  FilePlus2,
  Inbox,
  LogIn,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import SEO from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { apiFetch } from '../lib/api';

type ApplicationJob = {
  title?: string;
  company?: string;
  location?: string;
  salary?: string;
  applyUrl?: string;
};

type ApplicationItem = {
  id: string;
  user_id?: string;
  jobId: string | number;
  jobSnapshot?: ApplicationJob;
  job?: ApplicationJob;
  status: string;
  statusText?: string;
  note?: string;
  nextAction?: string;
  source?: string;
  resumeVersionId?: string;
  interviewDate?: string;
  appliedAt?: string;
  viewedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

type DraftApplication = {
  jobTitle?: string;
  companyName?: string;
  jobUrl?: string;
  targetRegion?: string;
  jobDescription?: string;
  analysisSummary?: string;
  status?: string;
  source?: string;
};

const statusTabs = [
  { key: '', label: '全部' },
  { key: 'saved', label: '已收藏' },
  { key: 'applied', label: '已投递' },
  { key: 'screening', label: '简历筛选中' },
  { key: 'oa', label: 'OA' },
  { key: 'interview_1', label: '一面' },
  { key: 'interview_2', label: '二面' },
  { key: 'final', label: '终面' },
  { key: 'offer', label: 'Offer' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'archived', label: '已放弃' },
];

const statusStyles: Record<string, string> = {
  saved: 'bg-slate-50 text-slate-700 border-slate-200',
  applied: 'bg-blue-50 text-blue-700 border-blue-100',
  screening: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  oa: 'bg-violet-50 text-violet-700 border-violet-100',
  interview_1: 'bg-amber-50 text-amber-700 border-amber-100',
  interview_2: 'bg-orange-50 text-orange-700 border-orange-100',
  final: 'bg-pink-50 text-pink-700 border-pink-100',
  offer: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  rejected: 'bg-gray-100 text-gray-600 border-gray-200',
  archived: 'bg-gray-100 text-gray-500 border-gray-200',
};

const defaultForm = {
  title: '',
  company: '',
  location: '',
  applyUrl: '',
  status: 'saved',
  note: '',
};

const formatDate = (value?: string) => {
  if (!value) return '待记录';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getJob = (item: ApplicationItem): ApplicationJob => (
  item.jobSnapshot?.title ? item.jobSnapshot : item.job || {}
);

const getStatusLabel = (status: string) => (
  statusTabs.find((tab) => tab.key === status)?.label || status || '已投递'
);

const nextActionLabel = (item: ApplicationItem) => {
  if (item.nextAction) return item.nextAction;
  if (item.status === 'saved') return '先完成 JD 解析和简历匹配，再决定是否投递';
  if (item.status === 'applied') return '建议 5-7 天后检查邮箱或官网状态';
  if (item.status === 'screening') return '准备岗位相关项目讲述，等待进一步通知';
  if (item.status === 'oa') return '整理 OA 截止时间，提前刷对应题型';
  if (item.status === 'interview_1') return '准备自我介绍、项目深挖和 2 个 STAR 案例';
  if (item.status === 'interview_2') return '复盘一面问题，补强系统/业务理解';
  if (item.status === 'final') return '准备动机、团队匹配和 offer 期望';
  if (item.status === 'offer') return '对比薪资、签证、城市和团队成长空间';
  if (item.status === 'rejected') return '复盘关键词和简历匹配度，调整下一批投递';
  if (item.status === 'archived') return '保留记录，避免后续重复投入';
  return '持续跟进申请状态';
};

const getTrackerKey = (userKey: string) => `zhiyin_application_tracker_${userKey}`;

const normalizeLocalRecord = (value: any, userKey: string): ApplicationItem | null => {
  if (!value || typeof value !== 'object') return null;
  const now = new Date().toISOString();
  const job = value.jobSnapshot || value.job || {};
  const status = String(value.status || 'saved');
  return {
    id: String(value.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
    user_id: String(value.user_id || userKey),
    jobId: value.jobId || value.job_id || `manual-${Date.now()}`,
    jobSnapshot: {
      title: String(job.title || value.job_title || ''),
      company: String(job.company || value.company_name || ''),
      location: String(job.location || value.location || ''),
      salary: String(job.salary || value.salary || ''),
      applyUrl: String(job.applyUrl || value.job_url || value.applyUrl || ''),
    },
    status,
    statusText: String(value.statusText || getStatusLabel(status)),
    note: String(value.note || ''),
    nextAction: String(value.nextAction || ''),
    source: String(value.source || 'local'),
    resumeVersionId: String(value.resumeVersionId || ''),
    interviewDate: String(value.interviewDate || ''),
    appliedAt: String(value.appliedAt || value.createdAt || now),
    viewedAt: String(value.viewedAt || ''),
    createdAt: String(value.createdAt || now),
    updatedAt: String(value.updatedAt || now),
  };
};

const readLocalRecords = (storageKey: string, userKey: string) => {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return Array.isArray(parsed)
      ? parsed.map((item) => normalizeLocalRecord(item, userKey)).filter((item): item is ApplicationItem => Boolean(item))
      : [];
  } catch {
    localStorage.removeItem(storageKey);
    return [];
  }
};

const writeLocalRecords = (storageKey: string, records: ApplicationItem[]) => {
  localStorage.setItem(storageKey, JSON.stringify(records.slice(0, 300)));
};

const mergeRecords = (primary: ApplicationItem[], secondary: ApplicationItem[]) => {
  const byId = new Map<string, ApplicationItem>();
  [...secondary, ...primary].forEach((record) => {
    byId.set(String(record.id), record);
  });
  return Array.from(byId.values()).sort((a, b) => (
    Date.parse(b.updatedAt || b.createdAt || b.appliedAt || '') -
    Date.parse(a.updatedAt || a.createdAt || a.appliedAt || '')
  ));
};

export default function Applications() {
  const { isAuthenticated, openAuthModal, user } = useAuth();
  const { showToast } = useToast();
  const userKey = useMemo(() => String(user?.id || user?.email || 'guest'), [user?.email, user?.id]);
  const storageKey = useMemo(() => getTrackerKey(userKey), [userKey]);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [activeStatus, setActiveStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [form, setForm] = useState(defaultForm);

  const importDraftRecord = (records: ApplicationItem[]) => {
    const rawDraft = sessionStorage.getItem('applicationTrackerDraft');
    if (!rawDraft) return records;

    try {
      const draft = JSON.parse(rawDraft) as DraftApplication;
      const now = new Date().toISOString();
      const record = normalizeLocalRecord({
        id: `jd-${Date.now()}`,
        user_id: userKey,
        jobId: `jd-${Date.now()}`,
        jobSnapshot: {
          title: draft.jobTitle || 'Target Role',
          company: draft.companyName || 'Target Company',
          location: draft.targetRegion || '',
          applyUrl: draft.jobUrl || '',
        },
        status: draft.status || 'saved',
        note: draft.analysisSummary || draft.jobDescription || '',
        nextAction: '先完成简历匹配，再决定投递节奏',
        source: draft.source || 'jd-analyzer',
        appliedAt: now,
        createdAt: now,
        updatedAt: now,
      }, userKey);
      sessionStorage.removeItem('applicationTrackerDraft');
      if (!record) return records;

      const exists = records.some((item) => {
        const job = getJob(item);
        return (
          job.applyUrl && record.jobSnapshot?.applyUrl && job.applyUrl === record.jobSnapshot.applyUrl
        ) || (
          job.title === record.jobSnapshot?.title && job.company === record.jobSnapshot?.company
        );
      });
      return exists ? records : [record, ...records];
    } catch {
      sessionStorage.removeItem('applicationTrackerDraft');
      return records;
    }
  };

  const loadApplications = async (status = activeStatus) => {
    setIsLoading(true);
    setErrorMessage('');
    const localRecords = importDraftRecord(readLocalRecords(storageKey, userKey));

    if (!isAuthenticated) {
      const nextRecords = status ? localRecords.filter((record) => record.status === status) : localRecords;
      setApplications(nextRecords);
      writeLocalRecords(storageKey, localRecords);
      setIsLoading(false);
      return;
    }

    try {
      const query = new URLSearchParams({ user_id: userKey });
      if (status) query.set('status', status);
      const response = await apiFetch(`/api/proxy/applications?${query.toString()}`);
      const remoteRecords = Array.isArray(response.data?.list)
        ? response.data.list.map((item: any) => normalizeLocalRecord(item, userKey)).filter(Boolean)
        : [];
      const mergedRecords = mergeRecords(remoteRecords as ApplicationItem[], localRecords);
      setApplications(mergedRecords);
      writeLocalRecords(storageKey, mergedRecords);
    } catch (error) {
      console.warn('Failed to load applications:', error);
      setApplications(status ? localRecords.filter((record) => record.status === status) : localRecords);
      setErrorMessage('在线记录暂时不可用，已显示本机保存的投递追踪。');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications(activeStatus);
  }, [activeStatus, isAuthenticated, storageKey]);

  const allLocalRecords = () => readLocalRecords(storageKey, userKey);

  const persistRecords = (records: ApplicationItem[]) => {
    writeLocalRecords(storageKey, records);
    setApplications(activeStatus ? records.filter((record) => record.status === activeStatus) : records);
  };

  const saveManualRecord = async () => {
    if (!form.title.trim() || !form.company.trim()) {
      showToast('请先填写公司和岗位名称', 'info');
      return;
    }

    const now = new Date().toISOString();
    const record = normalizeLocalRecord({
      id: `manual-${Date.now()}`,
      user_id: userKey,
      jobId: `manual-${Date.now()}`,
      jobSnapshot: {
        title: form.title,
        company: form.company,
        location: form.location,
        applyUrl: form.applyUrl,
      },
      status: form.status,
      note: form.note,
      source: 'manual',
      appliedAt: now,
      createdAt: now,
      updatedAt: now,
    }, userKey);
    if (!record) return;

    let nextRecord = record;
    if (isAuthenticated) {
      try {
        const response = await apiFetch('/api/proxy/applications', {
          method: 'POST',
          body: JSON.stringify({
            user_id: userKey,
            jobId: record.jobId,
            jobSnapshot: record.jobSnapshot,
            status: record.status,
            note: record.note,
            source: record.source,
          }),
        });
        nextRecord = normalizeLocalRecord(response.data, userKey) || record;
      } catch (error) {
        console.warn('Application save fallback:', error);
        setErrorMessage('在线保存暂时不可用，已保存到本机。');
      }
    }

    persistRecords(mergeRecords([nextRecord], allLocalRecords()));
    setForm(defaultForm);
    showToast('投递记录已保存', 'success');
  };

  const updateStatus = async (item: ApplicationItem, status: string) => {
    const nextItem = {
      ...item,
      status,
      statusText: getStatusLabel(status),
      updatedAt: new Date().toISOString(),
    };
    persistRecords(allLocalRecords().map((record) => (record.id === item.id ? nextItem : record)));

    if (isAuthenticated) {
      try {
        await apiFetch(`/api/proxy/applications/${encodeURIComponent(item.id)}`, {
          method: 'PATCH',
          body: JSON.stringify({
            user_id: userKey,
            status,
          }),
        });
      } catch (error) {
        console.warn('Application status sync fallback:', error);
        setErrorMessage('状态已保存在本机，在线同步稍后可重试。');
      }
    }
  };

  const deleteRecord = async (item: ApplicationItem) => {
    persistRecords(allLocalRecords().filter((record) => record.id !== item.id));
    if (isAuthenticated) {
      try {
        await apiFetch(`/api/proxy/applications/${encodeURIComponent(item.id)}?user_id=${encodeURIComponent(userKey)}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.warn('Application delete sync fallback:', error);
      }
    }
    showToast('记录已删除', 'success');
  };

  const visibleApplications = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    if (!keyword) return applications;
    return applications.filter((item) => {
      const job = getJob(item);
      return [job.title, job.company, job.location, item.statusText, item.status, item.note]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword));
    });
  }, [applications, searchQuery]);

  const statistics = useMemo(() => {
    const source = activeStatus ? allLocalRecords() : applications;
    const count = (statuses: string[]) => source.filter((record) => statuses.includes(record.status)).length;
    return {
      total: source.length,
      saved: count(['saved']),
      active: count(['applied', 'screening', 'oa', 'interview_1', 'interview_2', 'final']),
      interview: count(['oa', 'interview_1', 'interview_2', 'final']),
      offer: count(['offer']),
    };
  }, [applications, activeStatus, storageKey]);

  const pipelineProgress = useMemo(() => {
    const records = allLocalRecords();
    if (!records.length) return 0;
    const weights: Record<string, number> = {
      saved: 10,
      applied: 25,
      screening: 40,
      oa: 55,
      interview_1: 70,
      interview_2: 82,
      final: 92,
      offer: 100,
      rejected: 100,
      archived: 100,
    };
    const total = records.reduce((sum, record) => sum + (weights[record.status] || 20), 0);
    return Math.round(total / records.length);
  }, [applications, storageKey]);

  const copyFollowUpList = async () => {
    if (!visibleApplications.length) {
      showToast('暂无可复制的投递记录', 'info');
      return;
    }

    const text = visibleApplications.map((item, index) => {
      const job = getJob(item);
      return [
        `${index + 1}. ${job.company || '公司待补'} - ${job.title || '岗位待补'}`,
        `状态：${getStatusLabel(item.status)}`,
        `记录时间：${formatDate(item.appliedAt)}`,
        `下一步：${nextActionLabel(item)}`,
        item.note ? `备注：${item.note}` : '',
        job.applyUrl ? `官网链接：${job.applyUrl}` : '',
      ].filter(Boolean).join('\n');
    }).join('\n\n');

    await navigator.clipboard.writeText(text);
    showToast('跟进清单已复制', 'success');
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] pt-24 pb-12">
      <SEO
        title="投递追踪"
        description="集中管理已收藏和已投递岗位，跟踪申请状态、下一步动作、官网链接和面试进展。"
        canonical="https://www.zhiyincareer.com/application-tracker"
        noindex
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
              <Briefcase className="h-4 w-4" />
              Application Tracker
            </div>
            <h1 className="text-3xl font-black text-gray-950 sm:text-5xl">投递追踪</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600">
              把 JD 解析、简历匹配和官网投递串起来，集中管理岗位状态、下一步动作和复盘备注。
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {!isAuthenticated && (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="inline-flex h-10 items-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:border-primary/30 hover:text-primary"
              >
                <LogIn className="mr-2 h-4 w-4" />
                登录同步
              </button>
            )}
            <button
              type="button"
              onClick={copyFollowUpList}
              className="inline-flex h-10 items-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition hover:border-primary/30 hover:text-primary"
            >
              <Copy className="mr-2 h-4 w-4" />
              复制跟进清单
            </button>
            <button
              type="button"
              onClick={() => loadApplications(activeStatus)}
              className="inline-flex h-10 items-center rounded-lg bg-gray-900 px-4 text-sm font-bold text-white transition hover:bg-black"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              刷新
            </button>
          </div>
        </section>

        {!isAuthenticated && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">
            当前使用本机记录。登录后可尝试同步到账号级记录，未登录也可以继续规划和跟进。
          </div>
        )}

        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            ['全部岗位', statistics.total],
            ['已收藏', statistics.saved],
            ['进行中', statistics.active],
            ['面试 / Offer', statistics.interview + statistics.offer],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-gray-500">{label}</p>
              <p className="mt-2 text-3xl font-black text-gray-950">{value}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="flex items-center text-lg font-black text-gray-950">
                <FilePlus2 className="mr-2 h-5 w-5 text-primary" />
                新增岗位
              </h2>
              <div className="mt-4 space-y-3">
                <input
                  value={form.company}
                  onChange={(event) => setForm({ ...form, company: event.target.value })}
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  placeholder="公司"
                />
                <input
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  placeholder="岗位名称"
                />
                <input
                  value={form.location}
                  onChange={(event) => setForm({ ...form, location: event.target.value })}
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  placeholder="地点 / 地区"
                />
                <input
                  value={form.applyUrl}
                  onChange={(event) => setForm({ ...form, applyUrl: event.target.value })}
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  placeholder="官网投递链接"
                />
                <select
                  value={form.status}
                  onChange={(event) => setForm({ ...form, status: event.target.value })}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                >
                  {statusTabs.filter((tab) => tab.key).map((tab) => (
                    <option key={tab.key} value={tab.key}>{tab.label}</option>
                  ))}
                </select>
                <textarea
                  value={form.note}
                  onChange={(event) => setForm({ ...form, note: event.target.value })}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  placeholder="备注：投递策略、岗位亮点、需要准备的材料..."
                />
                <button
                  type="button"
                  onClick={saveManualRecord}
                  className="flex h-11 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-black text-white transition hover:bg-primary-hover"
                >
                  保存到追踪
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-black text-gray-950">整体推进</h2>
                  <p className="mt-1 text-xs text-gray-500">按当前状态估算投递 pipeline 完成度</p>
                </div>
                <span className="text-2xl font-black text-primary">{pipelineProgress}%</span>
              </div>
              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pipelineProgress}%` }} />
              </div>
            </div>
          </aside>

          <section className="space-y-4">
            <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
              <div className="flex items-center rounded-lg bg-gray-50 px-4 py-3">
                <Search className="mr-3 h-5 w-5 shrink-0 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="搜索公司、岗位、地点、状态或备注..."
                  className="w-full bg-transparent text-sm text-gray-900 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {statusTabs.map((tab) => (
                <button
                  key={tab.key || 'all'}
                  type="button"
                  onClick={() => setActiveStatus(tab.key)}
                  className={`shrink-0 rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                    activeStatus === tab.key
                      ? 'bg-primary text-white'
                      : 'border border-gray-200 bg-white text-gray-600 hover:text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {errorMessage && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-900">
                {errorMessage}
              </div>
            )}

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-36 animate-pulse rounded-lg border border-gray-200 bg-white" />
                ))}
              </div>
            ) : visibleApplications.length ? (
              <div className="space-y-4">
                {visibleApplications.map((item) => {
                  const job = getJob(item);
                  return (
                    <article key={item.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div className="min-w-0">
                          <div className="flex items-start gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <Briefcase className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                              <h2 className="truncate text-lg font-black text-gray-950">{job.title || '岗位待补'}</h2>
                              <p className="mt-1 text-sm font-bold text-gray-500">
                                {job.company || '公司待补'}{job.location ? ` · ${job.location}` : ''}{job.salary ? ` · ${job.salary}` : ''}
                              </p>
                              <p className="mt-2 inline-flex items-center text-xs font-bold text-gray-400">
                                <CalendarClock className="mr-1 h-3.5 w-3.5" />
                                记录于 {formatDate(item.appliedAt)}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 rounded-lg bg-gray-50 px-3 py-2">
                            <p className="flex items-start gap-2 text-sm font-bold leading-6 text-gray-700">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                              {nextActionLabel(item)}
                            </p>
                            {item.note && <p className="mt-2 text-sm leading-6 text-gray-500">{item.note}</p>}
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 xl:w-64">
                          <span className={`w-fit rounded-full border px-3 py-1 text-xs font-black ${statusStyles[item.status] || statusStyles.saved}`}>
                            {getStatusLabel(item.status)}
                          </span>
                          <select
                            value={item.status}
                            onChange={(event) => updateStatus(item, event.target.value)}
                            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm font-bold text-gray-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                          >
                            {statusTabs.filter((tab) => tab.key).map((tab) => (
                              <option key={tab.key} value={tab.key}>{tab.label}</option>
                            ))}
                          </select>
                          <div className="flex flex-wrap gap-2">
                            {job.applyUrl && (
                              <a
                                href={job.applyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-9 items-center rounded-lg bg-gray-900 px-3 text-sm font-bold text-white transition hover:bg-black"
                              >
                                官网
                                <ExternalLink className="ml-1.5 h-4 w-4" />
                              </a>
                            )}
                            {String(item.jobId).startsWith('manual') || String(item.jobId).startsWith('jd') ? null : (
                              <Link
                                to={`/jobs/${item.jobId}`}
                                className="inline-flex h-9 items-center rounded-lg border border-gray-200 px-3 text-sm font-bold text-gray-700 transition hover:border-primary/30 hover:text-primary"
                              >
                                职位详情
                              </Link>
                            )}
                            <button
                              type="button"
                              onClick={() => deleteRecord(item)}
                              className="inline-flex h-9 items-center rounded-lg border border-gray-200 px-3 text-sm font-bold text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="mr-1.5 h-4 w-4" />
                              删除
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
                <Inbox className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                <h2 className="text-lg font-black text-gray-950">还没有投递记录</h2>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  可以手动新增岗位，也可以从 JD Analyzer 保存岗位，再进入这里跟进状态。
                </p>
                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link to="/jd-analyzer" className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-black text-white transition hover:bg-primary-hover">
                    去解析 JD
                  </Link>
                  <Link to="/jobs" className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 px-5 text-sm font-bold text-gray-700 transition hover:border-primary/30 hover:text-primary">
                    浏览职位
                  </Link>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
