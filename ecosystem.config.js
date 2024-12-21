module.exports = {
    apps : [{
      name: 'remove_fundo',
      script: 'src/app.js',
      instances: 'max',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
    }]
  };
  