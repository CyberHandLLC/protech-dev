# Analytics Unification Guide
## ProTech HVAC - Complete Analytics Strategy

---

## 📊 **Current Analytics Stack**

### **1. Meta Pixel (Facebook)**
- **Purpose:** Track conversions for Facebook/Instagram ads
- **What it tracks:** User actions, form submissions, page views
- **Why we use it:** Optimize Facebook ad campaigns, retargeting, conversion tracking

### **2. Google Analytics 4 (GA4)**
- **Purpose:** Understand user behavior and traffic sources
- **What it tracks:** Page views, user sessions, traffic sources, demographics
- **Why we use it:** SEO insights, content performance, user journey analysis

### **3. Vercel Analytics**
- **Purpose:** Performance monitoring and page view tracking
- **What it tracks:** Page views, performance metrics, visitor counts
- **Why we use it:** Simple page view tracking, performance monitoring

---

## 🎯 **Unified Event Tracking Strategy**

### **Key Events We Track**

| Event Name | Meta Pixel | Google Analytics | Vercel | Purpose |
|------------|------------|------------------|--------|---------|
| **PageView** | ✅ (with event_id) | ✅ | ✅ | Track all page visits |
| **SessionStart** | ✅ | ✅ | ❌ | User begins browsing |
| **SessionEnd** | ✅ | ✅ | ❌ | User leaves site |
| **FormStarted** | ✅ | ✅ | ❌ | User begins filling form |
| **FormCompleted** | ✅ (custom) | ✅ | ❌ | Form submission success |
| **Lead** | ✅ (standard + server) | ✅ | ❌ | Lead generation ($100 value) |
| **Schedule** | ✅ (standard + server) | ✅ | ❌ | Appointment request ($150 value) |
| **ContactPageViewed** | ✅ (custom) | ✅ | ❌ | User visits contact page |
| **PhoneClick** | ✅ | ✅ | ❌ | User clicks phone number |
| **EmailClick** | ✅ | ✅ | ❌ | User clicks email |
| **ServiceViewed** | ✅ | ✅ | ❌ | User views service page |
| **ScrollDepth** | ❌ | ✅ | ❌ | User scrolls 25%, 50%, 75%, 100% |
| **TimeOnPage** | ❌ | ✅ | ❌ | User spends time on page |

---

## 📁 **Analytics File Structure**

### **Core Analytics Components**
```
src/components/analytics/
├── FacebookPixel.tsx          # Meta Pixel initialization
├── GoogleAnalytics.tsx        # GA4 initialization
├── AnalyticsProvider.tsx      # Wraps all analytics
├── SessionTracker.tsx         # Session start/end
├── PageViewTracker.tsx        # Page view tracking
├── FormInteractionTracker.tsx # Form events (Lead, Schedule)
├── ContactFormTracker.tsx     # Google Analytics form tracking
├── ContactPageTracker.tsx     # Contact page view event
└── [Other specialized trackers]
```

### **Hooks**
```
src/hooks/
├── useFacebookEvents.ts       # Client-side Meta Pixel events
├── useFacebookServerEvents.ts # Server-side Conversions API
└── useGoogleTracking.ts       # Google Analytics events
```

### **Utilities**
```
src/utils/
├── facebookConversionsApi.ts  # Server-side Meta tracking
└── metaPixelHelpers.ts        # Helper functions for Meta Pixel
```

---

## 🔄 **Event Flow Diagram**

### **Form Submission Flow**
```
User fills form
    ↓
FormInteractionTracker detects completion
    ↓
Fires 3 events in parallel:
    ├─→ FormCompleted (custom) → Meta Pixel + GA
    ├─→ Lead (standard) → Meta Pixel (client + server) + GA
    └─→ Schedule (standard) → Meta Pixel (client + server) + GA
```

### **Page View Flow**
```
User visits page
    ↓
PageViewTracker fires
    ↓
Sends to all platforms:
    ├─→ Meta Pixel (with event_id for deduplication)
    ├─→ Google Analytics
    └─→ Vercel Analytics (automatic)
```

---

## 🎯 **What Each Platform Is Best For**

### **Meta Pixel (Facebook)**
**Best for:**
- ✅ Tracking conversions from Facebook/Instagram ads
- ✅ Building custom audiences for retargeting
- ✅ Optimizing ad campaigns based on conversions
- ✅ Measuring ROI of social media advertising

**Key Metrics:**
- Lead conversions ($100 value)
- Schedule conversions ($150 value)
- Event Match Quality (EMQ) score
- Cost per conversion

