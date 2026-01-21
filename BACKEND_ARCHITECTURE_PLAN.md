# Mindpex Backend Architecture Plan

## Overview
Transform the current frontend-only Mindpex MVP into a fully functional application with proper backend API integration, authentication, data persistence, and third-party service integrations.

**Current State:** Client-side React app with direct Supabase queries, mock data, and localStorage fallbacks
**Target State:** Production-ready SaaS with secure API layer, proper authentication, and all interactive features functional

---

## Architecture Overview

### Technology Stack Recommendation

**Backend Framework:** Next.js 14 App Router with API Routes
- Already using Next.js for frontend
- Built-in API routes at `/app/api/`
- Server Actions for form submissions
- Middleware for authentication guards

**Database:** Supabase (PostgreSQL)
- Already configured
- Row Level Security (RLS) policies
- Real-time subscriptions capability
- Built-in authentication

**Additional Services:**
- **Email:** Resend or SendGrid for transactional emails
- **File Storage:** Supabase Storage for invoices/documents
- **AI Integration:** Anthropic Claude API or OpenAI for chat assistant
- **Payment Processing:** Stripe or Razorpay (for Indian market)
- **Analytics:** Posthog or Mixpanel for user tracking

---

## Phase 1: Core Infrastructure Setup

### 1.1 Database Schema Design

**New Tables Needed:**

```sql
-- Interventions tracking
CREATE TABLE interventions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id INT REFERENCES employees(id),
  pattern_type VARCHAR(50), -- 'burnout', 'promotion', 'satisfaction', etc.
  detected_pattern TEXT,
  why_it_matters TEXT,
  recommended_action TEXT,
  status VARCHAR(20), -- 'pending', 'started', 'completed'
  days_active INT,
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Organization settings
CREATE TABLE organization_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id),
  sensitivity_level VARCHAR(20), -- 'low', 'standard', 'high'
  cooldown_period INT, -- days
  playbook_low_performance BOOLEAN DEFAULT true,
  playbook_overwork_burnout BOOLEAN DEFAULT true,
  playbook_promotion_overdue BOOLEAN DEFAULT true,
  playbook_low_satisfaction BOOLEAN DEFAULT true,
  playbook_long_commute BOOLEAN DEFAULT false,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Support tickets
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  type VARCHAR(20), -- 'message', 'call', 'email'
  message TEXT,
  contact_info JSONB, -- {name, phone, email}
  context JSONB, -- {page, section, orgId}
  status VARCHAR(20) DEFAULT 'open', -- 'open', 'in_progress', 'closed'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Session bookings
CREATE TABLE session_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  session_type VARCHAR(50),
  preferred_date DATE,
  preferred_time TIME,
  contact_info JSONB,
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Billing & Subscriptions
CREATE TABLE billing_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id),
  plan_type VARCHAR(50), -- 'starter', 'professional', 'enterprise'
  billing_cycle VARCHAR(20), -- 'monthly', 'quarterly', 'half-yearly', 'yearly'
  active_employees INT,
  pepm_rate DECIMAL(10,2), -- Price per employee per month
  mrr DECIMAL(10,2), -- Monthly recurring revenue
  next_billing_date DATE,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID REFERENCES billing_subscriptions(id),
  invoice_date DATE,
  amount DECIMAL(10,2),
  employee_count INT,
  status VARCHAR(20), -- 'paid', 'pending', 'overdue'
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id),
  type VARCHAR(20), -- 'primary', 'backup'
  card_brand VARCHAR(50),
  last_four VARCHAR(4),
  expiry_month INT,
  expiry_year INT,
  stripe_payment_method_id TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Audit logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id),
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(100),
  resource_type VARCHAR(50),
  resource_id TEXT,
  metadata JSONB,
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Organizations table (if not exists)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255),
  industry VARCHAR(100),
  size VARCHAR(50),
  country VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- User roles and permissions
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  org_id UUID REFERENCES organizations(id),
  role VARCHAR(50), -- 'admin', 'manager', 'viewer'
  permissions JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 1.2 Row Level Security (RLS) Policies

Enable RLS on all tables and create policies:

```sql
-- Example: Interventions table
ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view interventions in their org"
  ON interventions FOR SELECT
  USING (
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.org_id = interventions.org_id
    )
  );

