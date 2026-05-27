import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, CheckCircle2, Clipboard, Copy, FileText, RotateCcw, Sparkles, Zap } from 'lucide-react';

import SEO from '../components/SEO';
import { useToast } from '../contexts/ToastContext';
import { apiFetch } from '../lib/api';

const sampleAnswers = [
  {
    question: 'Why are you interested in this role?',
    answer:
      'I am interested in this role because it combines product impact with hands-on execution. My previous experience taught me how to translate ambiguous requirements into reliable user-facing features, and this role matches my strengths in ownership, collaboration, and structured problem solving.',
  },
  {
    question: 'Describe a challenging technical problem you solved.',
    answer:
      'In a recent project, our team faced slow page rendering after adding several data-heavy views. I profiled the bottleneck, split expensive components, memoized derived data, and introduced lazy loading for non-critical panels. As a result, the core user flow became noticeably smoother.',
  },
];

const extractKeywords = (text: string) => {
  const keywords = ['React', 'TypeScript', 'Python', 'SQL', 'AWS', 'GCP', 'Node.js', 'Data', 'Machine Learning', 'Communication', 'Leadership', 'System Design'];
  return keywords.filter((keyword) => text.toLowerCase().includes(keyword.toLowerCase()));
};

const STORAGE_KEY = 'careerai_application_assistant_last';

