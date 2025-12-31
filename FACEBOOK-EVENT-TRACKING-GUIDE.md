# Facebook Event Tracking Guide

**Last Updated:** December 30, 2025

---

## Understanding Your Event Log

This guide explains what each Facebook event means and what user action triggered it.

---

## Event Types

### **1. PageView**
**What it means:** User landed on a page  
**When it fires:** Automatically when page loads  
**Event ID format:** `pageview_[timestamp]_[random]`

**Example:**
```
PageView
Event ID: pageview_1767154468838_ymmbx8hsx
URL: https://protech-ohio.com/
```
**User Action:** User visited the homepage

---

### **2. ViewContent**
**What it means:** User viewed or scrolled to a specific section  
**When it fires:** When section becomes visible on screen (scroll tracking)  
**Event ID format:** `[timestamp]_[random]_[random]`

**Types of ViewContent Events:**

#### **A. Hero Section View**
```
ViewContent
content_type: homepage_section
content_name: Hero Section - Cleveland
content_category: Homepage Engagement
```
**User Action:** User saw the top hero banner (happens immediately on page load)

#### **B. CTA Section View**
```
ViewContent
content_type: conversion_opportunity
content_name: CTA Section - Las Vegas, NV
content_category: Lead Generation
```
**User Action:** User scrolled down and the Call-to-Action section became visible

#### **C. Service Page View**
```
ViewContent
content_type: service_page
content_name: services
content_category: service
```
**User Action:** User viewed a service page or services overview

---

## Your Homepage Visit Example

**What you did:** Visited homepage → Scrolled to bottom

**Events captured (in order):**

1. **PageView** (11:14:28 PM)
   - User landed on homepage
   - URL: `https://protech-ohio.com/`

2. **ViewContent - Hero Section** (11:14:28 PM - same second)
   - User saw hero banner at top
   - Content: "Hero Section - Cleveland"
   - Triggered automatically (hero is visible on load)

3. **ViewContent - CTA Section** (11:14:52 PM - 24 seconds later)
   - User scrolled to bottom CTA
   - Content: "CTA Section - Las Vegas, NV"
   - Triggered when CTA section became visible

---

## Event Timeline Interpretation

### **Time Gaps Tell the Story:**

**Same timestamp (0-1 seconds apart):**
- Events fired on page load
- User hasn't scrolled yet

**5-30 seconds apart:**
- User is reading/scrolling
- Normal engagement

**30+ seconds apart:**
- User spent time on that section
- High engagement indicator

**Example from your log:**
```
11:14:28 PM - PageView (user arrives)
11:14:28 PM - Hero Section (immediate - top of page)
11:14:52 PM - CTA Section (24 seconds later - scrolled to bottom)
```
**Interpretation:** User spent 24 seconds reading before scrolling to bottom

---

## Common Event Patterns

### **Quick Bounce:**
```
PageView → (no other events)
```
User left immediately without scrolling

### **Engaged Visitor:**
```
PageView → Hero Section → Services Section → CTA Section
```
User scrolled through entire page

### **High Intent:**
```
PageView → Hero Section → Form View → Contact/Lead event
```
User engaged with conversion form

---

## Event Parameters Explained

### **content_type**
What kind of content the user viewed:
- `homepage_section` - Homepage content
- `service_page` - Service information
- `conversion_opportunity` - CTA or form
- `article` - Blog post

### **content_name**
Specific section or page:
- `Hero Section - Cleveland` - Top banner
- `CTA Section - Las Vegas, NV` - Call-to-action
- `AC Installation` - Specific service

### **content_category**
Broader grouping:
- `Homepage Engagement` - Homepage sections
- `Lead Generation` - Conversion-focused content
- `service` - Service pages

---

## Location in Event Names

**Why you see locations like "Cleveland" or "Las Vegas, NV":**

Your site dynamically shows location-specific content based on:
1. User's IP address geolocation
2. Selected service area

**Example:**
- User in Cleveland sees: "Hero Section - Cleveland"
- User in Las Vegas sees: "CTA Section - Las Vegas, NV"

This is **working correctly** - it helps you understand which geographic content users are seeing.

---

## Advanced Matching Parameters

