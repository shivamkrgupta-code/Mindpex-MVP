# Mindpex MVP - Employee Analytics Platform

A comprehensive Next.js application for employee performance analytics, competency tracking, and talent management with Supabase backend integration.

## 🚀 Project Overview

Mindpex MVP is a modern employee analytics platform built with Next.js 13, TypeScript, and Supabase. It provides comprehensive tools for tracking employee performance, competency gaps, and talent development through advanced analytics and visualization.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Setup Instructions](#setup-instructions)
- [Environment Configuration](#environment-configuration)
- [Database Migrations](#database-migrations)
- [API Documentation](#api-documentation)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

### Core Functionality
- **Employee Management**: Comprehensive employee data tracking and management
- **Performance Analytics**: Advanced performance rating and analysis tools
- **Competency Tracking**: Skill gap analysis and competency development tracking
- **Nine-Box Grid**: Talent assessment and succession planning visualization
- **Role-Based Access Control**: Secure multi-level access management
- **Real-time Analytics**: Live performance dashboards and insights

### Analytics Features
- **Competency Gap Analysis**: Automated calculation of skill gaps
- **Promotion Readiness Assessment**: AI-powered readiness evaluation
- **Performance Trend Analysis**: Historical performance tracking
- **Talent Pipeline Management**: Succession planning and development paths

### User Interface
- **Modern Design**: Clean, responsive UI built with Tailwind CSS
- **Component Library**: Comprehensive Radix UI component system
- **Dark/Light Mode**: Theme switching capabilities
- **Interactive Dashboards**: Real-time data visualization with Recharts
- **Form Management**: Advanced form handling with React Hook Form

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 13.5.1
- **Language**: TypeScript 5.2.2
- **Styling**: Tailwind CSS 3.3.3
- **UI Components**: Radix UI (Complete component library)
- **Charts**: Recharts 2.12.7
- **Forms**: React Hook Form 7.53.0
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

```
Mindpex-MVP-main/
├── components.json              # Radix UI component configuration
├── next.config.js              # Next.js configuration
├── package.json                 # Dependencies and scripts
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── postcss.config.js            # PostCSS configuration
├── supabase-config.txt          # Environment variables template
├── README.md                    # This file
├── supabase/                    # Supabase configuration
│   ├── config.toml             # Supabase local development config
│   └── migrations/             # Database migration files
│       ├── 20251021123636_remote_schema.sql
│       ├── 20251021143218_remote_schema.sql
│       ├── 20251021143737_remote_schema.sql
│       └── 20251022060026_remote_schema.sql
└── node_modules/                # Dependencies
```

## 🗄 Database Schema

### Core Tables

#### `employees`
Primary employee data table with comprehensive employee information:
- `employee_number` (Primary Key)
- `job_level`, `job_role`, `department`
- `education`, `education_field`
- `performance_rating`, `business_travel`, `over_time`
- `attrition`, `monthly_income`, `hourly_rate`
- `age`, `gender`, `marital_status`
- `years_at_company`, `years_in_current_role`
- `competency_gap_score`, `potential_score`
- `promotion_readiness_flag`

#### `job_roles`
Job role definitions and management:
- `role_id` (Primary Key)
- `role_name` (Unique)

#### `target_competencies`
Competency requirements for different roles:
- `target_id` (Primary Key)
- `role_id` (Foreign Key to job_roles)
- `competency_name`
- `required_level` (1-5 scale)
- `user_id` (Foreign Key to auth.users)

#### `user_roles`
User access control and permissions:
- `user_id` (Primary Key, Foreign Key to auth.users)
- `app_role` (administrator, viewer, employee)

### Database Functions

#### `calculate_competency_gap(employee_id)`
Calculates competency gap scores for employees based on:
- Current role requirements
- Employee's experience and involvement
- Performance metrics

#### `check_promotion_readiness(employee_id)`
Evaluates promotion readiness based on:
- Competency gap scores (≥80% threshold)
- Performance ratings
- Potential score classification

#### `set_target_competency_user_id()`
Trigger function that automatically assigns user IDs to competency records.

### Views

#### `nine_box_grid_all`
Complete employee data for nine-box grid analysis.

#### `nine_box_grid_data_v2`
Advanced analytics view with:
- Income percentile calculations
- Performance-based potential scoring
- Promotion readiness assessment

#### `nine_box_grid_data`
Simplified view for frontend consumption.

### Security Policies

Comprehensive Row Level Security (RLS) policies for:
- **Administrators**: Full access to all employee data
- **Viewers**: Read-only access to employee data
- **Employees**: Access to their own data only
- **Public**: Limited access to job roles

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase CLI
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Mindpex-MVP-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   ```bash
   # Install Supabase CLI (if not already installed)
   npm install -g supabase
   
   # Initialize Supabase (if not already done)
   supabase init
   
   # Start local development
   supabase start
   ```

4. **Configure environment variables**
   ```bash
   # Copy the template
   cp supabase-config.txt .env.local
   
   # Edit .env.local with your actual values
   ```

5. **Run database migrations**
   ```bash
   supabase db push
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Environment Configuration

### Required Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database URL (Transaction Mode Pooler Connection String)
DATABASE_URL=postgresql://postgres.lmogwfwmmtpxfdrwfjar:[YOUR-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres

# Supabase Project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co

# Supabase Anon Key (for client-side operations)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Supabase Service Role Key (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Supabase Configuration

The project includes a comprehensive Supabase configuration in `supabase/config.toml`:

- **API**: Port 54321 with public and graphql_public schemas
- **Database**: PostgreSQL 17 on port 54322
- **Studio**: Supabase Studio on port 54323
- **Auth**: JWT-based authentication with 1-hour expiry
- **Storage**: 50MiB file size limit
- **Realtime**: Enabled for live updates

## 🗃 Database Migrations

### Migration History

1. **20251021123636_remote_schema.sql** - Initial schema
   - Core tables (employees, job_roles, target_competencies, user_roles)
   - Database functions and triggers
   - RLS policies and security

2. **20251021143218_remote_schema.sql** - Security updates
   - Enhanced security policies
   - Audit logging improvements
   - Permission refinements

3. **20251021143737_remote_schema.sql** - Additional features
   - Extended functionality
   - Performance optimizations

4. **20251022060026_remote_schema.sql** - Latest updates
   - Final schema refinements
   - Production-ready optimizations

### Migration Commands

```bash
# Apply all migrations
supabase db push

# Check migration status
supabase migration list

# Repair migration history (if needed)
supabase migration repair --status applied <migration_id>

# Reset database
supabase db reset
```

## 📊 API Documentation

### Supabase Client Usage

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Fetch employees
const { data: employees } = await supabase
  .from('employees')
  .select('*')

// Calculate competency gap
const { data } = await supabase
  .rpc('calculate_competency_gap', { employee_id: 123 })

// Check promotion readiness
const { data } = await supabase
  .rpc('check_promotion_readiness', { employee_id: 123 })
```

### Key API Endpoints

- **Employees**: `/api/employees` - CRUD operations
- **Analytics**: `/api/analytics` - Performance metrics
- **Competencies**: `/api/competencies` - Skill tracking
- **Reports**: `/api/reports` - Generated reports

## 🔄 Development Workflow

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks

# Supabase
supabase start       # Start local Supabase
supabase stop        # Stop local Supabase
supabase status      # Check status
supabase db pull     # Pull remote schema
supabase db push     # Push local changes
```

### Development Guidelines

1. **Code Style**: Follow ESLint configuration
2. **Type Safety**: Use TypeScript for all new code
3. **Components**: Use Radix UI components when possible
4. **Styling**: Use Tailwind CSS classes
5. **Database**: Always use migrations for schema changes
6. **Security**: Implement proper RLS policies

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Supabase Deployment

```bash
# Deploy to Supabase
supabase db push

# Link to production project
supabase link --project-ref <your-project-ref>

# Deploy migrations
supabase db push
```

### Environment Setup

1. Configure production environment variables
2. Set up Supabase project
3. Run database migrations
4. Deploy to your hosting platform

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards

- Use TypeScript for all new code
- Follow existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all migrations are tested

## 📝 Recent Updates

### Latest Changes (October 2025)

1. **Database Schema Fixes**
   - Fixed SQL syntax errors in migration files
   - Standardized column naming conventions
   - Updated function definitions and triggers

2. **Security Enhancements**
   - Improved RLS policies
   - Enhanced user role management
   - Better access control implementation

3. **Performance Optimizations**
   - Optimized database queries
   - Improved function performance
   - Enhanced view definitions

4. **Migration History Repair**
   - Synchronized local and remote migrations
   - Fixed migration history mismatches
   - Ensured proper schema deployment

## 🔒 Security Features

- **Row Level Security (RLS)**: Comprehensive data access control
- **JWT Authentication**: Secure user authentication
- **Role-Based Access**: Multi-level permission system
- **Data Validation**: Input sanitization and validation
- **Audit Logging**: Comprehensive activity tracking

## 📈 Performance Features

- **Optimized Queries**: Efficient database operations
- **Caching**: Strategic data caching
- **Real-time Updates**: Live data synchronization
- **Responsive Design**: Mobile-first approach
- **Fast Loading**: Optimized bundle sizes

## 🎯 Future Roadmap

- [ ] Advanced analytics dashboard
- [ ] Machine learning integration
- [ ] Mobile application
- [ ] API rate limiting
- [ ] Advanced reporting features
- [ ] Integration with HR systems
- [ ] Automated insights generation

## 📞 Support

For support and questions:
- Check the documentation
- Review existing issues
- Create a new issue with detailed information
- Contact the development team

---

**Built with ❤️ using Next.js, TypeScript, and Supabase**