CREATE POLICY "Users can update their assigned interventions"
  ON interventions FOR UPDATE
  USING (assigned_to = auth.uid());
```

### 1.3 API Route Structure

Create organized API routes in `/app/api/`:

```
/app/api/
├── auth/
│   ├── login/route.ts
│   ├── logout/route.ts
│   ├── refresh/route.ts
│   ├── forgot-password/route.ts
│   └── reset-password/route.ts
├── interventions/
│   ├── route.ts (GET list, POST create)
│   └── [id]/
│       ├── route.ts (GET, PATCH, DELETE)
│       └── status/route.ts (PATCH status)
├── billing/
│   ├── subscription/route.ts
│   ├── invoices/route.ts
│   ├── invoices/[id]/download/route.ts
│   └── payment-methods/route.ts
├── settings/
│   ├── organization/route.ts
│   ├── detection/route.ts
│   └── playbooks/route.ts
├── support/
│   ├── message/route.ts
│   ├── call-request/route.ts
│   └── tickets/route.ts
├── sessions/
│   └── book/route.ts
├── insights/
│   ├── metrics/route.ts
│   ├── patterns/route.ts
│   └── effectiveness/route.ts
├── employees/
│   ├── route.ts
│   └── [id]/route.ts
├── users/
│   ├── invite/route.ts
│   └── [id]/route.ts
├── audit-logs/
│   └── route.ts
└── chat/
    └── message/route.ts
```

---

## Phase 2: Authentication & Authorization

### 2.1 Middleware Setup

**File:** `/middleware.ts`

```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired
  const { data: { session } } = await supabase.auth.getSession()

  // Protected routes
  const protectedPaths = ['/today', '/insights', '/billing', '/settings', '/access']
  const isProtected = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/today/:path*', '/insights/:path*', '/billing/:path*', '/settings/:path*', '/access/:path*']
}
```

### 2.2 Server-Side Auth Helpers

**File:** `/lib/auth-server.ts`

```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function getServerSession() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function requireAuth() {
  const session = await getServerSession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}

