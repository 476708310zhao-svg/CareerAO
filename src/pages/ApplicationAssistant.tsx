import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Briefcase, Zap, CheckCircle2, AlertCircle, Copy, Sparkles } from 'lucide-react';

export default function ApplicationAssistant() {
  const [jdText, setJdText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = () => {
    if (!jdText.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Sparkles className="w-8 h-8 text-blue-600 mr-3" />
            网申助手 (Application Assistant)
          </h1>
          <p className="text-gray-600 mt-2">智能解析 Job Description，一键生成高匹配度 OQ (Open Questions) 回答与投递建议。</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel: Input */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Briefcase className="w-5 h-5 text-blue-500 mr-2" />
                1. 输入岗位描述 (JD)
              </h2>
              <textarea
                className="w-full h-64 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                placeholder="请在此粘贴目标岗位的 Job Description..."
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
              ></textarea>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 text-indigo-500 mr-2" />
                2. 选择目标简历
              </h2>
              <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                <option>Alex_Chen_Software_Engineer_2026.pdf</option>
                <option>Alex_Chen_Frontend_Dev.pdf</option>
              </select>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !jdText.trim()}
              className={`w-full py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center transition-all ${
                isAnalyzing || !jdText.trim() ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30'
              }`}
            >
              {isAnalyzing ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  AI 正在深度解析...
                </span>
              ) : (
                <span className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" /> 开始 AI 智能解析
                </span>
              )}
            </button>
          </div>

          {/* Right Panel: Results */}
          <div className="w-full lg:w-1/2">
            {!showResults && !isAnalyzing && (
              <div className="h-full bg-white rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center p-12 text-center min-h-[500px]">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-10 h-10 text-blue-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">等待解析</h3>
                <p className="text-gray-500">粘贴 JD 并点击左侧按钮，AI 将为您生成深度匹配分析与网申 OQ 回答。</p>
              </div>
            )}

            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Match Score */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-1">岗位匹配度分析</h2>
                    <p className="text-sm text-gray-500">基于您的简历与 JD 核心要求的对比</p>
                  </div>
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="40" cy="40" r="36" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                      <circle cx="40" cy="40" r="36" stroke="#3b82f6" strokeWidth="8" fill="none" strokeDasharray="226" strokeDashoffset="45" className="transition-all duration-1000" />
                    </svg>
                    <span className="absolute text-xl font-bold text-blue-600">85%</span>
                  </div>
                </div>

                {/* OQ Generation */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 text-blue-500 mr-2" />
                    高频 OQ (Open Questions) 预测与回答
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <h4 className="font-bold text-sm text-gray-900 mb-2">Q1: Why are you interested in this role at our company?</h4>
                      <p className="text-sm text-gray-700 leading-relaxed mb-3">
                        "With a strong background in React and a passion for building scalable user interfaces, I am drawn to TechFlow's mission of revolutionizing digital workflows. My recent internship experience where I optimized frontend performance by 30% aligns perfectly with the responsibilities outlined in this JD..."
                      </p>
                      <button className="text-xs flex items-center text-blue-600 hover:text-blue-700 font-medium">
                        <Copy className="w-3.5 h-3.5 mr-1" /> 复制回答
                      </button>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <h4 className="font-bold text-sm text-gray-900 mb-2">Q2: Describe a challenging technical problem you solved.</h4>
                      <p className="text-sm text-gray-700 leading-relaxed mb-3">
                        "During my capstone project, we faced significant state management issues as the application scaled. I took the initiative to migrate our local state to Redux Toolkit, which not only resolved the bugs but also improved data flow predictability. This experience prepared me for the complex architecture mentioned in your requirements..."
                      </p>
                      <button className="text-xs flex items-center text-gray-500 hover:text-gray-700 font-medium">
                        <Copy className="w-3.5 h-3.5 mr-1" /> 复制回答
                      </button>
                    </div>
                  </div>
                </div>

                {/* Advice */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
                    AI 投递建议
                  </h2>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 shrink-0" />
                      <span className="text-sm text-gray-700">您的 <strong>React</strong> 和 <strong>TypeScript</strong> 技能与 JD 高度匹配。</span>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-orange-500 mr-2 shrink-0" />
                      <span className="text-sm text-gray-700">JD 中提到了 <strong>GraphQL</strong>，您的简历中未体现。建议在网申补充材料或面试中准备相关知识。</span>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-orange-500 mr-2 shrink-0" />
                      <span className="text-sm text-gray-700">建议在简历的 Project 经历中，将 "Improved performance" 替换为更具体的量化指标。</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
