# Analytics Dashboard Quick Reference
## ProTech HVAC - Where to Find What

---

## 🎯 **Quick Links**

| Platform | URL | What to Check |
|----------|-----|---------------|
| **Meta Events Manager** | [business.facebook.com/events_manager2](https://business.facebook.com/events_manager2) | Lead/Schedule conversions, Event Match Quality |
| **Google Analytics** | [analytics.google.com](https://analytics.google.com/) | Traffic sources, user behavior, demographics |
| **Vercel Analytics** | [vercel.com/dashboard](https://vercel.com/dashboard) | Page views, performance |
| **Google Search Console** | [search.google.com/search-console](https://search.google.com/search-console) | SEO performance, indexing |

---

## 📊 **What to Check Daily (5 minutes)**

### **1. Vercel Analytics** (1 minute)
**Go to:** Vercel Dashboard → Your Project → Analytics

**Check:**
- ✅ Total page views today
- ✅ Any unusual traffic spikes/drops
- ✅ Top 5 pages visited

**What's normal:**
- 50-200 page views per day (varies by season)
- Homepage and service pages should be top pages

---

### **2. Google Analytics Real-Time** (2 minutes)
**Go to:** GA4 → Reports → Real-time

**Check:**
- ✅ Current active users
- ✅ What pages they're viewing
- ✅ Where traffic is coming from

**What's normal:**
- 0-5 active users at any time
- Most traffic from Google organic search

---

### **3. Meta Events Manager** (2 minutes)
**Go to:** Events Manager → Overview

**Check:**
- ✅ Events received in last 24 hours
- ✅ Any error warnings (red indicators)
- ✅ Event Match Quality score (should be >6.0)

**What's normal:**
- PageView events every few minutes
- Lead/Schedule events when forms are submitted
- No red error warnings

---

## 📈 **What to Check Weekly (15 minutes)**

### **Google Analytics - Traffic Overview**
**Go to:** GA4 → Reports → Acquisition → Traffic acquisition

**Check:**
1. **Total Users** - Week over week comparison
2. **Traffic Sources:**
   - Organic Search (Google) - Should be 60-80%
   - Direct - Should be 10-20%
   - Referral - Should be 5-10%
3. **Top Landing Pages** - Which pages bring traffic
4. **Conversion Rate** - % of visitors who submit forms

**Actions:**
- If organic search drops → Check Google Search Console for issues
- If direct traffic increases → Good brand awareness
- If referral traffic increases → Check which sites are linking to you

---

### **Meta Pixel - Conversion Tracking**
**Go to:** Events Manager → Data Sources → Your Pixel → Overview

**Check:**
1. **Lead Events** - Total leads this week
2. **Schedule Events** - Total appointments this week
3. **Event Match Quality** - Should be >6.0
4. **Top Events** - PageView should be #1

**Actions:**
- If EMQ drops below 6.0 → Check for tracking errors
- If conversions drop → Check if forms are working
- If no events firing → Check Meta Pixel Helper extension

---

### **Vercel Analytics - Content Performance**
**Go to:** Vercel Dashboard → Analytics → Top Pages

**Check:**
1. **Most Visited Pages** - Which content is popular
2. **Traffic Trends** - Growing or declining
3. **Performance Scores** - Page load times

**Actions:**
- Promote popular pages on social media
- Improve content on low-traffic pages
- Optimize slow-loading pages

---

## 📊 **Monthly Report Checklist**

### **Traffic Summary**
- [ ] Total visitors (Google Analytics)
- [ ] Total page views (Vercel + GA)
- [ ] Traffic sources breakdown
- [ ] Top 10 pages by traffic
- [ ] Mobile vs Desktop split

### **Conversion Summary**
- [ ] Total form submissions (Meta + GA)
- [ ] Lead conversion rate
- [ ] Phone clicks (GA)
- [ ] Email clicks (GA)
- [ ] Top converting pages

### **SEO Performance**
- [ ] Google Search impressions (GSC)
- [ ] Average position in search (GSC)
- [ ] Click-through rate (GSC)
- [ ] New pages indexed (GSC)
- [ ] Top search queries (GSC)

### **User Behavior**
- [ ] Average session duration (GA)
- [ ] Bounce rate (GA)
- [ ] Pages per session (GA)
- [ ] Top exit pages (GA)

---

## 🚨 **Red Flags to Watch For**

### **Immediate Action Needed:**
- ❌ **Meta Pixel errors** in Events Manager
- ❌ **No events firing** for 24+ hours
- ❌ **Traffic drops >50%** suddenly
- ❌ **Event Match Quality <4.0**
- ❌ **Google Search Console errors**

### **Investigate Soon:**
- ⚠️ **Traffic drops 20-50%** week over week
- ⚠️ **Conversion rate drops >30%**
- ⚠️ **Event Match Quality 4.0-6.0**
- ⚠️ **Bounce rate >70%**
- ⚠️ **Page load time >3 seconds**

---

## 🎯 **Key Metrics to Track**

### **Meta Pixel KPIs**
| Metric | Good | Needs Improvement |
|--------|------|-------------------|
| Event Match Quality | >6.0 | <6.0 |
| Lead Conversions | 10+/week | <5/week |
| Cost per Lead | <$50 | >$100 |

### **Google Analytics KPIs**
| Metric | Good | Needs Improvement |
|--------|------|-------------------|
| Organic Traffic | 60-80% | <50% |
| Bounce Rate | <60% | >70% |
| Avg Session Duration | >2 min | <1 min |
| Conversion Rate | >2% | <1% |

### **Vercel Analytics KPIs**
| Metric | Good | Needs Improvement |
|--------|------|-------------------|
| Page Views | 500+/week | <200/week |
| Performance Score | >90 | <70 |

---

## 🔧 **Troubleshooting Guide**

### **Problem: No events showing in Meta Pixel**
**Check:**
1. Is Meta Pixel Helper showing events? (Chrome extension)
2. Are there JavaScript errors in browser console?
3. Is ad blocker disabled?

**Fix:**
- Clear browser cache
- Disable ad blockers
- Check if pixel ID is correct in code

---

### **Problem: Low Event Match Quality**
**Check:**
1. Are advanced matching parameters being sent?
2. Is external_id being set?
3. Are events being deduplicated properly?

**Fix:**
- Verify `_fbp` cookie is set
- Check `external_id` in localStorage
- Ensure event IDs are unique

---

### **Problem: Traffic dropped suddenly**
**Check:**
1. Google Search Console for manual actions
2. Google Analytics for traffic source changes
3. Website for technical errors

**Fix:**
- Check if site is down
- Verify robots.txt isn't blocking Google
- Check for Google penalties

---

### **Problem: Forms not converting**
**Check:**
1. Test form submission manually
2. Check browser console for errors
3. Verify API endpoint is working

**Fix:**
- Test form on different browsers
- Check `/api/contact` endpoint
- Verify Twilio credentials

---

## 📱 **Mobile Monitoring**

### **Install These Tools:**
1. **Meta Pixel Helper** (Chrome Extension)
   - Shows events firing in real-time
   - Displays event parameters
   - Highlights errors

2. **Google Analytics Debugger** (Chrome Extension)
   - Shows GA events firing
   - Displays event data
   - Helps debug tracking issues

3. **Vercel Mobile App**
   - Monitor deployments
   - Check analytics on-the-go
   - Get deployment notifications

---

## 📅 **Analytics Calendar**

### **Daily (5 min)**
- ✅ Check Vercel page views
- ✅ Check GA real-time users
- ✅ Check Meta events firing

### **Weekly (15 min)**
- ✅ Review traffic trends (GA)
- ✅ Review conversions (Meta)
- ✅ Check top pages (Vercel)

### **Monthly (1 hour)**
- ✅ Generate full report
- ✅ Analyze trends
- ✅ Plan content strategy
- ✅ Review SEO performance

### **Quarterly (2 hours)**
- ✅ Deep dive into user behavior
- ✅ Analyze conversion funnels
- ✅ Review ad performance (if running)
- ✅ Plan optimization strategies

---

## 🎓 **Learning Resources**

### **Meta Pixel**
- [Meta Pixel Setup Guide](https://www.facebook.com/business/help/952192354843755)
- [Conversions API Documentation](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [Event Match Quality Guide](https://www.facebook.com/business/help/765081237991954)

### **Google Analytics 4**
- [GA4 Beginner's Guide](https://support.google.com/analytics/answer/9304153)
- [GA4 Event Tracking](https://support.google.com/analytics/answer/9267735)
- [GA4 Reports Overview](https://support.google.com/analytics/answer/9143382)

### **Vercel Analytics**
- [Vercel Analytics Docs](https://vercel.com/docs/analytics)
- [Performance Monitoring](https://vercel.com/docs/analytics/performance)

---

## 💡 **Pro Tips**

1. **Set up email alerts** in Google Analytics for traffic drops
2. **Create custom dashboards** in GA for quick overview
3. **Use UTM parameters** in marketing links to track campaigns
4. **Test tracking** after every major code change
5. **Document changes** that affect analytics
6. **Compare week-over-week** not day-over-day (accounts for weekly patterns)
7. **Focus on trends** not individual data points
8. **Cross-reference** data between platforms for accuracy

---

**Last Updated:** January 5, 2026
**Next Review:** Weekly
