import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  Bookmark, 
  BookmarkCheck,
  Share2, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Bot,
  Sparkles,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useFavorites } from '../utils/favorites';

// Mock data for the job
const MOCK_JOB_DETAIL = {
  id: 1,
  title: 'Software Engineer, New Grad 2026',
  company: 'Google',
  logo: 'G',
  location: 'Mountain View, CA',
  salary: '$130k - $180k',
  type: '全职',
  visa: '支持 H1B/OPT',
  tags: ['C++', 'Python', 'Distributed Systems', 'Go', 'Kubernetes'],
  postedAt: '2天前',
  description: `
    <h3>Minimum qualifications:</h3>
    <ul>
      <li>Bachelor's degree or equivalent practical experience.</li>
      <li>Experience working with one or more general purpose programming languages including but not limited to: Java, C/C++, C#, Objective C, Python, JavaScript, or Go.</li>
      <li>Experience working with data structures or algorithms.</li>
    </ul>
    <br/>
    <h3>Preferred qualifications:</h3>
    <ul>
      <li>Master's degree or PhD in Computer Science or related technical field.</li>
      <li>Experience with distributed systems and microservices architecture.</li>
      <li>Experience with cloud computing platforms (GCP, AWS, Azure).</li>
      <li>Interest and ability to learn other coding languages as needed.</li>
    </ul>
    <br/>
    <h3>About the job:</h3>
    <p>Google's software engineers develop the next-generation technologies that change how billions of users connect, explore, and interact with information and one another. Our products need to handle information at massive scale, and extend well beyond web search. We're looking for engineers who bring fresh ideas from all areas, including information retrieval, distributed computing, large-scale system design, networking and data storage, security, artificial intelligence, natural language processing, UI design and mobile; the list goes on and is growing every day.</p>
  `
};

