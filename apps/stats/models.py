
from django.db import models
from apps.vehicles.models import Vehicle

class DailyStatistics(models.Model):
    id = models.BigAutoField(primary_key=True)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='daily_stats')
    date = models.DateField()
    
    total_distance_km = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    avg_speed = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    max_speed = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    
    total_passengers = models.IntegerField(default=0)
    avg_passengers = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    max_passengers = models.IntegerField(default=0)
    
    trips_count = models.IntegerField(default=0)
    stops_count = models.IntegerField(default=0)
    operation_hours = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    
    door_open_count = models.IntegerField(default=0)
    boarding_count = models.IntegerField(default=0)
    alighting_count = models.IntegerField(default=0)
    
    revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['vehicle', 'date']
        ordering = ['-date']
    
    def __str__(self):
        return f"Stats {self.vehicle.registration_number} - {self.date}"


class MonthlyStatistics(models.Model):
    id = models.BigAutoField(primary_key=True)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='monthly_stats')
    month = models.DateField()
    
    total_distance_km = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_passengers = models.IntegerField(default=0)
    avg_daily_passengers = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    operation_days = models.IntegerField(default=0)
    trips_count = models.IntegerField(default=0)
    
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    best_day = models.DateField(blank=True, null=True)
    worst_day = models.DateField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['vehicle', 'month']
        ordering = ['-month']
