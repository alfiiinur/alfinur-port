# CI/CD Deployment Guide

## Setup GitHub Secrets

Buka repository GitHub → Settings → Secrets and variables → Actions → New repository secret

Tambahkan secrets berikut:

| Secret Name       | Deskripsi                    | Contoh                                     |
| ----------------- | ---------------------------- | ------------------------------------------ |
| `VPS_HOST`        | IP atau domain VPS           | `123.456.789.0`                            |
| `VPS_USER`        | Username SSH                 | `root` atau `ubuntu`                       |
| `VPS_SSH_KEY`     | Private SSH key              | (isi dari `~/.ssh/id_rsa`)                 |
| `VPS_PORT`        | Port SSH                     | `22`                                       |
| `DATABASE_URL`    | Connection string PostgreSQL | `postgresql://user:pass@localhost:5432/db` |
| `NEXTAUTH_SECRET` | Secret untuk NextAuth        | random string                              |
| `NEXTAUTH_URL`    | URL aplikasi                 | `https://yourdomain.com`                   |

## Generate SSH Key (jika belum ada)

Di local machine:

```bash
ssh-keygen -t rsa -b 4096 -C "github-actions"
```

Copy public key ke VPS:

```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub user@your-vps-ip
```

Isi `VPS_SSH_KEY` dengan content dari `~/.ssh/id_rsa` (private key).

## Setup VPS (One-time)

SSH ke VPS dan jalankan:

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PM2
npm install -g pm2

# Clone repository (pertama kali)
mkdir -p /home/projects
cd /home/projects
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git alfinur-port
cd alfinur-port

# Setup environment
cp .env.example .env
nano .env  # Edit sesuai kebutuhan

# Install & build
pnpm install
pnpm build

# Start dengan PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Cara Deploy

### Otomatis

Push ke branch `main` atau `master` akan trigger deployment otomatis.

### Manual

1. Buka GitHub → Actions
2. Pilih "Deploy to VPS"
3. Klik "Run workflow"

## Troubleshooting

### Cek status di VPS

```bash
pm2 status
pm2 logs alfinur-port
```

### Restart manual

```bash
cd /home/projects/alfinur-port
pm2 restart alfinur-port
```

### Rebuild manual

```bash
cd /home/projects/alfinur-port
git pull
pnpm install
pnpm build
pm2 restart alfinur-port
```