**Where to view:**
- [Facebook Events Manager](https://business.facebook.com/events_manager2)

---

### **Google Analytics 4**
**Best for:**
- ✅ Understanding where traffic comes from (SEO, direct, referral)
- ✅ Analyzing user behavior and journey
- ✅ Tracking content performance
- ✅ Demographics and interests data
- ✅ Conversion funnel analysis

**Key Metrics:**
- Page views and sessions
- Traffic sources (organic, direct, referral)
- User demographics
- Bounce rate and engagement
- Conversion paths

**Where to view:**
- [Google Analytics Dashboard](https://analytics.google.com/)

---

### **Vercel Analytics**
**Best for:**
- ✅ Simple page view counting
- ✅ Performance monitoring
- ✅ Quick visitor stats
- ✅ No configuration needed

**Key Metrics:**
- Total page views
- Top pages
- Visitor counts
- Performance scores

**Where to view:**
- [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → Analytics

---

## 🔧 **How Events Are Tracked**

### **1. Automatic Tracking (No Code Needed)**
These events fire automatically when components load:

- **PageView** - Every page load
- **SessionStart** - First page load in session
- **SessionEnd** - User leaves site
- **Vercel Analytics** - All page views

### **2. User Interaction Tracking**
These events fire when users interact:

- **FormStarted** - User focuses on form field
- **FormCompleted** - User submits form successfully
- **Lead** - Form submission (conversion event)
- **Schedule** - Form submission (conversion event)
- **PhoneClick** - User clicks phone number
- **EmailClick** - User clicks email address

### **3. Behavioral Tracking**
These events track user behavior:

- **ScrollDepth** - User scrolls down page
- **TimeOnPage** - User spends time reading
- **ServiceViewed** - User views service details

---

## 📈 **Conversion Tracking Setup**

### **Meta Pixel Conversions**
```typescript
// Lead Event (Form Submission)
fbq('track', 'Lead', {
  content_name: 'Service Inquiry',
  content_category: 'lead_generation',
  value: 100,
  currency: 'USD'
}, { eventID: unique_id });

// Schedule Event (Appointment Request)
fbq('track', 'Schedule', {
  content_name: 'HVAC Service Appointment Request',
  content_category: 'appointment_scheduling',
  value: 150,
  currency: 'USD'
}, { eventID: unique_id });
```

**Server-side tracking** (Conversions API) sends the same events with matching event IDs for deduplication.

### **Google Analytics Conversions**
```typescript
// Lead Event
gtag('event', 'generate_lead', {
  event_category: 'engagement',
  event_label: 'Service Inquiry Form',
  value: 100
});

// Schedule Event
gtag('event', 'schedule_appointment', {
  event_category: 'conversion',
  event_label: 'HVAC Service Appointment',
  value: 150
});
```

---

## 🎯 **Key Performance Indicators (KPIs)**

### **Meta Pixel KPIs**
- **Lead conversions** - How many form submissions
- **Cost per lead** - Ad spend ÷ leads
- **Event Match Quality** - Data quality score (aim for >6.0)
- **Return on Ad Spend (ROAS)** - Revenue ÷ ad spend

### **Google Analytics KPIs**
- **Organic traffic** - Visitors from Google search
- **Bounce rate** - % of single-page sessions
- **Average session duration** - Time spent on site
- **Conversion rate** - % of visitors who convert
- **Top landing pages** - Which pages bring traffic

### **Vercel Analytics KPIs**
- **Total page views** - Overall traffic
- **Top pages** - Most visited pages
- **Unique visitors** - Individual people visiting

---

## 🔍 **How to Monitor Each Platform**

### **Daily Checks**
1. **Vercel Analytics** (30 seconds)
   - Check total page views
   - Look for traffic spikes or drops
   
2. **Google Analytics** (2 minutes)
   - Check real-time visitors
   - Review traffic sources
   - Check top pages

3. **Meta Pixel** (2 minutes)
   - Check Event Manager for errors
   - Verify events are firing
   - Check Event Match Quality score

### **Weekly Reviews**
1. **Google Analytics**
   - Traffic trends (week over week)
   - Top traffic sources
   - Conversion funnel analysis
   - User demographics

2. **Meta Pixel**
   - Lead/Schedule conversion trends
   - Cost per conversion
   - Ad performance (if running ads)

### **Monthly Reports**
1. **Traffic Summary**
   - Total visitors (GA)
   - Total page views (Vercel + GA)
   - Traffic sources breakdown (GA)

2. **Conversion Summary**
   - Total leads (Meta + GA)
   - Total appointments (Meta + GA)
   - Conversion rate trends

3. **Performance Summary**
   - Top performing pages
   - Top traffic sources
   - User behavior insights

---

## 🚀 **Quick Access Links**

### **Analytics Dashboards**
- [Meta Events Manager](https://business.facebook.com/events_manager2)
- [Google Analytics 4](https://analytics.google.com/)
- [Vercel Analytics](https://vercel.com/dashboard)
- [Google Search Console](https://search.google.com/search-console)

### **Testing Tools**
- [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/) (Chrome Extension)
- [Google Tag Assistant](https://tagassistant.google.com/)
- [Facebook Test Events](https://business.facebook.com/events_manager2/test_events)

---

## 🎯 **Common Questions**

### **Q: Why do I see duplicate events in Meta Pixel?**
**A:** We use event IDs to deduplicate client-side and server-side events. Both fire, but Facebook only counts them once.

### **Q: Why track the same event in multiple platforms?**
**A:** Each platform serves a different purpose:
- Meta Pixel = Optimize Facebook ads
- Google Analytics = Understand user behavior
- Vercel = Simple page view tracking

### **Q: How do I know if tracking is working?**
**A:** Check:
1. Meta Pixel Helper extension (Chrome)
2. Google Analytics Real-Time report
3. Vercel Analytics dashboard

### **Q: What's the most important metric?**
**A:** Depends on your goal:
- **Running Facebook ads?** → Cost per lead (Meta Pixel)
- **Improving SEO?** → Organic traffic (Google Analytics)
- **General traffic?** → Page views (Vercel)

---

## 📝 **Next Steps**

1. ✅ **Bookmark analytics dashboards** for quick access
2. ✅ **Set up weekly review calendar** reminder
3. ✅ **Install Meta Pixel Helper** Chrome extension
4. ✅ **Create monthly report template** for tracking trends
5. ✅ **Set conversion goals** in Google Analytics

---

## 🔧 **Technical Implementation**

All analytics are initialized in:
- `src/app/layout.tsx` - Vercel Analytics component
- `src/components/ClientGlobalSEO.tsx` - Wraps Meta Pixel + GA
- `src/components/analytics/AnalyticsProvider.tsx` - Provides tracking context

Events are tracked via:
- Automatic trackers (PageView, Session)
- Form interaction tracker (Lead, Schedule)
- User action trackers (Phone, Email clicks)

---

**Last Updated:** January 5, 2026
