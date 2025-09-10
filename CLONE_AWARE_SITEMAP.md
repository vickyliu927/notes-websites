# Clone-Aware Sitemap System

This document explains the robust, clone-aware sitemap implementation that ensures each website has proper SEO with canonical URLs and no duplicates.

## Overview

The sitemap system automatically detects clone domains and generates appropriate sitemaps with:
- ✅ **Clone-Specific URLs**: Only shows subjects relevant to each clone
- ✅ **Canonical WWW URLs**: All production domains use `www.` prefix
- ✅ **Duplicate Removal**: Eliminates duplicate page entries
- ✅ **Dynamic Generation**: Updates automatically when content changes

## Implementation

### Files Modified

#### 1. `/src/app/sitemap.xml/route.ts`
**Clone-Aware Sitemap Generation**

**Features:**
- Domain detection using request headers
- Clone-specific subject filtering
- Canonical URL generation with `www.` prefix
- Automatic duplicate removal
- Proper lastmod timestamps from Sanity

**Logic Flow:**
1. Detect domain from request headers
2. Map domain to clone ID using Sanity query
3. Fetch clone-specific subjects only
4. Generate canonical URLs with `www.` prefix
5. Remove duplicates based on slug
6. Generate XML sitemap

#### 2. `/src/app/robots.txt/route.ts`
**Clone-Aware Robots.txt**

**Features:**
- Domain-aware sitemap references
- Canonical URL generation
- Proper admin area blocking
- Clone-specific configurations

## URL Structure Examples

### Clone Domains (Production)
```
Domain: ibchemistry-notes.com
Canonical: https://www.ibchemistry-notes.com

Sitemap URLs:
- https://www.ibchemistry-notes.com/
- https://www.ibchemistry-notes.com/hl
- https://www.ibchemistry-notes.com/sl
```

### Main Site (Default)
```
Domain: localhost (development)
Canonical: https://igcse-notes.com

Sitemap URLs:
- https://igcse-notes.com/
- https://igcse-notes.com/maths
- https://igcse-notes.com/physics
```

**Note**: Contact pages have been removed - contact functionality is now handled via internal anchors (`#contact`) that scroll to contact forms embedded on pages.

## Key Functions

### `getCloneIdByDomain(hostname: string)`
Maps domain names to clone IDs using Sanity data.

```typescript
// Query: *[_type == "clone" && $hostname in metadata.domains && isActive == true][0]
```

### `getCloneSpecificSubjects(cloneId: string)`
Fetches only subjects belonging to a specific clone.

```typescript
// Query: *[_type == "subjectPage" && isPublished == true && cloneReference->cloneId.current == $cloneId]
```

### `getCanonicalBaseUrl(hostname: string, cloneId: string | null)`
Generates canonical URLs with proper `www.` prefix.

```typescript
// Production: www.domain.com
// Development: configured base URL
```

## Benefits

### 1. **SEO Optimization**
- Each clone has its own targeted sitemap
- No irrelevant pages diluting SEO value
- Proper canonical URLs prevent duplicate content issues

### 2. **Automatic Scaling**
- New clones automatically get proper sitemaps
- No manual configuration required
- Subject changes reflect immediately

### 3. **Duplicate Prevention**
- Built-in deduplication logic
- Prevents multiple entries for same page
- Clean, focused sitemaps

### 4. **Performance**
- Filtered subject lists (faster generation)
- Proper caching headers
- Error handling with fallbacks

## Testing

### Local Testing
```bash
# Test sitemap generation
curl http://localhost:3000/sitemap.xml

# Test robots.txt
curl http://localhost:3000/robots.txt
```

### Production Verification
```bash
# Test specific clone domains
curl https://www.ibchemistry-notes.com/sitemap.xml
curl https://www.ibeconomicsnotes.com/sitemap.xml
```

## Configuration

### Domain Mapping
Domains are configured in Sanity under each clone's `metadata.domains` array:

```typescript
// Example clone configuration
{
  cloneId: "ib-chemistry-notes",
  metadata: {
    domains: [
      "ibchemistry-notes.com",
      "www.ibchemistry-notes.com"
    ]
  }
}
```

### Subject Filtering
Subjects are linked to clones via `cloneReference` field:

```typescript
// Subject page configuration
{
  subjectSlug: "hl",
  cloneReference: { _ref: "clone-id-here" }
}
```

## Error Handling

### Fallback Behavior
- If domain lookup fails → Default to main site
- If subject query fails → Empty subject list
- If entire generation fails → Basic sitemap with homepage and contact

### Logging
All operations include detailed console logging with `🗺️ [SITEMAP]` prefix for easy debugging.

## Maintenance

### Zero Maintenance Required
- Automatic updates when content changes
- Self-healing with fallback mechanisms
- No manual sitemap management needed

### Monitoring
- Check server logs for any sitemap generation errors
- Verify canonical URLs in search console
- Monitor crawl efficiency improvements

## Future Enhancements

### Possible Additions
- Priority calculation based on page performance
- Image sitemap generation
- News sitemap for time-sensitive content
- Hreflang attributes for international versions

This system ensures robust, scalable, and SEO-optimized sitemaps for all current and future clone websites.
