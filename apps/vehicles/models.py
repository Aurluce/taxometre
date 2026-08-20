import uuid
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth import get_user_model

User = get_user_model()

class VehicleStatus(models.TextChoices):
    ACTIVE = 'active', 'Actif'
    INACTIVE = 'inactive', 'Inactif'
    MAINTENANCE = 'maintenance', 'Maintenance'
    OFFLINE = 'offline', 'Hors ligne'
    OUT_OF_SERVICE = 'out_of_service', 'Hors service'

class VehicleType(models.TextChoices):
    BUS = 'bus', 'Bus'
    MINIBUS = 'minibus', 'Minibus'
    TAXI = 'taxi', 'Taxi'
    TRUCK = 'truck', 'Camion'
    VAN = 'van', 'Fourgon'

class FuelType(models.TextChoices):
    DIESEL = 'diesel', 'Diesel'
    PETROL = 'petrol', 'Essence'
    ELECTRIC = 'electric', 'Électrique'
    HYBRID = 'hybrid', 'Hybride'

class Vehicle(models.Model):
    id = models.BigAutoField(primary_key=True)
    uuid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False, db_index=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vehicles')
    
    registration_number = models.CharField(max_length=20, unique=True, db_index=True)
    vehicle_type = models.CharField(max_length=20, choices=VehicleType.choices, default=VehicleType.MINIBUS)
    brand = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.IntegerField(validators=[MinValueValidator(1900), MaxValueValidator(2100)])
    color = models.CharField(max_length=30, blank=True, null=True)
    fuel_type = models.CharField(max_length=20, choices=FuelType.choices, default=FuelType.DIESEL)
    capacity = models.IntegerField(default=15)
    weight_kg = models.IntegerField(default=2000)
    
    chassis_number = models.CharField(max_length=50, blank=True, null=True)
    engine_number = models.CharField(max_length=50, blank=True, null=True)
    insurance_policy = models.CharField(max_length=50, blank=True, null=True)
    insurance_expiry = models.DateField(blank=True, null=True)
    technical_control_expiry = models.DateField(blank=True, null=True)
    
    status = models.CharField(max_length=20, choices=VehicleStatus.choices, default=VehicleStatus.INACTIVE)
    firmware_version = models.CharField(max_length=20, default='1.0.0')
    battery_level = models.IntegerField(default=100, validators=[MinValueValidator(0), MaxValueValidator(100)])
    signal_strength = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])
    
    last_latitude = models.DecimalField(max_digits=10, decimal_places=8, default=0)
    last_longitude = models.DecimalField(max_digits=11, decimal_places=8, default=0)
    last_speed = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    last_update = models.DateTimeField(blank=True, null=True)
    last_address = models.CharField(max_length=255, blank=True, null=True)
    
    total_distance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_passengers = models.IntegerField(default=0)
    current_passengers = models.IntegerField(default=0)
    total_trips = models.IntegerField(default=0)
    total_operation_hours = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    last_maintenance_date = models.DateField(blank=True, null=True)
    next_maintenance_date = models.DateField(blank=True, null=True)
    maintenance_interval_km = models.IntegerField(default=5000)
    
    is_active = models.BooleanField(default=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['owner', 'status']),
            models.Index(fields=['registration_number']),
            models.Index(fields=['uuid']),
        ]
    
    def __str__(self):
        return f"{self.registration_number} - {self.brand} {self.model}"


from django.db import models


class VehicleConfiguration(models.Model):
    vehicle = models.OneToOneField(
        Vehicle,
        on_delete=models.CASCADE,
        related_name='config'
    )

    # =========================
    # CHARGE / PASSAGERS
    # =========================

    load_cell_threshold = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=35.0
    )

    passenger_weight_kg = models.IntegerField(
        default=70
    )

    # =========================
    # GPS / LOCALISATION
    # =========================

    gps_update_interval_sec = models.IntegerField(
        default=5
    )

    # Tolérance GPS avant de considérer
    # qu'il y a une perte de position
    gps_timeout_sec = models.IntegerField(
        default=30
    )

    # =========================
    # SYNCHRONISATION
    # =========================

    data_sync_interval_min = models.IntegerField(
        default=5
    )

    # =========================
    # VITESSE
    # =========================

    max_speed_kmh = models.IntegerField(
        default=100
    )

    # Active/désactive les alertes de survitesse
    speed_alert_enabled = models.BooleanField(
        default=True
    )

    # Nombre de secondes pendant lesquelles
    # la vitesse doit être dépassée avant alerte
    speed_alert_delay_sec = models.IntegerField(
        default=5
    )

    # =========================
    # ARRÊT
    # =========================

    stop_detection_threshold = models.IntegerField(
        default=30
    )

    # Durée maximale d'un arrêt avant alerte
    max_stop_duration_min = models.IntegerField(
        default=15
    )

    stop_alert_enabled = models.BooleanField(
        default=True
    )

    # =========================
    # BATTERIE / ALIMENTATION
    # =========================

    battery_alert_enabled = models.BooleanField(
        default=True
    )

    # Pourcentage minimum de batterie
    battery_min_percent = models.IntegerField(
        default=20
    )

    # =========================
    # CONNEXION
    # =========================

    connection_alert_enabled = models.BooleanField(
        default=True
    )

    # Temps sans synchronisation avant alerte
    connection_timeout_min = models.IntegerField(
        default=10
    )

    # =========================
    # MODE HORS LIGNE
    # =========================

    is_offline_mode = models.BooleanField(
        default=True
    )

    # =========================
    # API
    # =========================

    api_base_url = models.URLField(
        default='http://localhost:8000/api',
        blank=True
    )

    # =========================
    # ALERTES
    # =========================

    alerts_enabled = models.BooleanField(
        default=True
    )

    # =========================
    # CONFIGURATION AVANCÉE
    # =========================

    config_json = models.JSONField(
        default=dict,
        blank=True
    )

    # =========================
    # DATES
    # =========================

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"Config - {self.vehicle.registration_number}"
    



class RestrictedZone(models.Model):
    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.CASCADE,
        related_name='restricted_zones'
    )

    name = models.CharField(max_length=150)

    # Centre de la zone
    latitude = models.DecimalField(
        max_digits=10,
        decimal_places=7
    )

    longitude = models.DecimalField(
        max_digits=10,
        decimal_places=7
    )

    # Rayon en mètres
    radius_meters = models.PositiveIntegerField(
        default=500
    )

    zone_type = models.CharField(
        max_length=20,
        choices=[
            ('no_entry', 'Interdiction d\'entrée'),
            ('speed_limit', 'Limitation de vitesse'),
            ('custom', 'Personnalisée')
        ],
        default='no_entry'
    )

    is_active = models.BooleanField(
        default=True
    )

    alert_enabled = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.name} - {self.vehicle.registration_number}"