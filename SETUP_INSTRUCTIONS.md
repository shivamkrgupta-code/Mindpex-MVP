# Mindpex Talent Intelligence Platform - Setup Instructions

## Current Status

Your Mindpex Talent Intelligence Platform is now **fully functional** with a premium dark black and golden theme! The platform features comprehensive talent analytics, AI-powered insights, and workforce planning tools.

## What's Working Now

✅ **Complete Navigation System:**
- 10+ pages accessible via the sidebar
- Seamless navigation with consistent layout
- Single sidebar across all pages
- Premium black background with golden accents

✅ **All Dashboard Pages:**
- **Main Dashboard** - Key metrics, high-risk employees, competency trends, industry benchmarks
- **Competency Models** - Role requirements and skills heatmap
- **Employee Directory** - Searchable employee database with filtering
- **Succession/Risk** - 9-box talent grid and promotion readiness
- **AI Insights** - AI-powered attrition predictions and risk analytics
- **Skills Optimizer** - Skill-based ratio comparison and cost optimization
- **Retain/Detain Grid** - 9-grid strategic talent segmentation matrix
- **Risk Parameters** - Comprehensive risk assessment methodology
- **Strategic Insights** - Workforce planning recommendations and training programs
- **Top Learners** - Leaderboard of top 50 employees by training engagement

