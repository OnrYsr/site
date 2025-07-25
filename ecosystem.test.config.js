module.exports = {
  apps: [{
    name: 'muse3dstudio-test',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/muse3dstudio',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'development',
      PORT: 3001
    },
    error_file: './logs/pm2-test-error.log',
    out_file: './logs/pm2-test-out.log',
    log_file: './logs/pm2-test.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
}; 