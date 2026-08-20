from rest_framework import serializers
from .models import Trip, TripStatus

class TripSerializer(serializers.ModelSerializer):
    vehicle_registration = serializers.CharField(source='vehicle.registration_number', read_only=True)
    vehicle_brand = serializers.CharField(source='vehicle.brand', read_only=True)
    vehicle_model = serializers.CharField(source='vehicle.model', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Trip
        fields = [
            'id', 'uuid', 'vehicle', 'vehicle_registration', 'vehicle_brand', 'vehicle_model',
            'status', 'status_display', 'trip_number',
            'start_time', 'end_time', 'scheduled_start_time', 'scheduled_end_time', 'duration_minutes',
            'start_latitude', 'start_longitude', 'end_latitude', 'end_longitude',
            'distance_km', 'avg_speed', 'max_speed',
            'passengers_boarded', 'passengers_alighted', 'max_passengers_on_board', 'avg_passengers',
            'stops_count', 'total_stop_duration_sec',
            'route_geojson',
            'is_completed', 'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'uuid', 'created_at', 'updated_at']

class TripCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = [
            'vehicle', 'status', 'trip_number',
            'start_time', 'scheduled_start_time', 'scheduled_end_time',
            'start_latitude', 'start_longitude', 'end_latitude', 'end_longitude',
            'notes'
        ]

class TripUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = [
            'status', 'end_time', 'duration_minutes',
            'end_latitude', 'end_longitude',
            'distance_km', 'avg_speed', 'max_speed',
            'passengers_boarded', 'passengers_alighted', 'max_passengers_on_board', 'avg_passengers',
            'stops_count', 'total_stop_duration_sec',
            'route_geojson', 'is_completed', 'notes'
        ]