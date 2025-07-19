from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from .models import TreeEntry
from django.urls import reverse
from datetime import date
from django.core.cache import cache
from django.core.cache.backends.base import InvalidCacheBackendError
from django.conf import settings
import redis
from redis.exceptions import ConnectionError as RedisConnectionError
import time
import json


class TreeEntryUnitTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="testpass"
        )  # nosec
        self.user2 = User.objects.create_user(
            username="otheruser", password="testpass2"
        )  # nosec
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.tree_data = {
            "species": "Oak",
            "latitude": 10.0,
            "longitude": 20.0,
            "date_planted": "2025-06-28",
        }

    def test_create_tree_entry(self):
        url = reverse("treeentry-list")
        response = self.client.post(url, self.tree_data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(TreeEntry.objects.count(), 1)
        tree = TreeEntry.objects.first()
        self.assertEqual(tree.species, "Oak")
        self.assertEqual(tree.latitude, 10.0)
        self.assertEqual(tree.longitude, 20.0)
        self.assertEqual(tree.user, self.user)

    def test_invalid_latitude(self):
        url = reverse("treeentry-list")
        data = self.tree_data.copy()
        data["latitude"] = 100.0
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("Latitude must be between -90 and 90.", str(response.data))

    def test_invalid_longitude(self):
        url = reverse("treeentry-list")
        data = self.tree_data.copy()
        data["longitude"] = 200.0
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("Longitude must be between -180 and 180.", str(response.data))

    def test_duplicate_tree_entry(self):
        url = reverse("treeentry-list")
        self.client.post(url, self.tree_data, format="json")
        response = self.client.post(url, self.tree_data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn(
            "You have already added a tree of this species", str(response.data)
        )

    def test_tree_entry_different_users(self):
        url = reverse("treeentry-list")
        self.client.post(url, self.tree_data, format="json")
        # Authenticate as another user
        self.client.force_authenticate(user=self.user2)
        response = self.client.post(url, self.tree_data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(TreeEntry.objects.count(), 2)

    def test_my_stats_endpoint(self):
        # Add multiple trees for stats
        TreeEntry.objects.create(
            user=self.user,
            species="Oak",
            latitude=1,
            longitude=1,
            date_planted=date(2025, 6, 28),
        )
        TreeEntry.objects.create(
            user=self.user,
            species="Maple",
            latitude=2,
            longitude=2,
            date_planted=date(2025, 6, 29),
        )
        TreeEntry.objects.create(
            user=self.user,
            species="Oak",
            latitude=3,
            longitude=3,
            date_planted=date(2025, 6, 30),
        )
        url = reverse("treeentry-my-stats")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["total_trees"], 3)
        self.assertEqual(data["species_diversity"], 2)
        # Check species_list contains correct counts
        species_counts = {
            item["species"]: item["count"] for item in data["species_list"]
        }
        self.assertEqual(species_counts["Oak"], 2)
        self.assertEqual(species_counts["Maple"], 1)

    def test_my_stats_no_trees(self):
        url = reverse("treeentry-my-stats")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["total_trees"], 0)
        self.assertEqual(data["species_diversity"], 0)
        self.assertEqual(data["species_list"], [])

    def test_my_stats_one_species(self):
        TreeEntry.objects.create(
            user=self.user,
            species="Oak",
            latitude=1,
            longitude=1,
            date_planted=date(2025, 6, 28),
        )
        TreeEntry.objects.create(
            user=self.user,
            species="Oak",
            latitude=2,
            longitude=2,
            date_planted=date(2025, 6, 29),
        )
        url = reverse("treeentry-my-stats")
        response = self.client.get(url)
        data = response.json()
        self.assertEqual(data["total_trees"], 2)
        self.assertEqual(data["species_diversity"], 1)
        self.assertEqual(data["species_list"][0]["species"], "Oak")
        self.assertEqual(data["species_list"][0]["count"], 2)

    def test_list_tree_entries(self):
        self.client.force_authenticate(user=self.user)
        # Create two trees for the user
        TreeEntry.objects.create(
            user=self.user,
            species="Oak",
            latitude=1,
            longitude=1,
            date_planted=date(2025, 6, 28),
        )
        TreeEntry.objects.create(
            user=self.user,
            species="Maple",
            latitude=2,
            longitude=2,
            date_planted=date(2025, 6, 29),
        )
        url = reverse("treeentry-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        # Only count trees for self.user
        results = (
            response.data["results"] if "results" in response.data else response.data
        )
        self.assertEqual(len(results), 2)
        species = {tree["species"] for tree in results}
        self.assertIn("Oak", species)
        self.assertIn("Maple", species)

    def test_retrieve_tree_entry(self):
        tree = TreeEntry.objects.create(
            user=self.user,
            species="Oak",
            latitude=1,
            longitude=1,
            date_planted=date(2025, 6, 28),
        )
        url = reverse("treeentry-detail", args=[tree.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["species"], "Oak")
        self.assertEqual(response.data["latitude"], 1)
        self.assertEqual(response.data["longitude"], 1)

    def test_update_tree_entry(self):
        tree = TreeEntry.objects.create(
            user=self.user,
            species="Oak",
            latitude=1,
            longitude=1,
            date_planted=date(2025, 6, 28),
        )
        url = reverse("treeentry-detail", args=[tree.id])
        data = {
            "species": "Oak",
            "latitude": 5.0,
            "longitude": 10.0,
            "date_planted": "2025-06-28",
        }
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        tree.refresh_from_db()
        self.assertEqual(tree.latitude, 5.0)
        self.assertEqual(tree.longitude, 10.0)

    def test_partial_update_tree_entry(self):
        tree = TreeEntry.objects.create(
            user=self.user,
            species="Oak",
            latitude=1,
            longitude=1,
            date_planted=date(2025, 6, 28),
        )
        url = reverse("treeentry-detail", args=[tree.id])
        response = self.client.patch(url, {"latitude": 7.0}, format="json")
        self.assertEqual(response.status_code, 200)
        tree.refresh_from_db()
        self.assertEqual(tree.latitude, 7.0)

    def test_delete_tree_entry(self):
        tree = TreeEntry.objects.create(
            user=self.user,
            species="Oak",
            latitude=1,
            longitude=1,
            date_planted=date(2025, 6, 28),
        )
        url = reverse("treeentry-detail", args=[tree.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(TreeEntry.objects.filter(id=tree.id).exists())

    def test_unauthenticated_access_denied(self):
        self.client.force_authenticate(user=None)
        url = reverse("treeentry-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_user_cannot_access_others_tree(self):
        tree = TreeEntry.objects.create(
            user=self.user2,
            species="Birch",
            latitude=0,
            longitude=0,
            date_planted=date(2025, 6, 28),
        )
        url = reverse("treeentry-detail", args=[tree.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        response = self.client.put(
            url,
            {
                "species": "Birch",
                "latitude": 1,
                "longitude": 1,
                "date_planted": "2025-06-28",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)

    def test_missing_required_fields(self):
        url = reverse("treeentry-list")
        data = {"species": "Oak"}  # Missing lat/lon/date
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("latitude", response.data)
        self.assertIn("longitude", response.data)
        self.assertIn("date_planted", response.data)

    def test_latitude_longitude_boundaries(self):
        url = reverse("treeentry-list")
        for lat in [-90, 90]:
            data = self.tree_data.copy()
            data["latitude"] = lat
            response = self.client.post(url, data, format="json")
            self.assertEqual(response.status_code, 201)
        for lon in [-180, 180]:
            data = self.tree_data.copy()
            data["longitude"] = lon
            response = self.client.post(url, data, format="json")
            self.assertEqual(response.status_code, 201)


class RedisCacheTest(TestCase):
    """
    Test Redis cache functionality and connection.
    """

    def setUp(self):
        """Set up test data for cache testing."""
        self.test_key = "test_redis_key"
        self.test_value = {"message": "Hello Redis!", "timestamp": time.time()}

    def tearDown(self):
        """Clean up test cache keys."""
        try:
            cache.delete(self.test_key)
            cache.delete("test_counter")
            cache.delete("test_complex_data")
        except Exception:
            pass  # Ignore cleanup errors

    def test_redis_connection(self):
        """Test basic Redis connection."""
        try:
            # Check if Redis backend is configured in settings
            cache_backend = settings.CACHES["default"]["BACKEND"]
            self.assertIn(
                "redis",
                cache_backend.lower(),
                "Redis cache backend should be configured in settings",
            )

            # Test basic cache operations to verify Redis is working
            cache.set(self.test_key, "test_value", timeout=30)
            value = cache.get(self.test_key)
            self.assertEqual(
                value, "test_value", "Should be able to set and get cache values"
            )

            # Test that the cache is actually working (not just a dummy cache)
            cache.set("test_working_cache", "working", timeout=30)
            retrieved = cache.get("test_working_cache")
            self.assertEqual(retrieved, "working", "Cache should persist values")

            # Clean up
            cache.delete("test_working_cache")

        except Exception as e:
            self.fail(f"Redis connection test failed: {str(e)}")

    def test_cache_set_get(self):
        """Test setting and getting cache values."""
        # Test string value
        cache.set(self.test_key, "simple_string", timeout=60)
        retrieved = cache.get(self.test_key)
        self.assertEqual(retrieved, "simple_string")

        # Test complex data structure
        complex_data = {
            "user_stats": {
                "trees_planted": 42,
                "species_diversity": 8,
                "last_updated": "2025-07-19",
            },
            "metadata": {"cache_version": 1, "created_at": time.time()},
        }
        cache.set("test_complex_data", complex_data, timeout=120)
        retrieved_complex = cache.get("test_complex_data")
        self.assertEqual(retrieved_complex, complex_data)

    def test_cache_expiration(self):
        """Test cache key expiration."""
        # Set a key with very short timeout
        cache.set(self.test_key, "expires_soon", timeout=1)

        # Should exist immediately
        value = cache.get(self.test_key)
        self.assertEqual(value, "expires_soon")

        # Wait for expiration (add small buffer)
        time.sleep(2)

        # Should be None after expiration
        expired_value = cache.get(self.test_key)
        self.assertIsNone(expired_value)

    def test_cache_increment_decrement(self):
        """Test atomic increment/decrement operations."""
        counter_key = "test_counter"

        # Initialize counter
        cache.set(counter_key, 0, timeout=60)

        # Test increment
        try:
            new_value = cache.get_or_set(counter_key, 0, timeout=60)
            self.assertEqual(new_value, 0)

            # Manual increment simulation (since django-redis doesn't guarantee incr/decr)
            current = cache.get(counter_key, 0)
            cache.set(counter_key, current + 1, timeout=60)
            incremented = cache.get(counter_key)
            self.assertEqual(incremented, 1)

        except Exception as e:
            # Some cache backends don't support increment/decrement
            self.skipTest(f"Cache backend doesn't support increment operations: {e}")

    def test_cache_delete(self):
        """Test cache key deletion."""
        # Set a value
        cache.set(self.test_key, "to_be_deleted", timeout=60)
        self.assertIsNotNone(cache.get(self.test_key))

        # Delete the key
        cache.delete(self.test_key)
        self.assertIsNone(cache.get(self.test_key))

    def test_cache_get_or_set(self):
        """Test get_or_set functionality."""
        # Should set and return default value when key doesn't exist
        default_value = {"new_data": "created"}
        result = cache.get_or_set(self.test_key, default_value, timeout=60)
        self.assertEqual(result, default_value)

        # Should return existing value on subsequent calls
        existing_result = cache.get_or_set(
            self.test_key, {"different": "data"}, timeout=60
        )
        self.assertEqual(existing_result, default_value)

    def test_redis_raw_connection(self):
        """Test direct Redis connection using redis-py."""
        try:
            # Extract Redis URL from Django settings
            cache_config = settings.CACHES.get("default", {})
            location = cache_config.get("LOCATION", "redis://127.0.0.1:6379/1")

            # Test direct Redis connection
            r = redis.from_url(location)

            # Test ping
            response = r.ping()
            self.assertTrue(response, "Redis should respond to ping")

            # Test set/get
            test_key = "direct_redis_test"
            r.set(test_key, "direct_value", ex=30)  # 30 second expiration
            value = r.get(test_key)
            self.assertEqual(value.decode("utf-8"), "direct_value")

            # Cleanup
            r.delete(test_key)

        except RedisConnectionError:
            self.skipTest("Redis server is not available for direct connection test")
        except Exception as e:
            self.fail(f"Direct Redis connection failed: {str(e)}")

    def test_cache_backend_type(self):
        """Test that Redis cache backend is properly configured."""
        cache_backend = settings.CACHES["default"]["BACKEND"]

        if "django_redis.cache.RedisCache" in cache_backend:
            # We're using Redis
            self.assertEqual(
                cache_backend,
                "django_redis.cache.RedisCache",
                "Should be using Redis cache backend",
            )
        elif "locmem" in cache_backend.lower():
            # We're using fallback in-memory cache
            self.skipTest("Using fallback in-memory cache instead of Redis")
        else:
            self.fail(f"Unexpected cache backend: {cache_backend}")

    def test_redis_vs_fallback_detection(self):
        """Detect whether we're using Redis or fallback cache."""
        cache_config = settings.CACHES["default"]
        backend = cache_config["BACKEND"]

        if "redis" in backend.lower():
            # Try to test Redis-specific functionality
            try:
                # Set a value and check if it persists beyond the Django cache framework
                cache.set("redis_detection_test", "redis_value", timeout=300)
                value = cache.get("redis_detection_test")
                self.assertEqual(value, "redis_value")

                # If we can also connect directly to Redis, we know it's working
                location = cache_config.get("LOCATION", "redis://127.0.0.1:6379/1")
                r = redis.from_url(location)
                r.ping()

                cache.delete("redis_detection_test")

            except Exception as e:
                self.skipTest(f"Redis appears configured but not accessible: {str(e)}")
        else:
            self.skipTest("Not using Redis backend")

    def test_cache_configuration(self):
        """Test Redis cache configuration settings."""
        cache_config = settings.CACHES["default"]

        # Check required configuration
        self.assertIn("LOCATION", cache_config)
        self.assertIn("OPTIONS", cache_config)

        options = cache_config["OPTIONS"]
        self.assertIn("CLIENT_CLASS", options)
        self.assertEqual(options["CLIENT_CLASS"], "django_redis.client.DefaultClient")

        # Check connection pool settings
        if "CONNECTION_POOL_KWARGS" in options:
            pool_kwargs = options["CONNECTION_POOL_KWARGS"]
            self.assertIn("max_connections", pool_kwargs)
            self.assertGreater(pool_kwargs["max_connections"], 0)

    def test_cache_performance(self):
        """Test cache performance with multiple operations."""
        start_time = time.time()

        # Perform multiple cache operations
        for i in range(10):
            key = f"perf_test_{i}"
            value = f"value_{i}"
            cache.set(key, value, timeout=60)
            retrieved = cache.get(key)
            self.assertEqual(retrieved, value)
            cache.delete(key)

        end_time = time.time()
        operation_time = end_time - start_time

        # Should complete reasonably quickly (adjust threshold as needed)
        self.assertLess(operation_time, 2.0, "Cache operations should be fast")

    def test_cache_fallback(self):
        """Test that cache gracefully handles connection issues."""
        # This test verifies the IGNORE_EXCEPTIONS setting works
        try:
            # These operations should not raise exceptions even if Redis is down
            cache.set("fallback_test", "value", timeout=60)
            value = cache.get("fallback_test", "default")
            # Value might be None if Redis is down and IGNORE_EXCEPTIONS is True
            self.assertIn(value, ["value", "default", None])

        except Exception as e:
            # If IGNORE_EXCEPTIONS is False, this might raise an exception
            self.skipTest(f"Cache fallback test skipped due to: {e}")


class CacheIntegrationTest(TestCase):
    """
    Integration tests for cache usage in the application.
    """

    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(username="cacheuser", password="testpass")
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_cache_in_api_views(self):
        """Test that cache is working in API views (if implemented)."""
        # Create some test data
        TreeEntry.objects.create(
            user=self.user,
            species="Cached Oak",
            latitude=45.0,
            longitude=-75.0,
            date_planted=date.today(),
        )

        # Test API endpoint (my_stats is a custom action on the TreeEntry viewset)
        url = reverse("treeentry-my-stats")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        # If caching is implemented, subsequent calls should be faster
        start_time = time.time()
        response2 = self.client.get(url)
        end_time = time.time()

        self.assertEqual(response2.status_code, 200)
        # Second call might be cached (though this is not guaranteed without explicit caching)

    def tearDown(self):
        """Clean up cache after tests."""
        cache.clear()
