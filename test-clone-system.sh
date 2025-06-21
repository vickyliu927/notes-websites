#!/bin/bash

# Test script for clone system
echo "🧪 Testing Clone System Implementation"
echo "======================================"

# Base URL (adjust as needed)
BASE_URL="http://localhost:3000"

echo ""
echo "1. Testing default domain (should show default content)"
echo "------------------------------------------------------"
curl -s -I "$BASE_URL/" | grep -E "(x-clone|HTTP)"

echo ""
echo "2. Testing clone domain via header simulation"
echo "---------------------------------------------"
curl -s -I -H "Host: igcse-questions.com" "$BASE_URL/" | grep -E "(x-clone|HTTP)"

echo ""
echo "3. Testing clone domain via header simulation (www)"
echo "--------------------------------------------------"
curl -s -I -H "Host: www.igcse-questions.com" "$BASE_URL/" | grep -E "(x-clone|HTTP)"

echo ""
echo "4. Testing direct clone URL (should redirect)"
echo "---------------------------------------------"
curl -s -I "$BASE_URL/clone/test-clone/homepage" | grep -E "(Location|HTTP)"

echo ""
echo "5. Testing subject page on clone domain"
echo "---------------------------------------"
curl -s -I -H "Host: igcse-questions.com" "$BASE_URL/mathematics" | grep -E "(x-clone|HTTP)"

echo ""
echo "6. Testing debug endpoint"
echo "------------------------"
curl -s "$BASE_URL/api/debug-middleware" | jq '.' 2>/dev/null || echo "jq not available, showing raw response:"
curl -s "$BASE_URL/api/debug-middleware"

echo ""
echo "✅ Test completed!"
echo ""
echo "Expected results:"
echo "- Default domain: No clone headers"
echo "- Clone domains: x-clone-id: test-clone header present"
echo "- Direct clone URLs: 301/302 redirect to clean URL"
echo "- Subject pages: Clone headers when accessed via clone domain" 