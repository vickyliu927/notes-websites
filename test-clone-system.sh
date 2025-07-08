#!/bin/bash

# 🧪 Enhanced Clone System Automated Test Suite - Prompt 12 Implementation
# Comprehensive testing & debug infrastructure for multi-clone content management system
# Run this script to test all major functionality, debug tools, and system health

echo "🚀 Enhanced Clone System Test Suite v2.0"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0
WARNINGS=0

# Base URL
BASE_URL="http://localhost:3000"

# Test results storage
TEST_RESULTS_FILE="test-results-$(date +%Y%m%d-%H%M%S).log"

# Logging function
log_test() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$TEST_RESULTS_FILE"
}

# Enhanced test function with performance monitoring
run_test_enhanced() {
    local test_name="$1"
    local url="$2"
    local expected_pattern="$3"
    local timeout="${4:-10}"
    
    echo -n "Testing $test_name... "
    log_test "STARTING: $test_name - $url"
    
    local start_time=$(date +%s%N)
    response=$(curl -s --max-time "$timeout" "$url" 2>/dev/null)
    local exit_code=$?
    local end_time=$(date +%s%N)
    local duration=$(( (end_time - start_time) / 1000000 )) # Convert to milliseconds
    
    if [ $exit_code -ne 0 ]; then
        echo -e "${RED}FAILED${NC} (Connection error, timeout: ${timeout}s)"
        log_test "FAILED: $test_name - Connection error (exit code: $exit_code)"
        ((TESTS_FAILED++))
        return 1
    fi
    
    if echo "$response" | grep -q "$expected_pattern"; then
        echo -e "${GREEN}PASSED${NC} (${duration}ms)"
        log_test "PASSED: $test_name - Duration: ${duration}ms"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}FAILED${NC} (Pattern not found: $expected_pattern)"
        log_test "FAILED: $test_name - Pattern not found: $expected_pattern"
        ((TESTS_FAILED++))
        return 1
    fi
}

# API endpoint test function
test_api_endpoint() {
    local endpoint_name="$1"
    local url="$2"
    local expected_status="${3:-200}"
    
    echo -n "Testing API: $endpoint_name... "
    log_test "API TEST: $endpoint_name - $url"
    
    local response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}PASSED${NC} (Status: $response)"
        log_test "API PASSED: $endpoint_name - Status: $response"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}FAILED${NC} (Expected: $expected_status, Got: $response)"
        log_test "API FAILED: $endpoint_name - Expected: $expected_status, Got: $response"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Performance monitoring function
monitor_performance() {
    local test_name="$1"
    local url="$2"
    local threshold_ms="${3:-1000}"
    
    echo -n "Performance test: $test_name... "
    log_test "PERFORMANCE: $test_name - $url"
    
    local start_time=$(date +%s%N)
    response=$(curl -s "$url" 2>/dev/null)
    local end_time=$(date +%s%N)
    local duration=$(( (end_time - start_time) / 1000000 ))
    
    if [ $duration -lt $threshold_ms ]; then
        echo -e "${GREEN}PASSED${NC} (${duration}ms < ${threshold_ms}ms)"
        log_test "PERFORMANCE PASSED: $test_name - ${duration}ms"
        ((TESTS_PASSED++))
    else
        echo -e "${YELLOW}WARNING${NC} (${duration}ms >= ${threshold_ms}ms)"
        log_test "PERFORMANCE WARNING: $test_name - ${duration}ms (threshold: ${threshold_ms}ms)"
        ((WARNINGS++))
    fi
}

# System health check function
system_health_check() {
    echo ""
    echo -e "${CYAN}🔍 System Health Check${NC}"
    echo "---------------------"
    
    # Check if server is running
    if curl -s "$BASE_URL" > /dev/null 2>&1; then
        echo -e "Server Status: ${GREEN}RUNNING${NC}"
        log_test "HEALTH: Server is running"
    else
        echo -e "Server Status: ${RED}DOWN${NC}"
        log_test "HEALTH: Server is down"
        echo -e "${RED}❌ Server is not running! Please start the development server first.${NC}"
        exit 1
    fi
    
    # Check debug endpoints
    local debug_endpoints=("debug-middleware" "debug-cache" "debug-performance")
    for endpoint in "${debug_endpoints[@]}"; do
        if curl -s "$BASE_URL/api/$endpoint" > /dev/null 2>&1; then
            echo -e "API $endpoint: ${GREEN}ACTIVE${NC}"
            log_test "HEALTH: API $endpoint is active"
        else
            echo -e "API $endpoint: ${RED}INACTIVE${NC}"
            log_test "HEALTH: API $endpoint is inactive"
            ((WARNINGS++))
        fi
    done
}

