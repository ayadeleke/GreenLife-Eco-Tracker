# Debug Locust Load Test for GreenLife Eco Tracker
import os
import sys
from locust import HttpUser, task, between, events

class DebugGreenLifeUser(HttpUser):
    """
    Minimal debug load test to identify issues
    """
    wait_time = between(2, 5)
    host = os.getenv('TARGET_URL', "https://greenlife-tracker.greenplant-30488afa.southcentralus.azurecontainerapps.io")
    
    def on_start(self):
        print("=== DEBUG LOCUST START ===")
        print(f"Host: {self.host}")
        print(f"Python version: {sys.version}")
        print(f"Working directory: {os.getcwd()}")
        print("Environment variables:")
        for key, value in os.environ.items():
            if any(keyword in key.upper() for keyword in ['TARGET', 'URL', 'HOST', 'USER', 'DURATION', 'ENABLE']):
                print(f"  {key}: {value}")
        print("=== END DEBUG INFO ===")

    @task(1)
    def test_root(self):
        """Test just the root endpoint"""
        print(f"Testing root endpoint: {self.host}/")
        try:
            with self.client.get("/", name="Root", catch_response=True, timeout=30) as response:
                print(f"Response status: {response.status_code}")
                print(f"Response headers: {dict(response.headers)}")
                print(f"Response time: {response.elapsed.total_seconds():.2f}s")
                
                if response.status_code == 200:
                    print("✅ Root endpoint successful")
                    response.success()
                else:
                    print(f"❌ Root endpoint failed: {response.status_code}")
                    print(f"Response text (first 200 chars): {response.text[:200]}")
                    response.failure(f"Root failed: {response.status_code}")
        except Exception as e:
            print(f"❌ Exception in root test: {e}")
            raise

@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    print("🔍 DEBUG LOAD TEST STARTING")
    print(f"Environment host: {environment.host}")
    print(f"Runner: {environment.runner}")
    
    # Test basic connectivity
    import requests
    try:
        print("Testing basic connectivity...")
        response = requests.get(environment.host, timeout=30)
        print(f"Direct connectivity test: {response.status_code} ({response.elapsed.total_seconds():.2f}s)")
    except Exception as e:
        print(f"Direct connectivity test failed: {e}")

@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    print("🔍 DEBUG LOAD TEST COMPLETED")
    stats = environment.stats
    print(f"Total requests: {stats.total.num_requests}")
    print(f"Failed requests: {stats.total.num_failures}")
    if stats.total.num_requests > 0:
        success_rate = ((stats.total.num_requests - stats.total.num_failures) / stats.total.num_requests * 100)
        print(f"Success rate: {success_rate:.1f}%")

@events.request.add_listener
def on_request(request_type, name, response_time, response_length, response, context, exception, start_time, url, **kwargs):
    if exception:
        print(f"❌ Request failed - {name}: {exception}")
    else:
        print(f"✅ Request succeeded - {name}: {response.status_code} in {response_time:.0f}ms")
