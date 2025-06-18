import { NextResponse } from 'next/server'

// ===== DOMAIN TO CLONE MAPPING =====
// Add your custom domains and their corresponding clone IDs here
const DOMAIN_TO_CLONE_MAP = {
  // Replace 'your-domain.com' with your actual domain
  'www.igcse-questions.com': 'test-clone',
  'igcse-questions.com': 'test-clone',
  // Add more domain mappings as needed
  // 'another-domain.com': 'another-clone-id',
}

// ===== CONFIGURATION =====
export const config = {
  matcher: '/',
}

// ===== CLONE DETECTION MIDDLEWARE =====
export function middleware(request) {
  console.log('🔥 MIDDLEWARE CALLED')
  return new Response('MIDDLEWARE RESPONSE', { status: 200 })
} 