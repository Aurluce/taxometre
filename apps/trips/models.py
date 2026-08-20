import uuid
from django.db import models
from apps.vehicles.models import Vehicle

class TripStatus(models.TextChoices):
    SCHEDULED = 'scheduled', 'Planifié'
    IN_PROGRESS = 'in_progress', 'En cours'
    PAUSED = 'paused', 'En pause'
    COMPLETED = 'completed', 'Terminé'
    CANCELLED = 'cancelled', 'Annulé'

class Trip(models.Model):
    id = models.BigAutoField(primary_key=True)
    uuid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False, db_index=True)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='trips')
    
    status = models.CharField(max_length=20, choices=TripStatus.choices, default=TripStatus.SCHEDULED)
    trip_number = models.CharField(max_length=20, blank=True, null=True)
    
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(blank=True, null=True)
    scheduled_start_time = models.DateTimeField(blank=True, null=True)
    scheduled_end_time = models.DateTimeField(blank=True, null=True)
    duration_minutes = models.IntegerField(default=0)
    
    start_latitude = models.DecimalField(max_digits=10, decimal_places=8, blank=True, null=True)
    start_longitude = models.DecimalField(max_digits=11, decimal_places=8, blank=True, null=True)
    end_latitude = models.DecimalField(max_digits=10, decimal_places=8, blank=True, null=True)
    end_longitude = models.DecimalField(max_digits=11, decimal_places=8, blank=True, null=True)
    
    distance_km = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    avg_speed = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    max_speed = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    
    passengers_boarded = models.IntegerField(default=0)
    passengers_alighted = models.IntegerField(default=0)
    max_passengers_on_board = models.IntegerField(default=0)
    avg_passengers = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    
    stops_count = models.IntegerField(default=0)
    total_stop_duration_sec = models.IntegerField(default=0)
    
    route_geojson = models.JSONField(default=list, blank=True)
    
    is_completed = models.BooleanField(default=False)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-start_time']
        indexes = [
            models.Index(fields=['vehicle', 'start_time']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"Trajet {self.trip_number or self.uuid[:8]}"
