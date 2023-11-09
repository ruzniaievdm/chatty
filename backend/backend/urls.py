"""
backend URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from api import ConversationViewSet, UserViewSet, CustomObtainAuthTokenView

router = routers.DefaultRouter()
router.register(r'users', UserViewSet, basename='users')
router.register('conversations', ConversationViewSet, basename='conversations')

urlpatterns = [
    path("api/", include(router.urls)),
    path('admin/', admin.site.urls),
    path("auth-token/", CustomObtainAuthTokenView.as_view()),
]
