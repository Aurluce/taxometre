from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Vehicle, VehicleConfiguration, RestrictedZone

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone', 'role']

class VehicleSerializer(serializers.ModelSerializer):
    owner_name = serializers.SerializerMethodField()
    owner_email = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    vehicle_type_display = serializers.CharField(source='get_vehicle_type_display', read_only=True)
    fuel_type_display = serializers.CharField(source='get_fuel_type_display', read_only=True)
    
    class Meta:
        model = Vehicle
        fields = [
            'id', 'uuid', 'registration_number', 'vehicle_type', 'vehicle_type_display',
            'brand', 'model', 'year', 'color', 'fuel_type', 'fuel_type_display',
            'capacity', 'weight_kg',
            'chassis_number', 'engine_number', 'insurance_policy',
            'insurance_expiry', 'technical_control_expiry',
            'status', 'status_display', 'firmware_version',
            'battery_level', 'signal_strength',
            'last_latitude', 'last_longitude', 'last_speed', 'last_update', 'last_address',
            'total_distance', 'total_passengers', 'current_passengers', 'total_trips',
            'total_operation_hours',
            'last_maintenance_date', 'next_maintenance_date', 'maintenance_interval_km',
            'owner', 'owner_name', 'owner_email',
            'is_active', 'notes', 'created_at', 'updated_at', 'config'
        ]
        read_only_fields = ['id', 'uuid', 'created_at', 'updated_at']
    
    def get_owner_name(self, obj):
        return obj.owner.get_full_name() or obj.owner.username
    
    def get_owner_email(self, obj):
        return obj.owner.email

    config = serializers.SerializerMethodField()

    def get_config(self, obj):
        if hasattr(obj, 'config'):
            return VehicleConfigurationSerializer(obj.config).data
        return None

class VehicleConfigurationSerializer(serializers.ModelSerializer):
    vehicle = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = VehicleConfiguration
        fields = [
            'vehicle',
            'load_cell_threshold',
            'passenger_weight_kg',
            'gps_update_interval_sec',
            'gps_timeout_sec',
            'data_sync_interval_min',
            'max_speed_kmh',
            'speed_alert_enabled',
            'speed_alert_delay_sec',
            'stop_detection_threshold',
            'max_stop_duration_min',
            'stop_alert_enabled',
            'connection_alert_enabled',
            'connection_timeout_min',
            'is_offline_mode',
            'api_base_url',
            'alerts_enabled',
            'config_json',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['vehicle', 'created_at', 'updated_at']

class RestrictedZoneSerializer(serializers.ModelSerializer):
    zone_type_display = serializers.CharField(source='get_zone_type_display', read_only=True)
    vehicle = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = RestrictedZone
        fields = [
            'id',
            'vehicle',
            'name',
            'latitude',
            'longitude',
            'radius_meters',
            'zone_type',
            'zone_type_display',
            'is_active',
            'alert_enabled',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'vehicle']

class VehicleCreateSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False, allow_null=True)
    
    class Meta:
        model = Vehicle
        fields = [
            'uuid', 'registration_number', 'vehicle_type', 'brand', 'model', 'year',
            'color', 'fuel_type', 'capacity', 'weight_kg',
            'chassis_number', 'engine_number', 'insurance_policy',
            'insurance_expiry', 'technical_control_expiry',
            'status', 'firmware_version', 'battery_level', 'signal_strength',
            'last_latitude', 'last_longitude', 'last_speed', 'last_address',
            'total_distance', 'total_passengers', 'current_passengers', 'total_trips',
            'total_operation_hours',
            'last_maintenance_date', 'next_maintenance_date', 'maintenance_interval_km',
            'is_active', 'notes', 'owner'
        ]
        read_only_fields = ['uuid']
