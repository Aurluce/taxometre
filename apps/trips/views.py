from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count, Sum, Avg
from django.utils import timezone
from .models import Trip, TripStatus
from .serializers import TripSerializer, TripCreateSerializer, TripUpdateSerializer

class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    
    def get_serializer_class(self):
        if self.action == 'create':
            return TripCreateSerializer
        elif self.action in ['update', 'partial_update', 'complete']:
            return TripUpdateSerializer
        return TripSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by vehicle
        vehicle_id = self.request.query_params.get('vehicle')
        if vehicle_id:
            queryset = queryset.filter(vehicle_id=vehicle_id)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date:
            queryset = queryset.filter(start_time__gte=start_date)
        if end_date:
            queryset = queryset.filter(start_time__lte=end_date)
        
        # Filter by completion
        is_completed = self.request.query_params.get('is_completed')
        if is_completed is not None:
            queryset = queryset.filter(is_completed=is_completed.lower() == 'true')
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        trip = self.get_object()
        trip.status = TripStatus.COMPLETED
        trip.end_time = timezone.now()
        trip.is_completed = True
        
        # Calculate duration
        if trip.start_time:
            duration = (trip.end_time - trip.start_time).total_seconds() / 60
            trip.duration_minutes = int(duration)
        
        trip.save()
        serializer = self.get_serializer(trip)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        trip = self.get_object()
        trip.status = TripStatus.IN_PROGRESS
        trip.start_time = timezone.now()
        trip.save()
        serializer = self.get_serializer(trip)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        total_trips = Trip.objects.count()
        active_trips = Trip.objects.filter(status=TripStatus.IN_PROGRESS).count()
        completed_trips = Trip.objects.filter(status=TripStatus.COMPLETED).count()
        
        # Calculate average distance and speed for completed trips
        completed = Trip.objects.filter(status=TripStatus.COMPLETED)
        avg_distance = completed.aggregate(Avg('distance_km'))['distance_km__avg'] or 0
        avg_speed = completed.aggregate(Avg('avg_speed'))['avg_speed__avg'] or 0
        
        # Total passengers
        total_passengers = completed.aggregate(Sum('passengers_boarded'))['passengers_boarded__sum'] or 0
        
        return Response({
            'total_trips': total_trips,
            'active_trips': active_trips,
            'completed_trips': completed_trips,
            'avg_distance_km': round(avg_distance, 2),
            'avg_speed_kmh': round(avg_speed, 2),
            'total_passengers': total_passengers
        })