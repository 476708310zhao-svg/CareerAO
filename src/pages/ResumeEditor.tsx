import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { ArrowLeft, Download, Save, Sparkles, Wand2 } from 'lucide-react';

import SEO from '../components/SEO';
import { useToast } from '../contexts/ToastContext';
import { apiFetch } from '../lib/api';

const initialResume = {
  name: 'Software Engineer - 2026 NG',
  targetRole: 'Software Engineer',
  personalInfo: {
    fullName: 'Alex Chen',
    email: 'alex.chen@email.com',
    phone: '(123) 456-7890',
    location: 'New York, NY',
    linkedin: 'linkedin.com/in/alexchen',
  },
  education: {
    school: 'Columbia University',
    degree: 'M.S. in Computer Science',
    date: 'Sep 2024 - May 2026',
    details: 'Relevant Coursework: Algorithms, Distributed Systems, Machine Learning',
  },
  experience: {
    company: 'TechFlow Inc.',
    role: 'Software Engineer Intern',
    date: 'May 2025 - Aug 2025',
    location: 'New York, NY',
    bullets: [
      'Developed a user dashboard feature using React and TypeScript.',
      'Improved page load speed by 20% through component splitting and lazy loading.',
      'Collaborated with backend engineers to define API contracts and reduce integration issues.',
    ],
  },
  project: {
    title: 'Real-time Chat Application',
    techStack: 'React, Node.js, Socket.io',
    date: 'Jan 2025 - Mar 2025',
    bullets: ['Built a messaging platform supporting 500+ concurrent connections.', 'Implemented end-to-end message encryption to improve data privacy.'],
  },
  skills: 'JavaScript, TypeScript, React, Node.js, Python, SQL, AWS, Docker, Git',
};

const personalInfoLabels: Record<string, string> = {
  fullName: '姓名',
  email: '邮箱',
  phone: '电话',
  location: '所在地',
  linkedin: 'LinkedIn',
};

