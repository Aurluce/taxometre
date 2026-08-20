from rest_framework import serializers
from .models import Alert, AlertType, AlertSeverity, AlertStatus

class AlertSerializer(serializers.ModelSerializer):
    vehicle_registration = serializers.CharField(source='vehicle.registration_number', read_only=True)
    vehicle_brand = serializers.CharField(source='vehicle.brand', read_only=True)
    vehicle_model = serializers.CharField(source='vehicle.model', read_only=True)
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    severity_display = serializers.CharField(source='get_severity_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Alert
        fields = [
            'id', 'vehicle', 'vehicle_registration', 'vehicle_brand', 'vehicle_model',
            'type', 'type_display', 'severity', 'severity_display', 'status', 'status_display',
            'title', 'message', 'suggested_action',
            'latitude', 'longitude',
            'detected_at', 'acknowledged_at', 'resolved_at',
            'is_read', 'is_resolved', 'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class AlertCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = [
            'vehicle', 'type', 'severity', 'title', 'message', 'suggested_action',
            'latitude', 'longitude'
        ]

class AlertUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = [
            'status', 'is_read', 'is_resolved', 'notes', 'acknowledged_at', 'resolved_at'
        ]