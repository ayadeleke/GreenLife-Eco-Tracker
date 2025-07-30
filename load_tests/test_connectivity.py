#!/usr/bin/env python3
"""
Simple connectivity test for GreenLife Eco Tracker endpoints
Run this before executing load tests to verify connectivity
"""

import requests
import os
import sys
from urllib.parse import urljoin

def test_connectivity(base_url, timeout=30):
    """Test basic connectivity to the application"""
    print(f"🔍 Testing connectivity to: {base_url}")
    
    # Test endpoints
    endpoints = [
        "/",
        "/dashboard", 
        "/register",
        "/login",
        "/static/css/main.css",
        "/favicon.ico",
        "/manifest.json"
    ]
    
    results = {}
    session = requests.Session()
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    })
    
    for endpoint in endpoints:
        url = urljoin(base_url, endpoint)
        try:
            print(f"  Testing {endpoint}...", end=" ")
            response = session.get(url, timeout=timeout, allow_redirects=True)
            results[endpoint] = {
                "status_code": response.status_code,
                "response_time": response.elapsed.total_seconds(),
                "success": response.status_code < 400
            }
            
            if response.status_code < 400:
                print(f"✅ {response.status_code} ({response.elapsed.total_seconds():.2f}s)")
            else:
                print(f"❌ {response.status_code} ({response.elapsed.total_seconds():.2f}s)")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Error: {e}")
            results[endpoint] = {
                "status_code": None,
                "response_time": None,
                "success": False,
                "error": str(e)
            }
    
    # Summary
    successful_tests = sum(1 for r in results.values() if r["success"])
    total_tests = len(results)
    
    print(f"\n📊 Summary: {successful_tests}/{total_tests} endpoints accessible")
    
    if successful_tests == 0:
        print("❌ No endpoints are accessible. Load test will likely fail.")
        return False
    elif successful_tests < total_tests:
        print("⚠️  Some endpoints are not accessible, but load test may still work.")
        return True
    else:
        print("✅ All endpoints accessible. Load test should work.")
        return True

if __name__ == "__main__":
    # Get target URL from environment or use default
    target_url = os.getenv("TARGET_URL", "https://greenlife-tracker.greenplant-30488afa.southcentralus.azurecontainerapps.io")
    
    if len(sys.argv) > 1:
        target_url = sys.argv[1]
    
    print(f"GreenLife Eco Tracker Connectivity Test")
    print(f"{'='*50}")
    
    success = test_connectivity(target_url)
    
    if not success:
        sys.exit(1)
    else:
        print("\n🎉 Connectivity test passed!")
        sys.exit(0)
