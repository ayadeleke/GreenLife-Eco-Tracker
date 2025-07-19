from rest_framework import viewsets
from .models import TreeEntry
from .serializers import RegisterSerializer, TreeEntrySerializer, User, UserSerializer
from rest_framework import generics, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.db.models import Count, Q
from django.db import connection
import logging
import time

# Set up logging for cache debugging
logger = logging.getLogger(__name__)


# User views
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer


class UserDetailView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class TreeEntryViewSet(viewsets.ModelViewSet):
    queryset = TreeEntry.objects.all().order_by("-date_planted")
    serializer_class = TreeEntrySerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["species", "user__username", "date_planted"]
    search_fields = ["species", "user__username"]
    ordering_fields = ["date_planted", "species"]

    permission_classes_by_action = {
        "list": [permissions.AllowAny],
        "retrieve": [permissions.AllowAny],
        "create": [permissions.IsAuthenticated],
        "update": [permissions.IsAuthenticated],
        "partial_update": [permissions.IsAuthenticated],
        "destroy": [permissions.IsAuthenticated],
        "my_stats": [permissions.IsAuthenticated],
        "geojson": [permissions.AllowAny],
    }

    def get_permissions(self):
        try:
            return [
                permission()
                for permission in self.permission_classes_by_action[self.action]
            ]
        except (KeyError, AttributeError):
            return [permission() for permission in self.permission_classes]

    def get_queryset(self):
        """Optimized queryset with select_related for user data"""
        return TreeEntry.objects.select_related("user").order_by("-date_planted")

    def list(self, request, *args, **kwargs):
        # Create cache key based on query parameters and cache version
        query_params = request.GET.urlencode()
        cache_version = self.get_cache_version()
        cache_key = f"tree_list_v{cache_version}_{hash(query_params)}"

        cached_response = cache.get(cache_key)
        if cached_response:
            logger.info(
                f"Serving /api/trees/ from cache (params: {query_params}, version: {cache_version})"
            )
            return Response(cached_response)

        logger.info(
            f"Cache miss: fetching /api/trees/ from DB (params: {query_params}, version: {cache_version})"
        )
        response = super().list(request, *args, **kwargs)
        # Cache only the data (not the Response object)
        cache.set(cache_key, response.data, timeout=600)
        return response

    def get_cache_version(self):
        """Get current cache version for tree list"""
        return cache.get("tree_list_cache_version", 1)

    def increment_cache_version(self):
        """Increment cache version to invalidate all cached lists"""
        current_version = self.get_cache_version()
        new_version = current_version + 1
        cache.set("tree_list_cache_version", new_version, timeout=86400)  # 24 hours
        return new_version

    def clear_list_cache(self):
        """Clear all variations of the list cache by incrementing version"""
        new_version = self.increment_cache_version()
        logger.info(f"Invalidated all tree list caches, new version: {new_version}")

    @action(detail=False, methods=["get"])
    def geojson(self, request):
        """Optimized GeoJSON endpoint with doing"""
        cache_key = f"geojson_all_trees_{request.user.id if request.user.is_authenticated else 'anon'}"

        # Try to get from cache first
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)

        # If not in cache, build the response
        queryset = self.get_queryset()
        if request.user.is_authenticated:
            queryset = queryset.filter(user=request.user)

        # Use values() for better performance
        trees = queryset.values(
            "id", "species", "latitude", "longitude", "date_planted", "description"
        )

        features = []
        for tree in trees:
            if tree["latitude"] and tree["longitude"]:
                features.append(
                    {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                float(tree["longitude"]),
                                float(tree["latitude"]),
                            ],
                        },
                        "properties": {
                            "id": tree["id"],
                            "species": tree["species"],
                            "date_planted": tree["date_planted"],
                            "description": tree["description"],
                        },
                    }
                )

        geojson_data = {"type": "FeatureCollection", "features": features}

        # Cache the result for 10 minutes
        cache.set(cache_key, geojson_data, 600)

        return Response(geojson_data)

    @action(detail=False, methods=["get"])
    def my_stats(self, request):
        """Optimized user statistics with caching"""
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=401)

        cache_key = f"user_stats_{request.user.id}"

        # Try cache first
        cached_stats = cache.get(cache_key)
        if cached_stats:
            return Response(cached_stats)

        # Use aggregate for better performance
        user_trees = TreeEntry.objects.filter(user=request.user)

        # Get species list with counts
        species_data = (
            user_trees.values("species")
            .annotate(count=Count("species"))
            .order_by("-count")
        )

        stats = {
            "total_trees": user_trees.count(),
            "species_diversity": species_data.count(),  # Changed from species_count
            "species_list": [  # Changed from recent_trees
                {"species": item["species"], "count": item["count"]}
                for item in species_data
            ],
        }

        # Cache for 2 minutes
        cache.set(cache_key, stats, 120)

        return Response(stats)

    def clear_list_cache(self):
        """Clear all variations of the list cache by incrementing version"""
        new_version = self.increment_cache_version()
        logger.info(f"Invalidated all tree list caches, new version: {new_version}")

    def perform_create(self, serializer):
        """Clear cache when creating new tree"""
        serializer.save(user=self.request.user)
        # Clear all relevant caches
        self.clear_list_cache()  # Clear all list cache variations
        cache.delete(f"user_stats_{self.request.user.id}")
        cache.delete(f"geojson_all_trees_{self.request.user.id}")
        cache.delete("geojson_all_trees_anon")  # Clear anonymous geojson cache

    def perform_update(self, serializer):
        """Clear cache when updating tree"""
        serializer.save()
        # Clear all relevant caches
        self.clear_list_cache()  # Clear all list cache variations
        cache.delete(f"user_stats_{self.request.user.id}")
        cache.delete(f"geojson_all_trees_{self.request.user.id}")
        cache.delete("geojson_all_trees_anon")  # Clear anonymous geojson cache

    def perform_destroy(self, instance):
        """Clear cache when deleting tree"""
        # Clear all relevant caches
        self.clear_list_cache()  # Clear all list cache variations
        cache.delete(f"user_stats_{instance.user.id}")
        cache.delete(f"geojson_all_trees_{instance.user.id}")
        cache.delete("geojson_all_trees_anon")  # Clear anonymous geojson cache
        instance.delete()


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims if needed
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = {
            "username": self.user.username,
            # add other fields if needed
        }
        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
