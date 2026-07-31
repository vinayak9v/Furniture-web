// Managed by aaPanel Node project "viazo-pm2" and by .github/workflows/deploy.yml
// ponytail: port comes from PORT env, not `next start -p` -- npm swallows `-p` as
// its own --parseable flag and passes the bare number to next as a directory.
// ponytail: script must stay `npm` (not node_modules/.bin/next) so a process named
// `node` with cwd=project dir stays alive -- that is what aaPanel greps for to
// decide whether the project is running.
module.exports = {
  apps: [
    {
      name: 'viazo-pm2',
      cwd: '/www/wwwroot/gioteak/Furniture-web',
      script: '/www/server/nodejs/v24.18.0/bin/npm',
      args: 'start',
      interpreter: '/www/server/nodejs/v24.18.0/bin/node',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1024M',
      min_uptime: '20s',
      max_restarts: 10,
      env: {
        NODE_ENV: 'production',
        PORT: '5356',
        NODE_PROJECT_NAME: 'viazo-pm2',
      },
      out_file: '/www/wwwlogs/pm2/gioteak-pm2/out.log',
      error_file: '/www/wwwlogs/pm2/gioteak-pm2/err.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
    },
  ],
};
