from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator

class User(AbstractUser):
    ROLE_CHOICES = [
        ('owner', 'Propriétaire'),
        ('admin', 'Administrateur'),
        ('driver', 'Chauffeur'),
        ('viewer', 'Visualisateur'),
    ]
    
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='owner')
    is_verified = models.BooleanField(default=False)
    company_name = models.CharField(max_length=100, blank=True, null=True)
    company_address = models.TextField(blank=True, null=True)
    company_phone = models.CharField(max_length=20, blank=True, null=True)
    last_login_ip = models.GenericIPAddressField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Notification preferences
    email_notifications = models.BooleanField(default=True, help_text="Recevoir les notifications par email")
    sms_notifications = models.BooleanField(default=False, help_text="Recevoir les notifications par SMS")
    push_notifications = models.BooleanField(default=True, help_text="Recevoir les notifications push")
    
    class Meta:
        db_table = 'users'
        ordering = ['-date_joined']
        indexes = [
            models.Index(fields=['email', 'role']),
            models.Index(fields=['is_active', 'is_verified']),
        ]
    
    def __str__(self):
        return f"{self.username} ({self.email})"
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username
    
    def is_owner(self):
        return self.role == 'owner'
    
    def is_admin_user(self):
        return self.role == 'admin' or self.is_superuser