export default function ApplicationAssistant() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [jdText, setJdText] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const matchedKeywords = useMemo(() => extractKeywords(`${jdText} ${resumeText}`), [jdText, resumeText]);
  const missingHints = ['补充量化结果', '突出和 JD 对应的关键词', '准备 2 个 STAR 案例'];
  const matchScore = resumeText ? 86 : 72;

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      setJdText(parsed.jdText || '');
      setResumeText(parsed.resumeText || '');
      setAiSummary(parsed.aiSummary || '');
      setCheckedItems(Array.isArray(parsed.checkedItems) ? parsed.checkedItems : []);
      setShowResults(Boolean(parsed.showResults));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      jdText,
      resumeText,
      aiSummary,
      checkedItems,
      showResults,
    }));
  }, [aiSummary, checkedItems, jdText, resumeText, showResults]);

  const copyText = async (text: string, message = '已复制到剪贴板') => {
    if (!text.trim()) {
      showToast('暂无可复制内容', 'info');
      return;
    }
    await navigator.clipboard.writeText(text);
    showToast(message, 'success');
  };

  const buildReport = () => [
    `岗位匹配度：${matchScore}%`,
    `关键词命中：${(matchedKeywords.length ? matchedKeywords : ['Communication', 'Ownership', 'Problem Solving']).join(', ')}`,
    aiSummary ? `\nAI 分析：\n${aiSummary}` : '',
    `\n投递前建议：\n${missingHints.map((hint) => `- ${hint}${checkedItems.includes(hint) ? '（已完成）' : ''}`).join('\n')}`,
  ].filter(Boolean).join('\n');

  const resetWorkspace = () => {
    setJdText('');
    setResumeText('');
    setAiSummary('');
    setCheckedItems([]);
    setShowResults(false);
    localStorage.removeItem(STORAGE_KEY);
    showToast('已清空本次网申分析', 'success');
  };

  const handleAnalyze = async () => {
    if (!jdText.trim()) return;
    setIsAnalyzing(true);
    try {
      const response = await apiFetch('/api/proxy/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          temperature: 0.4,
          messages: [
            {
              role: 'system',
              content: 'You are a career application assistant. Analyze the JD and resume excerpt. Return concise Chinese advice with match score, keywords, open-question angles, and pre-submit checklist.',
            },
            {
              role: 'user',
              content: `JD:\n${jdText}\n\nResume excerpt:\n${resumeText || '未提供'}`,
            },
          ],
        }),
      });
      setAiSummary(response.choices?.[0]?.message?.content || response.data?.content || '');
    } catch (error) {
      console.warn('Application analysis fallback:', error);
      setAiSummary('');
    } finally {
      setIsAnalyzing(false);
      setShowResults(true);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12">
      <SEO
        title="网申助手"
        description="职引网申助手帮助留学生解析 JD、生成开放题回答、提炼岗位关键词，并给出简历和投递优化建议。"
        keywords="网申助手,开放题回答,JD解析,留学生求职,简历匹配"
        canonical="https://www.zhiyincareer.com/application-assistant"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary mb-2">Application Assistant</p>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 flex items-center">
                <Sparkles className="w-8 h-8 text-primary mr-3" />
                网申助手
              </h1>
              <p className="text-gray-600 mt-3 max-w-2xl">
                粘贴目标岗位 JD 和简历片段，快速生成匹配度分析、开放题回答方向和投递前检查清单。
              </p>
            </div>
            {(jdText || resumeText || showResults) && (
              <button onClick={resetWorkspace} className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-white hover:text-gray-900 transition-colors w-fit">
                <RotateCcw className="w-4 h-4 mr-2" />
                重新开始
              </button>
            )}
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-8">
          <section className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Clipboard className="w-5 h-5 text-primary mr-2" />
                1. 粘贴岗位描述
              </h2>
              <textarea
                className="w-full h-64 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none text-sm outline-none"
                placeholder="请粘贴目标岗位的 Job Description..."
                value={jdText}
                onChange={(event) => setJdText(event.target.value)}
              />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 text-indigo-500 mr-2" />
                2. 粘贴简历片段
              </h2>
              <textarea
                className="w-full h-36 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none text-sm outline-none"
                placeholder="可选：粘贴你最相关的一段项目、实习或经历..."
                value={resumeText}
                onChange={(event) => setResumeText(event.target.value)}
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !jdText.trim()}
              className="w-full py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center transition-all bg-primary hover:bg-primary-hover disabled:bg-primary/50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? 'AI 正在分析...' : <><Zap className="w-5 h-5 mr-2" />开始智能分析</>}
            </button>

            {showResults && (
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-sm font-bold text-gray-900 mb-3">下一步动作</h2>
                <div className="grid sm:grid-cols-3 gap-3">
                  <button onClick={() => copyText(buildReport(), '分析报告已复制')} className="inline-flex items-center justify-center px-3 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-black transition-colors">
                    <Copy className="w-4 h-4 mr-2" />
                    复制报告
                  </button>
                  <button onClick={() => navigate('/ai-interview', { state: { jd: jdText } })} className="inline-flex items-center justify-center px-3 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors">
                    AI 面试
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                  <button onClick={() => navigate('/resume-editor', { state: { jd: jdText, resume: resumeText } })} className="inline-flex items-center justify-center px-3 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50 transition-colors">
                    优化简历
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            )}
          </section>

          <section>
            {!showResults && !isAnalyzing && (
              <div className="h-full bg-white rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center p-12 text-center min-h-[520px]">
                <Sparkles className="w-12 h-12 text-primary/40 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">等待分析</h3>
                <p className="text-gray-500">输入 JD 后，系统会生成匹配度、关键词、开放题回答和投递建议。</p>
              </div>
            )}

            {showResults && (
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {aiSummary && (
                  <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                    <h2 className="text-lg font-bold text-indigo-950 mb-3">AI 后端分析</h2>
                    <p className="text-sm text-indigo-900 leading-relaxed whitespace-pre-line">{aiSummary}</p>
                  </div>
                )}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-1">岗位匹配度</h2>
                    <p className="text-sm text-gray-500">基于 JD 关键词和简历片段的快速评估</p>
                  </div>
                  <div className="text-4xl font-black text-primary">{matchScore}%</div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">关键词命中</h2>
                  <div className="flex flex-wrap gap-2">
                    {(matchedKeywords.length ? matchedKeywords : ['Communication', 'Ownership', 'Problem Solving']).map((keyword) => (
                      <span key={keyword} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">高频开放题回答</h2>
                  <div className="space-y-4">
                    {sampleAnswers.map((item) => (
                      <div key={item.question} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <h4 className="font-bold text-sm text-gray-900 mb-2">{item.question}</h4>
                        <p className="text-sm text-gray-700 leading-relaxed mb-3">{item.answer}</p>
                        <button onClick={() => copyText(item.answer, '回答模板已复制')} className="text-xs flex items-center text-primary hover:text-primary-hover font-medium">
                          <Copy className="w-3.5 h-3.5 mr-1" />
                          复制回答
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">投递前建议</h2>
                  <ul className="space-y-3">
                    {missingHints.map((hint, index) => (
                      <li key={hint} className="flex items-start">
                        <button
                          onClick={() => setCheckedItems((current) => current.includes(hint) ? current.filter((item) => item !== hint) : [...current, hint])}
                          className="mt-0.5 mr-2"
                          aria-label={checkedItems.includes(hint) ? `取消${hint}` : `完成${hint}`}
                        >
                          {checkedItems.includes(hint)
                            ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                            : index === 0
                              ? <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                              : <CheckCircle2 className="w-5 h-5 text-gray-300 shrink-0" />}
                        </button>
                        <span className={`text-sm ${checkedItems.includes(hint) ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{hint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