Every event includes:
- ✅ **IP address** - User's location
- ✅ **User agent** - Browser/device info
- ✅ **ZIP code** - Detailed location (when available)

These improve Facebook's ability to match events to real users for better ad targeting.

---

## How to Analyze User Behavior

### **Question: "What did the user do?"**

**Look at:**
1. **Event sequence** - Order of events
2. **Time gaps** - How long between events
3. **Content names** - Which sections they viewed

### **Example Analysis:**

**Event Log:**
```
11:14:28 PM - PageView (/)
11:14:28 PM - ViewContent (Hero Section)
11:14:52 PM - ViewContent (CTA Section)
```

**Analysis:**
- User landed on homepage
- Immediately saw hero section (top of page)
- 24 seconds later, scrolled to CTA at bottom
- Did NOT submit form (no Lead/Contact event)
- **Conclusion:** Engaged visitor, read content, but didn't convert

---

## Conversion Events (High Value)

These indicate strong intent:

### **Contact**
```
Event: Contact
```
User submitted contact form

### **Lead**
```
Event: Lead
```
User provided contact information

### **InitiateCheckout**
```
Event: InitiateCheckout
```
User started scheduling/booking process

### **Schedule**
```
Event: Schedule
```
User scheduled a service appointment

---

## Event Deduplication

**Event IDs prevent duplicate counting:**

Each event has a unique ID:
- `pageview_1767154468838_ymmbx8hsx`
- `1767154492716_f2a36gn9_m1qa`

If the same event fires twice (e.g., page refresh), Facebook only counts it once using the Event ID.

---

## Recommended Event Tracking Improvements

### **Option 1: Add User Action Context**

Instead of just "ViewContent", add action type:
- `ScrolledTo_HeroSection`
- `ScrolledTo_CTASection`
- `Clicked_ServiceCard`

### **Option 2: Add Scroll Depth**

Track how far user scrolled:
- `25%_Scroll`
- `50%_Scroll`
- `75%_Scroll`
- `100%_Scroll`

### **Option 3: Add Time on Section**

Track how long user viewed each section:
- `HeroSection_Viewed_15s`
- `CTASection_Viewed_8s`

---

## Quick Reference: Event Meanings

| Event | User Action |
|-------|-------------|
| PageView | Landed on page |
| ViewContent (Hero) | Saw top banner |
| ViewContent (CTA) | Scrolled to call-to-action |
| ViewContent (Service) | Viewed service page |
| Contact | Submitted contact form |
| Lead | Provided contact info |
| InitiateCheckout | Started booking |
| Schedule | Scheduled appointment |

---

## Your Current Setup (Working Correctly)

✅ **PageView** - Tracks page visits  
✅ **ViewContent** - Tracks section views (scroll-based)  
✅ **Event IDs** - Prevents duplicates  
✅ **Advanced Matching** - IP, User Agent, ZIP  
✅ **Location Tracking** - Shows which geo content users see  

**What's missing for clarity:**
- Scroll depth percentage
- Time spent on sections
- Explicit user actions (clicks, hovers)

---

## Next Steps (Optional Improvements)

If you want clearer tracking:

1. **Add scroll depth events**
   - Track 25%, 50%, 75%, 100% scroll points
   - Shows how engaged users are

2. **Add interaction events**
   - Button clicks
   - Form field interactions
   - Phone number clicks

3. **Add timing events**
   - Time on page
   - Time per section
   - Engagement duration

4. **Custom event names**
   - Instead of "ViewContent" for everything
   - Use specific names like "HeroViewed", "CTAViewed"

---

## Summary

**Your current events ARE working correctly.** The confusion is that:

1. Multiple "ViewContent" events fire for different sections
2. Event names don't clearly indicate the user action
3. You need to look at `content_name` to understand what happened

**To understand user behavior:**
- Look at event **sequence** (order)
- Check **time gaps** (engagement duration)
- Read **content_name** (which section)
- Check for **conversion events** (Contact, Lead, Schedule)

**Your homepage visit was:**
1. Arrived (PageView)
2. Saw hero (immediate)
3. Scrolled to bottom CTA (24 seconds later)
4. Did not convert (no form submission)

This is **normal engaged visitor behavior** - they read your content but didn't take action yet.
