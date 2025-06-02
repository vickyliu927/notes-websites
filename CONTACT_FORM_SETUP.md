# Contact Form Setup Guide

## Overview
The contact form has been successfully integrated into your homepage. It appears between the FAQ section and the Footer, matching the design from your screenshot.

## Features
- ✅ All required fields from the screenshot:
  - Full name
  - Country
  - Phone (with country code)
  - Email
  - Details of tutoring request
  - Hourly budget (including currency)
- ✅ Form validation (client-side and server-side)
- ✅ Data storage in Sanity CMS
- ✅ Email notifications via Resend
- ✅ Beautiful UI matching your site's design
- ✅ Success/error handling
- ✅ Loading states

## Configuration Required

### 1. Environment Variables
Copy `env.template` to `.env.local` and configure:

```bash
# Sanity Configuration (already configured)
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_write_token_here

# Email Configuration (NEW - required for contact form)
RESEND_API_KEY=your_resend_api_key_here
FROM_EMAIL=noreply@your-domain.com
NOTIFICATION_EMAIL=your-email@example.com
```

### 2. Resend Setup
1. Sign up at [resend.com](https://resend.com)
2. Verify your domain or use their test domain
3. Get your API key from the dashboard
4. Add the API key to your `.env.local` file

### 3. Sanity Schema Deployment
The contact form schema has been added to your Sanity project. You need to deploy it:

```bash
npm run sanity:deploy
```

## How It Works

### Frontend (ContactForm.tsx)
- Located in `src/components/ContactForm.tsx`
- Uses React hooks for state management
- Validates form data before submission
- Shows loading states and success/error messages
- Matches the exact design from your screenshot

### Backend (API Route)
- Located in `src/app/api/contact/route.ts`
- Validates all required fields
- Saves form data to Sanity CMS
- Sends email notifications via Resend
- Handles errors gracefully

### Data Storage
- Form submissions are stored in Sanity as `contactForm` documents
- Each submission includes all form fields plus a timestamp
- You can view submissions in your Sanity Studio

### Email Notifications
- Automatic email notifications sent to `NOTIFICATION_EMAIL`
- Includes all form data in a formatted HTML email
- Continues to work even if Sanity storage fails

## Testing
1. Make sure your environment variables are configured
2. Start the development server: `npm run dev`
3. Navigate to your homepage
4. Scroll down to see the contact form after the FAQ section
5. Fill out and submit the form to test functionality

## Troubleshooting
- If emails aren't sending, check your Resend API key and domain verification
- If Sanity storage fails, check your `SANITY_API_TOKEN` permissions
- Form submissions will still work even if one service fails (graceful degradation)

## Files Modified/Created
- `sanity/schemas/contactForm.ts` - New Sanity schema
- `sanity/schemas/index.ts` - Added contact form to exports
- `src/components/ContactForm.tsx` - New contact form component
- `src/components/index.ts` - Added ContactForm export
- `src/app/api/contact/route.ts` - New API endpoint
- `src/app/page.tsx` - Added ContactForm to homepage
- `types/sanity.ts` - Added ContactFormData interface
- `env.template` - Added email configuration variables
- `package.json` - Added Resend dependency 