export async function getUserRole(userId: string) {
  const supabase = createServerComponentClient({ cookies })
  const { data } = await supabase
    .from('user_roles')
    .select('role, permissions')
    .eq('user_id', userId)
    .single()

  return data
}
```

---

## Phase 3: Core API Endpoints Implementation

### 3.1 Interventions API

**File:** `/app/api/interventions/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // 'pending', 'started', 'completed'

    let query = supabase
      .from('interventions')
      .select('*')
      .eq('assigned_to', session.user.id)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ interventions: data })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const { data, error } = await supabase
      .from('interventions')
      .insert({
        ...body,
        assigned_to: session.user.id,
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ intervention: data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

**File:** `/app/api/interventions/[id]/status/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { status } = await request.json()

    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    }

    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('interventions')
      .update(updateData)
      .eq('id', params.id)
      .eq('assigned_to', session.user.id)
      .select()
      .single()

    if (error) throw error

    // Log audit trail
    await supabase.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'intervention_status_updated',
      resource_type: 'intervention',
      resource_id: params.id,
      metadata: { new_status: status }
    })

    return NextResponse.json({ intervention: data })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

### 3.2 Settings API

**File:** `/app/api/settings/organization/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's org_id from user_roles
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('org_id')
      .eq('user_id', session.user.id)
      .single()

    const { data, error } = await supabase
      .from('organization_settings')
      .select('*')
      .eq('org_id', roleData.org_id)
      .single()

    if (error) throw error

    return NextResponse.json({ settings: data })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Get user's org_id
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('org_id, role')
      .eq('user_id', session.user.id)
      .single()

    // Check if user has admin role
    if (roleData.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('organization_settings')
      .upsert({
        org_id: roleData.org_id,
        ...body,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    // Log audit trail
    await supabase.from('audit_logs').insert({
      user_id: session.user.id,
      org_id: roleData.org_id,
      action: 'settings_updated',
      resource_type: 'organization_settings',
      metadata: body
    })

    return NextResponse.json({ settings: data })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

### 3.3 Support API

**File:** `/app/api/support/message/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, context } = await request.json()

    // Save to database
    const { data: ticket, error } = await supabase
      .from('support_tickets')
      .insert({
        user_id: session.user.id,
        type: 'message',
        message,
        context,
        status: 'open'
      })
      .select()
      .single()

    if (error) throw error

    // Send email notification to support team
    await resend.emails.send({
      from: 'Mindpex Support <support@mindpex.com>',
      to: 'support@mindpex.com',
      subject: `New Support Request from ${session.user.email}`,
      html: `
        <h2>New Support Request</h2>
        <p><strong>From:</strong> ${session.user.email}</p>
        <p><strong>Context:</strong> ${context.page}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <p><strong>Ticket ID:</strong> ${ticket.id}</p>
      `
    })

    // Send confirmation email to user
    await resend.emails.send({
      from: 'Mindpex Support <support@mindpex.com>',
      to: session.user.email,
      subject: 'We received your support request',
      html: `
        <h2>Thank you for contacting Mindpex Support</h2>
        <p>We've received your message and will respond within 1 business day.</p>
        <p><strong>Your message:</strong></p>
        <p>${message}</p>
        <p><strong>Reference ID:</strong> ${ticket.id}</p>
      `
    })

    return NextResponse.json({
      success: true,
      ticket_id: ticket.id
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

### 3.4 Billing API

**File:** `/app/api/billing/subscription/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get org_id
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('org_id')
      .eq('user_id', session.user.id)
      .single()

    const { data, error } = await supabase
      .from('billing_subscriptions')
      .select('*')
      .eq('org_id', roleData.org_id)
      .single()

    if (error) throw error

    return NextResponse.json({ subscription: data })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { billing_cycle } = await request.json()

    // Get org_id
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('org_id, role')
      .eq('user_id', session.user.id)
      .single()

    // Check admin permission
    if (roleData.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('billing_subscriptions')
      .update({ billing_cycle })
      .eq('org_id', roleData.org_id)
      .select()
      .single()

    if (error) throw error

    // Log audit trail
    await supabase.from('audit_logs').insert({
      user_id: session.user.id,
      org_id: roleData.org_id,
      action: 'billing_cycle_updated',
      resource_type: 'subscription',
      metadata: { new_cycle: billing_cycle }
    })

    return NextResponse.json({ subscription: data })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

---

## Phase 4: Client-Side Integration

### 4.1 API Client Utility

**File:** `/lib/api-client.ts`

```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

class APIClient {
  private baseUrl = '/api'
  private supabase = createClientComponentClient()

  private async getAuthHeaders() {
    const { data: { session } } = await this.supabase.auth.getSession()
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`
    }
  }

  async get(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: await this.getAuthHeaders()
    })
    return response.json()
  }

  async post(endpoint: string, data: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return response.json()
  }

  async patch(endpoint: string, data: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return response.json()
  }

  async delete(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders()
    })
    return response.json()
  }
}

export const apiClient = new APIClient()
```

### 4.2 Update Today Page to Use API

**Replace in:** `/app/today/page.tsx`

```typescript
// OLD: Local state update
const updateInterventionStatus = (id: string, status: 'started' | 'completed') => {
  setInterventions(prevInterventions => {
    const updated = prevInterventions.map(intervention =>
      intervention.id === id ? { ...intervention, status } : intervention
    )
    // ... rest of logic
  })
}

