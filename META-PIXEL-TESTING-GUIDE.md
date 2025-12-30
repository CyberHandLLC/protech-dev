# Meta Pixel Testing Guide

**Deployment Status:** ✅ Pushed to GitHub - Vercel is deploying now

---

## Step 1: Wait for Vercel Deployment (2-3 minutes)

### Check Deployment Status:
1. Go to: https://vercel.com/dashboard
2. Look for your `protech-dev` project
3. Wait for the green checkmark ✅
4. Click on the deployment to get the URL

**Expected URLs:**
- Production: `https://protech-ohio.com`
- Preview: `https://protech-dev-[hash].vercel.app`

---

## Step 2: Browser Console Testing (Most Important)

### Open Your Site with DevTools:

1. **Open Chrome** (recommended for best debugging)
2. **Navigate to:** `https://protech-ohio.com`
3. **Open DevTools:** Press `F12` or `Right-click → Inspect`
4. **Go to Console tab**

### ✅ What You SHOULD See (Success):

```
✅ Meta Pixel loaded successfully
✅ [Facebook Pixel] Tracked event: PageView {eventId: "pageview_1735...", customData: {}}
✅ GA4 page_view event sent for: /
✅ Google Tag Manager initialized with ID: GTM-T6QSRR5H
✅ Page view tracked: /
```

### ❌ What You Should NOT See (Errors Fixed):

```
❌ Duplicate Pixel ID: 1201375401668813
❌ "fbq('test', ...);" is not a valid fbq command
❌ Instagram Pixel ID not provided
❌ Error sending conversion event
❌ Error sending PageView event to Facebook
❌ Failed to execute 'json' on 'Response'
```

---

## Step 3: Facebook Events Manager Testing (Real-Time)

### Access Facebook Test Events:

1. **Go to:** https://business.facebook.com/events_manager2/list/pixel/
2. **Login** with your Facebook Business account
3. **Select Data Sources** → **Pixels**
4. **Click on Pixel ID:** `1201375401668813`
5. **Click "Test Events"** in the left sidebar

### Test Your Website:

1. **Enter Test Browser Code:**
   - In Test Events, you'll see "Test browser events"
   - Click "Open Test Events" or use the browser extension

2. **Navigate Your Site:**
   - Open a new tab: `https://protech-ohio.com`
   - Click around different pages
   - Fill out a contact form (don't submit if you don't want to)

3. **Watch Events Appear in Real-Time:**

**✅ Expected Events:**
```
PageView - Just now
  ├─ event_source_url: https://protech-ohio.com/
  ├─ event_id: pageview_1735...
  └─ Status: ✅ Received
```

**When you navigate to service pages:**
```
ViewContent - Just now
  ├─ content_name: "Furnace Maintenance"
  ├─ content_category: "Services"
  └─ Status: ✅ Received
```

**When you click phone number:**
```
Contact - Just now
  ├─ content_type: "phone_call"
  └─ Status: ✅ Received
```

---

## Step 4: Network Tab Verification

### Check Meta Pixel Script Loading:

1. **In DevTools** → **Network tab**
2. **Reload the page** (Ctrl+R or Cmd+R)
3. **Filter by:** Type `fbevents` in the filter box

### ✅ What to Look For:

```
Name: fbevents.js
Status: 200 OK
Type: script
Size: ~50-80 KB
Time: < 500ms
```

**Click on `fbevents.js`:**
- Headers tab should show: `Status Code: 200`
- Response tab should show JavaScript code

### Check Pixel Requests:

**Filter by:** `facebook.com/tr`

**✅ Expected:**
```
Request URL: https://www.facebook.com/tr/
Status: 200
Method: POST
```

**Click on the request → Payload tab:**
```json
{
  "id": "1201375401668813",
  "ev": "PageView",
  "eid": "pageview_1735..."
}
```

---

## Step 5: Meta Pixel Helper Extension (Recommended)

### Install the Extension:

1. **Chrome Web Store:** Search "Meta Pixel Helper"
2. **Install:** https://chrome.google.com/webstore/detail/meta-pixel-helper/
3. **Pin the extension** to your toolbar

### Use the Helper:

1. **Navigate to:** `https://protech-ohio.com`
2. **Click the Meta Pixel Helper icon** (looks like `</>`)
3. **Check the popup**

**✅ Expected Output:**
```
✅ PageView
   Pixel ID: 1201375401668813
   Status: Active
   
✅ No errors found
✅ No duplicate pixels
```

**❌ If you see errors:**
- Red icon = Errors (should not happen with our fix)
- Yellow icon = Warnings (acceptable)
- Green icon = All good ✅

---

## Step 6: Page-by-Page Testing Checklist

### Test These Key Pages:

#### 1. **Homepage** - `https://protech-ohio.com/`
```
✅ Console: No errors
✅ Meta Pixel: PageView event
✅ Network: fbevents.js loaded
```

#### 2. **Service Detail Page** - `https://protech-ohio.com/services/residential/heating/maintenance/furnaces/cleveland-oh`
```
✅ Console: No errors
✅ Meta Pixel: PageView event
✅ Meta Pixel: ViewContent event (optional)
```

#### 3. **Contact Page** - `https://protech-ohio.com/contact`
```
✅ Console: No errors
✅ Meta Pixel: PageView event
✅ Form submission should trigger Lead/Contact event
```

