from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    CustomTokenObtainPairView,
    verify_session,
    logout_view,
    change_password,
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair_login'),
    path('', include(router.urls)),
    path('verify-session/', verify_session, name='verify_session'),
    path('logout/', logout_view, name='logout'),
    path('change-password/', change_password, name='change_password'),
]
