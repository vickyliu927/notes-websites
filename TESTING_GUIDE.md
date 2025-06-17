# 🧪 Clone System Testing Guide

## Overview
This guide provides comprehensive testing scenarios for the website cloning system.

## Quick Test URLs
- **Main Homepage**: http://localhost:3000
- **Clone Homepage**: http://localhost:3000/clone/test-clone/homepage
- **Test Dashboard**: http://localhost:3000/clone-system-test
- **Clone Overview**: http://localhost:3000/clone/test-clone

## 1. Basic Functionality Tests

### A. Page Loading Tests
```bash
# Test main homepage
curl -s http://localhost:3000 | head -10

# Test clone homepage  
curl -s http://localhost:3000/clone/test-clone/homepage | head -10

# Test clone overview (should redirect)
curl -s http://localhost:3000/clone/test-clone | head -10

# Test invalid clone (should 404)
curl -s http://localhost:3000/clone/invalid-clone-id | head -10
```

### B. Clone Data System Tests
Visit: http://localhost:3000/clone-system-test

**Expected Results:**
- ✅ 1 active clone ("Test Clone", ID: "test-clone")
- ✅ All components showing green badges (clone-specific data)
- ✅ Complete data integrity across all components
- ✅ Proper fallback behavior when data is missing

## 2. Component Integration Tests

### A. Hero Component Tests
**Check for:**
- Proper null handling for statistics/floating cards/premium tag
- Clone-specific styling if implemented
- No JavaScript errors in console

### B. Subject Grid Tests
**Check for:**
- Proper rendering of subjects data
- Clone-aware content if implemented
- Responsive layout functionality

### C. Navigation Tests
**Check for:**
- Clone switcher components working
- Proper URL generation for clone routes
- Breadcrumb/navigation context

## 3. Data Layer Tests

### A. Sanity Data Integrity
**Test in browser console:**
```javascript
// Check if Sanity client is accessible
console.log("Testing Sanity connection...");

// Test clone data fetching
fetch('/api/test-clone-data')
  .then(r => r.json())
  .then(data => console.log('Clone data:', data));
```

### B. Fallback System Tests
**Scenarios to test:**
1. **Clone-specific data exists**: Should use clone data
2. **Clone data missing**: Should fall back to baseline clone
3. **Baseline missing**: Should fall back to default content
4. **All missing**: Should show graceful null handling

## 4. URL & Routing Tests

### A. Clone Route Tests
```bash
# Valid clone routes
curl -s http://localhost:3000/clone/test-clone
curl -s http://localhost:3000/clone/test-clone/homepage

# Invalid format (should 404)
curl -s http://localhost:3000/clone/Test-Clone  # Capital letters
curl -s http://localhost:3000/clone/test_clone   # Underscores
curl -s http://localhost:3000/clone/123          # Numbers only
```

### B. Metadata Tests
**Check in browser:**
- Page titles should be clone-specific
- Meta descriptions should mention clone
- Social sharing metadata should work

## 5. Error Handling Tests

### A. 404 Error Tests
- Invalid clone IDs → Should redirect to 404
- Malformed URLs → Should handle gracefully
- Missing components → Should not crash

### B. Console Error Monitoring
**Open browser console and check for:**
- No React hydration errors
- No prop type warnings
- No network errors for clone data

## 6. Performance Tests

### A. Load Time Tests
```bash
# Measure initial page load
time curl -s http://localhost:3000 > /dev/null

# Measure clone page load
time curl -s http://localhost:3000/clone/test-clone/homepage > /dev/null
```

### B. Caching Tests
- First visit vs. subsequent visits
- Clone data caching behavior
- Image/asset loading optimization

## 7. Mobile/Responsive Tests

### A. Clone Switcher Tests
- Mobile dropdown behavior
- Touch interactions
- Responsive layout

### B. Clone Content Tests  
- Mobile layout adaptation
- Touch-friendly navigation
- Content accessibility

## 8. Integration Tests

### A. Sanity Studio Integration
**In Sanity Studio (http://localhost:3000/studio):**
1. Create new clone record
2. Modify existing clone data
3. Test content preview
4. Verify real-time updates

### B. Development Tools Tests
**Test dashboard features:**
- Clone data inspection
- Component debugging
- System status monitoring

## 9. Edge Case Tests

### A. Data Edge Cases
- Empty clone data
- Malformed clone content
- Large data sets
- Special characters in clone IDs

### B. Network Edge Cases
- Slow network conditions
- Offline behavior
- API timeouts

## 10. User Experience Tests

### A. Navigation Flow
1. User lands on main site
2. Discovers clone system
3. Switches between clones
4. Bookmarks clone URLs
5. Shares clone-specific content

### B. Content Discovery
- Clone-specific features are obvious
- Differences from main site are clear
- User can easily return to main site

## Expected Test Results

### ✅ All Tests Passing
When all tests pass, you should see:
- All pages load without errors
- Clone system responds correctly
- Component isolation works
- Data fallbacks function properly
- URLs are properly formatted
- Error handling is graceful

### 🔍 Test Reporting
Document any issues found:
- Component errors
- Data inconsistencies  
- Performance bottlenecks
- UX friction points

## Next Steps After Testing

1. **Phase 4**: Component Enhancement (make components fully clone-aware)
2. **Phase 5**: Advanced Features (clone analytics, A/B testing)
3. **Phase 6**: Production Deployment (performance optimization, monitoring)

---

*Happy Testing! 🚀* 