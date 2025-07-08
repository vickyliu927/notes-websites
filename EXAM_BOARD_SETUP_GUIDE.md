# Exam Board Setup Guide

## Overview

The exam board system allows you to create subject-specific pages where users can choose between different exam boards (like AQA, CIE, Edexcel) before accessing study materials. This is similar to the screenshot you provided.

## Setting Up Exam Board Pages

### 1. Create an Exam Board Configuration in Sanity

1. Go to your Sanity Studio (`/studio`)
2. Click on "Exam Board" in the content types
3. Click "Create" to add a new exam board configuration
4. Fill in the following fields:

#### Basic Information
- **Title**: Internal name (e.g., "Biology Exam Boards")
- **Subject Name**: The subject this page is for (e.g., "Biology", "Mathematics")
- **Slug**: URL-friendly version (auto-generated from subject name)

#### Hero Section
- **Main Title**: The page heading (e.g., "Choose your A-Level Biology Exam Boards")
- **Description**: Text explaining what to do
- **CTA Buttons** (optional): Primary and secondary action buttons

#### Exam Boards
Add each exam board with:
- **Exam Board Name**: Short name (e.g., "AQA", "CIE", "Edexcel")
- **Full Name** (optional): Full organization name
- **Logo** (optional): Upload exam board logo
- **Description**: Brief description of what this exam board offers
- **Additional Info** (optional): Extra text like "Official website"
- **CTA Button**: Button text and URL where users should go

#### Sidebar Content (optional)
- **Premium Notes Box**: Promotional box for premium study materials
- **Practice Questions Box**: Promotional box for practice questions

### 2. Connect Subject Grid to Exam Boards

1. Go to "Subject Grid" in Sanity Studio
2. Edit your existing subject grid configuration
3. Find the "Exam Board Settings" section
4. Toggle on "Use Exam Board Pages"
5. The URL pattern defaults to `/exam-boards/{subject}` (can be customized)

Now when users click "View Notes" on subject cards, they'll be taken to the exam board selection page instead of directly to subject pages.

## How It Works

### URL Structure
- Exam board pages use the URL pattern: `/exam-boards/[subject-slug]`
- Example: `/exam-boards/biology`, `/exam-boards/mathematics`

### Integration with Subject Grid
- When exam board routing is enabled in the subject grid, clicking "View Notes" will take users to the exam board page
- The subject name gets converted to a URL-friendly slug automatically
- Users can then choose their specific exam board

### Components Used
- **Header**: Reused from homepage
- **Hero Section**: Custom hero with title, description, and optional CTA buttons
- **Exam Board Grid**: Displays available exam boards in a responsive grid
- **Sidebar**: Optional promotional boxes for premium content
- **Footer**: Reused from homepage

## Example Usage

1. **Create Biology Exam Board Page**:
   - Subject Name: "Biology"
   - Slug: "biology"
   - Add exam boards: AQA, CIE, Edexcel with their respective logos and links

2. **Enable in Subject Grid**:
   - Turn on "Use Exam Board Pages"
   - Now biology subject card will link to `/exam-boards/biology`

3. **User Flow**:
   - User clicks "View Notes" on Biology card
   - Gets taken to `/exam-boards/biology`
   - Sees options for AQA, CIE, Edexcel
   - Clicks their preferred exam board
   - Gets taken to the specific study materials for that board

## Files Created/Modified

### New Files
- `sanity/schemas/examBoard.ts` - Sanity schema for exam board configurations
- `src/app/exam-boards/[subject]/page.tsx` - Dynamic exam board page
- `src/app/exam-boards/[subject]/not-found.tsx` - 404 page for exam boards
- `src/components/ExamBoardGrid.tsx` - Component to display exam boards

### Modified Files
- `sanity/schemas/index.ts` - Added exam board schema
- `types/sanity.ts` - Added TypeScript types for exam boards
- `lib/sanity.ts` - Added GROQ query for exam board data
- `sanity/schemas/subjectGrid.ts` - Added exam board settings
- `lib/cloneQueries.ts` - Updated queries to include exam board settings
- `src/components/SubjectGrid.tsx` - Added exam board routing logic
- `src/components/index.ts` - Exported new ExamBoardGrid component

## Notes

- The system is fully optional - you can enable/disable it per subject grid
- It maintains the same visual style as the rest of your website
- Header and footer components are reused for consistency
- Works with both regular sites and clone sites
- Responsive design matches the screenshot you provided 