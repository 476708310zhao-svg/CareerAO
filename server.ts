import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

type ProxyJob = {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  region: string;
  salary: string;
  jobType: string;
  industry: string;
  description: string;
  requirements: string[];
  visaSponsored: boolean;
  postedAt: string;
  viewCount: number;
  applyCount: number;
  applyUrl: string;
  source: string;
  sourceLabel: string;
};

const proxyFallbackJobs: ProxyJob[] = [
  {
    id: 'fallback-google-swe-2026',
    title: 'Software Engineer, New Grad 2026',
    company: 'Google',
    companyLogo: 'https://cdn.brandfetch.io/google.com/w/128/h/128/theme/light/icon',
    location: 'Mountain View, CA',
    region: '美国',
    salary: '$130k - $180k',
    jobType: '全职',
    industry: '互联网',
    description: '参与核心产品和基础设施研发，面向大规模用户构建高可靠系统。适合具备扎实算法、系统设计和工程实践能力的 New Grad 候选人。',
    requirements: ['Computer Science 相关背景', '熟悉数据结构与算法', '有大型项目或实习经历', '英文沟通能力良好'],
    visaSponsored: true,
    postedAt: '2026-06-01',
    viewCount: 2380,
    applyCount: 168,
    applyUrl: 'https://careers.google.com/',
    source: 'proxy_fallback',
    sourceLabel: '精选职位',
  },
  {
    id: 'fallback-amazon-data-2026',
    title: 'Data Scientist, University Graduate',
    company: 'Amazon',
    companyLogo: 'https://cdn.brandfetch.io/amazon.com/w/128/h/128/theme/light/icon',
    location: 'Seattle, WA',
    region: '美国',
    salary: '$125k - $170k',
    jobType: '全职',
    industry: '互联网',
    description: '负责业务实验、预测模型和数据产品建设，和产品、工程团队共同提升用户体验与运营效率。',
    requirements: ['统计、计算机或数据科学背景', '熟悉 SQL 和 Python', '了解 A/B Test', '有机器学习项目经验'],
    visaSponsored: true,
    postedAt: '2026-05-31',
    viewCount: 1810,
    applyCount: 121,
    applyUrl: 'https://www.amazon.jobs/',
    source: 'proxy_fallback',
    sourceLabel: '精选职位',
  },
  {
    id: 'fallback-msft-pm-2026',
    title: 'Product Manager Intern',
    company: 'Microsoft',
    companyLogo: 'https://cdn.brandfetch.io/microsoft.com/w/128/h/128/theme/light/icon',
    location: 'Redmond, WA',
    region: '美国',
    salary: '$45 - $65/hr',
    jobType: '实习',
    industry: '互联网',
    description: '参与 AI 产品功能规划、用户研究和指标分析，推动跨团队协作和产品落地。',
    requirements: ['产品 Sense 强', '能拆解用户需求和指标', '有数据分析能力', '可进行英文产品沟通'],
    visaSponsored: true,
    postedAt: '2026-05-30',
    viewCount: 1436,
    applyCount: 92,
    applyUrl: 'https://careers.microsoft.com/',
    source: 'proxy_fallback',
    sourceLabel: '精选职位',
  },
  {
    id: 'fallback-goldman-analyst-2026',
    title: 'Investment Banking Analyst',
    company: 'Goldman Sachs',
    companyLogo: 'https://cdn.brandfetch.io/goldmansachs.com/w/128/h/128/theme/light/icon',
    location: 'New York, NY',
    region: '美国',
    salary: '$110k - $140k',
    jobType: '全职',
    industry: '金融',
    description: '参与 M&A、IPO 和资本市场项目，负责行业研究、财务建模、估值分析和客户材料准备。',
    requirements: ['金融或经济相关背景', '熟悉三张表和估值模型', 'Excel / PowerPoint 熟练', '抗压能力强'],
    visaSponsored: false,
    postedAt: '2026-05-29',
    viewCount: 1675,
    applyCount: 134,
    applyUrl: 'https://www.goldmansachs.com/careers/',
    source: 'proxy_fallback',
    sourceLabel: '精选职位',
  },
  {
    id: 'fallback-mckinsey-ba-2026',
    title: 'Business Analyst',
    company: 'McKinsey & Company',
    companyLogo: 'https://cdn.brandfetch.io/mckinsey.com/w/128/h/128/theme/light/icon',
    location: 'New York, NY',
    region: '美国',
    salary: '$110k - $135k',
    jobType: '全职',
    industry: '咨询',
    description: '为客户提供战略咨询服务，参与市场研究、数据分析、方案设计和高层汇报。',
    requirements: ['优秀的结构化思维', '强数据分析能力', '沟通表达清晰', '有咨询或商业分析经历优先'],
    visaSponsored: false,
    postedAt: '2026-05-28',
    viewCount: 1295,
    applyCount: 88,
    applyUrl: 'https://www.mckinsey.com/careers',
    source: 'proxy_fallback',
    sourceLabel: '精选职位',
  },
  {
    id: 'fallback-bytedance-frontend-2026',
    title: 'Frontend Engineer',
    company: 'ByteDance',
    companyLogo: 'https://cdn.brandfetch.io/bytedance.com/w/128/h/128/theme/light/icon',
    location: 'San Jose, CA',
    region: '美国',
    salary: '$140k - $190k',
    jobType: '全职',
    industry: '互联网',
    description: '负责全球化产品 Web 体验建设，优化性能、组件体系和前端工程效率。',
    requirements: ['熟悉 React / TypeScript', '了解前端性能优化', '有复杂业务项目经验', '能跨时区协作'],
    visaSponsored: true,
    postedAt: '2026-05-27',
    viewCount: 2120,
    applyCount: 147,
    applyUrl: 'https://jobs.bytedance.com/',
    source: 'proxy_fallback',
    sourceLabel: '精选职位',
  },
  {
    id: 'fallback-tesla-me-2026',
    title: 'Mechanical Design Engineer',
    company: 'Tesla',
    companyLogo: 'https://cdn.brandfetch.io/tesla.com/w/128/h/128/theme/light/icon',
    location: 'Fremont, CA',
    region: '美国',
    salary: '$105k - $150k',
    jobType: '全职',
    industry: '新能源',
    description: '参与电动车与能源产品结构设计、验证和量产问题解决，推动设计从概念到制造落地。',
    requirements: ['机械工程相关背景', '熟悉 CAD 和 DFM', '有硬件项目经历', '能快速迭代解决问题'],
    visaSponsored: false,
    postedAt: '2026-05-26',
    viewCount: 1168,
    applyCount: 73,
    applyUrl: 'https://www.tesla.com/careers',
    source: 'proxy_fallback',
    sourceLabel: '精选职位',
  },
  {
    id: 'fallback-jpm-risk-2026',
    title: 'Risk Analyst',
    company: 'JPMorgan Chase',
    companyLogo: 'https://cdn.brandfetch.io/jpmorganchase.com/w/128/h/128/theme/light/icon',
    location: 'London, UK',
    region: '英国',
    salary: '£55k - £75k',
    jobType: '全职',
    industry: '金融',
    description: '参与市场风险、信用风险和组合数据分析，为业务团队提供风险监控和策略建议。',
    requirements: ['金融工程或量化背景', '熟悉 Python / SQL', '理解风险指标', '英文写作能力好'],
    visaSponsored: true,
    postedAt: '2026-05-25',
    viewCount: 940,
    applyCount: 58,
    applyUrl: 'https://careers.jpmorgan.com/',
    source: 'proxy_fallback',
    sourceLabel: '精选职位',
  },
  {
    id: 'fallback-tencent-pm-2026',
    title: '产品经理培训生',
    company: 'Tencent',
    companyLogo: 'https://cdn.brandfetch.io/tencent.com/w/128/h/128/theme/light/icon',
    location: '深圳',
    region: '中国',
    salary: '25k - 40k',
    jobType: '全职',
    industry: '互联网',
    description: '参与内容、社交或企业服务产品规划，负责需求分析、版本推进和用户增长策略。',
    requirements: ['有产品实习经历', '逻辑和表达清晰', '熟悉国内互联网产品', '能进行数据分析'],
    visaSponsored: false,
    postedAt: '2026-05-24',
    viewCount: 1520,
    applyCount: 102,
    applyUrl: 'https://join.qq.com/',
    source: 'proxy_fallback',
    sourceLabel: '精选职位',
  },
  {
    id: 'fallback-sea-backend-2026',
    title: 'Backend Engineer',
    company: 'Sea',
    companyLogo: 'https://cdn.brandfetch.io/sea.com/w/128/h/128/theme/light/icon',
    location: 'Singapore',
    region: '新加坡',
    salary: 'SGD 90k - 130k',
    jobType: '全职',
    industry: '互联网',
    description: '负责交易、支付或增长系统后端研发，建设高可用服务和数据链路。',
    requirements: ['熟悉 Java / Go / Python', '了解分布式系统', '数据库基础扎实', '有高并发项目经验'],
    visaSponsored: true,
    postedAt: '2026-05-23',
    viewCount: 1086,
    applyCount: 81,
    applyUrl: 'https://www.sea.com/careers',
    source: 'proxy_fallback',
    sourceLabel: '精选职位',
  },
];

