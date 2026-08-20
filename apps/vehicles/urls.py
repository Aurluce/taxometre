from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VehicleViewSet, RestrictedZoneViewSet

router = DefaultRouter()
router.register(r'vehicles', VehicleViewSet, basename='vehicle')
router.register(r'restricted-zones', RestrictedZoneViewSet, basename='restrictedzone')

urlpatterns = [
    path('', include(router.urls)),
]
