import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

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
    try {
      const REAL_API_BASE_URL = process.env.REAL_API_BASE_URL || 'http://localhost:3001';
      
      if (REAL_API_BASE_URL === 'http://localhost:3001') {
        return res.json({ useMock: true });
      }

      // Extract the target path, e.g., /api/proxy/jobs -> /api/jobs
      const targetPath = req.params[0]; 
      const queryParams = new URLSearchParams(req.query as Record<string, string>).toString();
      const url = `${REAL_API_BASE_URL}/api/${targetPath}${queryParams ? `?${queryParams}` : ''}`;

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
