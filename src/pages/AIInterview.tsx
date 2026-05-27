import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AlertCircle, BarChart, Bot, CheckCircle2, Code2, Copy, MessageSquare, Mic, Play, Send, Square, Target } from 'lucide-react';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from 'recharts';

import SEO from '../components/SEO';
import { useToast } from '../contexts/ToastContext';
import { apiFetch } from '../lib/api';

type InterviewMessage = { role: 'ai' | 'user'; text: string };

const interviewTypes = [
  { id: 'Behavioral', name: '行为面试', icon: MessageSquare, desc: '练习 STAR 表达、冲突处理、领导力和团队协作' },
  { id: 'Technical', name: '算法与技术面', icon: Code2, desc: '围绕技术基础、项目细节和编码思路进行追问' },
  { id: 'SystemDesign', name: '系统设计', icon: BarChart, desc: '练习架构拆解、容量估算、取舍分析和扩展性' },
];

const radarData = [
  { subject: '结构化表达', score: 84, fullMark: 100 },
  { subject: '岗位匹配', score: 88, fullMark: 100 },
  { subject: '专业深度', score: 76, fullMark: 100 },
  { subject: '沟通清晰度', score: 90, fullMark: 100 },
  { subject: '案例质量', score: 82, fullMark: 100 },
];