function filterProxyFallbackJobs(query: Record<string, unknown>) {
  const keyword = String(query.keyword || query.query || '').trim().toLowerCase();
  const region = String(query.region || '').trim();
  const industry = String(query.industry || '').trim();
  const jobType = String(query.jobType || '').trim();
  const visaSponsored = String(query.visaSponsored || '').trim();

  return proxyFallbackJobs.filter((job) => {
    const matchesKeyword =
      !keyword ||
      job.title.toLowerCase().includes(keyword) ||
      job.company.toLowerCase().includes(keyword) ||
      job.description.toLowerCase().includes(keyword) ||
      job.requirements.join(' ').toLowerCase().includes(keyword);
    const matchesRegion = !region || region === '全部' || job.region === region;
    const matchesIndustry = !industry || industry === '全部' || job.industry === industry;
    const matchesType = !jobType || jobType === '全部' || job.jobType === jobType;
    const matchesVisa = visaSponsored !== 'true' || job.visaSponsored;
    return matchesKeyword && matchesRegion && matchesIndustry && matchesType && matchesVisa;
  });
}

function buildProxyJobsResponse(query: Record<string, unknown>) {
  const page = Math.max(1, parseInt(String(query.page || '1'), 10) || 1);
  const pageSize = Math.min(Math.max(1, parseInt(String(query.pageSize || '10'), 10) || 10), 50);
  const filtered = filterProxyFallbackJobs(query);
  const start = (page - 1) * pageSize;
  const list = filtered.slice(start, start + pageSize);

  return {
    code: 0,
    message: 'success',
    data: {
      list,
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize) || 1,
      source: 'proxy_fallback',
      sources: ['proxy_fallback'],
    },
    meta: {
      generatedAt: new Date().toISOString(),
      reason: 'backend_unavailable',
    },
  };
}