#### 4. **Location Page** - `https://protech-ohio.com/services/locations/cleveland-oh`
```
✅ Console: No errors
✅ Meta Pixel: PageView event
```

---

## Step 7: Mobile Testing

### Test on Mobile Device:

1. **Open on your phone:** `https://protech-ohio.com`
2. **For Android Chrome:**
   - Connect phone to computer via USB
   - Chrome → `chrome://inspect`
   - Click "Inspect" next to your phone
   - Check console for errors

3. **For iOS Safari:**
   - Settings → Safari → Advanced → Web Inspector
   - Connect to Mac
   - Safari → Develop → [Your iPhone] → protech-ohio.com

**✅ Expected:** Same clean console as desktop

---

## Step 8: Event Deduplication Test

### Verify No Duplicate Events:

1. **Open:** `https://protech-ohio.com`
2. **Check Facebook Test Events**
3. **Count PageView events**

**✅ Expected:** ONE PageView event per page load

**❌ Before Fix:** You would see 2-3 PageView events

### Test Navigation:

1. Click to: `/services/residential/heating/maintenance/furnaces/cleveland-oh`
2. **Check Test Events**
3. **Should see:** ONE new PageView event

---

## Step 9: Error Monitoring (First 24 Hours)

### Check for Issues:

**Vercel Dashboard:**
1. Go to: https://vercel.com/dashboard
2. Click your project
3. **Functions tab** → Check for errors in `/api/facebook-conversions`

**Expected:** No errors or very few (< 1%)

**Browser Console (Random Pages):**
- Visit 5-10 different service pages
- Check console each time
- Should be clean on all pages

---

## Step 10: Performance Check

### Verify Pixel Doesn't Slow Down Site:

**Lighthouse Test:**
1. **DevTools** → **Lighthouse tab**
2. **Select:** Performance, Desktop
3. **Click:** Generate report

**✅ Expected Scores:**
- Performance: > 90
- Best Practices: > 90
- SEO: > 95

**Meta Pixel Impact:** Should be minimal (< 5 points)

---

## Common Issues & Solutions

### Issue 1: "fbq is not defined"
**Cause:** Script blocked by ad blocker  
**Solution:** Disable ad blocker for testing

### Issue 2: No events in Test Events
**Cause:** Test Events not enabled  
**Solution:** Make sure you clicked "Test Events" and have the browser code active

### Issue 3: Duplicate PageView events
**Cause:** Old cache  
**Solution:** Hard refresh (Ctrl+Shift+R) or clear cache

### Issue 4: 404 on fbevents.js
**Cause:** Network issue or Facebook down  
**Solution:** Check https://status.facebook.com/

---

## Success Criteria Checklist

### ✅ All These Should Be True:

- [ ] **Console is clean** - No Meta Pixel errors
- [ ] **ONE PageView per page** - No duplicates
- [ ] **Events appear in Test Events** - Real-time tracking works
- [ ] **fbevents.js loads** - Status 200 in Network tab
- [ ] **No Instagram warnings** - Silent, as expected
- [ ] **No JSON parsing errors** - Conversions API works
- [ ] **No duplicate pixel warnings** - Single initialization
- [ ] **Mobile works** - Same as desktop
- [ ] **Performance not impacted** - Lighthouse > 90
- [ ] **All pages work** - Home, services, contact, locations

---

## Quick Test Commands (Copy-Paste in Console)

### Check if Meta Pixel is loaded:
```javascript
typeof fbq !== 'undefined' ? '✅ Meta Pixel loaded' : '❌ Not loaded'
```

### Check Pixel ID:
```javascript
window._fbq ? '✅ Pixel initialized' : '❌ Not initialized'
```

### Manually trigger test event (for testing):
```javascript
if (typeof fbq !== 'undefined') {
  fbq('track', 'ViewContent', {
    content_name: 'Test Event',
    content_type: 'test'
  });
  console.log('✅ Test event fired');
}
```

---

## Next Steps After Successful Testing

1. **Monitor for 24 hours** - Check Vercel logs
2. **Review Facebook Events Manager** - Ensure events are coming through
3. **Set up Conversions** - Create conversion events in Facebook Ads Manager
4. **Create Custom Audiences** - Based on PageView, ViewContent events
5. **Launch Campaigns** - Use pixel data for targeting

---

## Support Resources

**Facebook Business Help:**
- Events Manager: https://business.facebook.com/events_manager2/
- Pixel Setup Guide: https://www.facebook.com/business/help/952192354843755
- Test Events: https://www.facebook.com/business/help/2040882202645320

**Vercel Support:**
- Dashboard: https://vercel.com/dashboard
- Logs: https://vercel.com/docs/observability/runtime-logs

**Need Help?**
- Check `META-PIXEL-FIX-SUMMARY.md` for detailed changes
- Review console errors and share screenshots
- Check Facebook Events Manager for event data

---

## Expected Timeline

- **Now:** Deployment in progress
- **2-3 min:** Deployment complete
- **5 min:** Test in browser console
- **10 min:** Verify in Facebook Test Events
- **24 hours:** Monitor for any issues
- **7 days:** Review event data quality

---

**Status:** Ready to test once Vercel deployment completes! 🚀
