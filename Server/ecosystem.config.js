module.exports = {
  apps: [
    {
      name: 'print-server',
      script: 'index.js',
      // The 'cwd' is crucial. It tells PM2 to run the script
      // as if we were currently in the 'Server' directory.
      // This ensures all relative paths (./routes, ./config, ../public) work correctly.
      cwd: './',
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