function buildProxyJobDetail(id: string) {
  const job = proxyFallbackJobs.find((item) => item.id === id);
  if (!job) return null;
  return { code: 0, message: 'success', data: job };
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Initialize Gemini API
  // Note: We initialize lazily or handle missing keys gracefully if needed, 
  // but for Gemini in this environment, process.env.GEMINI_API_KEY is provided.
  let ai: GoogleGenAI | null = null;
  try {
    if (process.env.GEMINI_API_KEY) {
      ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
  } catch (e) {
    console.error("Failed to initialize Gemini API:", e);
  }

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Proxy Campus Calendar Endpoint
  // This forwards the request to your real backend to bypass browser CORS errors in AI Studio Dev Env
  app.get('/api/campus', async (req, res) => {
    try {
      const BASE_URL = process.env.VITE_API_BASE_URL || process.env.REAL_API_BASE_URL;
      
      if (BASE_URL && !BASE_URL.includes('localhost')) {
        const queryParams = new URLSearchParams(req.query as Record<string, string>).toString();
        // Forward to the real backend location
        let url = `${BASE_URL}/api/campus${queryParams ? `?${queryParams}` : ''}`;
        
        // If the BASE_URL already ends with /api, avoid double /api
        if (BASE_URL.endsWith('/api')) {
           url = `${BASE_URL}/campus${queryParams ? `?${queryParams}` : ''}`;
        }
        
        const fetchHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
        if (req.headers.authorization) {
          fetchHeaders['Authorization'] = req.headers.authorization;
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: fetchHeaders
        });

        const data = await response.json();
        return res.status(response.status).json(data);
      }

      // -------------------------------------------------------------
      // Fallback: If no real backend is configured, return Mock Data
      // -------------------------------------------------------------
      const { region, type, role, gradYear } = req.query;
      
      let mockData = [
        { id: 101, date: '今日开启', day: 'Sep 15', company: 'Google', title: '2027 Software Engineering Intern', type: 'Internship (暑期)', role: 'SDE / Tech', gradYear: '2027届', location: 'US / Canada', status: 'upcoming', applyUrl: 'https://careers.google.com/' },
        { id: 102, date: '3天后截止', day: 'Sep 18', company: 'Meta', title: 'New Grad 2026 - Software Engineer', type: 'Full-time (秋招)', role: 'SDE / Tech', gradYear: '2026届', location: 'US', status: 'closing-soon', applyUrl: 'https://metacareers.com/' },
        { id: 103, date: '下周', day: 'Sep 22', company: 'Jane Street', title: 'Quantitative Researcher Campus Hire', type: 'Full-time (秋招)', role: 'Finance / Quant', gradYear: '2026届', location: 'Hong Kong / NY', status: 'upcoming', applyUrl: 'https://janestreet.com/' },
        { id: 104, date: '本月末', day: 'Sep 30', company: 'Tencent 腾讯', title: '2026届产品经理培训生 (提前批)', type: 'Full-time (秋招)', role: 'PM / Operations', gradYear: '2026届', location: 'Shenzhen / Beijing', status: 'upcoming', applyUrl: 'https://join.qq.com/' },
        { id: 105, date: 'Oct 01', day: 'Oct 01', company: 'Apple', title: 'Hardware Engineering Intern', type: 'Internship (暑期)', role: 'SDE / Tech', gradYear: '2027届', location: 'Cupertino, CA', status: 'upcoming', applyUrl: 'https://apple.com/jobs' },
        { id: 106, date: 'Oct 05', day: 'Oct 05', company: 'ByteDance', title: 'Research Scientist - Gen AI', type: 'Full-time (秋招)', role: 'Data / AI', gradYear: '2025届', location: 'Singapore / US', status: 'upcoming', applyUrl: 'https://jobs.bytedance.com/' }
      ];

      if (region && region !== 'All') mockData = mockData.filter(d => d.location.includes(region as string));
      if (type && type !== 'All') mockData = mockData.filter(d => d.type === type);
      if (role && role !== 'All') mockData = mockData.filter(d => d.role === role);
      if (gradYear && gradYear !== 'All') mockData = mockData.filter(d => d.gradYear === gradYear);

      await new Promise(resolve => setTimeout(resolve, 800));
      res.json({ data: mockData });

    } catch (error) {
      console.error('Campus Calendar Proxy error:', error);
      res.status(500).json({ error: 'Failed to proxy request', useMock: true });
    }
  });



  // Generic Proxy endpoint for real Mini-Program API
  app.all('/api/proxy/*', async (req, res) => {
    const targetPath = req.params[0];
    const sendJobsFallback = () => {
      if (targetPath === 'jobs') return res.json(buildProxyJobsResponse(req.query as Record<string, unknown>));
      if (targetPath === 'jobs/recommend/list') {
        return res.json({ code: 0, message: 'success', data: proxyFallbackJobs.slice(0, 5) });
      }
      if (targetPath.startsWith('jobs/')) {
        const rawId = decodeURIComponent(targetPath.replace(/^jobs\//, ''));
        const detail = buildProxyJobDetail(rawId);
        if (detail) return res.json(detail);
      }
      return null;
    };

    try {
      const REAL_API_BASE_URL = process.env.REAL_API_BASE_URL || process.env.VITE_API_BASE_URL || '';
      
      if (!REAL_API_BASE_URL) {
        const fallback = sendJobsFallback();
        if (fallback) return fallback;
        return res.json({ useMock: true });
      }

      // Extract the target path, e.g., /api/proxy/jobs -> /api/jobs
      const queryParams = new URLSearchParams(req.query as Record<string, string>).toString();
      const baseUrl = REAL_API_BASE_URL.replace(/\/$/, '');
      const apiPrefix = baseUrl.endsWith('/api') ? '' : '/api';
      const url = `${baseUrl}${apiPrefix}/${targetPath}${queryParams ? `?${queryParams}` : ''}`;

      const response = await fetch(url, {
        method: req.method,
        headers: {
          'Authorization': req.headers.authorization || '',
          'Content-Type': req.headers['content-type'] || 'application/json'
        },
        body: ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) ? JSON.stringify(req.body) : undefined
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Proxy error:', error);
      const fallback = sendJobsFallback();
      if (fallback) return fallback;
      res.status(500).json({ error: 'Failed to fetch from real API', useMock: true });
    }
  });

  // AI Polish Endpoint
  app.post('/api/ai/polish-resume', async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({ error: 'Gemini API is not configured.' });
      }

      const { text, role } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: 'Text is required' });
      }

      const prompt = `You are an expert resume writer and career coach. 
Please rewrite the following resume bullet points to make them more professional, impactful, and aligned with the STAR (Situation, Task, Action, Result) method. 
Target Role: ${role || 'General Professional'}

Original text:
${text}

Please provide the rewritten bullet points. Make them concise, use strong action verbs, and quantify results where possible (you can add placeholder numbers like [X]% if needed). Return ONLY the bullet points, starting each with a bullet character (•).`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      res.json({ result: response.text });
    } catch (error: any) {
      console.error('AI Polish Error:', error);
      res.status(500).json({ error: error.message || 'Failed to polish resume' });
    }
  });

  // AI Interview Chat Endpoint
  app.post('/api/ai/interview-chat', async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({ error: 'Gemini API is not configured.' });
      }

      const { messages, role, company, jd, type } = req.body;
      
      const systemInstruction = `You are an expert AI interviewer conducting a ${type} interview for a ${role} position at ${company}.
      ${jd ? `Here is the job description context: ${jd}` : ''}
      Keep your responses concise, conversational, and professional. Ask one question at a time. Evaluate the candidate's responses and ask follow-up questions based on their answers. Do not break character.`;

      const formattedMessages = messages.map((m: any) => ({
        role: m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: formattedMessages,
        config: {
          systemInstruction: systemInstruction,
        }
      });

      res.json({ reply: response.text });
    } catch (error: any) {
      console.error('AI Interview Error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate response' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // In Express v4, use app.get('*', ...)
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
