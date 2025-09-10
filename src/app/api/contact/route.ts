import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { client } from '../../../../lib/sanity'
import { Resend } from 'resend'

interface ContactFormData {
  fullName: string
  country: string
  phone: string
  email: string
  tutoringDetails: string
  hourlyBudget: string
}

// Function to get clone ID and name by domain
async function getCloneInfoByDomain(hostname: string): Promise<{cloneId: string | null, cloneName: string | null}> {
  try {
    const query = `
      *[_type == "clone" && $hostname in metadata.domains && isActive == true][0] {
        cloneId,
        cloneName,
        metadata
      }
    `
    
    const result = await client.fetch(query, { hostname })
    
    if (result?.cloneId?.current) {
      return {
        cloneId: result.cloneId.current,
        cloneName: result.cloneName || null
      }
    }
    
    return { cloneId: null, cloneName: null }
  } catch (error) {
    console.error('Error getting clone info by domain:', error)
    return { cloneId: null, cloneName: null }
  }
}

export async function POST(request: NextRequest) {
  console.log('=== CONTACT FORM API CALLED ===')
  
  try {
    // Get domain information from headers
    const headersList = await headers()
    const host = headersList.get('host')
    const hostname = host?.split(':')[0] || 'localhost'
    const referer = headersList.get('referer') || ''
    
    console.log('📍 [CONTACT] Request from:', { hostname, referer })
    
    // Get clone information
    const { cloneId, cloneName } = await getCloneInfoByDomain(hostname)
    const sourceDomain = hostname
    const sourceUrl = referer
    
    console.log('📍 [CONTACT] Clone info:', { cloneId, cloneName, sourceDomain })
    
    const body: ContactFormData = await request.json()
    console.log('Received form data:', {
      fullName: body.fullName,
      country: body.country,
      email: body.email,
      sourceDomain,
      cloneId,
      // Don't log sensitive data like phone/details in production
    })
    
    // Validate required fields
    const requiredFields: (keyof ContactFormData)[] = ['fullName', 'country', 'phone', 'email', 'tutoringDetails', 'hourlyBudget']
    for (const field of requiredFields) {
      if (!body[field]) {
        console.log(`Validation failed: ${field} is missing`)
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      console.log('Validation failed: Invalid email format')
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    console.log('Form validation passed')

    // Save to Sanity
    let sanitySuccess = false
    try {
      console.log('Attempting to save to Sanity...')
      console.log('Sanity Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
      console.log('Sanity Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET)
      console.log('Sanity Token available:', !!process.env.SANITY_API_TOKEN)
      
      const doc = await client.create({
        _type: 'contactFormSubmission',
        fullName: body.fullName,
        country: body.country,
        phone: body.phone,
        email: body.email,
        tutoringDetails: body.tutoringDetails,
        hourlyBudget: body.hourlyBudget,
        submissionDate: new Date().toISOString(),
        // Add domain tracking information
        sourceDomain: sourceDomain,
        sourceUrl: sourceUrl,
        cloneId: cloneId,
        cloneName: cloneName
      })
      console.log('✅ Successfully saved to Sanity:', doc._id)
      sanitySuccess = true
    } catch (sanityError) {
      console.error('❌ Sanity save failed:', sanityError)
      // Continue with email sending even if Sanity fails
    }

    // Send email notification if Resend is configured
    let emailSuccess = false
    console.log('Checking email configuration...')
    console.log('RESEND_API_KEY available:', !!process.env.RESEND_API_KEY)
    console.log('NOTIFICATION_EMAIL:', process.env.NOTIFICATION_EMAIL)
    console.log('FROM_EMAIL:', process.env.FROM_EMAIL)
    
    if (process.env.RESEND_API_KEY && process.env.NOTIFICATION_EMAIL) {
      try {
        console.log('Attempting to send email...')
        const resend = new Resend(process.env.RESEND_API_KEY)
        // Create enhanced subject line with domain/clone info
        const domainInfo = cloneName ? `from ${cloneName} (${sourceDomain})` : `from ${sourceDomain}`
        const subject = `New Tutoring Request from ${body.fullName} - ${domainInfo}`
        
        const result = await resend.emails.send({
          from: process.env.FROM_EMAIL || 'notifications@yourdomain.com',
          to: process.env.NOTIFICATION_EMAIL,
          subject: subject,
          html: `
            <h2>New Tutoring Request</h2>
            
            <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 10px 0; color: #0369a1;">📍 Submission Source</h3>
              <p style="margin: 5px 0;"><strong>Domain:</strong> ${sourceDomain}</p>
              ${cloneId ? `<p style="margin: 5px 0;"><strong>Clone ID:</strong> ${cloneId}</p>` : ''}
              ${cloneName ? `<p style="margin: 5px 0;"><strong>Website:</strong> ${cloneName}</p>` : ''}
              ${sourceUrl ? `<p style="margin: 5px 0;"><strong>Source URL:</strong> ${sourceUrl}</p>` : ''}
            </div>
            
            <h3>👤 Contact Information</h3>
            <p><strong>Name:</strong> ${body.fullName}</p>
            <p><strong>Country:</strong> ${body.country}</p>
            <p><strong>Phone:</strong> ${body.phone}</p>
            <p><strong>Email:</strong> ${body.email}</p>
            
            <h3>💰 Budget & Requirements</h3>
            <p><strong>Hourly Budget:</strong> ${body.hourlyBudget}</p>
            <p><strong>Tutoring Details:</strong></p>
            <div style="background-color: #f9f9f9; border-left: 4px solid #e5e7eb; padding: 12px; margin: 10px 0;">
              ${body.tutoringDetails.replace(/\n/g, '<br>')}
            </div>
            
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          `
        })
        console.log('✅ Email sent successfully:', result)
        emailSuccess = true
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError)
        // Don't fail the request if email fails
      }
    } else {
      console.log('⚠️ Email not configured - missing environment variables')
    }

    // Return response with debugging info
    const responseData = {
      message: 'Form submitted successfully',
      debug: {
        sanitySuccess,
        emailSuccess,
        timestamp: new Date().toISOString()
      }
    }
    
    console.log('=== API RESPONSE ===', responseData)
    return NextResponse.json(responseData, { status: 200 })

  } catch (error) {
    console.error('❌ API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 