<div align="center">

<!-- Or use video demo (uncomment below and comment image above) -->
<!--
https://github.com/user-attachments/assets/YOUR-VIDEO-ID

OR use GIF:

-->

# 🌟 Alfinur Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

A modern, full-stack portfolio website built with Next.js 16, featuring a comprehensive admin dashboard, blog system, project showcase, and various productivity tools.

[🌐 Live Demo](http://alfinurdigital.com/) • [📖 Documentation](https://github.com/alfiiinur/alfinur-port/wiki) • [🐛 Report Bug](https://github.com/alfiiinur/alfinur-port/issues) • [✨ Request Feature](https://github.com/alfiiinur/alfinur-port/issues)

<img src="public/covergif.gif" alt="Demo" width="100%" />

</div>

---

## 📑 Table of Contents

- [Tech Stack](#-tech-stack)
- [Screenshots & Demo](#-screenshots--demo)
- [Project Structure](#-project-structure)
- [Features](#-features)
- [Installation](#️-installation)
- [Scripts](#-scripts)
- [Database Schema](#️-database-schema)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js v5
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI, shadcn/ui
- **Animations:** GSAP, Framer Motion
- **Charts:** Recharts
- **Drag & Drop:** dnd-kit
- **Package Manager:** pnpm

## 📁 Project Structure

```
├── app/
│   ├── (admin)/              # Admin dashboard routes
│   │   ├── dashboard/
│   │   │   ├── analytics/    # Blog analytics
│   │   │   ├── blogs/        # Blog management + sections
│   │   │   ├── calendar/     # Calendar & events
│   │   │   ├── chat/         # Live chat inbox
│   │   │   ├── comments/     # Comment moderation
│   │   │   ├── designs/      # Design portfolio management
│   │   │   ├── finance/      # Finance tracker (wallets, bills, OCR)
│   │   │   ├── notes/        # Sticky notes
│   │   │   ├── projects/     # Project management
│   │   │   ├── services/     # Services & testimonials
│   │   │   ├── settings/     # Site settings, profile, security
│   │   │   └── tasks/        # Task management with drag & drop
│   │   ├── login/
│   │   └── signup/
│   │
│   ├── (public)/             # Public-facing pages
│   │   ├── about/            # About page with work history
│   │   ├── blogs/            # Blog listing & detail
│   │   ├── contact/          # Contact form
│   │   ├── design/           # Design showcase
│   │   ├── home/             # Homepage
│   │   ├── projects/         # Project portfolio
│   │   └── services/         # Services & pricing
│   │
│   ├── (showcase)/           # Showcase routes
│   │
│   └── api/                  # API routes
│       ├── admin/            # Admin APIs
│       ├── auth/             # NextAuth endpoints
│       ├── blogs/            # Blog CRUD
│       ├── calendar/         # Calendar events
│       ├── chat/             # Live chat
│       ├── comments/         # Comments & reactions
│       ├── contact/          # Contact submissions
│       ├── designs/          # Design CRUD
│       ├── finance/          # Finance APIs
│       ├── github/           # GitHub integration
│       ├── notes/            # Notes CRUD
│       ├── services/         # Services CRUD
│       ├── settings/         # Site settings
│       ├── tasks/            # Task management
│       ├── testimonials/     # Testimonials
│       └── upload/           # File uploads
│
├── components/
│   ├── admin/                # Admin dashboard components
│   ├── dataMock/             # Mock data for development
│   ├── public/               # Public site components
│   │   ├── chat/             # Chat widget
│   │   └── shared/           # Shared components (navbar, footer, etc.)
│   └── ui/                   # shadcn/ui components
│
├── lib/
│   ├── hooks/                # Custom React hooks
│   ├── ocr/                  # OCR utilities (Tesseract.js)
│   ├── auth.ts               # NextAuth configuration
│   ├── chat-ai.ts            # AI chat integration
│   ├── prisma.ts             # Prisma client
│   ├── settings.ts           # Site settings utilities
│   └── utils.ts              # Utility functions
│
├── prisma/
│   ├── migrations/           # Database migrations
│   ├── schema.prisma         # Database schema
│   └── seed*.js              # Seed scripts
│
├── public/                   # Static assets
│   ├── img/
│   ├── uploads/
│   └── video/                # Video files (videoHome.mp4, videonote.mp4)
│
└── types/                    # TypeScript type definitions
```

## ✨ Features

### Public Website

- 🏠 **Homepage** - Hero section, portfolio preview, services marquee
- 👤 **About** - Work history timeline, achievements, tech stack
- 📝 **Blog** - Markdown support, categories, sections, comments, reactions
- 🎨 **Design** - Design portfolio with likes
- 💼 **Projects** - Project showcase with custom sections
- 🛠️ **Services** - Service listings, testimonials, FAQ
- 📧 **Contact** - Contact form with service selection
- 💬 **Live Chat** - Real-time chat widget with AI support

### Admin Dashboard

- 📊 **Dashboard** - Overview stats and charts
- 📝 **Blog Management** - CRUD, sections (drag & drop), analytics
- 🎨 **Design Management** - CRUD with analytics
- 💼 **Project Management** - CRUD with custom sections
- 🛠️ **Services** - Manage services, testimonials, FAQ
- 💬 **Live Chat** - Inbox, quick replies
- 📅 **Calendar** - Event management
- ✅ **Tasks** - Kanban-style task management
- 📝 **Notes** - Sticky notes
- 💰 **Finance** - Wallets, transactions, bills, OCR scanner
- ⚙️ **Settings** - Site settings, profile, security

## 🛠️ Installation

### Prerequisites

- Node.js 20+
- PostgreSQL
- pnpm

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/alfiiinur/alfinur-port.git
   cd alfinur-port
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Setup environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Configure the following variables:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/port_alfinur"

   # NextAuth
   AUTH_SECRET="your-secret-key"
   AUTH_URL="http://localhost:3000"

   # Optional: AI Chat
   OPENAI_API_KEY="your-openai-key"
   ```

4. **Setup database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed the database (optional)**

   ```bash
   pnpm seed              # Main seed
   pnpm seed:blogs        # Blog data
   pnpm seed:designs      # Design data
   pnpm seed:projects     # Project data
   pnpm seed:services     # Services data
   ```

6. **Run development server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 📜 Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm seed         # Run main seed
pnpm seed:blogs   # Seed blog data
pnpm seed:designs # Seed design data
pnpm seed:projects # Seed project data
pnpm seed:services # Seed services data
```

## 🗄️ Database Schema

Key models:

- **User** - Admin users with roles
- **Blog** - Blog posts with sections, comments, views
- **BlogSection** - Blog categorization (AI, Web Dev, etc.)
- **Project** - Portfolio projects
- **Design** - Design showcase with likes
- **Service** - Service offerings
- **Testimonial** - Client testimonials
- **Task** - Task management with subtasks
- **Transaction/Wallet/Bill** - Finance tracking
- **ChatSession/ChatMessage** - Live chat
- **CalendarEvent** - Calendar events
- **Note** - Sticky notes

## 🤝 Contributing

1. **Fork the repository**

2. **Create a feature branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit your changes**

   ```bash
   git commit -m 'Add some amazing feature'
   ```

4. **Push to the branch**

   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**

### Code Style

- Use TypeScript for all new files
- Follow existing code patterns
- Use Tailwind CSS for styling
- Components should be in appropriate folders
- API routes should follow RESTful conventions

### Commit Convention

```
feat: Add new feature
fix: Bug fix
docs: Documentation changes
style: Code style changes (formatting, etc.)
refactor: Code refactoring
test: Add or update tests
chore: Maintenance tasks
```

## 👤 Author

<div align="center">

**Alfi Nur**

[![GitHub](https://img.shields.io/badge/GitHub-alfiiinur-181717?style=for-the-badge&logo=github)](https://github.com/alfiiinur)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-alfinurhakim-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/alfinur)
[![Portfolio](https://img.shields.io/badge/Portfolio-alfinurdigital.com-000?style=for-the-badge&logo=vercel)](http://alfinurdigital.com)
[![Email](https://img.shields.io/badge/Email-alfinurdanialin900@gmail.com-EA4335?style=for-the-badge&logo=gmail)](mailto:alfinurdanialin900@gmail.com)

</div>

---

<div align="center">

### ⭐ Star this repo if you find it useful!

Built with using Next.js, GSAP, Frammer, Tailwind CSS

![Visitors](https://api.visitorbadge.io/api/visitors?path=alfiiinur%2Falfinur-port&label=Visitors&countColor=%23263759)

</div>
