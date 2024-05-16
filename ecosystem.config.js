module.exports = {
  apps: [
    {
      name: 'Nest_App',
      script: './dist/main.js',
      instances: '4',
      exec_mode: 'cluster',
      autorestart: true,
    },
  ],
};
