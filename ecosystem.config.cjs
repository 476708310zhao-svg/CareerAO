module.exports = {
  apps: [
    {
      name: 'zhiyincareer-api',
      script: 'npm',
      args: 'run start',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || '3000',
        VITE_API_BASE_URL: process.env.VITE_API_BASE_URL || 'https://www.zhiyincareer.com',
        REAL_API_BASE_URL: process.env.REAL_API_BASE_URL || '',
        ENABLE_RESUME_TAILOR_AI: process.env.ENABLE_RESUME_TAILOR_AI || 'false',
        RESUME_TAILOR_AI_MODEL: process.env.RESUME_TAILOR_AI_MODEL || 'gemini-2.5-flash',
        RESUME_TAILOR_AI_TIMEOUT_MS: process.env.RESUME_TAILOR_AI_TIMEOUT_MS || '12000',
      },
    },
  ],
};