export default function ResumeEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [resume, setResume] = useState(initialResume);
  const [isSaving, setIsSaving] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const [diagnosisOpen, setDiagnosisOpen] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id || id === 'new') return;
    apiFetch(`/api/proxy/resumes/${id}`)
      .then((response) => {
        if (response.data?.data) {
          setResume((current) => ({ ...current, ...response.data.data }));
        }
      })
      .catch((error) => console.warn('Resume detail fallback:', error));
  }, [id]);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `${resume.personalInfo.fullName.replace(' ', '_')}_Resume`,
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const endpoint = id && id !== 'new' ? `/api/proxy/resumes/${id}` : '/api/proxy/resumes';
      await apiFetch(endpoint, {
        method: id && id !== 'new' ? 'PUT' : 'POST',
        body: JSON.stringify({
          name: resume.name,
          language: 'en',
          data: resume,
        }),
      });
      showToast('简历已同步到后端', 'success');
    } catch (error) {
      console.warn('Resume save fallback:', error);
      showToast('当前未登录或同步失败，已保留本地编辑内容', 'info');
    } finally {
      setIsSaving(false);
    }
  };

  const updatePersonalInfo = (field: keyof typeof resume.personalInfo, value: string) => {
    setResume((current) => ({ ...current, personalInfo: { ...current.personalInfo, [field]: value } }));
  };

  const updateExperienceBullet = (index: number, value: string) => {
    setResume((current) => ({
      ...current,
      experience: {
        ...current.experience,
        bullets: current.experience.bullets.map((bullet, bulletIndex) => (bulletIndex === index ? value : bullet)),
      },
    }));
  };

  const polishExperience = async () => {
    setIsPolishing(true);
    try {
      const response = await apiFetch('/api/proxy/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          temperature: 0.35,
          messages: [
            {
              role: 'system',
              content: 'Rewrite resume bullets in English. Make them concise, action-oriented, quantified when possible. Return only bullet lines.',
            },
            {
              role: 'user',
              content: `Target role: ${resume.targetRole}\nBullets:\n${resume.experience.bullets.join('\n')}`,
            },
          ],
        }),
      });
      const raw = response.choices?.[0]?.message?.content || response.data?.content || '';
      const bullets = raw
        .split('\n')
        .map((line: string) => line.replace(/^[-*\u2022\s]*/, '').trim())
        .filter(Boolean);
      if (bullets.length) {
        setResume((current) => ({ ...current, experience: { ...current.experience, bullets: bullets.slice(0, 4) } }));
        showToast('AI 润色成功', 'success');
      } else {
        showToast('AI 暂未返回可用结果，请稍后重试', 'error');
      }
    } catch (error: any) {
      showToast(error.message || 'AI 润色失败', 'error');
    } finally {
      setIsPolishing(false);
    }
  };

  return (
    <main className="pt-16 min-h-screen bg-gray-50 flex flex-col">
      <SEO title={id === 'new' ? '新建简历' : '编辑简历'} canonical="https://www.zhiyincareer.com/my-resume" noindex />
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sticky top-16 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/my-resume')} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" aria-label="返回简历库">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-gray-900">{resume.name}</h1>
            <p className="text-xs text-gray-500">编辑后可导出 PDF，也可用于网申助手和投递流程。</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setDiagnosisOpen((value) => !value)} className="flex items-center px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-100">
            <Wand2 className="w-4 h-4 mr-2" />
            AI 诊断
          </button>
          <button onClick={handleSave} disabled={isSaving} className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? '保存中...' : '保存'}
          </button>
          <button onClick={() => handlePrint()} className="flex items-center px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover">
            <Download className="w-4 h-4 mr-2" />
            导出 PDF
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr] flex-1 overflow-hidden">
        <section className="overflow-y-auto bg-white p-6 border-r border-gray-200">
          <div className="max-w-2xl mx-auto space-y-8 pb-20">
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">基本信息</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {Object.entries(resume.personalInfo).map(([key, value]) => (
                  <label key={key} className="block">
                    <span className="block text-xs font-medium text-gray-700 mb-1">{personalInfoLabels[key] || key}</span>
                    <input value={value} onChange={(event) => updatePersonalInfo(key as keyof typeof resume.personalInfo, event.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                  </label>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">工作经历</h2>
                <button onClick={polishExperience} disabled={isPolishing} className="flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 disabled:opacity-50">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  {isPolishing ? 'AI 润色中...' : 'AI 润色'}
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input value={resume.experience.company} onChange={(event) => setResume((current) => ({ ...current, experience: { ...current.experience, company: event.target.value } }))} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" />
                <input value={resume.experience.role} onChange={(event) => setResume((current) => ({ ...current, experience: { ...current.experience, role: event.target.value } }))} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" />
              </div>
              <div className="space-y-3">
                {resume.experience.bullets.map((bullet, index) => (
                  <textarea key={index} value={bullet} onChange={(event) => updateExperienceBullet(index, event.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none min-h-[70px]" />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">技能</h2>
              <textarea value={resume.skills} onChange={(event) => setResume((current) => ({ ...current, skills: event.target.value }))} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none resize-none h-24" />
            </section>
          </div>
        </section>

        <section className="bg-gray-200 p-6 lg:p-8 overflow-y-auto">
          <div ref={contentRef} className="bg-white shadow-2xl w-full max-w-[800px] min-h-[1056px] p-10 mx-auto text-gray-900">
            <div className="text-center mb-6 border-b-2 border-gray-800 pb-4">
              <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">{resume.personalInfo.fullName}</h1>
              <div className="text-sm flex flex-wrap items-center justify-center gap-x-2 text-gray-700">
                <span>{resume.personalInfo.email}</span><span>|</span><span>{resume.personalInfo.phone}</span><span>|</span><span>{resume.personalInfo.location}</span>
              </div>
            </div>
            <section className="mb-6">
              <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Education</h2>
              <div className="flex justify-between gap-4"><strong>{resume.education.school}</strong><span>{resume.education.date}</span></div>
              <p className="italic text-sm">{resume.education.degree}</p>
              <p className="text-sm mt-1 text-gray-700">{resume.education.details}</p>
            </section>
            <section className="mb-6">
              <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Experience</h2>
              <div className="flex justify-between gap-4"><strong>{resume.experience.company}</strong><span>{resume.experience.date}</span></div>
              <p className="italic text-sm mb-2">{resume.experience.role} · {resume.experience.location}</p>
              <ul className="list-disc ml-5 space-y-1">{resume.experience.bullets.map((bullet) => <li key={bullet} className="text-sm leading-relaxed">{bullet}</li>)}</ul>
            </section>
            <section className="mb-6">
              <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Projects</h2>
              <div className="flex justify-between gap-4"><strong>{resume.project.title}</strong><span>{resume.project.date}</span></div>
              <p className="italic text-sm mb-2">{resume.project.techStack}</p>
              <ul className="list-disc ml-5 space-y-1">{resume.project.bullets.map((bullet) => <li key={bullet} className="text-sm leading-relaxed">{bullet}</li>)}</ul>
            </section>
            <section>
              <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Skills</h2>
              <p className="text-sm">{resume.skills}</p>
            </section>
          </div>
        </section>

        {diagnosisOpen && (
          <aside className="fixed right-4 bottom-4 w-[calc(100%-2rem)] max-w-sm bg-white border border-gray-100 rounded-2xl shadow-2xl p-5 z-50">
            <h3 className="font-bold text-indigo-900 flex items-center mb-3"><Wand2 className="w-5 h-5 mr-2 text-indigo-600" />AI 简历诊断</h3>
            <div className="text-4xl font-black text-primary mb-2">88</div>
            <p className="text-sm text-gray-600 mb-4">整体结构清晰，建议继续补充项目结果指标和系统设计关键词。</p>
            <ul className="space-y-2 text-xs text-gray-600 list-disc pl-4">
              <li>把 Improved 改写为更具体的动作和结果。</li>
              <li>补充并发、缓存、数据库设计等关键词。</li>
              <li>每条经历尽量包含 Action + Result。</li>
            </ul>
          </aside>
        )}
      </div>
    </main>
  );
}