// NEW: API integration
const updateInterventionStatus = async (id: string, status: 'started' | 'completed') => {
  try {
    const result = await apiClient.patch(`/interventions/${id}/status`, { status })

    if (result.error) {
      showToast('Failed to update intervention', 'red')
      return
    }

    // Update local state after successful API call
    setInterventions(prevInterventions =>
      prevInterventions.map(intervention =>
        intervention.id === id ? { ...intervention, status } : intervention
      )
    )

    showToast(
      status === 'started' ? 'Intervention tracking started' : 'Intervention completed',
      status === 'started' ? 'blue' : 'green'
    )
  } catch (error) {
    showToast('Network error', 'red')
  }
}
```

### 4.3 Update Settings Page to Use API

**Replace in:** `/app/settings/page.tsx`

```typescript
// OLD: Mock save
const handleSave = async () => {
  setIsSaving(true)
  await new Promise(resolve => setTimeout(resolve, 1000))
  setIsSaving(false)
  setIsSaved(true)
}

// NEW: API integration
const handleSave = async () => {
  setIsSaving(true)

  try {
    const result = await apiClient.post('/settings/organization', {
      sensitivity_level: sensitivityLevel,
      cooldown_period: parseInt(cooldownPeriod),
      playbook_low_performance: playbooks.lowPerformance,
      playbook_overwork_burnout: playbooks.overworkBurnout,
      playbook_promotion_overdue: playbooks.promotionOverdue,
      playbook_low_satisfaction: playbooks.lowSatisfaction,
      playbook_long_commute: playbooks.longCommute,
      // ... other organization settings
    })

    if (result.error) {
      alert('Failed to save settings: ' + result.error)
    } else {
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    }
  } catch (error) {
    alert('Network error')
  } finally {
    setIsSaving(false)
  }
}

// Fetch settings on mount
useEffect(() => {
  async function fetchSettings() {
    const result = await apiClient.get('/settings/organization')
    if (result.settings) {
      setSensitivityLevel(result.settings.sensitivity_level)
      setCooldownPeriod(result.settings.cooldown_period.toString())
      setPlaybooks({
        lowPerformance: result.settings.playbook_low_performance,
        overworkBurnout: result.settings.playbook_overwork_burnout,
        promotionOverdue: result.settings.playbook_promotion_overdue,
        lowSatisfaction: result.settings.playbook_low_satisfaction,
        longCommute: result.settings.playbook_long_commute,
      })
    }
  }
  fetchSettings()
}, [])
```

### 4.4 Update Support Drawer to Use API

**Replace in:** `/components/SupportDrawer.tsx`

```typescript
// OLD: Mock submission
const handleSubmitMessage = () => {
  console.log('Message submitted:', { messageText, context })
  setSubmitted(true)
  setTimeout(() => {
    setSubmitted(false)
    setMessageText('')
    onClose()
  }, 2000)
}

// NEW: API integration
const handleSubmitMessage = async () => {
  try {
    const result = await apiClient.post('/support/message', {
      message: messageText,
      context
    })

    if (result.error) {
      alert('Failed to submit message')
      return
    }

    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setMessageText('')
      onClose()
    }, 2000)
  } catch (error) {
    alert('Network error')
  }
}
```

---

## Phase 5: Third-Party Integrations

### 5.1 Email Service (Resend)

**Setup:**
1. Sign up at resend.com
2. Add API key to `.env.local`: `RESEND_API_KEY=re_xxx`
3. Install: `npm install resend`

**Usage in API routes:**
```typescript
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'Mindpex <notifications@mindpex.com>',
  to: user.email,
  subject: 'Your Subject',
  html: '<p>Email content</p>'
})
```

### 5.2 Payment Processing (Stripe for Global / Razorpay for India)

**For Indian market (Razorpay):**
1. Sign up at razorpay.com
2. Add keys: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
3. Install: `npm install razorpay`

**File:** `/app/api/billing/create-payment/route.ts`

```typescript
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

