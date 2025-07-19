"""
Test Redis connectivity and functionality.
"""

from django.core.management.base import BaseCommand
from django.core.cache import cache
from django.conf import settings
import redis
from redis.exceptions import ConnectionError as RedisConnectionError
import time


class Command(BaseCommand):
    """Management command to test Redis connectivity and performance."""

    help = "Test Redis cache connectivity and functionality"

    def add_arguments(self, parser):
        """Add command arguments."""
        parser.add_argument(
            "--verbose", action="store_true", help="Enable verbose output"
        )
        parser.add_argument(
            "--performance", action="store_true", help="Run performance tests"
        )
        parser.add_argument(
            "--cleanup", action="store_true", help="Clean up test keys after running"
        )

    def handle(self, *args, **options):
        """Main command handler."""
        self.verbose = options.get("verbose", False)
        self.performance = options.get("performance", False)
        self.cleanup = options.get("cleanup", True)

        self.stdout.write(
            self.style.SUCCESS("🔍 Testing Redis Cache Connectivity...\n")
        )

        # Run all tests
        tests_passed = 0
        tests_failed = 0

        test_methods = [
            self.test_cache_backend,
            self.test_basic_operations,
            self.test_data_types,
            self.test_expiration,
            self.test_direct_redis_connection,
        ]

        if self.performance:
            test_methods.append(self.test_performance)

        for test_method in test_methods:
            try:
                test_method()
                tests_passed += 1
            except Exception as e:
                tests_failed += 1
                self.stdout.write(
                    self.style.ERROR(f"❌ {test_method.__name__} failed: {str(e)}")
                )

        # Cleanup test keys
        if self.cleanup:
            self.cleanup_test_keys()

        # Summary
        self.stdout.write("\n" + "=" * 50)
        self.stdout.write(self.style.SUCCESS(f"✅ Tests passed: {tests_passed}"))
        if tests_failed > 0:
            self.stdout.write(self.style.ERROR(f"❌ Tests failed: {tests_failed}"))
        else:
            self.stdout.write(self.style.SUCCESS("🎉 All Redis tests passed!"))

    def test_cache_backend(self):
        """Test cache backend configuration."""
        self.stdout.write("Testing cache backend configuration...")

        cache_config = settings.CACHES.get("default", {})
        backend = cache_config.get("BACKEND", "")

        if "redis" in backend.lower():
            self.stdout.write(
                self.style.SUCCESS(f"✅ Redis backend configured: {backend}")
            )
        else:
            self.stdout.write(self.style.WARNING(f"⚠️  Non-Redis backend: {backend}"))

        if self.verbose:
            self.stdout.write(f'   Location: {cache_config.get("LOCATION", "Not set")}')
            self.stdout.write(f'   Timeout: {cache_config.get("TIMEOUT", "Not set")}')

    def test_basic_operations(self):
        """Test basic cache operations."""
        self.stdout.write("Testing basic cache operations...")

        test_key = "redis_test_basic"
        test_value = "Hello Redis!"

        # Set value
        cache.set(test_key, test_value, timeout=60)

        # Get value
        retrieved = cache.get(test_key)

        if retrieved == test_value:
            self.stdout.write(self.style.SUCCESS("✅ Basic set/get operations working"))
        else:
            raise Exception(f'Expected "{test_value}", got "{retrieved}"')

        # Test delete
        cache.delete(test_key)
        deleted_value = cache.get(test_key)

        if deleted_value is None:
            self.stdout.write(self.style.SUCCESS("✅ Delete operation working"))
        else:
            raise Exception(f'Key should be deleted, but got "{deleted_value}"')

    def test_data_types(self):
        """Test different data types in cache."""
        self.stdout.write("Testing different data types...")

        test_data = {
            "string": "text_value",
            "integer": 42,
            "float": 3.14159,
            "boolean": True,
            "list": [1, 2, 3, "four"],
            "dict": {"nested": "value", "number": 123, "sub_dict": {"deep": "nested"}},
            "none": None,
        }

        for data_type, value in test_data.items():
            key = f"redis_test_{data_type}"
            cache.set(key, value, timeout=60)
            retrieved = cache.get(key)

            if retrieved == value:
                if self.verbose:
                    self.stdout.write(f"   ✅ {data_type}: OK")
            else:
                raise Exception(
                    f"{data_type} test failed: expected {value}, got {retrieved}"
                )

        self.stdout.write(self.style.SUCCESS("✅ All data types working"))

    def test_expiration(self):
        """Test cache key expiration."""
        self.stdout.write("Testing cache expiration...")

        test_key = "redis_test_expiration"
        cache.set(test_key, "expires_soon", timeout=1)

        # Should exist immediately
        value = cache.get(test_key)
        if value != "expires_soon":
            raise Exception("Value should exist immediately after setting")

        if self.verbose:
            self.stdout.write("   Waiting for expiration...")

        # Wait for expiration
        time.sleep(2)

        # Should be None after expiration
        expired_value = cache.get(test_key)
        if expired_value is None:
            self.stdout.write(self.style.SUCCESS("✅ Cache expiration working"))
        else:
            raise Exception(f'Key should have expired, but got "{expired_value}"')

    def test_direct_redis_connection(self):
        """Test direct Redis connection."""
        self.stdout.write("Testing direct Redis connection...")

        try:
            cache_config = settings.CACHES.get("default", {})
            location = cache_config.get("LOCATION", "redis://127.0.0.1:6379/1")

            # Create direct Redis connection
            r = redis.from_url(location)

            # Test ping
            pong = r.ping()
            if pong:
                self.stdout.write(self.style.SUCCESS("✅ Redis ping successful"))
            else:
                raise Exception("Redis ping failed")

            # Test direct operations
            test_key = "direct_redis_test"
            r.set(test_key, "direct_value", ex=30)
            value = r.get(test_key)

            if value and value.decode("utf-8") == "direct_value":
                self.stdout.write(
                    self.style.SUCCESS("✅ Direct Redis operations working")
                )
            else:
                raise Exception("Direct Redis set/get failed")

            # Get Redis info
            if self.verbose:
                info = r.info()
                self.stdout.write(
                    f'   Redis version: {info.get("redis_version", "Unknown")}'
                )
                self.stdout.write(
                    f'   Connected clients: {info.get("connected_clients", "Unknown")}'
                )
                self.stdout.write(
                    f'   Used memory: {info.get("used_memory_human", "Unknown")}'
                )

            # Cleanup
            r.delete(test_key)

        except RedisConnectionError:
            raise Exception("Cannot connect to Redis server")
        except Exception as e:
            raise Exception(f"Direct Redis connection failed: {str(e)}")

    def test_performance(self):
        """Test cache performance."""
        self.stdout.write("Testing cache performance...")

        operations = 100
        test_keys = []

        # Test write performance
        start_time = time.time()
        for i in range(operations):
            key = f"perf_test_{i}"
            cache.set(key, f"value_{i}", timeout=60)
            test_keys.append(key)
        write_time = time.time() - start_time

        # Test read performance
        start_time = time.time()
        for key in test_keys:
            cache.get(key)
        read_time = time.time() - start_time

        # Test delete performance
        start_time = time.time()
        for key in test_keys:
            cache.delete(key)
        delete_time = time.time() - start_time

        self.stdout.write(
            self.style.SUCCESS(
                f"✅ Performance test completed ({operations} operations):"
            )
        )
        self.stdout.write(
            f"   Write time: {write_time:.3f}s ({operations/write_time:.1f} ops/sec)"
        )
        self.stdout.write(
            f"   Read time: {read_time:.3f}s ({operations/read_time:.1f} ops/sec)"
        )
        self.stdout.write(
            f"   Delete time: {delete_time:.3f}s ({operations/delete_time:.1f} ops/sec)"
        )

    def cleanup_test_keys(self):
        """Clean up any remaining test keys."""
        if self.verbose:
            self.stdout.write("Cleaning up test keys...")

        try:
            # Use pattern matching to delete test keys if Redis supports it
            cache_config = settings.CACHES.get("default", {})
            location = cache_config.get("LOCATION", "redis://127.0.0.1:6379/1")
            r = redis.from_url(location)

            # Find and delete test keys
            pattern = "*redis_test*"
            test_keys = r.keys(pattern)
            if test_keys:
                r.delete(*test_keys)
                if self.verbose:
                    self.stdout.write(f"   Cleaned up {len(test_keys)} test keys")

        except Exception:
            # Fallback to Django cache clear if direct Redis fails
            try:
                cache.clear()
                if self.verbose:
                    self.stdout.write("   Used cache.clear() for cleanup")
            except Exception:
                if self.verbose:
                    self.stdout.write("   Could not clean up test keys")
