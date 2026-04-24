import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { 
  ArrowLeft, 
  Download, 
  Sparkles, 
  Save, 
  Plus, 
  Trash2,
  GripVertical,
  Bot,
  Wand2,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { apiFetch } from '../lib/api';

// Mock data for initial state
const MOCK_RESUME = {
  id: '1',
  name: 'Software Engineer - 2026 NG',
  targetRole: 'Software Engineer',
  personalInfo: {
    fullName: 'Alex Chen',
    email: 'alex.chen@email.com',
    phone: '(123) 456-7890',
    location: 'New York, NY',
    linkedin: 'linkedin.com/in/alexchen',
    portfolio: 'alexchen.dev'
  },
  education: [
    {
      id: 'e1',
      school: 'Columbia University',
      degree: 'Master of Science in Computer Science',
      date: 'Sep 2024 - May 2026',
      gpa: '3.9/4.0',
      details: 'Relevant Coursework: Algorithms, Distributed Systems, Machine Learning'
    }
  ],
  experience: [
    {
      id: 'exp1',
      company: 'TechFlow Inc.',
      role: 'Software Engineer Intern',
      date: 'May 2025 - Aug 2025',
      location: 'New York, NY',
      bullets: [
        'Developed a new feature for the user dashboard using React.',
        'Improved page load speed by 20%.',
        'Collaborated with backend team on API design.'
      ]
    }
  ],
  projects: [
    {
      id: 'p1',
      title: 'Real-time Chat Application',
      techStack: 'React, Node.js, Socket.io',
      date: 'Jan 2025 - Mar 2025',
      bullets: [
        'Built a real-time messaging platform supporting 500+ concurrent connections.',
        'Implemented end-to-end message encryption to ensure data privacy.'
      ]
    }
  ],
  skills: [
    { id: 's1', category: 'Languages', items: 'JavaScript, TypeScript, Python, Java, C++' },
    { id: 's2', category: 'Frameworks', items: 'React, Node.js, Express, Next.js, Spring Boot' },
    { id: 's3', category: 'Tools', items: 'Git, Docker, AWS, CI/CD, Figma' }
  ]
};

export default function ResumeEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [resume, setResume] = useState(MOCK_RESUME);
  const [isSaving, setIsSaving] = useState(false);
  const [isPolishing, setIsPolishing] = useState<string | null>(null); // ID of the experience/project being polished
  
  const [showAiDiagnosis, setShowAiDiagnosis] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `${resume.personalInfo.fullName.replace(' ', '_')}_Resume`,
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Mock save API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
    showToast('简历保存成功', 'success');
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsAnalyzing(false);
  };

  const handlePolish = async (itemType: 'experience' | 'project', id: string, currentBullets: string[]) => {
    setIsPolishing(id);
    try {
      const textToPolish = currentBullets.join('\n');
      const response = await apiFetch('/api/ai/polish-resume', {
        method: 'POST',
        body: JSON.stringify({ 
          text: textToPolish,
          role: resume.targetRole
        })
      });

      if (response.result) {
        // Parse the returned bullet points
        const newBullets = response.result
          .split('\n')
          .filter((line: string) => line.trim().startsWith('•') || line.trim().startsWith('-'))
          .map((line: string) => line.replace(/^[•-]\s*/, '').trim());

        if (newBullets.length > 0) {
          setResume(prev => ({
            ...prev,
            [itemType]: prev[itemType].map((item: any) => 
              item.id === id ? { ...item, bullets: newBullets } : item
            )
          }));
          showToast('AI 润色成功！', 'success');
        } else {
          showToast('AI 返回格式有误，请重试', 'error');
        }
      }
    } catch (error: any) {
      showToast(error.message || 'AI 润色失败', 'error');
    } finally {
      setIsPolishing(null);
    }
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setResume(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const updateExperience = (id: string, field: string, value: string | string[]) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const updateProject = (id: string, field: string, value: string | string[]) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.map(proj => 
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    }));
  };

  const handleBulletChange = (itemType: 'experience' | 'project', id: string, index: number, value: string) => {
    setResume(prev => ({
      ...prev,
      [itemType]: prev[itemType].map((item: any) => {
        if (item.id === id) {
          const newBullets = [...item.bullets];
          newBullets[index] = value;
          return { ...item, bullets: newBullets };
        }
        return item;
      })
    }));
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50 flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-16 z-40 shadow-sm shrink-0">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/my-resume')}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-gray-900">{resume.name}</h1>
            <p className="text-xs text-gray-500">自动保存于刚刚</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => {
              setShowAiDiagnosis(true);
              if (!showAiDiagnosis) handleRunAnalysis();
            }}
            className="flex items-center px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors shadow-sm"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            AI 简历诊断
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? '保存中...' : '保存'}
          </button>
          <button 
            onClick={() => handlePrint()}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            导出 PDF
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Panel: Editor */}
        <div className="w-1/2 overflow-y-auto border-r border-gray-200 bg-white p-6 relative">
          <div className="max-w-2xl mx-auto space-y-8 pb-20">
            
            {/* Personal Info */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-1.5 h-5 bg-primary rounded-full mr-2"></div>
                基本信息
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">姓名</label>
                  <input 
                    type="text" 
                    value={resume.personalInfo.fullName}
                    onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">邮箱</label>
                  <input 
                    type="email" 
                    value={resume.personalInfo.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">电话</label>
                  <input 
                    type="tel" 
                    value={resume.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">所在地</label>
                  <input 
                    type="text" 
                    value={resume.personalInfo.location}
                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>
            </section>

            {/* Experience */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <div className="w-1.5 h-5 bg-primary rounded-full mr-2"></div>
                  工作经历
                </h2>
                <button className="text-sm text-primary font-medium hover:text-primary-hover flex items-center">
                  <Plus className="w-4 h-4 mr-1" /> 添加经历
                </button>
              </div>

              <div className="space-y-6">
                {resume.experience.map((exp, index) => (
                  <div key={exp.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 relative group">
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab">
                      <GripVertical className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">公司名称</label>
                        <input 
                          type="text" 
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">职位</label>
                        <input 
                          type="text" 
                          value={exp.role}
                          onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-medium text-gray-700">经历描述 (Bullet Points)</label>
                        <button 
                          onClick={() => handlePolish('experience', exp.id, exp.bullets)}
                          disabled={isPolishing === exp.id}
                          className="flex items-center px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-medium hover:bg-indigo-100 transition-colors disabled:opacity-50 border border-indigo-100"
                        >
                          {isPolishing === exp.id ? (
                            <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-1.5"></div>
                          ) : (
                            <Sparkles className="w-3 h-3 mr-1.5" />
                          )}
                          {isPolishing === exp.id ? 'AI 润色中...' : 'AI 一键润色 (STAR法则)'}
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        {exp.bullets.map((bullet, bIndex) => (
                          <div key={bIndex} className="flex items-start space-x-2">
                            <span className="mt-2 text-gray-400">•</span>
                            <textarea 
                              value={bullet}
                              onChange={(e) => handleBulletChange('experience', exp.id, bIndex, e.target.value)}
                              className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none min-h-[60px]"
                            />
                            <button className="mt-2 text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button className="mt-2 text-xs text-gray-500 hover:text-primary font-medium flex items-center">
                        <Plus className="w-3 h-3 mr-1" /> 添加一条描述
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <div className="w-1.5 h-5 bg-primary rounded-full mr-2"></div>
                  项目经历
                </h2>
                <div className="flex items-center space-x-2">
                  <button className="text-sm text-indigo-600 bg-indigo-50 px-2 py-1 flex items-center rounded-md font-medium hover:bg-indigo-100 transition-colors">
                    <Sparkles className="w-3 h-3 mr-1" /> AI 自动生成项目
                  </button>
                  <button className="text-sm text-primary font-medium hover:text-primary-hover flex items-center px-2 py-1">
                    <Plus className="w-4 h-4 mr-1" /> 手动添加
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {resume.projects.map((proj, index) => (
                  <div key={proj.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 relative group">
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab">
                      <GripVertical className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">项目名称</label>
                        <input 
                          type="text" 
                          value={proj.title}
                          onChange={(e) => updateProject(proj.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">技术栈 (Tech Stack)</label>
                        <input 
                          type="text" 
                          value={proj.techStack}
                          onChange={(e) => updateProject(proj.id, 'techStack', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-medium text-gray-700">项目描述 (Bullet Points)</label>
                        <button 
                          onClick={() => handlePolish('project', proj.id, proj.bullets)}
                          disabled={isPolishing === proj.id}
                          className="flex items-center px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-medium hover:bg-indigo-100 transition-colors disabled:opacity-50 border border-indigo-100"
                        >
                          {isPolishing === proj.id ? (
                            <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-1.5"></div>
                          ) : (
                            <Sparkles className="w-3 h-3 mr-1.5" />
                          )}
                          {isPolishing === proj.id ? 'AI 润色中...' : 'AI 一键润色'}
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        {proj.bullets.map((bullet, bIndex) => (
                          <div key={bIndex} className="flex items-start space-x-2">
                            <span className="mt-2 text-gray-400">•</span>
                            <textarea 
                              value={bullet}
                              onChange={(e) => handleBulletChange('project', proj.id, bIndex, e.target.value)}
                              className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none min-h-[60px]"
                            />
                            <button className="mt-2 text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button className="mt-2 text-xs text-gray-500 hover:text-primary font-medium flex items-center">
                        <Plus className="w-3 h-3 mr-1" /> 添加一条描述
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>

        {/* Right Panel: Live Preview */}
        <div className="w-1/2 bg-gray-200 p-8 overflow-y-auto flex justify-center">
          <div 
            className="bg-white shadow-2xl w-full max-w-[800px] min-h-[1056px] p-12 text-gray-900"
            ref={contentRef}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {/* Resume Header */}
            <div className="text-center mb-6 border-b-2 border-gray-800 pb-4">
              <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">{resume.personalInfo.fullName}</h1>
              <div className="text-sm flex items-center justify-center space-x-2 text-gray-700">
                <span>{resume.personalInfo.email}</span>
                <span>|</span>
                <span>{resume.personalInfo.phone}</span>
                <span>|</span>
                <span>{resume.personalInfo.location}</span>
                <span>|</span>
                <a href={`https://${resume.personalInfo.linkedin}`} className="text-blue-600 hover:underline">{resume.personalInfo.linkedin}</a>
              </div>
            </div>

            {/* Education */}
            <div className="mb-6">
              <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1 text-gray-800">Education</h2>
              {resume.education.map(edu => (
                <div key={edu.id} className="mb-3">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-base">{edu.school}</h3>
                    <span className="text-sm font-medium">{edu.date}</span>
                  </div>
                  <div className="flex justify-between items-baseline mt-0.5">
                    <span className="italic text-sm">{edu.degree}</span>
                    <span className="text-sm font-medium">GPA: {edu.gpa}</span>
                  </div>
                  <p className="text-sm mt-1 text-gray-700">{edu.details}</p>
                </div>
              ))}
            </div>

            {/* Experience */}
            <div className="mb-6">
              <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1 text-gray-800">Experience</h2>
              {resume.experience.map(exp => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-base">{exp.company}</h3>
                    <span className="text-sm font-medium">{exp.date}</span>
                  </div>
                  <div className="flex justify-between items-baseline mt-0.5 mb-2">
                    <span className="italic text-sm">{exp.role}</span>
                    <span className="text-sm">{exp.location}</span>
                  </div>
                  <ul className="list-disc list-outside ml-4 space-y-1">
                    {exp.bullets.map((bullet, i) => (
                      <li key={i} className="text-sm text-gray-800 leading-relaxed pl-1">{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Projects */}
            <div className="mb-6">
              <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1 text-gray-800">Projects</h2>
              {resume.projects.map(proj => (
                <div key={proj.id} className="mb-4">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-base">
                      {proj.title} <span className="font-normal italic text-sm ml-2">| {proj.techStack}</span>
                    </h3>
                    <span className="text-sm font-medium">{proj.date}</span>
                  </div>
                  <ul className="list-disc list-outside ml-4 space-y-1">
                    {proj.bullets.map((bullet, i) => (
                      <li key={i} className="text-sm text-gray-800 leading-relaxed pl-1">{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1 text-gray-800">Skills</h2>
              <div className="space-y-1.5">
                {resume.skills.map(skill => (
                  <div key={skill.id} className="text-sm">
                    <span className="font-bold">{skill.category}: </span>
                    <span className="text-gray-800">{skill.items}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* AI Diagnosis Floating Panel */}
        {showAiDiagnosis && (
          <div className="absolute top-0 right-0 h-full w-[400px] bg-white border-l border-gray-200 shadow-[-10px_0_30px_rgba(0,0,0,0.05)] z-50 flex flex-col transform transition-transform animate-in slide-in-from-right-full">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-indigo-50/50">
              <h3 className="font-bold text-indigo-900 flex items-center">
                <Wand2 className="w-5 h-5 mr-2 text-indigo-600" />
                AI 简历诊断报告
              </h3>
              <button onClick={() => setShowAiDiagnosis(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center h-full text-indigo-600">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                  <p className="font-medium animate-pulse">正在进行全维深度扫描...</p>
                  <p className="text-xs text-gray-400 mt-2">评估关键字匹配度与排版格式</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center pb-6 border-b border-gray-100">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg shadow-green-200 mb-3">
                      <span className="text-4xl font-black">88</span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg">匹配度: 良好 (Good)</h4>
                    <p className="text-xs text-gray-500 mt-1">基于 {resume.targetRole} 的 ATS 标准评估</p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3 text-sm flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-1.5" />
                      当前优势 (Strengths)
                    </h4>
                    <ul className="space-y-2">
                       <li className="bg-green-50 text-green-700 text-xs px-3 py-2 rounded-lg border border-green-100">结构清晰，采用哈佛标准一页纸格式。</li>
                       <li className="bg-green-50 text-green-700 text-xs px-3 py-2 rounded-lg border border-green-100">项目中提到了前端核心框架 (React, Node.js)。</li>
                    </ul>
                  </div>

                  <div>
                     <h4 className="font-bold text-gray-900 mb-3 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 text-amber-500 mr-1.5" />
                      高优先级修改建议 (Critical Fixes)
                    </h4>
                    <div className="space-y-3">
                      <div className="border border-amber-100 bg-amber-50 rounded-xl p-3">
                        <h5 className="font-bold text-amber-800 text-xs mb-1">经历缺乏量化数据</h5>
                        <p className="text-amber-700 text-xs leading-relaxed">你的实习经历中写了 "Improved page load speed by 20%"，这很好，但最好能补充是通过什么具体技术（如 Lazy Loading, Webpack 优化）实现的，以便体现工程深度。</p>
                        <button className="mt-2 text-xs font-bold text-indigo-600 flex items-center hover:text-indigo-700">
                          <Sparkles className="w-3 h-3 mr-1" /> 去修改该经历
                        </button>
                      </div>
                      <div className="border border-amber-100 bg-amber-50 rounded-xl p-3">
                        <h5 className="font-bold text-amber-800 text-xs mb-1">缺少系统架构关键词</h5>
                        <p className="text-amber-700 text-xs leading-relaxed">目标岗位 {resume.targetRole} 通常要求了解系统级别知识。建议在“Real-time Chat”项目中补充关于并发处理或数据库结构设计的细节。</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
