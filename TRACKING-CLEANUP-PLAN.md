# Event Tracking Cleanup Plan

**Goal:** Clean up duplicate/noisy events before implementing new tracking strategy

---

## Current Issues

### **Problem 1: Multiple ViewContent Trackers**

**Components firing ViewContent:**
1. `ContentViewTracker.tsx` - Generic content tracking
2. `ServicePageTracker.tsx` - Service page tracking
3. `ServiceViewTracker.tsx` - Service view tracking
4. `ViewTracker.tsx` - General view tracking
5. `BlogPostTracker.tsx` - Blog post tracking

**Result:** Multiple overlapping ViewContent events for the same user action

### **Problem 2: Unclear Event Names**

All engagement uses "ViewContent" event name:
- Hero section view → ViewContent
- CTA section view → ViewContent
- Service page view → ViewContent
- Blog post view → ViewContent

**Result:** Can't distinguish between different user actions

### **Problem 3: Duplicate Tracking**

Many components track both:
- Client-side (Facebook Pixel)
- Server-side (Conversions API)

This is correct for deduplication, but components may overlap.

---

## Cleanup Steps

### **Step 1: Verify Event Match Quality**

**Check current status:**
- [ ] Current Match Quality score
- [ ] fbp (Browser ID) coverage %
- [ ] fbc (Click ID) coverage %
- [ ] Email coverage %
- [ ] Phone coverage %
- [ ] IP address coverage %
- [ ] User agent coverage %

**Expected after our improvements:**
- fbp: 100% (was 41%)
- fbc: Auto-capture from ads
- IP: 100%
- User agent: 100%

### **Step 2: Consolidate ViewContent Trackers**

**Keep:**
- `ContentViewTracker.tsx` - Rename to `SectionViewTracker.tsx`
  - Use for CTA sections, forms, high-value content
  - Add clear content_type parameters

**Remove/Merge:**
- `ViewTracker.tsx` - Merge into ContentViewTracker
- `ServiceViewTracker.tsx` - Keep but rename event to "ServiceViewed"
- `ServicePageTracker.tsx` - Merge with ServiceViewTracker
- `BlogPostTracker.tsx` - Keep but rename event to "ArticleViewed"

### **Step 3: Implement Clear Event Names**

**Replace generic "ViewContent" with:**
- `ServiceViewed` - User viewing service page
- `ArticleViewed` - User reading blog post
- `CTAViewed` - User saw call-to-action
- `FormViewed` - User saw contact form

**Keep "ViewContent" only for:**
- Generic content that doesn't fit other categories
- Third-party integrations that require it

### **Step 4: Remove Noisy Events**

**Remove automatic tracking for:**
- ❌ Hero section views (happens on every page load, not valuable)
- ❌ Generic homepage sections (unless CTA or form)
- ❌ Footer views (not actionable)

**Keep tracking for:**
- ✅ CTA sections (conversion opportunity)
- ✅ Contact forms (high intent)
- ✅ Service pages (user need indicator)
- ✅ Specific user actions (clicks, submissions)

---

## Event Match Quality Verification

### **Test in Browser Console:**

```javascript
// Check if fbp/fbc cookies are set
const params = {
  fbp: document.cookie.match(/_fbp=([^;]+)/)?.[1],
  fbc: document.cookie.match(/_fbc=([^;]+)/)?.[1],
  userAgent: navigator.userAgent
};
console.log('Browser Parameters:', params);

// Expected output:
// fbp: "fb.1.1767058398909.155070556671561658" ✅
// fbc: null (unless user clicked Facebook ad)
// userAgent: "Mozilla/5.0..." ✅
```

### **Check Event Match Quality Dashboard:**

1. Go to: https://business.facebook.com/events_manager2/
2. Click Pixel ID: `1201375401668813`
3. Click "Event Match Quality"
4. Verify improvements:
   - Browser ID (fbp): Should be ~100%
   - Click ID (fbc): Should show when users click ads
   - IP Address: Should be 100%
   - User Agent: Should be 100%

---

## Implementation Order

### **Phase 1: Verify Match Quality (Do First)**
- [ ] Check Event Match Quality score
- [ ] Verify fbp cookie is being sent
- [ ] Verify fbc cookie works (test with ?fbclid= URL)
- [ ] Confirm score improved from ~41 to ~70-85

### **Phase 2: Clean Up Current Tracking**
- [ ] Consolidate ViewContent trackers
- [ ] Remove noisy Hero section tracking
- [ ] Rename events to be more descriptive
- [ ] Test that essential events still fire

### **Phase 3: Implement New Tracking (After Cleanup)**
- [ ] Add PhoneClicked tracking
- [ ] Add FormViewed tracking
- [ ] Add CTAClicked tracking
- [ ] Add engagement milestones
- [ ] Test complete user journey

---

## Files to Modify

### **Consolidate/Remove:**
1. `src/components/analytics/ViewTracker.tsx` - Merge into ContentViewTracker
2. `src/components/analytics/ServiceViewTracker.tsx` - Rename event
3. `src/components/analytics/ServicePageTracker.tsx` - Merge with ServiceViewTracker

### **Update:**
1. `src/components/analytics/ContentViewTracker.tsx` - Rename to SectionViewTracker
2. `src/components/analytics/BlogPostTracker.tsx` - Rename event to ArticleViewed
3. `src/hooks/useFacebookEvents.ts` - Add new event methods

### **Create:**
1. `src/components/analytics/PhoneClickTracker.tsx` - Track phone clicks
2. `src/components/analytics/FormViewTracker.tsx` - Track form views
3. `src/components/analytics/CTAClickTracker.tsx` - Track CTA clicks

---

## Expected Results After Cleanup

### **Before Cleanup:**
```
Homepage visit:
1. PageView
2. ViewContent (Hero) ← Remove
3. ViewContent (CTA)
4. ViewContent (Generic) ← Duplicate
Total: 4 events (noisy)
```

### **After Cleanup:**
```
Homepage visit:
1. PageView
2. CTAViewed (when user scrolls to CTA)
Total: 2 events (clean)
```

### **Service Page Before:**
```
1. PageView
2. ViewContent (Service) ← Generic
3. ViewContent (Service) ← Duplicate
4. ViewContent (CTA)
Total: 4 events (confusing)
```

### **Service Page After:**
```
1. PageView
2. ServiceViewed (AC Repair)
3. CTAViewed (when user scrolls to CTA)
Total: 3 events (clear)
```

---

## Next Steps

1. **User provides Event Match Quality report**
   - Current score
   - Parameter coverage percentages
   - Verify fbp/fbc improvements

2. **Verify browser parameters in console**
   - Run test script to check cookies
   - Confirm fbp is being set

3. **Clean up tracking components**
   - Consolidate trackers
   - Remove noisy events
   - Rename to clear event names

4. **Implement Phase 1 new tracking**
   - Add PhoneClicked
   - Add FormViewed
   - Add CTAClicked
   - Add engagement milestones

---

## Questions to Answer

**Event Match Quality:**
- [ ] What is current Match Quality score?
- [ ] What is fbp coverage %?
- [ ] What is fbc coverage %?
- [ ] Did score improve from ~41?

**Browser Parameters:**
- [ ] Is _fbp cookie being set?
- [ ] Is _fbc cookie working with fbclid?
- [ ] Are parameters being sent to Conversions API?

**Current Tracking:**
- [ ] Which components are firing duplicate events?
- [ ] Which events are noisy/not valuable?
- [ ] Which events should be kept?

---

**Ready to proceed once we verify Event Match Quality improvements are working.**
