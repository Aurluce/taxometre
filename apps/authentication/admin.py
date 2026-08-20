from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'phone', 'is_active']
    list_filter = ['role', 'is_active', 'is_verified', 'is_superuser']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'phone']
    
    fieldsets = UserAdmin.fieldsets + (
        ('Informations personnelles', {'fields': ('phone', 'address')}),
        ('Entreprise', {'fields': ('company_name', 'company_address', 'company_phone')}),
        ('Rôle et statut', {'fields': ('role', 'is_verified', 'last_login_ip')}),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Informations personnelles', {'fields': ('phone', 'address')}),
        ('Entreprise', {'fields': ('company_name', 'company_address')}),
        ('Rôle', {'fields': ('role',)}),
    )
