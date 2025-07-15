# Subject Slug Validation Fix - Comprehensive Solution

## Problem Analysis

The subject slug validation was not working properly due to several interconnected issues:

### 1. **Reference Resolution Issues**
- Clone references weren't properly resolved during validation
- Different document states (new, editing, saved) had different reference formats
- Validation ran before clone references were fully saved

### 2. **Timing Issues**
- Validation occurred before the clone reference field was properly set
- New documents fell into "default site" validation even when intended for clones

### 3. **Context Handling**
- Document context wasn't properly handled during validation
- Multiple reference formats weren't accounted for

## Solution Implemented

### 1. **Robust Reference Resolution**
Created a helper function `resolveCloneReference()` that handles all possible reference states:
- Direct references (`{_ref: "id"}`)
- Resolved references (`{_id: "id"}`)
- Nested resolved references (`{cloneId: {current: "slug"}}`)

### 2. **Enhanced Validation Logic**
- More reliable clone reference detection
- Better error handling with fallback behavior
- Clearer error messages with actionable guidance

### 3. **Development Support**
- Added console logging for debugging
- Graceful degradation when validation queries fail
- Clear error messages explaining options to users

## How It Works Now

### Default Site Pages (No Clone Reference)
- Slugs must be unique across all default pages
- Can coexist with clone-specific pages using the same slug

### Clone-Specific Pages
- Slugs must be unique only within the same clone
- Same slug can be used across different clones
- Same slug can be used for default site and clones

### Example Valid Scenarios
```
✅ Default Site: /maths
✅ Clone A:     /clone/school-a/maths  
✅ Clone B:     /clone/school-b/maths
✅ Clone C:     /clone/region-c/maths
```

## Best Practices

### 1. **For Content Creators**
- **Default Pages**: Create template pages without clone references
- **Clone Pages**: Always assign a clone reference for customized content
- **Slug Conflicts**: If validation fails, either use a different slug or assign to a specific clone

### 2. **For Developers**
- Monitor console logs for validation debugging
- Test slug creation in different scenarios (new docs, editing, clones)
- Check Sanity Studio Network tab for validation query errors

### 3. **For System Administration**
- Regularly verify clone reference integrity
- Monitor for orphaned documents
- Keep clone references consistent

## Troubleshooting

### Validation Still Failing?
1. **Check Console Logs**: Look for `[SLUG_VALIDATION]` messages
2. **Verify Clone Reference**: Ensure the clone reference is properly set
3. **Check Existing Data**: Query Sanity for conflicting slugs
4. **Clear Browser Cache**: Sanity Studio sometimes caches validation state

### Query to Check Conflicts
```groq
*[_type == "subjectPage" && subjectSlug.current == "your-slug"]{
  _id,
  title,
  subjectSlug,
  cloneReference,
  "cloneId": cloneReference->cloneId.current
}
```

### Common Issues
- **New documents**: Clone reference might not be saved yet
- **Duplicate data**: Previous invalid states might exist
- **Browser cache**: Studio might cache old validation rules

## Technical Details

### Validation Flow
1. Extract slug from document
2. Get current document ID
3. Resolve clone reference using helper function
4. Query for existing conflicts based on clone context
5. Return validation result with clear messaging

### Error Handling
- Graceful degradation if queries fail
- Detailed logging for debugging
- User-friendly error messages with solutions

### Performance Considerations
- Minimal database queries
- Cached validation results where possible
- Early returns for common cases

## Migration Notes

### Existing Data
No migration required - existing documents will work with new validation

### Testing Required
1. Create new default pages
2. Create new clone-specific pages
3. Edit existing pages
4. Test slug conflicts in different scenarios

## Support

If issues persist:
1. Check browser console for validation logs
2. Verify Sanity Studio version compatibility
3. Test with fresh browser session
4. Contact development team with specific error logs 