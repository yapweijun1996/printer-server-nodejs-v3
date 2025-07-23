module.exports = {
  apps: [
    {
      name: 'print-server',
      script: 'index.js',
      // exec_mode: 'fork' is crucial for stability in simple servers.
      // It prevents PM2 from using the complex 'cluster' mode, which can hide errors.
      exec_mode: 'fork',
      // The 'cwd' ensures that all relative paths (./routes, ../public) work correctly.
      // Using '.' is the most robust way to specify the current directory.
      cwd: '.',
      watch: false,
      // --- Log Management ---
      // Redirect output and error logs to the 'Server/logs' directory
      output: './logs/out.log',
      error: './logs/error.log',
      // Merge logs from all instances of the app
      merge_logs: true,
      // Add timestamps to the logs
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};