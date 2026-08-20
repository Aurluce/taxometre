from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from .models import Vehicle, VehicleConfiguration

@admin.register(Vehicle)
class VehicleAdmin(ImportExportModelAdmin):
    list_display = ['registration_number', 'brand', 'model', 'get_owner', 'status', 'current_passengers', 'created_at']
    list_filter = ['status', 'vehicle_type', 'owner', 'is_active']
    search_fields = ['registration_number', 'brand', 'model', 'owner__username', 'owner__email']
    readonly_fields = ['uuid', 'created_at', 'updated_at']
    
    def get_owner(self, obj):
        return obj.owner.username
    get_owner.short_description = 'Propriétaire'
    
    fieldsets = (
        ('Identifiants', {'fields': ('uuid', 'registration_number', 'chassis_number', 'engine_number')}),
        ('Propriétaire', {'fields': ('owner',)}),
        ('Informations', {'fields': ('brand', 'model', 'year', 'color', 'vehicle_type', 'capacity', 'fuel_type')}),
        ('État', {'fields': ('status', 'is_active', 'firmware_version', 'battery_level')}),
        ('Position', {'fields': ('last_latitude', 'last_longitude', 'last_speed', 'last_update')}),
        ('Statistiques', {'fields': ('total_distance', 'total_passengers', 'current_passengers')}),
        ('Maintenance', {'fields': ('last_maintenance_date', 'next_maintenance_date', 'maintenance_interval_km')}),
        ('Métadonnées', {'fields': ('notes', 'created_at', 'updated_at')}),
    )

@admin.register(VehicleConfiguration)
class VehicleConfigurationAdmin(admin.ModelAdmin):
    list_display = ['vehicle', 'max_speed_kmh', 'gps_update_interval_sec']
    search_fields = ['vehicle__registration_number']
