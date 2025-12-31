# ProTech HVAC - Strategic Event Tracking Plan

**Goal:** Understand user behavior, needs, and intent without overwhelming event logs

---

## Your Key Questions & How We'll Answer Them

### **1. What pages are they visiting?**
**Track:** Page visits with context
- Homepage
- Service pages (which services interest them?)
- Location pages (which areas?)
- Contact page

### **2. How long did they stay?**
**Track:** Engagement duration
- Time on page (via engagement events)
- Scroll depth (25%, 50%, 75%, 100%)
- Section viewing time

### **3. What did they do?**
**Track:** User actions
- Clicked phone number (ready to call)
- Clicked CTA button (high intent)
- Viewed contact form (considering contact)
- Submitted form (conversion)
- Clicked service card (researching)

### **4. What do they need?**
**Track:** Intent signals
- Which services they view (AC repair? Heating? Installation?)
- Emergency vs. scheduled service interest
- Price/quote interest
- Location-specific needs

---

## Strategic Event Structure

### **Core Journey Events (Always Track)**

#### **1. Page Navigation**
```
Event: PageView
Parameters:
  - page_type: homepage | service | location | contact
  - page_name: Specific page
  - location: User's detected location
```
**Tells you:** Where users go, which pages are popular

#### **2. Service Interest**
```
Event: ServiceViewed
Parameters:
  - service_name: AC Repair, Heating Installation, etc.
  - service_category: repair | installation | maintenance
  - location: Service area
  - estimated_value: Potential service value
```
**Tells you:** What services users need, which are most popular

#### **3. Contact Intent**
```
Event: ContactIntentShown
Parameters:
  - intent_type: phone_click | form_view | cta_click
  - page_source: Where they showed intent
  - service_context: What service they were viewing
```
**Tells you:** When users are ready to contact, what triggered it

#### **4. Conversion**
```
Event: Lead | Contact | Schedule
Parameters:
  - service_requested: What they want
  - urgency: emergency | scheduled
  - location: Service area
  - source_page: Where they converted
```
**Tells you:** What converts users, which pages drive conversions

---

### **Engagement Events (Track Selectively)**

#### **5. Engagement Depth**
```
Event: EngagementMilestone
Parameters:
  - milestone_type: scroll_50 | time_30s | time_60s
  - page_type: What page they're engaged with
  - content_viewed: What they're reading
```
**Tells you:** How engaged users are, quality of traffic

#### **6. High-Value Actions**
```
Event: HighValueAction
Parameters:
  - action_type: phone_click | quote_request | emergency_click
  - service_context: What service
  - urgency_indicator: emergency | scheduled
```
**Tells you:** User urgency and intent level

---

## Clean Event Log Example

### **Scenario: User needs AC repair**

**What you'll see:**
```
1. PageView (homepage)
   - page_type: homepage
   - location: Cleveland, OH

2. ServiceViewed (AC Repair)
   - service_name: AC Repair
   - service_category: repair
   - estimated_value: $300

3. EngagementMilestone (50% scroll)
   - milestone_type: scroll_50
   - page_type: service

4. ContactIntentShown (phone click)
   - intent_type: phone_click
   - service_context: AC Repair
   
5. Lead (form submission)
   - service_requested: AC Repair
   - urgency: emergency
   - location: Cleveland, OH
```

**What you learn:**
- User from Cleveland needs AC repair
- They researched the service (50% scroll)
- High intent (clicked phone)
- Converted (submitted form)
- Emergency need (urgency indicator)
- **Total: 5 clear, actionable events**

---

## User Journey Mapping

### **Journey 1: Research → Contact**
```
PageView → ServiceViewed → EngagementMilestone → ContactIntentShown → Lead
```
**Insight:** User researched, engaged, and converted (ideal journey)

### **Journey 2: Quick Decision**
```
PageView → ContactIntentShown → Lead
```
**Insight:** User already knew what they wanted (emergency or referral)

### **Journey 3: Comparison Shopping**
```
PageView → ServiceViewed (Service A) → ServiceViewed (Service B) → ServiceViewed (Service C) → Exit
```
**Insight:** User comparing services but didn't convert (retargeting opportunity)

### **Journey 4: Location Research**
```
PageView → LocationViewed → ServiceViewed → ContactIntentShown
```
**Insight:** User checking if you serve their area, then interested in service

---

## What Each Event Tells You

### **PageView**
- **Traffic source:** Where users come from
- **Popular pages:** What content attracts users
- **Navigation patterns:** How users move through site

### **ServiceViewed**
- **Service demand:** Which services are most needed
- **Seasonal trends:** AC in summer, heating in winter
- **Price sensitivity:** High-value vs. low-value services

### **EngagementMilestone**
- **Content quality:** Are users reading or bouncing?
- **Page effectiveness:** Which pages engage users?
- **Traffic quality:** Engaged visitors vs. quick exits

### **ContactIntentShown**
- **Conversion readiness:** When users are ready to act
- **Friction points:** Where users hesitate
- **CTA effectiveness:** Which CTAs work best

### **Lead/Contact/Schedule**
- **Conversion rate:** How many visitors convert
- **Service mix:** What services drive conversions
- **Revenue potential:** Estimated value of leads

---

## Recommended Event Parameters

### **Every Event Should Include:**

1. **page_path** - Exact URL
2. **page_type** - Category (homepage, service, location, contact)
3. **user_location** - Detected location (Cleveland, Akron, etc.)
4. **session_duration** - Time since first page view
5. **timestamp** - When event occurred

### **Service Events Should Include:**

