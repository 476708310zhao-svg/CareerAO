import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Upload, 
  Sparkles, 
  Download, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Target,
  FileSearch,
  ChevronRight,
  MoreVertical
} from 'lucide-react';

export default function MyResume() {
  const navigate = useNavigate();
  const [resumes] = useState([
    {
      id: 1,
      name: 'Software Engineer - 2026 NG',
      targetRole: 'Software Engineer',
      lastModified: '2小时前',
      atsScore: 92,
      completion: 100,
      language: 'English',
      isDefault: true
    },
    {
      id: 2,
      name: 'Frontend Developer - React',
      targetRole: 'Frontend Engineer',
      lastModified: '3天前',
      atsScore: 85,
      completion: 90,
      language: 'English',
      isDefault: false
    },
    {
      id: 3,
      name: '产品经理实习 - 中文版',
      targetRole: 'Product Manager',
      lastModified: '1周前',
      atsScore: 78,
      completion: 85,
      language: 'Chinese',
      isDefault: false
    }
  ]);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center tracking-tight">
              <FileText className="w-8 h-8 text-primary mr-3" />
              我的简历 (My Resumes)
            </h1>
            <p className="text-gray-500 mt-2">
              管理您的多版本简历。使用 AI 一键润色经历，并进行 ATS 简历解析打分。
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center shadow-sm">
              <Upload className="w-4 h-4 mr-2" />
              导入 PDF
            </button>
            <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center shadow-sm shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" />
              新建简历
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Resume List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">简历库 ({resumes.length})</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resumes.map((resume) => (
                  <div key={resume.id} className="border border-gray-200 rounded-xl p-5 hover:border-primary/40 hover:shadow-md transition-all group relative bg-white">
                    {resume.isDefault && (
                      <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl">
                        默认投递
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start mb-3">
                      <div className="pr-6">
                        <h3 className="font-bold text-gray-900 text-base truncate group-hover:text-primary transition-colors">
                          {resume.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">目标岗位: {resume.targetRole}</p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">ATS Score</span>
                        <div className="flex items-center">
                          <span className={`font-bold text-lg ${resume.atsScore >= 90 ? 'text-green-500' : resume.atsScore >= 80 ? 'text-primary' : 'text-amber-500'}`}>
                            {resume.atsScore}
                          </span>
                          <span className="text-xs text-gray-400 ml-1">/100</span>
                        </div>
                      </div>
                      <div className="w-px h-8 bg-gray-100"></div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Language</span>
                        <span className="text-sm font-medium text-gray-700">{resume.language}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <span className="text-xs text-gray-400">更新于 {resume.lastModified}</span>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => navigate(`/my-resume/${resume.id}`)}
                          className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-md transition-colors" 
                          title="编辑"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => navigate(`/my-resume/${resume.id}`)}
                          className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-md transition-colors" 
                          title="AI 润色"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => navigate(`/my-resume/${resume.id}`)}
                          className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-md transition-colors" 
                          title="下载 PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Create New Card */}
                <div 
                  onClick={() => navigate('/my-resume/new')}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center text-center hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer min-h-[200px]"
                >
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-white">
                    <Plus className="w-6 h-6 text-gray-400 group-hover:text-primary" />
                  </div>
                  <h3 className="font-medium text-gray-900">创建新版本</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-[200px]">针对不同岗位定制专属简历，提高网申通过率</p>
                </div>
              </div>
            </div>

            {/* AI Polish Banner */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-bold flex items-center mb-2">
                    <Sparkles className="w-5 h-5 mr-2 text-yellow-300" />
                    AI 深度润色服务
                  </h3>
                  <p className="text-indigo-100 text-sm max-w-md">
                    运用哈佛商学院推荐的 XYZ 简历法则，将平淡的经历转化为强有力的数据驱动型描述。
                  </p>
                </div>
                <button className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-50 transition-colors shrink-0 shadow-sm">
                  一键优化简历
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Tools & ATS */}
          <div className="space-y-6">
            
            {/* ATS Checker */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <Target className="w-5 h-5 text-primary mr-2" />
                <h3 className="font-bold text-gray-900">ATS 匹配度检测</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                上传目标岗位的 Job Description，检测您的简历在企业 ATS 系统中的匹配得分。
              </p>
              
              <div className="space-y-3">
                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <label className="block text-xs font-medium text-gray-700 mb-1">选择简历</label>
                  <select className="w-full bg-transparent border-none outline-none text-sm text-gray-900">
                    <option>Software Engineer - 2026 NG</option>
                    <option>Frontend Developer - React</option>
                  </select>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <label className="block text-xs font-medium text-gray-700 mb-1">粘贴 Job Description</label>
                  <textarea 
                    className="w-full bg-transparent border-none outline-none text-sm text-gray-900 resize-none h-20"
                    placeholder="Paste the job requirements here..."
                  ></textarea>
                </div>

                <button className="w-full bg-gray-900 hover:bg-black text-white py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center">
                  <FileSearch className="w-4 h-4 mr-2" />
                  开始检测
                </button>
              </div>
            </div>

            {/* Resume Tips */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">高分简历指南</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 mr-2 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">使用强动词开头</h4>
                    <p className="text-xs text-gray-500 mt-0.5">避免使用 "Responsible for"，改用 "Architected", "Spearheaded", "Optimized"。</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 mr-2 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">量化你的成果</h4>
                    <p className="text-xs text-gray-500 mt-0.5">加入具体数据，例如 "提升了 40% 的加载速度" 或 "管理 $500K 的预算"。</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 mr-2 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">控制在一页纸内</h4>
                    <p className="text-xs text-gray-500 mt-0.5">对于应届生和少于 5 年经验的求职者，一页纸 (1-page) 是北美求职的黄金标准。</p>
                  </div>
                </li>
              </ul>
              <button className="w-full mt-4 py-2 text-sm font-medium text-primary hover:text-primary-hover flex items-center justify-center transition-colors">
                查看完整指南 <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