export default function AIInterview() {
  const location = useLocation();
  const { showToast } = useToast();
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isInterviewEnded, setIsInterviewEnded] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Software Engineer');
  const [selectedCompany, setSelectedCompany] = useState('Google');
  const [selectedType, setSelectedType] = useState('Behavioral');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(3);
  const [jdContext, setJdContext] = useState('');
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(typeof window !== 'undefined' ? window.speechSynthesis : null);

  useEffect(() => {
    if (location.state) {
      const { role, company, jd } = location.state as any;
      if (role) setSelectedRole(role);
      if (company) setSelectedCompany(company);
      if (jd) setJdContext(jd);
    }
  }, [location.state]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onresult = (event: any) => {
      let current = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        current += event.results[i][0].transcript;
      }
      setTranscript(current);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    return () => recognition.stop();
  }, []);

  const activeType = useMemo(() => interviewTypes.find((type) => type.id === selectedType) || interviewTypes[0], [selectedType]);

  const speak = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synthRef.current.getVoices();
    const englishVoice = voices.find((voice) => voice.lang.startsWith('en-'));
    if (englishVoice) utterance.voice = englishVoice;
    synthRef.current.speak(utterance);
  };

  const startInterview = () => {
    const greeting = `Welcome to your ${activeType.name} mock interview for ${selectedRole} at ${selectedCompany}. Please introduce yourself briefly, then we will start the first question.`;
    setMessages([{ role: 'ai', text: greeting }]);
    setIsInterviewEnded(false);
    setIsInterviewStarted(true);
    speak(greeting);
  };

  const sendAnswer = async (answer: string) => {
    const userText = answer.trim();
    if (!userText) return;
    const nextMessages: InterviewMessage[] = [...messages, { role: 'user', text: userText }];
    setMessages(nextMessages);
    setTextInput('');
    setTranscript('');
    setIsAiThinking(true);
    try {
      const response = await apiFetch('/api/proxy/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          temperature: 0.7,
          messages: [
            {
              role: 'system',
              content: [
                `You are an AI interviewer for ${selectedCompany}.`,
                `Target role: ${selectedRole}. Interview type: ${selectedType}. Difficulty: ${selectedDifficulty}.`,
                `Ask one focused question or follow-up at a time. Give concise feedback when useful.`,
                `Limit the mock session to about ${questionCount} core questions.`,
                jdContext ? `Job description context: ${jdContext}` : '',
              ].filter(Boolean).join('\n'),
            },
            ...nextMessages.map((message) => ({
              role: message.role === 'ai' ? 'assistant' : 'user',
              content: message.text,
            })),
          ],
        }),
      });
      const reply =
        response.choices?.[0]?.message?.content ||
        'Thanks. Let me ask a follow-up: can you quantify the impact and explain what trade-off you made?';
      setMessages((current) => [...current, { role: 'ai', text: reply }]);
      speak(reply);
    } catch (error) {
      console.error('Interview chat failed:', error);
      const fallback = 'I could not connect to the AI service right now. Please continue by explaining your approach, impact, and reflection.';
      setMessages((current) => [...current, { role: 'ai', text: fallback }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (transcript.trim()) sendAnswer(transcript);
      return;
    }
    setTranscript('');
    recognitionRef.current.start();
    setIsListening(true);
  };

  const buildInterviewReport = () => [
    `AI 模拟面试复盘`,
    `公司：${selectedCompany}`,
    `岗位：${selectedRole}`,
    `类型：${activeType.name}`,
    `难度：${selectedDifficulty}`,
    '',
    '综合反馈：表达结构比较清晰，下一步建议加强结果量化，把“做了什么”转化为“带来了什么业务或工程价值”。',
    '',
    '面试记录：',
    ...messages.map((message, index) => `${index + 1}. ${message.role === 'ai' ? 'AI 面试官' : '我'}：${message.text}`),
  ].join('\n');

  const copyInterviewReport = async () => {
    await navigator.clipboard.writeText(buildInterviewReport());
    showToast('面试复盘已复制', 'success');
  };

  if (isInterviewEnded) {
    return (
      <main className="pt-24 pb-16 min-h-screen bg-gray-50">
        <SEO title="AI 面试报告" canonical="https://www.zhiyincareer.com/ai-interview" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-black text-gray-900 mb-2">模拟面试已结束</h1>
            <p className="text-gray-500">{selectedCompany} · {selectedRole} · {activeType.name}</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-6 flex items-center"><Target className="w-5 h-5 text-primary mr-2" />综合表现</h2>
              <div className="text-center mb-4">
                <div className="text-6xl font-black text-primary mb-2">86</div>
                <div className="text-sm font-medium text-gray-400 uppercase tracking-widest">综合得分</div>
              </div>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar dataKey="score" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center"><MessageSquare className="w-5 h-5 text-indigo-500 mr-2" />AI 反馈</h2>
                <p className="text-gray-700 leading-relaxed text-sm">
                  你的表达结构比较清晰，能够说明背景和行动。下一步建议加强结果量化，把“做了什么”进一步转化为“带来了什么业务或工程价值”。
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <h3 className="font-bold text-green-800 text-sm mb-2">优势</h3>
                  <ul className="text-green-700 text-xs space-y-1 list-disc pl-4">
                    <li>回答有主线，能围绕岗位展开</li>
                    <li>沟通清晰，节奏稳定</li>
                    <li>能主动补充项目背景</li>
                  </ul>
                </div>
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <h3 className="font-bold text-amber-800 text-sm mb-2">待提升</h3>
                  <ul className="text-amber-700 text-xs space-y-1 list-disc pl-4">
                    <li>结果指标还可以更具体</li>
                    <li>技术取舍需要讲出原因</li>
                    <li>结尾可加入反思和下一步</li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={copyInterviewReport} className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black font-bold inline-flex items-center justify-center">
                  <Copy className="w-4 h-4 mr-2" />
                  复制复盘报告
                </button>
                <button onClick={() => { setIsInterviewStarted(false); setIsInterviewEnded(false); }} className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover font-bold">
                  再练一次
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isInterviewStarted) {
    const latestMessage = messages[messages.length - 1];
    return (
      <main className="pt-16 min-h-screen bg-gray-950 flex flex-col">
        <SEO title="AI 模拟面试进行中" canonical="https://www.zhiyincareer.com/ai-interview" />
        <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center"><Bot className="text-primary w-6 h-6" /></div>
            <div>
              <h1 className="font-bold text-lg text-white">AI Interviewer - {selectedCompany}</h1>
              <p className="text-sm text-gray-400">{selectedRole} · {activeType.name}</p>
            </div>
          </div>
          <button onClick={() => { setIsInterviewStarted(false); setIsInterviewEnded(true); synthRef.current?.cancel(); }} className="px-4 py-2 rounded-lg bg-red-500/10 text-red-300 border border-red-500/20 text-sm font-bold">
            结束并生成报告
          </button>
        </div>

        <div className="flex-1 grid lg:grid-cols-[1fr_380px] overflow-hidden">
          <section className="relative flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-950 p-6">
            <div className={`w-36 h-36 rounded-full bg-primary/10 flex items-center justify-center ${isAiThinking ? 'animate-pulse' : ''}`}>
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.6)]">
                <Bot className="w-12 h-12 text-white" />
              </div>
            </div>
            <p className="mt-5 text-gray-400 text-sm font-medium tracking-widest uppercase">
              {isAiThinking ? 'Thinking...' : isListening ? 'Listening...' : 'Waiting...'}
            </p>
            <div className="mt-8 max-w-3xl w-full bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">
              <p className="text-primary-light text-sm font-medium mb-2">{isListening ? 'You are speaking' : latestMessage?.role === 'ai' ? 'AI 面试官' : '你的回答'}</p>
              <p className="text-white text-lg leading-relaxed">{isListening ? transcript || 'Listening...' : latestMessage?.text}</p>
            </div>
          </section>

          <aside className="bg-gray-900 border-l border-gray-800 flex flex-col">
            <div className="p-5 border-b border-gray-800">
              <h2 className="text-white font-bold mb-2">面试记录</h2>
              <p className="text-xs text-gray-500">可用语音或文字回答。语音识别不可用时，请直接输入文字。</p>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {messages.map((message, index) => (
                <div key={index} className={`p-3 rounded-xl text-sm leading-relaxed ${message.role === 'ai' ? 'bg-gray-800 text-gray-200' : 'bg-primary text-white'}`}>
                  {message.text}
                </div>
              ))}
            </div>
            <div className="p-5 border-t border-gray-800 space-y-3">
              <div className="flex gap-2">
                <input value={textInput} onChange={(event) => setTextInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && sendAnswer(textInput)} className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-primary" placeholder="输入你的回答..." />
                <button onClick={() => sendAnswer(textInput)} className="bg-primary text-white p-2 rounded-lg hover:bg-primary-hover"><Send className="w-4 h-4" /></button>
              </div>
              <button onClick={toggleListening} disabled={!recognitionRef.current} className={`w-full py-3 rounded-xl font-bold flex items-center justify-center ${isListening ? 'bg-red-500 text-white' : 'bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-40'}`}>
                {isListening ? <><Square className="w-5 h-5 mr-2" />结束语音</> : <><Mic className="w-5 h-5 mr-2" />开始语音回答</>}
              </button>
            </div>
          </aside>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16 min-h-screen bg-gray-50">
      <SEO
        title="AI 模拟面试"
        description="职引 AI 模拟面试支持行为面、技术面和系统设计面试，结合目标岗位和 JD 生成追问与面试反馈。"
        keywords="AI模拟面试,行为面试,技术面试,系统设计面试,留学生面试"
        canonical="https://www.zhiyincareer.com/ai-interview"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="text-center mb-12">
          <p className="text-sm font-semibold text-primary mb-2">AI Interview</p>
          <h1 className="text-4xl font-black text-deep mb-4 tracking-tight">AI 模拟面试</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">选择岗位、公司和面试类型，开始一场带追问和反馈的模拟面试。</p>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-deep mb-6">配置面试环境</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">目标岗位</span>
                <input value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50" />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">目标公司</span>
                <input value={selectedCompany} onChange={(event) => setSelectedCompany(event.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50" />
              </label>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">面试难度</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {['Easy', 'Medium', 'Hard'].map((level) => (
                    <button key={level} onClick={() => setSelectedDifficulty(level)} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${selectedDifficulty === level ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
                      {level}
                    </button>
                  ))}
                </div>
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">题量：{questionCount} 题</span>
                <input type="range" min="1" max="8" value={questionCount} onChange={(event) => setQuestionCount(Number(event.target.value))} className="w-full accent-primary" />
              </label>
            </div>
            <div className="mb-6">
              <span className="block text-sm font-medium text-gray-700 mb-3">面试类型</span>
              <div className="grid md:grid-cols-3 gap-4">
                {interviewTypes.map((type) => {
                  const Icon = type.icon;
                  const selected = selectedType === type.id;
                  return (
                    <button key={type.id} onClick={() => setSelectedType(type.id)} className={`text-left rounded-xl border-2 p-4 transition-all ${selected ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/30 hover:bg-gray-50'}`}>
                      <Icon className={`w-6 h-6 mb-3 ${selected ? 'text-primary' : 'text-gray-400'}`} />
                      <h3 className={`font-bold mb-1 ${selected ? 'text-primary' : 'text-gray-700'}`}>{type.name}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">{type.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
            {jdContext && (
              <div className="mb-6 bg-green-50 border border-green-100 rounded-xl p-4 text-sm text-green-800 flex items-start">
                <CheckCircle2 className="w-5 h-5 mr-2 shrink-0" />
                已带入职位详情页的 JD，上下文会用于生成更贴近岗位的追问。
              </div>
            )}
            <button onClick={startInterview} className="w-full bg-primary hover:bg-primary-hover text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center">
              <Play className="w-5 h-5 mr-2 fill-current" />
              开始面试
            </button>
          </section>

          <aside className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-deep mb-4">练习建议</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex"><CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0" />先用 60 秒自我介绍建立主线。</li>
                <li className="flex"><CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0" />回答行为题时尽量使用 STAR 结构。</li>
                <li className="flex"><AlertCircle className="w-4 h-4 text-amber-500 mr-2 mt-0.5 shrink-0" />技术题要讲清楚取舍和复杂度。</li>
              </ul>
            </div>
            <div className="bg-gray-900 text-white rounded-2xl p-6">
              <Bot className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-bold mb-2">从职位详情进入更好用</h3>
              <p className="text-sm text-gray-300">在职位详情页点击“用此 JD 模拟面试”，AI 会根据该岗位描述进行追问。</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
