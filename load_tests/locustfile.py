# Python
import os
import logging
import random
from locust import HttpUser, task, between, events
from dotenv import load_dotenv

# Load environment variables from .env file if present
load_dotenv()

class GreenLifeUser(HttpUser):
    """
    Simulates real users browsing the GreenLife Eco Tracker React application
    """
    wait_time = between(1, 3)
    # Use environment variable for host, with fallback
    host = os.getenv('TARGET_URL', "https://greenlife-tracker-prod.greenplant-30488afa.southcentralus.azurecontainerapps.io")
    timeout_duration = 90  # seconds

    def on_start(self):
        # Set debug mode from environment variable
        self.ENABLE_LOGGING = os.getenv('ENABLE_LOGGING', 'True') == 'True'
        # Set up logging
        if self.ENABLE_LOGGING:
            logging.basicConfig(level=logging.DEBUG)
        else:
            logging.basicConfig(level=logging.WARNING)
        
        if self.ENABLE_LOGGING:
            print(f"[Locust] Starting user session for {self.host}")
            print(f"[Locust] Environment variables:")
            print(f"  TARGET_URL: {os.getenv('TARGET_URL', 'not set')}")
            print(f"  USERS: {os.getenv('USERS', 'not set')}")
            print(f"  DURATION: {os.getenv('DURATION', 'not set')}")
            print(f"  ENABLE_LOGGING: {os.getenv('ENABLE_LOGGING', 'not set')}")

        # Test basic connectivity first
        try:
            response = self.client.get("/", timeout=30)
            if self.ENABLE_LOGGING:
                print(f"[Locust] Initial connectivity test: {response.status_code}")
        except Exception as e:
            if self.ENABLE_LOGGING:
                print(f"[Locust] Initial connectivity failed: {e}")
            raise

    @task(5)
    def visit_homepage(self):
        """
        Test the main homepage - most common user action
        """
        headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        
        if self.ENABLE_LOGGING:
            print("[Locust] Visiting homepage")

        with self.client.get(
            "/",
            headers=headers,
            name="Homepage",
            catch_response=True,
            timeout=self.timeout_duration
        ) as response:
            if response.status_code == 200:
                response.success()
                if self.ENABLE_LOGGING:
                    print("[Locust] Homepage loaded successfully")
            elif response.status_code == 404:
                # For SPAs, 404 might be expected for some routes
                response.success()
                if self.ENABLE_LOGGING:
                    print("[Locust] Homepage returned 404 (may be expected for SPA)")
            else:
                msg = f"Homepage failed with status {response.status_code}: {response.text[:200]}"
                response.failure(msg)
                if self.ENABLE_LOGGING:
                    logging.error(msg)

    @task(3)
    def visit_dashboard(self):
        """
        Test the dashboard page - main application interface
        """
        headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        
        if self.ENABLE_LOGGING:
            print("[Locust] Visiting dashboard")

        with self.client.get(
            "/dashboard",
            headers=headers,
            name="Dashboard",
            catch_response=True,
            timeout=self.timeout_duration
        ) as response:
            if response.status_code == 200:
                response.success()
                if self.ENABLE_LOGGING:
                    print("[Locust] Dashboard loaded successfully")
            else:
                msg = f"Dashboard failed with status {response.status_code}"
                response.failure(msg)
                if self.ENABLE_LOGGING:
                    logging.error(msg)

    @task(2)
    def visit_register(self):
        """
        Test the registration page
        """
        headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        
        if self.ENABLE_LOGGING:
            print("[Locust] Visiting register page")

        with self.client.get(
            "/register",
            headers=headers,
            name="Register Page",
            catch_response=True,
            timeout=self.timeout_duration
        ) as response:
            if response.status_code == 200:
                response.success()
                if self.ENABLE_LOGGING:
                    print("[Locust] Register page loaded successfully")
            else:
                msg = f"Register page failed with status {response.status_code}"
                response.failure(msg)
                if self.ENABLE_LOGGING:
                    logging.error(msg)

    @task(1)
    def load_static_assets(self):
        """
        Test loading static assets (CSS, JS files)
        """
        # Common static asset paths for React apps
        static_assets = [
            "/static/css/main.css",
            "/static/js/main.js",
            "/favicon.ico",
            "/manifest.json"
        ]
        
        asset = random.choice(static_assets)
        
        with self.client.get(
            asset,
            name="Static Assets",
            catch_response=True,
            timeout=self.timeout_duration
        ) as response:
            # Static assets might return 200 or 404, both are acceptable for testing
            if response.status_code in [200, 404]:
                response.success()
                if self.ENABLE_LOGGING and response.status_code == 200:
                    print(f"[Locust] Static asset loaded: {asset}")
            else:
                response.failure(f"Static asset failed with status {response.status_code}")

    @task(1)
    def simulate_spa_navigation(self):
        """
        Simulate Single Page Application navigation behavior
        """
        # Test common React router paths that might exist
        spa_routes = [
            "/login",
            "/profile", 
            "/trees",
            "/stats",
            "/about"
        ]
        
        route = random.choice(spa_routes)
        headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        
        with self.client.get(
            route,
            headers=headers,
            name="SPA Navigation",
            catch_response=True,
            timeout=self.timeout_duration
        ) as response:
            # React router usually returns 200 for all routes (serving index.html)
            if response.status_code in [200, 404]:
                response.success()
                if self.ENABLE_LOGGING:
                    print(f"[Locust] SPA route tested: {route}")
            else:
                response.failure(f"SPA navigation failed with status {response.status_code}")

    def on_stop(self):
        # No resources to clean up for this scenario
        if self.ENABLE_LOGGING:
            print("[Locust] User session ended")