# Cache debugging tests
test_cache_system() {
    echo ""
    echo -e "${CYAN}🗄️ Cache System Tests${NC}"
    echo "---------------------"
    
    # Test cache status
    test_api_endpoint "Cache Status" "$BASE_URL/api/debug-cache?action=status"
    
    # Test cache entries
    test_api_endpoint "Cache Entries" "$BASE_URL/api/debug-cache?action=entries"
    
    # Test cache stats
    test_api_endpoint "Cache Stats" "$BASE_URL/api/debug-cache?action=stats"
    
    # Test domain lookup with cache
    echo -n "Testing cache domain lookup... "
    response=$(curl -s "$BASE_URL/api/debug-cache?action=test&hostname=www.igcse-questions.com" 2>/dev/null)
    if echo "$response" | grep -q "hostname"; then
        echo -e "${GREEN}PASSED${NC}"
        log_test "CACHE TEST PASSED: Domain lookup test"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}FAILED${NC}"
        log_test "CACHE TEST FAILED: Domain lookup test"
        ((TESTS_FAILED++))
    fi
}

# Performance monitoring tests
test_performance_system() {
    echo ""
    echo -e "${CYAN}📊 Performance Monitoring Tests${NC}"
    echo "-------------------------------"
    
    # Test performance stats API
    test_api_endpoint "Performance Stats" "$BASE_URL/api/debug-performance?type=stats"
    
    # Test performance metrics API
    test_api_endpoint "Performance Metrics" "$BASE_URL/api/debug-performance?type=domainLookups"
    
    # Test performance monitoring page
    run_test_enhanced "Performance Monitor Page" "$BASE_URL/debug/performance-monitor" "Performance Monitor"
    
    # Performance thresholds
    monitor_performance "Homepage Load Time" "$BASE_URL" 1000
    monitor_performance "Clone Homepage Load Time" "$BASE_URL/clone/test-clone/homepage" 1000
    monitor_performance "System Status Load Time" "$BASE_URL/debug/system-status" 2000
}

# Debug tools integration tests
test_debug_tools() {
    echo ""
    echo -e "${CYAN}🛠️ Debug Tools Integration Tests${NC}"
    echo "--------------------------------"
    
    # Test all debug pages
    local debug_pages=(
        "middleware-test:Middleware Test"
        "browser-test:Browser Test" 
        "extension-test:Extension Test"
        "system-status:System Status"
        "performance-monitor:Performance Monitor"
    )
    
    for page_info in "${debug_pages[@]}"; do
        IFS=':' read -r page_path page_name <<< "$page_info"
        run_test_enhanced "$page_name Page" "$BASE_URL/debug/$page_path" "$page_name"
    done
    
    # Test clone system test dashboard
    run_test_enhanced "Clone System Test Dashboard" "$BASE_URL/clone-system-test" "Clone System Test Dashboard"
}

# Component data source verification
test_component_sources() {
    echo ""
    echo -e "${CYAN}🧩 Component Data Sources Tests${NC}"
    echo "-------------------------------"
    
    # Test system status API for component sources
    echo -n "Testing component data sources... "
    response=$(curl -s "$BASE_URL/debug/system-status" 2>/dev/null)
    if echo "$response" | grep -q "Component Data Sources" && echo "$response" | grep -q "clone-specific\|baseline\|default"; then
        echo -e "${GREEN}PASSED${NC}"
        log_test "COMPONENT SOURCES PASSED: Data sources visible"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}FAILED${NC}"
        log_test "COMPONENT SOURCES FAILED: Data sources not visible"
        ((TESTS_FAILED++))
    fi
    
    # Test clone data fetching
    echo -n "Testing clone data fetching... "
    response=$(curl -s "$BASE_URL/api/debug-middleware" 2>/dev/null)
    if echo "$response" | grep -q "timestamp"; then
        echo -e "${GREEN}PASSED${NC}"
        log_test "CLONE DATA PASSED: Middleware responding"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}FAILED${NC}"
        log_test "CLONE DATA FAILED: Middleware not responding"
        ((TESTS_FAILED++))
    fi
}

