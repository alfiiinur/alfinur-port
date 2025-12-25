module.exports = {
  apps: [
    {
      name: 'alfinur-port',
      script: 'npm',
      args: 'start',
      cwd: '/home/projects/alfinur-port', // INI KUNCINYA (Lokasi Absolut)
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      // Opsi agar PM2 tidak menyerah kalau crash
      exp_backoff_restart_delay: 100,
    },
  ],
};
