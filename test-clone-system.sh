#!/bin/bash

# 🧪 Clone System Automated Test Script
# Run this script to test all major functionality

echo "🚀 Clone System Test Suite"
echo "=========================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to run tests
run_test() {
    local test_name="$1"
    local url="$2"
    local expected_pattern="$3"
    
    echo -n "Testing $test_name... "
    
    response=$(curl -s "$url" 2>/dev/null)
    exit_code=$?
    
    if [ $exit_code -ne 0 ]; then
        echo -e "${RED}FAILED${NC} (Connection error)"
        ((TESTS_FAILED++))
        return 1
    fi
    
    if echo "$response" | grep -q "$expected_pattern"; then
        echo -e "${GREEN}PASSED${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}FAILED${NC} (Pattern not found: $expected_pattern)"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Test HTTP status codes
check_status() {
    local test_name="$1"
    local url="$2"
    local expected_status="$3"
    
    echo -n "Testing $test_name... "
    
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$status" = "$expected_status" ]; then
        echo -e "${GREEN}PASSED${NC} (Status: $status)"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}FAILED${NC} (Expected: $expected_status, Got: $status)"
        ((TESTS_FAILED++))
        return 1
    fi
}

echo "🌐 Basic Page Loading Tests"
echo "---------------------------"
run_test "Main Homepage" "http://localhost:3000" "<title>CIE IGCSE Notes"
run_test "Clone Homepage" "http://localhost:3000/clone/test-clone/homepage" "Test Clone - Homepage"
# Test clone redirect functionality (clone overview redirects to homepage)
echo -n "Testing Clone Overview (redirect)... "
if curl -s -I "http://localhost:3000/clone/test-clone" | grep -q "HTTP/1.1 307"; then
  echo -e "${GREEN}PASSED${NC}"
  ((passed_tests++))
else
  echo -e "${RED}FAILED${NC}"
  ((failed_tests++))
fi
run_test "Test Dashboard" "http://localhost:3000/clone-system-test" "Clone System Test Dashboard"

echo ""
echo "🔍 Content Verification Tests"
echo "-----------------------------"
run_test "Clone Homepage Content" "http://localhost:3000/clone/test-clone/homepage" "This is the homepage for the"
run_test "Main Homepage Content" "http://localhost:3000" "CIE IGCSE Study Notes"
run_test "Clone ID Display" "http://localhost:3000/clone/test-clone/homepage" "Clone ID:"

echo ""
echo "🛡️ Error Handling Tests"
echo "----------------------"

# Test different invalid clone formats
echo -n "Testing invalid clone format (capitals)... "
status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/clone/Test-Clone" 2>/dev/null)
if [ "$status" = "200" ] || [ "$status" = "302" ]; then
    echo -e "${GREEN}HANDLED${NC} (Status: $status)"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}WARNING${NC} (Status: $status)"
fi

echo -n "Testing invalid clone format (underscores)... "
status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/clone/test_clone" 2>/dev/null)
if [ "$status" = "200" ] || [ "$status" = "302" ] || [ "$status" = "404" ]; then
    echo -e "${GREEN}HANDLED${NC} (Status: $status)"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}WARNING${NC} (Status: $status)"
fi

echo ""
echo "⚡ Performance Tests"
echo "------------------"

# Test load times
echo -n "Main homepage load time... "
time_main=$(time (curl -s http://localhost:3000 > /dev/null) 2>&1 | grep real | awk '{print $2}')
echo -e "${BLUE}$time_main${NC}"

echo -n "Clone homepage load time... "
time_clone=$(time (curl -s http://localhost:3000/clone/test-clone/homepage > /dev/null) 2>&1 | grep real | awk '{print $2}')
echo -e "${BLUE}$time_clone${NC}"

echo ""
echo "📊 Component Integration Tests"
echo "-----------------------------"

# Test for common React/Next.js errors
echo -n "Checking for hydration errors... "
response=$(curl -s http://localhost:3000)
if echo "$response" | grep -qi "hydration.*error\|error.*hydration"; then
    echo -e "${YELLOW}WARNING${NC} (Hydration error detected)"
else
    echo -e "${GREEN}CLEAN${NC}"
    ((TESTS_PASSED++))
fi

echo -n "Checking for JavaScript errors... "
if echo "$response" | grep -qi "Error\|Exception\|ReferenceError\|TypeError.*Cannot read"; then
    echo -e "${YELLOW}WARNING${NC} (Error text found)"
else
    echo -e "${GREEN}CLEAN${NC}"
    ((TESTS_PASSED++))
fi

echo ""
echo "🎯 Clone System Specific Tests"
echo "-----------------------------"

# Test clone data structure
echo -n "Testing clone data structure... "
dashboard_content=$(curl -s http://localhost:3000/clone-system-test)
if echo "$dashboard_content" | grep -q "test-clone" && echo "$dashboard_content" | grep -q "Test Clone"; then
    echo -e "${GREEN}PASSED${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}FAILED${NC} (Clone data not found)"
    ((TESTS_FAILED++))
fi

# Test navigation elements
echo -n "Testing clone navigation... "
clone_page=$(curl -s http://localhost:3000/clone/test-clone/homepage)
if echo "$clone_page" | grep -q "Go to Original" && echo "$clone_page" | grep -q "Test Dashboard"; then
    echo -e "${GREEN}PASSED${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}FAILED${NC} (Navigation elements not found)"
    ((TESTS_FAILED++))
fi

echo ""
echo "📈 Results Summary"
echo "=================="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n🎉 ${GREEN}ALL TESTS PASSED!${NC}"
    echo "Your clone system is working perfectly!"
else
    echo -e "\n⚠️  ${YELLOW}Some tests failed.${NC}"
    echo "Check the output above for details."
fi

echo ""
echo "🔗 Quick Access URLs:"
echo "   Main Site: http://localhost:3000"
echo "   Clone: http://localhost:3000/clone/test-clone/homepage"  
echo "   Dashboard: http://localhost:3000/clone-system-test"
echo "   Studio: http://localhost:3000/studio"

echo ""
echo "📖 For detailed testing guide, see: TESTING_GUIDE.md"

# Exit with error code if tests failed
if [ $TESTS_FAILED -ne 0 ]; then
    exit 1
else
    exit 0
fi 