# Error tracking and logging tests
test_error_tracking() {
    echo ""
    echo -e "${CYAN}🚨 Error Tracking & Logging Tests${NC}"
    echo "--------------------------------"
    
    # Test 404 handling
    echo -n "Testing 404 error handling... "
    status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/non-existent-page" 2>/dev/null)
    if [ "$status" = "404" ]; then
        echo -e "${GREEN}PASSED${NC} (Status: $status)"
        log_test "ERROR TRACKING PASSED: 404 handling works"
        ((TESTS_PASSED++))
    else
        echo -e "${YELLOW}WARNING${NC} (Status: $status)"
        log_test "ERROR TRACKING WARNING: Unexpected status for 404: $status"
        ((WARNINGS++))
    fi
    
    # Test invalid clone handling
    echo -n "Testing invalid clone handling... "
    status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/clone/invalid-clone-id/homepage" 2>/dev/null)
    if [ "$status" = "404" ] || [ "$status" = "302" ]; then
        echo -e "${GREEN}PASSED${NC} (Status: $status)"
        log_test "ERROR TRACKING PASSED: Invalid clone handling works"
        ((TESTS_PASSED++))
    else
        echo -e "${YELLOW}WARNING${NC} (Status: $status)"
        log_test "ERROR TRACKING WARNING: Unexpected status for invalid clone: $status"
        ((WARNINGS++))
    fi
}

# Integration testing of all tools
test_tools_integration() {
    echo ""
    echo -e "${CYAN}🔗 Tools Integration Tests${NC}"
    echo "-------------------------"
    
    # Test navigation between debug tools
    echo -n "Testing debug tools navigation... "
    system_status_response=$(curl -s "$BASE_URL/debug/system-status" 2>/dev/null)
    if echo "$system_status_response" | grep -q "Debug Tools" && echo "$system_status_response" | grep -q "href.*debug"; then
        echo -e "${GREEN}PASSED${NC}"
        log_test "INTEGRATION PASSED: Debug tools navigation works"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}FAILED${NC}"
        log_test "INTEGRATION FAILED: Debug tools navigation not found"
        ((TESTS_FAILED++))
    fi
    
    # Test cross-system data consistency
    echo -n "Testing cross-system data consistency... "
    middleware_response=$(curl -s "$BASE_URL/api/debug-middleware" 2>/dev/null)
    cache_response=$(curl -s "$BASE_URL/api/debug-cache?action=status" 2>/dev/null)
    
    if echo "$middleware_response" | grep -q "timestamp" && echo "$cache_response" | grep -q "timestamp"; then
        echo -e "${GREEN}PASSED${NC}"
        log_test "INTEGRATION PASSED: Cross-system data consistency"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}FAILED${NC}"
        log_test "INTEGRATION FAILED: Cross-system data inconsistency"
        ((TESTS_FAILED++))
    fi
}