1. **service_name** - Specific service
2. **service_category** - repair | installation | maintenance | emergency
3. **estimated_value** - Potential revenue
4. **urgency_indicator** - emergency | scheduled | quote

### **Conversion Events Should Include:**

1. **conversion_type** - phone | form | chat | schedule
2. **service_requested** - What they want
3. **lead_quality** - hot | warm | cold (based on engagement)
4. **source_page** - Where they converted from

---

## Implementation Plan

### **Phase 1: Core Events (Implement First)**

✅ **PageView** - Already working
✅ **ServiceViewed** - Track service page visits
✅ **ContactIntentShown** - Track phone clicks, form views, CTA clicks
✅ **Lead/Contact** - Track conversions

**Result:** 2-4 events per visit, answers "What did they do?"

### **Phase 2: Engagement Tracking**

✅ **EngagementMilestone** - 50% scroll, 30s time, 60s time
✅ **HighValueAction** - Emergency clicks, quote requests

**Result:** +1-2 events for engaged users, answers "How long did they stay?"

### **Phase 3: Advanced Analytics (Optional)**

✅ **ServiceComparison** - Track when users view multiple services
✅ **LocationCheck** - Track location-specific interest
✅ **ReturnVisitor** - Track repeat visits

**Result:** Deep insights for optimization

---

## Event Naming Convention

### **Clear, Descriptive Names:**

| Event Name | What It Means | When It Fires |
|------------|---------------|---------------|
| PageView | User landed on page | Page load |
| ServiceViewed | User viewing service details | Service page visit |
| PhoneClicked | User clicked phone number | Phone link click |
| FormViewed | User saw contact form | Form visible |
| CTAClicked | User clicked call-to-action | CTA button click |
| Engaged_30s | User spent 30+ seconds | 30s on page |
| Scrolled_50 | User scrolled halfway | 50% scroll depth |
| Lead | User submitted form | Form submission |
| EmergencyRequest | User indicated emergency | Emergency button click |

**No more generic "ViewContent"** - every event name tells you exactly what happened

---

## Dashboard-Ready Structure

### **Questions You Can Answer:**

**"What services do users need?"**
```sql
Count ServiceViewed events
Group by service_name
Sort by count
```
**Result:** Top 5 services users are interested in

**"Which pages convert best?"**
```sql
Count Lead events
Group by source_page
Calculate conversion rate
```
**Result:** Homepage converts 5%, AC Repair page converts 12%

**"How engaged are users?"**
```sql
Count EngagementMilestone events
Calculate % of visitors who scroll 50%
Calculate average time on page
```
**Result:** 60% of users scroll halfway, average 45 seconds on page

**"What's the typical user journey?"**
```sql
Sequence events by session
Group by common patterns
```
**Result:** Most common path is Homepage → Service → Contact

---

## Clean Event Log Examples

### **Example 1: High-Intent User (Emergency)**
```
11:30:00 - PageView (homepage)
11:30:05 - EmergencyRequest (AC Repair)
11:30:10 - PhoneClicked
11:30:15 - Lead (form submitted)
```
**Insight:** Emergency need, converted in 15 seconds, high-value lead

### **Example 2: Research User**
```
11:30:00 - PageView (homepage)
11:30:15 - ServiceViewed (AC Repair)
11:30:45 - Engaged_30s
11:31:00 - Scrolled_50
11:31:30 - ServiceViewed (Heating Maintenance)
11:32:00 - CTAClicked
11:32:05 - FormViewed
11:32:30 - Lead (form submitted)
```
**Insight:** Thorough researcher, compared services, engaged content, converted after 2.5 minutes

### **Example 3: Bounce User**
```
11:30:00 - PageView (homepage)
11:30:05 - Exit
```
**Insight:** Quick exit, possible wrong audience or poor first impression

---

## Key Metrics Dashboard

### **Traffic Metrics**
- Total page views
- Unique visitors
- Pages per session
- Bounce rate

### **Engagement Metrics**
- Average time on page
- Scroll depth (% reaching 50%)
- Engaged sessions (30s+)
- Return visitor rate

### **Intent Metrics**
- Service views per session
- Phone clicks
- Form views
- CTA clicks

### **Conversion Metrics**
- Lead conversion rate
- Service-specific conversion rates
- Time to conversion
- Lead quality score

---

## Implementation Recommendation

### **Start with Phase 1 (Core Events):**

1. ✅ **PageView** - Already working
2. ✅ **ServiceViewed** - Add to service pages
3. ✅ **PhoneClicked** - Track phone number clicks
4. ✅ **FormViewed** - Track when form becomes visible
5. ✅ **CTAClicked** - Track CTA button clicks
6. ✅ **Lead/Contact** - Already working

**Result:** 
- **Simple visit:** 1-2 events (PageView + exit)
- **Engaged visit:** 3-5 events (PageView + ServiceViewed + engagement)
- **Conversion:** 4-6 events (PageView + engagement + intent + Lead)

**Clean, understandable, actionable**

---

## Next Steps

**Would you like me to implement Phase 1?**

I'll:
1. ✅ Keep PageView (working)
2. ✅ Add ServiceViewed (service page tracking)
3. ✅ Add PhoneClicked (phone number clicks)
4. ✅ Add FormViewed (form visibility)
5. ✅ Add CTAClicked (CTA button clicks)
6. ✅ Keep Lead/Contact (working)
7. ❌ Remove noisy Hero/generic ViewContent events

**This will give you:**
- Clear understanding of user journey
- Answers to all your key questions
- 2-6 events per visit (not overwhelming)
- Dashboard-ready data structure
- Actionable insights for optimization

**Ready to implement?**
