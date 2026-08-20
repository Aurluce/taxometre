import uuid
from django.db import models
from apps.vehicles.models import Vehicle
from apps.trips.models import Trip

class EventType(models.TextChoices):
    DOOR_OPEN = 'door_open', 'Ouverture porte'
    DOOR_CLOSE = 'door_close', 'Fermeture porte'
    BOARDING = 'boarding', 'Montée passager'
    ALIGHTING = 'alighting', 'Descente passager'
    STOP_START = 'stop_start', 'Début arrêt'
    STOP_END = 'stop_end', 'Fin arrêt'
    SPEEDING = 'speeding', 'Excès de vitesse'
    GPS_LOST = 'gps_lost', 'Perte GPS'
    POWER_CUT = 'power_cut', 'Coupure alimentation'
    SENSOR_FAILURE = 'sensor_failure', 'Panne capteur'
    MAINTENANCE_DUE = 'maintenance_due', 'Maintenance due'

class EventSeverity(models.TextChoices):
    INFO = 'info', 'Information'
    LOW = 'low', 'Faible'
    MEDIUM = 'medium', 'Moyen'
    HIGH = 'high', 'Élevé'
    CRITICAL = 'critical', 'Critique'

class Event(models.Model):
    id = models.BigAutoField(primary_key=True)
    uuid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='events')
    trip = models.ForeignKey(Trip, on_delete=models.SET_NULL, null=True, blank=True, related_name='events')
    
    type = models.CharField(max_length=30, choices=EventType.choices, db_index=True)
    severity = models.CharField(max_length=20, choices=EventSeverity.choices, default=EventSeverity.INFO)
    
    count = models.IntegerField(default=1)
    value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    latitude = models.DecimalField(max_digits=10, decimal_places=8, blank=True, null=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, blank=True, null=True)
    
    message = models.CharField(max_length=500, blank=True, null=True)
    details = models.JSONField(default=dict, blank=True)
    
    recorded_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-recorded_at']
        indexes = [
            models.Index(fields=['vehicle', 'recorded_at']),
            models.Index(fields=['type']),
        ]
    
    def __str__(self):
        return f"{self.type} - {self.vehicle.registration_number}"