export async function POST(request: NextRequest) {
  const { amount, currency = 'INR' } = await request.json()

  const order = await razorpay.orders.create({
    amount: amount * 100, // Convert to paise
    currency,
    receipt: `receipt_${Date.now()}`
  })

  return NextResponse.json({ order })
}
```

### 5.3 AI Chat Integration (Anthropic Claude API)

**File:** `/app/api/chat/message/route.ts`

```typescript
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json()

    // Fetch relevant context from database
    const supabase = createServerComponentClient({ cookies })
    const { data: metrics } = await supabase
      .from('insights_metrics')
      .select('*')
      .single()

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        ...conversationHistory,
        {
          role: 'user',
          content: message
        }
      ],
      system: `You are an AI assistant for Mindpex, an HR analytics platform.
      Current metrics: ${JSON.stringify(metrics)}.
      Provide insights based on workforce data.`
    })

    return NextResponse.json({
      reply: response.content[0].text
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

---

## Phase 6: Environment Variables

**File:** `.env.local` (Complete list)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://lmogwfwmmtpxfdrwfjar.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_database_url
SUPABASE_JWT_SECRET=your_jwt_secret

# Email (Resend)
RESEND_API_KEY=re_xxx

# Payment (Razorpay for India)
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx

# AI (Anthropic Claude)
ANTHROPIC_API_KEY=sk-ant-xxx

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## Phase 7: Testing & Validation

### 7.1 API Testing Checklist

- [ ] Authentication flow (login, logout, session refresh)
- [ ] Intervention creation and status updates
- [ ] Settings persistence and retrieval
- [ ] Support ticket creation and email notifications
- [ ] Billing subscription updates
- [ ] Invoice generation and download
- [ ] Audit log creation
- [ ] User role permissions enforcement
- [ ] RLS policies working correctly
- [ ] Error handling for all endpoints

### 7.2 Security Checklist

- [ ] All API routes require authentication
- [ ] RLS policies enabled on all tables
- [ ] No sensitive data exposed in client
- [ ] Service role key never exposed to client
- [ ] CSRF protection (Next.js handles automatically)
- [ ] Rate limiting on API endpoints
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (using Supabase client)

---

## Critical Files to Modify

**High Priority:**
1. `app/today/page.tsx` - Add intervention API integration
2. `app/settings/page.tsx` - Add settings API integration
3. `components/SupportDrawer.tsx` - Add support ticket API
4. `app/billing/page.tsx` - Add billing API integration
5. `lib/supabase.ts` - Update to use server/client helpers properly

**New Files to Create:**
1. `middleware.ts` - Authentication middleware
2. `lib/api-client.ts` - API client utility
3. `lib/auth-server.ts` - Server-side auth helpers
4. `app/api/**/route.ts` - All API endpoints (20+ files)

---

## Implementation Timeline

**Week 1:** Database schema, RLS policies, auth middleware
**Week 2:** Core API endpoints (interventions, settings, support)
**Week 3:** Billing & payment integration
**Week 4:** Email service, AI chat integration
**Week 5:** Client-side integration, update all pages
**Week 6:** Testing, bug fixes, security audit
**Week 7:** Deployment, monitoring setup

---

## Deployment Considerations

1. **Next.js Config:** Change `output: 'export'` to enable API routes
2. **Hosting:** Use Vercel (recommended) or AWS with Node.js runtime
3. **Database:** Supabase cloud (already configured)
4. **CDN:** Vercel Edge Network or Cloudflare
5. **Monitoring:** Sentry for error tracking, PostHog for analytics
6. **CI/CD:** GitHub Actions for automated testing and deployment

---

## Cost Estimates (Monthly)

- Supabase: $25/month (Pro plan)
- Resend: $20/month (Email service)
- Razorpay: 2% per transaction
- Anthropic API: ~$100-500 (based on usage)
- Vercel Pro: $20/month
- **Total: ~$165-665/month** (excluding transaction fees)

---

## Next Steps After Backend Implementation

1. Add real-time features using Supabase Realtime
2. Implement notification system
3. Add export functionality for reports
4. Build admin dashboard for system monitoring
5. Implement webhooks for external integrations
6. Add multi-language support
7. Implement advanced analytics with time-series data
