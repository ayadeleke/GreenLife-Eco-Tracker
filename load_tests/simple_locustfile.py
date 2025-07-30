# Simple Locust Load Test for GreenLife Eco Tracker
import os
import logging
from locust import HttpUser, task, between, events

class SimpleGreenLifeUser(HttpUser):
    """
    Simplified load test focusing on verified working endpoints
    """
    wait_time = between(1, 3)
    host = os.getenv('TARGET_URL', "https://greenlife-tracker.greenplant-30488afa.southcentralus.azurecontainerapps.io")
    
    def on_start(self):
        self.ENABLE_LOGGING = os.getenv('ENABLE_LOGGING', 'True') == 'True'
        if self.ENABLE_LOGGING:
            print(f"[Locust] Simple load test starting for {self.host}")

    @task(5)
    def test_homepage(self):
        """Test the main homepage"""
        with self.client.get("/", name="Homepage", catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Homepage failed: {response.status_code}")

    @task(3)
    def test_dashboard(self):
        """Test the dashboard page"""
        with self.client.get("/dashboard", name="Dashboard", catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Dashboard failed: {response.status_code}")

    @task(2)
    def test_register(self):
        """Test the register page"""
        with self.client.get("/register", name="Register", catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Register failed: {response.status_code}")

    @task(1)
    def test_manifest(self):
        """Test manifest.json"""
        with self.client.get("/manifest.json", name="Manifest", catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Manifest failed: {response.status_code}")

@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    print("🌱 Simple GreenLife Load Test Starting!")
    print(f"Target: {environment.host}")
    print(f"Users: {os.getenv('USERS', '1')}")
    print(f"Duration: {os.getenv('DURATION', '60')} seconds")

@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    stats = environment.stats
    print("\n🌳 Simple Load Test Completed!")
    print(f"Total Requests: {stats.total.num_requests}")
    print(f"Failed Requests: {stats.total.num_failures}")
    if stats.total.num_requests > 0:
        success_rate = ((stats.total.num_requests - stats.total.num_failures) / stats.total.num_requests * 100)
        print(f"Success Rate: {success_rate:.1f}%")
        print(f"Average Response Time: {stats.total.avg_response_time:.2f}ms")