# Main test execution
main() {
    echo "🎯 Starting comprehensive test suite..."
    echo "Logging to: $TEST_RESULTS_FILE"
    echo ""
    
    log_test "TEST SUITE STARTED: Enhanced Clone System Test Suite v2.0"
    
    # Core system health check
    system_health_check
    
    # Basic functionality tests
    echo ""
    echo -e "${BLUE}🌐 Basic Page Loading Tests${NC}"
    echo "---------------------------"
    run_test_enhanced "Main Homepage" "$BASE_URL" "<title>CIE IGCSE Notes" 5
    run_test_enhanced "Clone Homepage" "$BASE_URL/clone/test-clone/homepage" "Test Clone - Homepage" 5
    run_test_enhanced "Admin Dashboard" "$BASE_URL/admin/clones" "Clone Management" 5
    
    # API endpoint tests
    echo ""
    echo -e "${BLUE}🔌 API Endpoint Tests${NC}"
    echo "--------------------"
    test_api_endpoint "Debug Middleware" "$BASE_URL/api/debug-middleware"
    test_api_endpoint "Debug Cache" "$BASE_URL/api/debug-cache"
    test_api_endpoint "Debug Performance" "$BASE_URL/api/debug-performance"
    
    # Comprehensive debug system tests
    test_cache_system
    test_performance_system
    test_debug_tools
    test_component_sources
    test_error_tracking
    test_tools_integration
    
    # Performance monitoring
    echo ""
    echo -e "${PURPLE}⚡ Performance Benchmarks${NC}"
    echo "-------------------------"
    monitor_performance "Main Homepage" "$BASE_URL" 800
    monitor_performance "Clone Detection" "$BASE_URL/clone/test-clone/homepage" 1000
    monitor_performance "Debug Dashboard" "$BASE_URL/debug/system-status" 1500
    
    # Final results
    echo ""
    echo -e "${PURPLE}📈 Final Results Summary${NC}"
    echo "========================"
    echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
    echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
    echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
    echo ""
    
    # System grade calculation
    local total_tests=$((TESTS_PASSED + TESTS_FAILED))
    local success_rate=0
    if [ $total_tests -gt 0 ]; then
        success_rate=$(( (TESTS_PASSED * 100) / total_tests ))
    fi
    
    echo -e "Success Rate: ${CYAN}${success_rate}%${NC}"
    echo -e "Test Results Logged to: ${CYAN}$TEST_RESULTS_FILE${NC}"
    
    # System grade
    if [ $TESTS_FAILED -eq 0 ] && [ $WARNINGS -eq 0 ]; then
        echo -e "\n🎉 ${GREEN}SYSTEM GRADE: A+ (EXCELLENT)${NC}"
        echo "Your clone system is production-ready!"
    elif [ $TESTS_FAILED -eq 0 ] && [ $WARNINGS -lt 3 ]; then
        echo -e "\n✅ ${GREEN}SYSTEM GRADE: A (VERY GOOD)${NC}"
        echo "Your clone system is working excellently with minor warnings."
    elif [ $success_rate -ge 90 ]; then
        echo -e "\n👍 ${BLUE}SYSTEM GRADE: B (GOOD)${NC}"
        echo "Your clone system is working well with some issues."
    elif [ $success_rate -ge 75 ]; then
        echo -e "\n⚠️ ${YELLOW}SYSTEM GRADE: C (FAIR)${NC}"
        echo "Your clone system has several issues that need attention."
    else
        echo -e "\n❌ ${RED}SYSTEM GRADE: F (NEEDS WORK)${NC}"
        echo "Your clone system requires significant fixes."
    fi
    
    echo ""
    echo -e "${CYAN}🔗 Quick Access URLs:${NC}"
    echo "   Main Site: $BASE_URL"
    echo "   Clone: $BASE_URL/clone/test-clone/homepage"
    echo "   System Status: $BASE_URL/debug/system-status"
    echo "   Performance Monitor: $BASE_URL/debug/performance-monitor"
    echo "   Cache Debug: $BASE_URL/api/debug-cache?action=status"
    echo "   Test Dashboard: $BASE_URL/clone-system-test"
    echo "   Studio: $BASE_URL/studio"
    
    echo ""
    echo -e "${CYAN}📖 Documentation:${NC}"
    echo "   Testing Guide: TESTING_GUIDE.md"
    echo "   Phase 4 Implementation: PHASE4_IMPLEMENTATION.md"
    echo "   Browser Testing: BROWSER_TESTING.md"
    
    log_test "TEST SUITE COMPLETED: Tests Passed: $TESTS_PASSED, Failed: $TESTS_FAILED, Warnings: $WARNINGS"
    
    # Exit with error code if tests failed
    if [ $TESTS_FAILED -gt 0 ]; then
        exit 1
    fi
}

# Run the main function
main "$@" 