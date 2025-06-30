from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, TreeEntryViewSet, UserDetailView, MyTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r"trees", TreeEntryViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("users/", UserDetailView.as_view(), name="user_detail"),
]
