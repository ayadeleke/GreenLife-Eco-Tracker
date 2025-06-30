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
    }

    def get_permissions(self):
        try:
            return [
                permission()
                for permission in self.permission_classes_by_action[self.action]
            ]
        except (KeyError, AttributeError):
            return [permission() for permission in self.permission_classes]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(
        detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated]
    )
    def my_stats(self, request):
        user = request.user
        trees = TreeEntry.objects.filter(user=user)
        total = trees.count()
        # Count trees per species
        from collections import Counter

        species_counter = Counter(trees.values_list("species", flat=True))
        # Convert to list of dicts for frontend
        species_list = [
            {"species": species, "count": count}
            for species, count in species_counter.items()
        ]
        species_count = len(species_counter)
        return Response(
            {
                "total_trees": total,
                "species_diversity": species_count,
                "species_list": species_list,
            }
        )

    @action(detail=False, methods=["get"], permission_classes=[permissions.AllowAny])
    def geojson(self, request):
        features = []
        for tree in self.get_queryset():
            features.append(
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [tree.longitude, tree.latitude],
                    },
                    "properties": {
                        "id": tree.id,
                        "species": tree.species,
                        "date_planted": tree.date_planted,
                        "user": tree.user.username,
                    },
                }
            )
        return Response({"type": "FeatureCollection", "features": features})


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
