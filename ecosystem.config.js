# PM2 配置文件
# 使用方式: pm2 start ecosystem.config.js --env production

module.exports = {
  apps: [{
    name: 'hohai110-backend',
    script: './src/server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    env_development: {
      NODE_ENV: 'development',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '500M',
    watch: false,
    ignore_watch: ['node_modules', 'logs', 'uploads'],
    max_restarts: 10,
    min_uptime: '10s',
    autorestart: true,
    // 优雅退出
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000,
    // 日志轮转
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
