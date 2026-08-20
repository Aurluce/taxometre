from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from .models import Vehicle, VehicleConfiguration, RestrictedZone
from apps.alerts.models import Alert
from apps.alerts.serializers import AlertSerializer
from .serializers import (
    VehicleSerializer,
    VehicleCreateSerializer,
    VehicleConfigurationSerializer,
    RestrictedZoneSerializer,
)

User = get_user_model()

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if isinstance(obj, Vehicle):
            return obj.owner == request.user
        if isinstance(obj, RestrictedZone):
            return obj.vehicle.owner == request.user
        return False

class VehicleViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'admin':
            return Vehicle.objects.all().select_related('owner', 'config')
        return Vehicle.objects.filter(owner=user).select_related('owner', 'config')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return VehicleCreateSerializer
        return VehicleSerializer
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_vehicles(self, request):
        vehicles = Vehicle.objects.filter(owner=request.user).select_related('owner')
        serializer = self.get_serializer(vehicles, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def assign_to_user(self, request, pk=None):
        if not request.user.is_superuser and request.user.role != 'admin':
            return Response(
                {'error': 'Permission refusée'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        vehicle = self.get_object()
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response(
                {'error': 'user_id requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(id=user_id)
            vehicle.owner = user
            vehicle.save()
            return Response({
                'success': True,
                'message': f'Véhicule assigné à {user.username}',
                'vehicle': VehicleSerializer(vehicle).data
            })
        except User.DoesNotExist:
            return Response(
                {'error': 'Utilisateur non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['get', 'patch', 'put'], url_path='configuration')
    def configuration(self, request, pk=None):
        vehicle = self.get_object()
        config, _ = VehicleConfiguration.objects.get_or_create(vehicle=vehicle)
        if request.method in ['PATCH', 'PUT']:
            serializer = VehicleConfigurationSerializer(config, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        serializer = VehicleConfigurationSerializer(config)
        return Response(serializer.data)

    @action(detail=True, methods=['get', 'post'], url_path='restricted-zones', url_name='restricted-zones')
    def restricted_zones(self, request, pk=None):
        vehicle = self.get_object()

        if request.method == 'POST':
            serializer = RestrictedZoneSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(vehicle=vehicle)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        zones = RestrictedZone.objects.filter(vehicle=vehicle)
        serializer = RestrictedZoneSerializer(zones, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], url_path='alerts', url_name='alerts')
    def alerts(self, request, pk=None):
        vehicle = self.get_object()
        alerts = Alert.objects.filter(vehicle=vehicle)
        serializer = AlertSerializer(alerts, many=True)
        return Response(serializer.data)

class RestrictedZoneViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    queryset = RestrictedZone.objects.all()
    serializer_class = RestrictedZoneSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'admin':
            return RestrictedZone.objects.all()
        return RestrictedZone.objects.filter(vehicle__owner=user)
