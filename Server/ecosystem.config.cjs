module.exports = {
  apps: [
    {
      name: 'print-server',
      script: 'index.js',
      // exec_mode: 'fork' is crucial for stability in simple servers.
      // It prevents PM2 from using the complex 'cluster' mode, which can hide errors.
      exec_mode: 'fork',
      // The 'cwd' ensures that all relative paths (./routes, ../public) work correctly.
      cwd: __dirname,
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};