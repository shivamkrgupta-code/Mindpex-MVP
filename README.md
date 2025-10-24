# Mindpex Talent Intelligence Platform

A comprehensive Next.js application for employee performance analytics, competency tracking, talent management, and AI-powered workforce insights with Supabase backend integration.

## 🚀 Project Overview

Mindpex is a modern talent intelligence platform built with Next.js 13, TypeScript, and Supabase. It provides comprehensive tools for tracking employee performance, competency gaps, talent development, AI-powered attrition predictions, and strategic workforce planning through advanced analytics and visualization with a premium dark black and golden theme.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Navigation](#pages--navigation)
- [Database Schema](#database-schema)
- [Design System](#design-system)
- [Setup Instructions](#setup-instructions)
- [Environment Configuration](#environment-configuration)
- [Development Workflow](#development-workflow)
- [Recent Updates](#recent-updates)

## ✨ Features

### Core Functionality
- **Employee Management**: Comprehensive employee data tracking and management (1470+ employees)
- **Performance Analytics**: Advanced performance rating and analysis tools
- **Competency Tracking**: Skill gap analysis and competency development tracking
- **Nine-Box Grid**: Talent assessment and succession planning visualization
- **AI-Powered Insights**: Machine learning-driven attrition predictions and risk analytics
- **Strategic Planning**: Workforce optimization and cost savings recommendations
- **Training Programs**: Comprehensive learning pathways with ROI metrics
- **Real-time Analytics**: Live performance dashboards and insights

### Advanced Analytics
- **AI Attrition Predictions**: Risk segmentation (Imminent/Likely/Possible/Stable)
- **Skills Optimizer**: Ratio analysis and cost optimization ($355K+ savings potential)
- **Retain/Detain Grid**: 9-grid strategic talent segmentation matrix
- **Risk Parameters**: Comprehensive methodology documentation
- **Industry Benchmarks**: Performance comparison across KPIs
- **Top Learners Leaderboard**: Training engagement tracking (top 50 employees)

### User Interface
- **Premium Dark Theme**: Pure black (#000000, #1a1a1a, #2a2a2a) with signal gold accents (#B58342, #d4a05a)
- **Glass Morphism**: Backdrop blur effects and transparency
- **Modern Landing Page**: White "Mindpex" branding with golden tagline
- **Component Library**: Comprehensive Radix UI component system
- **Interactive Dashboards**: Real-time data visualization with Recharts
- **AI Assistant**: Floating chat with golden theme for HR queries

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 13.5.1 (App Router)
- **Language**: TypeScript 5.2.2
- **Styling**: Tailwind CSS 3.3.3
- **UI Components**: Radix UI (Complete component library)
- **Charts**: Recharts 2.12.7
- **Icons**: Lucide React 0.446.0
- **Date Handling**: date-fns 3.6.0

### Backend & Database
- **Database**: PostgreSQL (via Supabase)
- **Backend**: Supabase 2.58.0
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage

### Development Tools
- **Linting**: ESLint 8.49.0
- **Type Checking**: TypeScript
- **Build Tool**: Next.js SWC
- **Package Manager**: npm

## 📁 Project Structure

\`\`\`
Mindpex-MVP-main/
├── app/
│   ├── page.tsx                        # Landing page (hero, features)
│   ├── layout.tsx                      # Root layout with dark theme
│   ├── globals.css                     # Global styles (black + gold)
│   ├── dashboard/
│   │   ├── page.tsx                   # Main dashboard
│   │   ├── layout.tsx                 # Dashboard layout with sidebar
│   │   ├── ai-insights/
│   │   │   └── page.tsx              # AI attrition predictions
│   │   ├── skills-optimizer/
│   │   │   └── page.tsx              # Skills ratio & cost optimization
│   │   ├── retain-detain/
│   │   │   └── page.tsx              # 9-grid talent matrix
│   │   ├── risk-parameters/
│   │   │   └── page.tsx              # Risk methodology docs
│   │   ├── strategic-insights/
│   │   │   └── page.tsx              # Planning + training programs
│   │   └── top-learners/
│   │       └── page.tsx              # Training leaderboard (top 50)
│   ├── competency/
│   │   ├── page.tsx                   # Competency models
│   │   └── layout.tsx
│   ├── employees/
│   │   ├── page.tsx                   # Employee directory
│   │   └── layout.tsx
│   └── succession/
│       ├── page.tsx                   # Succession planning
│       └── layout.tsx
├── components/
│   ├── sidebar.tsx                    # Navigation (10 items)
│   ├── header.tsx                     # Top header bar
│   ├── FloatingChat.tsx               # AI assistant (golden theme)
│   ├── BenchmarkSystem.tsx            # Industry benchmarks
│   ├── SkillsTraining.tsx             # Training programs
│   ├── AttritionInsights.tsx          # AI predictions
│   ├── SkillRatioComparison.tsx       # Skills optimizer
│   ├── RetainDetainGrid.tsx           # 9-grid matrix
│   ├── RiskParameters.tsx             # Risk parameters
│   ├── EmployeeDialog.tsx             # Employee modal
│   └── ui/                            # Reusable components
├── lib/
│   └── supabase.ts                    # Supabase client
├── supabase/
│   ├── config.toml                    # Supabase config
│   └── migrations/                    # Database migrations
├── components.json                     # Radix UI config
├── next.config.js                      # Next.js config
├── tailwind.config.ts                  # Tailwind config
├── package.json                        # Dependencies
└── README.md                           # This file
\`\`\`

## 🗺 Pages & Navigation

### Main Navigation
1. **Dashboard** - Overview with key metrics, high-risk employees, competency trends, industry benchmarks
2. **Competency Models** - Role requirements and skills heatmap
3. **Employee Directory** - Searchable employee database with filtering
4. **Succession/Risk** - 9-box talent grid and promotion readiness

### Advanced Analytics (Sidebar)
5. **AI Insights** - Machine learning attrition predictions (Imminent/Likely/Possible/Stable risk distribution)
6. **Skills Optimizer** - Upskilling analysis, ratio comparison, cost savings recommendations
7. **Retain/Detain Grid** - 9-box strategic talent segmentation with retain/develop/monitor/detain actions
8. **Risk Parameters** - Comprehensive risk assessment methodology documentation

### Learning & Development (Sidebar)
9. **Strategic Insights** - Workforce planning recommendations + 4 training programs (Technical, Leadership, Certifications, Sales)
10. **Top Learners** - Leaderboard of top 50 employees ranked by training engagement (Elite/Advanced/Active tiers)

## 🗄 Database Schema

### Core Tables

#### `employees`
Comprehensive employee data (1470+ records):
- Demographics: EmployeeNumber, Age, Gender, MaritalStatus
- Job Info: JobRole, JobLevel, Department, BusinessTravel
- Performance: PerformanceRating, JobSatisfaction, JobInvolvement
- Compensation: MonthlyIncome, HourlyRate, StockOptionLevel
- Work-Life: WorkLifeBalance, EnvironmentSatisfaction, OverTime
- Development: TrainingTimesLastYear, Education, EducationField
- Tenure: YearsAtCompany, YearsInCurrentRole, YearsSinceLastPromotion
- Attrition: Attrition flag

#### `job_roles`
Job role definitions and management

#### `target_competencies`
Competency requirements for different roles

#### `user_roles`
User access control (administrator, viewer, employee)

### Key Database Functions

- calculate_competency_gap(employee_id) - Skill gap calculations
- check_promotion_readiness(employee_id) - Promotion evaluation
- set_target_competency_user_id() - Trigger for user ID assignment

### Security
Comprehensive Row Level Security (RLS) policies for administrators, viewers, employees, and public access.

## 🎨 Design System

### Color Palette

**Primary Colors:**
- Pure Black: #000000 (main backgrounds)
- Dark Black: #1a1a1a (secondary backgrounds)
- Medium Black: #2a2a2a (tertiary backgrounds)
- Signal Gold: #B58342 (primary accent)
- Light Gold: #d4a05a (secondary accent)

**UI Elements:**
- Borders: Golden with 20-30% opacity
- Glass cards: bg-black/40 backdrop-blur-xl
- Gradients: from-[#B58342] to-[#d4a05a]
- Text: White, slate-300, slate-400

**Navigation:**
- Active state: Golden background
- Hover state: White 10% opacity
- Sidebar: Black gradient with golden border

### Landing Page
- White "Mindpex" branding
- Golden "Retention Intelligence Platform" tagline
- Animated hero metrics
- Golden CTA buttons

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Git

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd Mindpex-MVP-main
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configure environment variables**
   \`\`\`bash
   # Create .env.local file
   cp supabase-config.txt .env.local

   # Edit with your Supabase credentials
   \`\`\`

4. **Set up Supabase database**
   - Go to https://supabase.com
   - Create a new project
   - Run the SQL migrations from supabase/migrations/
   - Or use the seed-data.sql file for quick setup

5. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Access the application**
   - Landing page: http://localhost:3000
   - Dashboard: http://localhost:3000/dashboard

## 🔧 Environment Configuration

Create a .env.local file:

\`\`\`env
# Supabase Project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co

# Supabase Anon Key (client-side)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Supabase Service Role Key (server-side)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database URL (Transaction Mode Pooler)
DATABASE_URL=postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:6543/postgres
\`\`\`

## 🔄 Development Workflow

### Available Scripts

\`\`\`bash
# Development
npm run dev          # Start dev server (localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Supabase (if using local development)
supabase start       # Start local Supabase
supabase stop        # Stop local Supabase
supabase db push     # Push schema changes
\`\`\`

### Development Guidelines

1. **Code Style**: Follow ESLint configuration
2. **Type Safety**: Use TypeScript for all new code
3. **Components**: Use Radix UI components when possible
4. **Styling**: Use Tailwind CSS with theme colors (#000000, #B58342)
5. **Database**: Test queries with pagination (1000 records/request)
6. **Navigation**: All dashboard pages should be in /app/dashboard/ folder

## 📝 Recent Updates

### Color Scheme Transformation (October 2024)
- **Complete Theme Migration**: Changed from teal/blue to pure black + signal gold
- **All Pages Updated**: 10+ pages redesigned with consistent premium theme
- **Landing Page**: White "Mindpex" branding + golden tagline
- **Glass Morphism**: Backdrop blur effects across all cards
- **Component Updates**: All 8+ major components redesigned

### Dashboard Reorganization
- **6 Sections Moved**: Relocated major sections to dedicated sidebar pages
- **70% Clutter Reduction**: Cleaner main dashboard with core metrics only
- **Logical Grouping**: Analytics, learning & development sections organized
- **Single Sidebar**: Fixed double sidebar issue with proper layout inheritance

### New Pages Added
1. **AI Insights** - Attrition predictions with risk segmentation (4 tiers)
2. **Skills Optimizer** - Ratio analysis, cost optimization ($355K+ savings)
3. **Retain/Detain Grid** - 9-box talent matrix with strategic actions
4. **Risk Parameters** - Comprehensive methodology documentation
5. **Strategic Insights** - Workforce planning + 4 training programs combined
6. **Top Learners** - Expanded leaderboard with 50 employees (Elite/Advanced/Active tiers)

### Enhanced Components
- **AI Assistant**: Floating chat with golden theme for HR queries
- **Industry Benchmarks**: Performance comparison across multiple KPIs
- **Training Programs**: 4 programs (Technical, Leadership, Certifications, Sales)
- **ROI Metrics**: Investment calculations, productivity gains, retention impact
- **Tiered Learners**: Visual rankings with gold/silver/bronze styling

## 🔒 Security Features

- **Row Level Security (RLS)**: Comprehensive data access control
- **JWT Authentication**: Secure user authentication via Supabase
- **Role-Based Access**: Multi-level permission system
- **Data Pagination**: 1000 records per request to prevent memory issues
- **Environment Variables**: All sensitive credentials secured

## 📈 Performance Features

- **Code Splitting**: Each page loads independently
- **Client-Side Rendering**: 'use client' for interactive components
- **Data Pagination**: Efficient fetching (1000 employees per request)
- **Lazy Loading**: Components load on demand
- **Caching**: Supabase client caches queries

## 🎯 Key Metrics & Analytics

### AI-Powered Insights
- Risk scores: 0-100 scale
- Segmentation: Imminent (70-100), Likely (50-69), Possible (30-49), Stable (0-29)
- Predicted attrition timeline by quarter
- Machine learning trend analysis

### Cost Optimization
- Potential annual savings: $355,542K+
- Internal mobility vs. external hiring analysis
- Training investment ROI: +23% productivity, -15% attrition
- Upskilling gap analysis and cost projections

### Training & Development
- 4 comprehensive programs (12-16 weeks)
- Skills covered: Python, ML, Cloud, Leadership, PMP, AWS, Scrum
- Top 50 learners leaderboard
- Elite (5+), Advanced (3-4), Active (1-2) tier system

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Follow the design system (black + gold theme)
4. Test thoroughly with 1470+ employee dataset
5. Submit a pull request

### Code Standards
- Use TypeScript for all new code
- Follow Tailwind CSS color palette
- Use Radix UI components
- Implement proper data pagination
- Test with full employee dataset

## 📞 Support

For support and questions:
- Check SETUP_INSTRUCTIONS.md for detailed setup guide
- Review browser console for errors (F12)
- Verify Supabase connection and credentials
- Clear .next cache and rebuild if needed
- Check that all dependencies are installed

## 🚀 Deployment

### Production Checklist
1. Set environment variables in hosting platform
2. Run npm run build to create production build
3. Deploy to Vercel, Netlify, or preferred host
4. Configure Supabase RLS policies for production
5. Test all 10 pages with production data
6. Verify sidebar navigation across all pages

---
**Mindpex Talent Intelligence Platform** - Predictive Workforce Analytics & Succession Planning
