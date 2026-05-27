import React, { useEffect, useMemo, useState } from 'react';
import { Bell, CheckCheck, Clock, LogIn, MailOpen, RefreshCw } from 'lucide-react';

import SEO from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../lib/api';

type MessageItem = {
  id: number;
  type?: string;
  title?: string;
  content?: string;
  isRead?: boolean;
  createdAt?: string;
};

const typeLabels: Record<string, string> = {
  system: '系统通知',
  job: '职位提醒',
  application: '投递进展',
  payment: '会员订单',
  campus: '校招提醒',
};

const formatTime = (value?: string) => {
  if (!value) return '时间待同步';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '时间待同步';
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function Messages() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const messageFilters = useMemo(() => [
    { key: 'all', label: '全部', count: messages.length },
    { key: 'unread', label: '未读', count: unreadCount },
    ...Object.entries(typeLabels).map(([key, label]) => ({
      key,
      label,
      count: messages.filter((message) => (message.type || 'system') === key).length,
    })).filter((item) => item.count > 0),
  ], [messages, unreadCount]);

  const filteredMessages = useMemo(() => {
    if (activeFilter === 'all') return messages;
    if (activeFilter === 'unread') return messages.filter((message) => !message.isRead);
    return messages.filter((message) => (message.type || 'system') === activeFilter);
  }, [activeFilter, messages]);

  const groupedMessages = useMemo(() => {
    return filteredMessages.reduce<Record<string, MessageItem[]>>((groups, message) => {
      const key = message.type || 'system';
      if (!groups[key]) groups[key] = [];
      groups[key].push(message);
      return groups;
    }, {});
  }, [filteredMessages]);

  const loadMessages = async () => {
    if (!isAuthenticated) {
      setMessages([]);
      setUnreadCount(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await apiFetch('/api/proxy/messages');
      const list = Array.isArray(response.data?.list) ? response.data.list : [];
      setMessages(list);
      setUnreadCount(Number(response.data?.unreadCount) || list.filter((item: MessageItem) => !item.isRead).length);
    } catch (error) {
      console.warn('Failed to load messages:', error);
      setMessages([]);
      setUnreadCount(0);
      setErrorMessage('消息中心加载失败，请稍后重试。');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [isAuthenticated]);

  const markMessageRead = async (message: MessageItem) => {
    if (message.isRead) return;
    setMessages((current) => current.map((item) => (item.id === message.id ? { ...item, isRead: true } : item)));
    setUnreadCount((current) => Math.max(0, current - 1));

    try {
      await apiFetch(`/api/proxy/messages/${message.id}/read`, { method: 'PUT' });
    } catch (error) {
      console.warn('Failed to mark message read:', error);
      setMessages((current) => current.map((item) => (item.id === message.id ? { ...item, isRead: false } : item)));
      setUnreadCount((current) => current + 1);
      setErrorMessage('标记已读失败，请稍后再试。');
    }
  };

  const markAllRead = async () => {
    if (!unreadCount) return;
    setIsMarkingAll(true);
    const previousMessages = messages;
    const previousUnreadCount = unreadCount;
    setMessages((current) => current.map((item) => ({ ...item, isRead: true })));
    setUnreadCount(0);

    try {
      await apiFetch('/api/proxy/messages/read-all', { method: 'PUT' });
    } catch (error) {
      console.warn('Failed to mark all messages read:', error);
      setMessages(previousMessages);
      setUnreadCount(previousUnreadCount);
      setErrorMessage('全部已读操作失败，请稍后再试。');
    } finally {
      setIsMarkingAll(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12">
      <SEO
        title="消息中心"
        description="查看职位提醒、系统通知、投递进展与会员订单消息，及时跟进求职关键节点。"
        canonical="https://www.zhiyincareer.com/messages"
        noindex
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full mb-4">
              <Bell className="w-4 h-4" />
              Notification Center
            </div>
            <h1 className="text-3xl font-black text-gray-900">消息中心</h1>
            <p className="text-gray-500 mt-3">统一接收职位提醒、系统通知、校招订阅和订单状态更新。</p>
          </div>

          {isAuthenticated && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={loadMessages}
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:border-primary/30 hover:text-primary transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                刷新
              </button>
              <button
                onClick={markAllRead}
                disabled={!unreadCount || isMarkingAll}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-gray-300 transition-colors"
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                全部已读
              </button>
            </div>
          )}
        </section>

        {!isAuthenticated ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
            <LogIn className="mx-auto mb-4 h-12 w-12 text-primary/40" />
            <h2 className="text-lg font-bold text-gray-900">登录后查看消息</h2>
            <p className="mt-2 mb-6 text-sm text-gray-500">职位提醒、投递进展和会员订单状态会同步到你的账号。</p>
            <button onClick={() => openAuthModal('login')} className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-hover">
              立即登录
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">全部消息</p>
                <p className="mt-2 text-2xl font-black text-gray-900">{messages.length}</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">未读消息</p>
                <p className="mt-2 text-2xl font-black text-primary">{unreadCount}</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">消息类型</p>
                <p className="mt-2 text-2xl font-black text-gray-900">{Object.keys(groupedMessages).length}</p>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
                {errorMessage}
              </div>
            )}

            <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
              {messageFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`shrink-0 rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                    activeFilter === filter.key ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:text-primary'
                  }`}
                >
                  {filter.label}
                  <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${activeFilter === filter.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>{filter.count}</span>
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-28 rounded-2xl border border-gray-100 bg-white animate-pulse" />
                ))}
              </div>
            ) : filteredMessages.length ? (
              <div className="space-y-6">
                {Object.entries(groupedMessages).map(([type, items]) => (
                  <section key={type}>
                    <h2 className="mb-3 text-sm font-black text-gray-500">{typeLabels[type] || '其他消息'}</h2>
                    <div className="space-y-3">
                      {items.map((message) => (
                        <button
                          key={message.id}
                          onClick={() => markMessageRead(message)}
                          className={`w-full rounded-2xl border p-5 text-left shadow-sm transition-colors ${
                            message.isRead
                              ? 'border-gray-100 bg-white hover:border-gray-200'
                              : 'border-primary/20 bg-primary/[0.04] hover:border-primary/40'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                {!message.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                                <h3 className="font-bold text-gray-900 line-clamp-1">{message.title || '未命名消息'}</h3>
                              </div>
                              <p className="mt-2 text-sm leading-6 text-gray-600">{message.content || '暂无消息内容。'}</p>
                            </div>
                            <span className="inline-flex shrink-0 items-center text-xs font-medium text-gray-400">
                              <Clock className="mr-1 h-3.5 w-3.5" />
                              {formatTime(message.createdAt)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
                <MailOpen className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                <h2 className="text-lg font-bold text-gray-900">暂无匹配消息</h2>
                <p className="mt-2 text-sm text-gray-500">切换筛选条件，或订阅校招、收藏职位、记录投递后查看更新。</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
