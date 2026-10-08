module.exports = {
  apps: [
    {
      name: "zhiyincareer-next-preview",
      script: "./server.js",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        HOSTNAME: "127.0.0.1",
        PORT: "3101",
      },
    },
  ],
};
