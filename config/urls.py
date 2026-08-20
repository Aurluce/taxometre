from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from apps.authentication.views import CustomTokenObtainPairView

schema_view = get_schema_view(
    openapi.Info(
        title="Taxomètre API",
        default_version='v1',
        description="API pour le système de suivi Taxomètre",
    ),
    public=True,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('apps.vehicles.urls')),
    path('api/', include('apps.alerts.urls')),
    path('api/', include('apps.trips.urls')),
    path('api/auth/', include('apps.authentication.urls')),
    path('api/', include('apps.authentication.urls')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]