// Mock data for JD Analysis
const MOCK_JD_ANALYSIS = {
  matchScore: 82,
  matchedSkills: ['Python', 'Data Structures', 'Algorithms', 'Java'],
  missingSkills: ['Distributed Systems', 'Go', 'GCP/AWS'],
  suggestions: [
    '您的简历中体现了扎实的 Python 和 Java 基础，这与该职位的核心要求高度匹配。',
    '建议在面试前突击复习分布式系统（Distributed Systems）的基础概念，这是该职位的加分项。',
    '可以准备一个使用过云服务（如 AWS 或 GCP）的个人项目经历，以弥补云平台经验的不足。'
  ]
};

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<typeof MOCK_JD_ANALYSIS | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  const jobId = id ? parseInt(id, 10) : MOCK_JOB_DETAIL.id;

  const handleAnalyzeJD = () => {
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setAnalysisResult(MOCK_JD_ANALYSIS);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleStartInterview = () => {
    // Navigate to AI Interview page with context
    navigate('/ai-interview', { 
      state: { 
        role: MOCK_JOB_DETAIL.title, 
        company: MOCK_JOB_DETAIL.company,
        jd: MOCK_JOB_DETAIL.description
      } 
    });
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-primary transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回职位列表
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Job Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-5">
                  <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-3xl font-bold text-primary shrink-0">
                    {MOCK_JOB_DETAIL.logo}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-deep mb-2">{MOCK_JOB_DETAIL.title}</h1>
                    <div className="flex flex-wrap items-center text-gray-600 text-sm gap-4">
                      <span className="flex items-center font-medium text-gray-900">
                        <Building2 className="w-4 h-4 mr-1.5 text-gray-400" />
                        {MOCK_JOB_DETAIL.company}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                        {MOCK_JOB_DETAIL.location}
                      </span>
                      <span className="flex items-center text-green-600 font-medium">
                        <DollarSign className="w-4 h-4 mr-1 text-green-500" />
                        {MOCK_JOB_DETAIL.salary}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => toggleFavorite(jobId)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isFavorite(jobId) 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-gray-50 text-gray-500 hover:text-primary hover:bg-primary/10'
                    }`}
                  >
                    {isFavorite(jobId) ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                  {MOCK_JOB_DETAIL.type}
                </span>
                <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
                  {MOCK_JOB_DETAIL.visa}
                </span>
                <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm flex items-center">
                  <Clock className="w-4 h-4 mr-1.5" />
                  {MOCK_JOB_DETAIL.postedAt}
                </span>
              </div>

              <div className="flex gap-4">
                <a 
                  href="https://careers.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold transition-colors shadow-sm flex items-center justify-center"
                >
                  前往官网投递
                  <ExternalLink className="w-4 h-4 ml-2 opacity-80" />
                </a>
                <button 
                  onClick={handleStartInterview}
                  className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 py-3 rounded-xl font-bold transition-colors flex items-center justify-center"
                >
                  <Bot className="w-5 h-5 mr-2" />
                  AI 模拟面试
                </button>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-deep mb-6">职位描述 (Job Description)</h2>
              <div 
                className="prose prose-gray max-w-none prose-h3:text-lg prose-h3:font-bold prose-h3:mb-3 prose-h3:mt-6 prose-li:text-gray-600 prose-p:text-gray-600"
                dangerouslySetInnerHTML={{ __html: MOCK_JOB_DETAIL.description }}
              />
            </div>
          </div>

          {/* Right Column: JD Analysis & Tools */}
          <div className="space-y-6">
            
            {/* AI JD Analysis Module */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-deep flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-indigo-500" />
                    AI 职位 JD 分析
                  </h3>
                </div>
                
                <p className="text-sm text-gray-500 mb-6">
                  提取 JD 核心要求，与您的默认简历进行智能比对，找出匹配优势与缺失项，为面试做足准备。
                </p>

                {!analysisResult && !isAnalyzing && (
                  <button 
                    onClick={handleAnalyzeJD}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition-colors shadow-sm flex items-center justify-center"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    一键分析匹配度
                  </button>
                )}

                {isAnalyzing && (
                  <div className="py-8 flex flex-col items-center justify-center space-y-4">
                    <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-sm text-indigo-600 font-medium animate-pulse">AI 正在深度解析 JD 与您的简历...</p>
                  </div>
                )}

                {analysisResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Match Score */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div>
                        <div className="text-sm font-medium text-gray-500 mb-1">简历匹配度</div>
                        <div className="text-3xl font-black text-deep">{analysisResult.matchScore}<span className="text-lg text-gray-400 font-medium">%</span></div>
                      </div>
                      <div className="w-16 h-16 relative flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={analysisResult.matchScore >= 80 ? '#10B981' : '#F59E0B'}
                            strokeWidth="3"
                            strokeDasharray={`${analysisResult.matchScore}, 100`}
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Matched Skills */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-1.5" />
                        已匹配技能 (优势)
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.matchedSkills.map(skill => (
                          <span key={skill} className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-100 rounded-md text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Missing Skills */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                        <XCircle className="w-4 h-4 text-red-500 mr-1.5" />
                        缺失技能 (需准备)
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.missingSkills.map(skill => (
                          <span key={skill} className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-100 rounded-md text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* AI Suggestions */}
                    <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
                      <h4 className="text-sm font-bold text-indigo-900 mb-3 flex items-center">
                        <Bot className="w-4 h-4 text-indigo-600 mr-1.5" />
                        AI 面试备考建议
                      </h4>
                      <ul className="space-y-2">
                        {analysisResult.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="text-xs text-indigo-800 leading-relaxed flex items-start">
                            <span className="mr-1.5 mt-0.5">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button 
                      onClick={handleStartInterview}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition-colors shadow-sm flex items-center justify-center group"
                    >
                      <Bot className="w-4 h-4 mr-2" />
                      针对此 JD 开始模拟面试
                      <ChevronRight className="w-4 h-4 ml-1 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Company Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-deep mb-4">关于公司</h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-xl font-bold text-primary shrink-0">
                  {MOCK_JOB_DETAIL.logo}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{MOCK_JOB_DETAIL.company}</div>
                  <a href="#" className="text-sm text-blue-600 hover:underline">查看公司主页</a>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Google 是一家跨国科技企业，业务范围涵盖互联网搜索、云计算、广告技术等领域，致力于整合全球信息，供大众使用，使人人受益。
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500 mb-1">规模</div>
                  <div className="font-medium text-gray-900">10000+ 人</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">行业</div>
                  <div className="font-medium text-gray-900">科技 / 互联网</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
