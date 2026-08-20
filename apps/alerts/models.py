from django.db import models
from django.utils import timezone
from apps.vehicles.models import Vehicle

class AlertType(models.TextChoices):
    SPEEDING = 'speeding', 'Excès de vitesse'
    GPS_LOST = 'gps_lost', 'Perte GPS'
    POWER_CUT = 'power_cut', 'Coupure alimentation'
    SENSOR_FAILURE = 'sensor_failure', 'Panne capteur'
    NO_COMMUNICATION = 'no_communication', 'Absence communication'
    MAINTENANCE_DUE = 'maintenance_due', 'Maintenance due'
    CAPACITY_EXCEEDED = 'capacity_exceeded', 'Capacité dépassée'
    BATTERY_LOW = 'battery_low', 'Batterie faible'

class AlertSeverity(models.TextChoices):
    LOW = 'low', 'Faible'
    MEDIUM = 'medium', 'Moyen'
    HIGH = 'high', 'Élevé'
    CRITICAL = 'critical', 'Critique'

class AlertStatus(models.TextChoices):
    NEW = 'new', 'Nouvelle'
    ACKNOWLEDGED = 'acknowledged', 'Reconnue'
    RESOLVED = 'resolved', 'Résolue'

class Alert(models.Model):
    id = models.BigAutoField(primary_key=True)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='alerts')
    
    type = models.CharField(max_length=30, choices=AlertType.choices, db_index=True)
    severity = models.CharField(max_length=20, choices=AlertSeverity.choices, default=AlertSeverity.MEDIUM)
    status = models.CharField(max_length=20, choices=AlertStatus.choices, default=AlertStatus.NEW)
    
    title = models.CharField(max_length=200)
    message = models.TextField()
    suggested_action = models.TextField(blank=True, null=True)
    
    latitude = models.DecimalField(max_digits=10, decimal_places=8, blank=True, null=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, blank=True, null=True)
    
    detected_at = models.DateTimeField(auto_now_add=True)
    acknowledged_at = models.DateTimeField(blank=True, null=True)
    resolved_at = models.DateTimeField(blank=True, null=True)
    
    is_read = models.BooleanField(default=False)
    is_resolved = models.BooleanField(default=False)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-detected_at']
        indexes = [
            models.Index(fields=['vehicle', 'status']),
            models.Index(fields=['detected_at']),
        ]
    
    def __str__(self):
        return f"{self.type} - {self.vehicle.registration_number}"
