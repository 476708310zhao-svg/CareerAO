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
        body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined
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
