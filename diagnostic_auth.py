#!/usr/bin/env python
"""
Script de diagnostic pour l'authentification
"""
import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, '/home/aurluce/Bureau/taxometre')
django.setup()

from apps.authentication.models import User
from django.contrib.auth import authenticate
from django.db import connection

print("=" * 70)
print("DIAGNOSTIC D'AUTHENTIFICATION")
print("=" * 70)

# 1. Vérifier la connexion à la base de données
print("\n1. CONNEXION BASE DE DONNÉES")
print("-" * 70)
try:
    with connection.cursor() as cursor:
        cursor.execute("SELECT DATABASE()")
        db_name = cursor.fetchone()[0]
        print(f"✓ Connecté à la base de données: {db_name}")
except Exception as e:
    print(f"✗ Erreur de connexion: {e}")
    sys.exit(1)

# 2. Vérifier les utilisateurs
print("\n2. UTILISATEURS DANS LA BASE")
print("-" * 70)
users = User.objects.all()
if users.exists():
    print(f"✓ {users.count()} utilisateur(s) trouvé(s):\n")
    for user in users:
        print(f"  ID: {user.id}")
        print(f"  Username: {user.username}")
        print(f"  Email: {user.email}")
        print(f"  Nom: {user.first_name} {user.last_name}")
        print(f"  Rôle: {user.role}")
        print(f"  Actif: {user.is_active}")
        print(f"  Staff: {user.is_staff}")
        print(f"  Superuser: {user.is_superuser}")
        print(f"  Mot de passe hashé: {user.password[:50]}...")
        print()
else:
    print("✗ Aucun utilisateur trouvé dans la base de données!")
    print("  Créez un utilisateur avec: python manage.py createsuperuser")

# 3. Tester l'authentification
print("\n3. TEST D'AUTHENTIFICATION")
print("-" * 70)

test_cases = [
    ("admin", "admin123"),
    ("admin@taxometre.com", "admin123"),
]

for username, password in test_cases:
    print(f"\nTest: {username} / {password}")
    user = authenticate(username=username, password=password)
    if user:
        print(f"  ✓ Authentification réussie: {user.username} ({user.email})")
    else:
        print(f"  ✗ Échec de l'authentification")

# 4. Vérifier la configuration
print("\n4. CONFIGURATION DJANGO")
print("-" * 70)
print(f"  AUTH_USER_MODEL: {django.conf.settings.AUTH_USER_MODEL}")
print(f"  DEFAULT_PERMISSION_CLASSES: {django.conf.settings.REST_FRAMEWORK.get('DEFAULT_PERMISSION_CLASSES')}")
print(f"  DEBUG: {django.conf.settings.DEBUG}")

# 5. Vérifier les migrations
print("\n5. MIGRATIONS")
print("-" * 70)
from django.core.management import call_command
from io import StringIO

out = StringIO()
call_command('showmigrations', 'authentication', stdout=out)
output = out.getvalue()

if '[X]' in output:
    print("✓ Migrations appliquées:")
    for line in output.split('\n')[:10]:
        if line.strip():
            print(f"  {line}")
else:
    print("✗ Aucune migration trouvée ou migrations non appliquées")
    print("  Exécutez: python manage.py migrate")

print("\n" + "=" * 70)
print("FIN DU DIAGNOSTIC")
print("=" * 70)

print("\n📋 RECOMMANDATIONS:")
print("-" * 70)

if not users.exists():
    print("1. CRÉER UN UTILISATEUR:")
    print("   python manage.py createsuperuser")
    print()
elif users.count() == 1:
    user = users.first()
    print("1. UTILISATEUR TROUVÉ:")
    print(f"   Email: {user.email}")
    print(f"   Username: {user.username}")
    print()
    print("2. TESTER LA CONNEXION:")
    print(f"   curl -X POST http://localhost:8000/api/auth/login/ \\")
    print(f"     -H 'Content-Type: application/json' \\")
    print(f"     -d '{{\"username\": \"{user.email}\", \"password\": \"votre_mot_de_passe\"}}'")
    print()

print("3. VÉRIFIER LE SERVEUR:")
print("   curl http://localhost:8000/admin/")
print()
print("4. VÉRIFIER LES LOGS:")
print("   python manage.py runserver --verbosity=2")
print("=" * 70)