# Event listeners for monitoring
@events.request.add_listener
def my_request_handler(request_type, name, response_time, response_length, response, context, exception, start_time, url, **kwargs):
    """Custom request handler for detailed monitoring"""
    if exception:
        logging.error(f"Request failed: {name} - {exception}")
    elif response_time > 2000:  # Log slow requests (> 2 seconds)
        logging.warning(f"Slow request: {name} - {response_time}ms")

@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    """Called when the test starts"""
    print("🌱 GreenLife Eco Tracker Load Test Starting!")
    print(f"Target: {environment.host}")
    print(f"Users: {os.getenv('USERS', 'default')}")
    print(f"Duration: {os.getenv('DURATION', 'default')} seconds")
    print(f"Enable Logging: {os.getenv('ENABLE_LOGGING', 'default')}")
    print("Environment Variables:")
    for key, value in os.environ.items():
        if key.startswith(('TARGET_', 'USERS', 'DURATION', 'ENABLE_')):
            print(f"  {key}: {value}")
    print("Testing React SPA with known routes:")
    print("  - / (Homepage)")
    print("  - /dashboard")
    print("  - /register")
    print("  - Static assets")
    print("  - SPA navigation")
    
    # Test connectivity
    import requests
    try:
        print(f"Testing connectivity to {environment.host}...")
        response = requests.get(environment.host, timeout=30)
        print(f"Connectivity test result: {response.status_code}")
    except Exception as e:
        print(f"Connectivity test failed: {e}")
        print("This may cause the load test to fail!")

@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    """Called when the test stops"""
    print("\n🌳 GreenLife Eco Tracker Load Test Completed!")
    
    # Log basic stats
    stats = environment.stats
    print(f"📊 Test Results:")
    print(f"   Total Requests: {stats.total.num_requests}")
    print(f"   Failed Requests: {stats.total.num_failures}")
    print(f"   Success Rate: {((stats.total.num_requests - stats.total.num_failures) / stats.total.num_requests * 100):.1f}%")
    print(f"   Average Response Time: {stats.total.avg_response_time:.2f}ms")
    print(f"   Max Response Time: {stats.total.max_response_time:.2f}ms")
    print(f"   Requests per Second: {stats.total.total_rps:.2f}")

# To run:
# locust -f locustfile.py -u 10 -r 2 --run-time 1m
