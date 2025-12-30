# SEO Fix Verification Tests

This document contains commands and tests to verify that all SEO/indexing fixes have been properly implemented.

## Fix #1: Out-of-Service-Area Location Blocking ✅

### Test Ohio Location (Should Work)
```bash
# Test valid Ohio location - should return 200 with full HTML
curl -I https://protech-ohio.com/services/residential/heating/maintenance/furnaces/akron-oh
curl -s https://protech-ohio.com/services/residential/heating/maintenance/furnaces/akron-oh | grep -i "<h1"
```

### Test Out-of-State Location (Should 404)
```bash
# Test invalid out-of-state location - should return 404
curl -I https://protech-ohio.com/services/residential/heating/maintenance/furnaces/las-vegas-nv
curl -I https://protech-ohio.com/services/residential/heating/maintenance/furnaces/new-york-ny
curl -I https://protech-ohio.com/services/locations/las-vegas-nv
```

**Expected Result:** All out-of-state URLs should return `404 Not Found`

---

## Fix #2: SSR Bailout Elimination ✅

### Test for Real HTML Content
```bash
# Should return actual H1 tags and content, NOT just <template data-dgst="BAILOUT_TO_CLIENT_SIDE_RENDERING">
curl -s https://protech-ohio.com/services/residential/heating/maintenance/furnaces/akron-oh | grep -i "<h1"
curl -s https://protech-ohio.com/services/residential/heating/maintenance/furnaces/akron-oh | grep -i "BAILOUT_TO_CLIENT_SIDE_RENDERING"
```

**Expected Results:**
- First command: Should return H1 tags with actual content
- Second command: Should return NO results (no bailout templates)

### Check for Server-Rendered Content
```bash
# Should see actual page content in the HTML response
curl -s https://protech-ohio.com/services/residential/heating/maintenance/furnaces/akron-oh | head -100
```

**Expected Result:** Should see meta tags, structured data, and actual content - not just scripts and empty divs

---

## Fix #3: WWW to Non-WWW Canonical Redirect ✅

### Test WWW Redirect
```bash
# Should return 308 Permanent Redirect to non-www
curl -I https://www.protech-ohio.com/services
curl -I https://www.protech-ohio.com/
```

**Expected Result:** 
```
HTTP/2 308
location: https://protech-ohio.com/services
```

### Test HTTP to HTTPS Redirect
```bash
# Should redirect to HTTPS
curl -I http://protech-ohio.com/
```

**Expected Result:** Should redirect to `https://protech-ohio.com/`

---

## Fix #4: Caching Headers ✅

### Test Service Page Caching
```bash
# Should return proper cache headers
curl -I https://protech-ohio.com/services/residential/heating/maintenance/furnaces/akron-oh | grep -i "cache-control"
```

**Expected Result:**
```
cache-control: public, s-maxage=3600, stale-while-revalidate=86400
```

---

## Fix #5: Sitemap Ohio-Only Validation ✅

### Check Sitemap Contents
```bash
# Download and inspect sitemap
curl -s https://protech-ohio.com/sitemap.xml > sitemap.xml
cat sitemap.xml | grep -i "las-vegas"
cat sitemap.xml | grep -i "new-york"
cat sitemap.xml | grep -i "-oh</loc>"
```

**Expected Results:**
- No Las Vegas or other out-of-state locations in sitemap
- Only Ohio locations (ending in `-oh`) should be present
- Should include `northeast-ohio` as the region

---

## Additional Verification Tests

### Test TypeScript Compilation
```bash
# Should exit with code 0 (no errors)
npx tsc --noEmit
```

### Test Build
```bash
# Should complete without SSR bailout warnings
npm run build
```

### Check Robots.txt
```bash
curl -s https://protech-ohio.com/robots.txt
```

**Expected Result:** Should point to `https://protech-ohio.com/sitemap.xml` (non-www)

---

## Google Search Console Actions

After deploying these fixes:

1. **Request Re-indexing** for key Ohio pages:
   - `/services/residential/heating/maintenance/furnaces/akron-oh`
   - `/services/residential/cooling/repair/air-conditioners/cleveland-oh`
   - `/services/locations/akron-oh`

2. **Submit Updated Sitemap** in Google Search Console

3. **Monitor "Crawled - currently not indexed"** status:
   - Should see reduction in out-of-state pages
   - Ohio pages should start getting indexed

4. **Check Coverage Report** for 404 errors:
   - Out-of-state pages should show as 404 (this is correct)
   - Mark them as "Fixed" in GSC

---

## Success Criteria

✅ Out-of-state locations return 404  
✅ Ohio locations return 200 with full HTML  
✅ No SSR bailout templates in HTML  
✅ WWW redirects to non-www with 308  
✅ Proper cache headers on service pages  
✅ Sitemap contains only Ohio locations  
✅ TypeScript compiles without errors  
✅ Build completes without SSR warnings  

---

## Timeline

- **Immediate:** All fixes are code-complete
- **After Deploy:** Run verification tests
- **Week 1:** Submit updated sitemap to GSC
- **Week 2-4:** Monitor indexing improvements
- **Month 1:** Should see significant reduction in "Crawled - currently not indexed"
