#!/usr/bin/env python3
"""
GreenLife Eco Tracker - Comprehensive Load Testing Script
This script tests the key user journeys and API endpoints of the application.
"""

import os
import json
import random
import logging
from locust import HttpUser, task, between, events
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GreenLifeUser(HttpUser):
    """
    Simulates a real user interacting with GreenLife Eco Tracker
    """
    wait_time = between(2, 5)  # Wait 2-5 seconds between requests
    host = os.getenv('HOST', 'https://greenlife-tracker-prod.greenplant-30488afa.southcentralus.azurecontainerapps.io')
    
    def on_start(self):
        """Called when a simulated user starts"""
        self.token = None
        self.user_id = None
        self.tree_ids = []
        
        # Sample data for testing
        self.tree_species = [
            "Oak", "Pine", "Maple", "Cherry", "Birch", 
            "Willow", "Cedar", "Elm", "Ash", "Poplar"
        ]
        
        self.locations = [
            "Central Park, NYC", "Golden Gate Park, SF", "Hyde Park, London",
            "Vondelpark, Amsterdam", "Stanley Park, Vancouver", 
            "Regent's Park, London", "Millennium Park, Chicago"
        ]
        
        logger.info(f"Starting user session for {self.host}")

    @task(5)
    def view_homepage(self):
        """Test the main homepage - most common user action"""
        with self.client.get("/", name="Homepage", catch_response=True) as response:
            if response.status_code == 200:
                response.success()
                logger.debug("Homepage loaded successfully")
            else:
                response.failure(f"Homepage failed with status {response.status_code}")

    @task(3)
    def view_tree_list(self):
        """Test viewing the tree list/dashboard"""
        with self.client.get("/api/trees/", name="Tree List API", catch_response=True) as response:
            if response.status_code in [200, 401]:  # 401 is expected if not authenticated
                response.success()
                if response.status_code == 200:
                    try:
                        data = response.json()
                        logger.debug(f"Tree list returned {len(data.get('results', []))} trees")
                    except:
                        pass
            else:
                response.failure(f"Tree list failed with status {response.status_code}")

    @task(2)
    def register_user(self):
        """Test user registration"""
        user_data = {
            "username": f"testuser_{random.randint(1000, 9999)}",
            "email": f"test_{random.randint(1000, 9999)}@example.com",
            "password": "TestPassword123!",
            "first_name": "Test",
            "last_name": "User"
        }
        
        with self.client.post(
            "/api/auth/register/",
            json=user_data,
            name="User Registration",
            catch_response=True
        ) as response:
            if response.status_code in [201, 400]:  # 400 might be validation errors
                response.success()
                if response.status_code == 201:
                    logger.debug(f"User {user_data['username']} registered successfully")
            else:
                response.failure(f"Registration failed with status {response.status_code}")

    @task(2)
    def login_user(self):
        """Test user login"""
        login_data = {
            "username": "testuser",  # Use a known test user
            "password": "testpassword"
        }
        
        with self.client.post(
            "/api/auth/login/",
            json=login_data,
            name="User Login",
            catch_response=True
        ) as response:
            if response.status_code in [200, 400, 401]:
                response.success()
                if response.status_code == 200:
                    try:
                        data = response.json()
                        self.token = data.get('token')
                        logger.debug("User logged in successfully")
                    except:
                        pass
            else:
                response.failure(f"Login failed with status {response.status_code}")

    @task(1)
    def add_tree(self):
        """Test adding a new tree (requires authentication)"""
        if not self.token:
            return
            
        tree_data = {
            "species": random.choice(self.tree_species),
            "location": random.choice(self.locations),
            "planted_date": "2025-07-27",
            "notes": f"Tree planted during load test - {random.randint(1, 1000)}"
        }
        
        headers = {"Authorization": f"Bearer {self.token}"}
        
        with self.client.post(
            "/api/trees/",
            json=tree_data,
            headers=headers,
            name="Add Tree",
            catch_response=True
        ) as response:
            if response.status_code in [201, 401, 403]:
                response.success()
                if response.status_code == 201:
                    try:
                        data = response.json()
                        tree_id = data.get('id')
                        if tree_id:
                            self.tree_ids.append(tree_id)
                        logger.debug(f"Tree added: {tree_data['species']} at {tree_data['location']}")
                    except:
                        pass
            else:
                response.failure(f"Add tree failed with status {response.status_code}")

    @task(1)
    def view_tree_detail(self):
        """Test viewing individual tree details"""
        if not self.tree_ids:
            return
            
        tree_id = random.choice(self.tree_ids)
        
        with self.client.get(
            f"/api/trees/{tree_id}/",
            name="Tree Detail",
            catch_response=True
        ) as response:
            if response.status_code in [200, 404]:
                response.success()
                logger.debug(f"Viewed tree detail for tree {tree_id}")
            else:
                response.failure(f"Tree detail failed with status {response.status_code}")

    @task(1)
    def search_trees(self):
        """Test searching/filtering trees"""
        species = random.choice(self.tree_species)
        
        with self.client.get(
            f"/api/trees/?species={species}",
            name="Search Trees",
            catch_response=True
        ) as response:
            if response.status_code in [200, 401]:
                response.success()
                logger.debug(f"Searched trees by species: {species}")
            else:
                response.failure(f"Tree search failed with status {response.status_code}")

    @task(1)
    def view_statistics(self):
        """Test viewing user/global statistics"""
        with self.client.get(
            "/api/stats/",
            name="Statistics API",
            catch_response=True
        ) as response:
            if response.status_code in [200, 401]:
                response.success()
                logger.debug("Statistics loaded")
            else:
                response.failure(f"Statistics failed with status {response.status_code}")

    @task(1)
    def health_check(self):
        """Test application health endpoint"""
        with self.client.get(
            "/health/",
            name="Health Check",
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
                logger.debug("Health check passed")
            else:
                response.failure(f"Health check failed with status {response.status_code}")

class AdminUser(HttpUser):
    """
    Simulates an admin user with higher privileges
    """
    wait_time = between(3, 8)
    host = os.getenv('HOST', 'https://greenlife-tracker-prod.greenplant-30488afa.southcentralus.azurecontainerapps.io')
    weight = 1  # Lower weight means fewer admin users

    @task
    def admin_dashboard(self):
        """Test admin dashboard access"""
        with self.client.get("/admin/", name="Admin Dashboard", catch_response=True) as response:
            if response.status_code in [200, 302, 401, 403]:  # Various expected responses
                response.success()
            else:
                response.failure(f"Admin dashboard failed with status {response.status_code}")

# Event listeners for custom metrics
@events.request.add_listener
def my_request_handler(request_type, name, response_time, response_length, response, context, exception, start_time, url, **kwargs):
    """Custom request handler for detailed logging"""
    if exception:
        logger.error(f"Request failed: {name} - {exception}")
    elif response_time > 2000:  # Log slow requests (> 2 seconds)
        logger.warning(f"Slow request: {name} - {response_time}ms")

@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    """Called when the test starts"""
    logger.info("🌱 GreenLife Eco Tracker Load Test Starting!")
    logger.info(f"Target: {environment.host}")
    logger.info(f"Users: {environment.runner.target_user_count if hasattr(environment.runner, 'target_user_count') else 'N/A'}")

@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    """Called when the test stops"""
    logger.info("🌳 GreenLife Eco Tracker Load Test Completed!")
    
    # Log some basic stats
    stats = environment.stats
    logger.info(f"Total Requests: {stats.total.num_requests}")
    logger.info(f"Failed Requests: {stats.total.num_failures}")
    logger.info(f"Average Response Time: {stats.total.avg_response_time:.2f}ms")
    logger.info(f"Max Response Time: {stats.total.max_response_time:.2f}ms")

if __name__ == "__main__":
    print("🌱 GreenLife Eco Tracker Load Test Script")
    print("Run this with: locust -f greenlife_load_test.py")
    print("Or use the web UI: locust -f greenlife_load_test.py --web-host=0.0.0.0")