✅ **Premium Dark Theme:**
- Pure black backgrounds (#000000, #1a1a1a, #2a2a2a)
- Signal gold accents (#B58342, #d4a05a)
- Glass morphism effects with backdrop blur
- Consistent golden gradients throughout

✅ **Landing Page:**
- Modern hero section with animated metrics
- White "Mindpex" branding with golden tagline
- Feature showcases and social proof
- CTA buttons with golden styling

✅ **Advanced Components:**
- AI Assistant floating chat with golden theme
- Industry benchmark comparison system
- Training programs with ROI metrics
- Skills progression tracking
- Strategic workforce recommendations

## Accessing the Platform

Your development server runs at: **http://localhost:3000** (or 3001)

### Navigation Structure

**Main Navigation:**
1. **Dashboard** - Overview with key metrics and charts
2. **Competency Models** - Skills and role requirements
3. **Employee Directory** - Searchable employee database
4. **Succession/Risk** - Talent assessment and succession planning

**Advanced Analytics:**
5. **AI Insights** - Machine learning-driven attrition predictions
6. **Skills Optimizer** - Skills analysis and cost optimization
7. **Retain/Detain Grid** - Strategic talent segmentation (9-grid)
8. **Risk Parameters** - Risk assessment methodology documentation

**Learning & Development:**
9. **Strategic Insights** - Workforce planning + training programs
10. **Top Learners** - Employee training leaderboard (top 50)

## Database Setup

Your Supabase database needs to be populated with employee data.

### Method 1: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase project dashboard:
   https://lmogwfwmmtpxfdrwfjar.supabase.co

2. Click on **SQL Editor** in the left sidebar

3. Click **New query**

4. Copy the entire contents of `seed-data.sql` file (located in your project root)

5. Paste it into the SQL editor

6. Click **Run** to execute the query

7. Refresh your browser to see real data!

### What the Database Includes

- 1470+ employees across multiple departments
- Departments: Sales, Research & Development, Human Resources
- Comprehensive employee data:
  - Performance ratings and job satisfaction scores
  - Training times and education levels
  - Work-life balance and environment satisfaction
  - Years at company and in current role
  - Overtime status and attrition indicators
  - Competency scores and skill assessments

## File Structure

\`\`\`
app/
├── page.tsx                    # Landing page with hero and features
├── layout.tsx                  # Root layout with dark theme
├── globals.css                 # Global styles with black + gold theme
├── dashboard/
│   ├── page.tsx               # Main dashboard
│   ├── layout.tsx             # Dashboard layout with sidebar
│   ├── ai-insights/
│   │   └── page.tsx          # AI-powered attrition insights
│   ├── skills-optimizer/
│   │   └── page.tsx          # Skills ratio and cost optimization
│   ├── retain-detain/
│   │   └── page.tsx          # 9-grid retain/detain system
│   ├── risk-parameters/
│   │   └── page.tsx          # Risk methodology documentation
│   ├── strategic-insights/
│   │   └── page.tsx          # Strategic planning + training
│   └── top-learners/
│       └── page.tsx          # Training leaderboard (top 50)
├── competency/
│   ├── page.tsx               # Competency models
│   └── layout.tsx
├── employees/
│   ├── page.tsx               # Employee directory
│   └── layout.tsx
└── succession/
    ├── page.tsx               # Succession planning
    └── layout.tsx

components/
├── sidebar.tsx                # Navigation sidebar (10 items)
├── header.tsx                 # Top header bar
├── FloatingChat.tsx           # AI assistant with golden theme
├── BenchmarkSystem.tsx        # Industry benchmarks
├── SkillsTraining.tsx         # Training programs component
├── AttritionInsights.tsx      # AI predictions component
├── SkillRatioComparison.tsx   # Skills optimizer component
├── RetainDetainGrid.tsx       # 9-grid talent matrix
├── RiskParameters.tsx         # Risk parameters component
├── EmployeeDialog.tsx         # Employee detail modal
└── ui/                        # Reusable UI components

lib/
└── supabase.ts                # Supabase client configuration
\`\`\`

## Theme & Design System

### Color Palette

**Primary Colors:**
- **Pure Black**: #000000 (main backgrounds)
- **Dark Black**: #1a1a1a (secondary backgrounds)
- **Medium Black**: #2a2a2a (tertiary backgrounds)
- **Signal Gold**: #B58342 (primary accent)
- **Light Gold**: #d4a05a (secondary accent)

**UI Elements:**
- Borders: Golden with 20-30% opacity
- Glass cards: bg-black/40 backdrop-blur-xl
- Gradients: from-[#B58342] to-[#d4a05a]
- Text: White, slate-300, slate-400

**Navigation:**
- Active state: Golden background
- Hover state: White with 10% opacity
- Sidebar: Black gradient with golden border

## Features by Page

### Main Dashboard
- **Key Metrics**: Total workforce, attrition risk score, critical risk count
- **Risk Analysis**: Top 5 high-risk employees with scores
- **Trends**: 6-month competency performance chart
- **Benchmarks**: Industry comparison system

### AI Insights
- **Risk Distribution**: Color-coded employee segmentation
- **Predictions**: Machine learning risk scores (0-100)
- **Timeline**: Predicted attrition patterns by quarter
- **Analytics**: Advanced statistical models

### Skills Optimizer
- **Upskilling Analysis**: Gap analysis and cost projections
- **Ratio Comparison**: Senior/junior workforce balance
- **Cost Savings**: Potential savings ($355K+ annually)
- **Strategic Recommendations**: Priority actions and planning

### Retain/Detain Grid
- **9-Box Matrix**: Performance vs. potential talent segmentation
- **Strategic Actions**: Retain/develop/monitor/detain
- **Visual Distribution**: Interactive grid with counts

### Risk Parameters
- **Methodology**: Comprehensive scoring documentation
- **Factors**: Attrition, performance, satisfaction metrics
- **Thresholds**: Risk level definitions

### Strategic Insights
- **Workforce Planning**: Priority actions and strategy
- **Training Programs**: 4 comprehensive programs
- **ROI Metrics**: Investment and productivity gains

### Top Learners
- **Leaderboard**: Top 50 employees by training
- **Tiered Display**: Elite/Advanced/Active learners
- **Statistics**: Top performer metrics

## Development Commands

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

## Recent Updates

### Color Scheme Transformation
- Migrated from teal/blue to pure black + golden
- Updated all 10+ pages and components
- Landing page: White "Mindpex" + golden tagline

### Dashboard Reorganization
- Moved 6 major sections to dedicated pages
- Cleaner main dashboard (70% reduction)
- Improved navigation with logical grouping

### New Pages Added
- AI Insights (attrition predictions)
- Skills Optimizer (ratio + cost savings)
- Retain/Detain Grid (9-box matrix)
- Risk Parameters (methodology)
- Strategic Insights (planning + training)
- Top Learners (50 employee leaderboard)

---

**Made with Claude Code** 🤖

**Mindpex Talent Intelligence Platform** - Predictive Workforce Analytics & Succession Planning
