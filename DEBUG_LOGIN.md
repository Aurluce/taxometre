# Guide de débogage - Erreur 401 sur le login

## Erreur observée
```
"POST /api/auth/login/ HTTP/1.1" 401 79
Unauthorized: /api/auth/login/
```

## Causes possibles

### 1. L'utilisateur n'existe pas dans la base de données

**Vérification :**
```bash
cd /home/aurluce/Bureau/taxometre
python manage.py shell
```

```python
from apps.authentication.models import User

# Lister tous les utilisateurs
users = User.objects.all()
for user in users:
    print(f"Username: {user.username}, Email: {user.email}, Role: {user.role}")

# Vérifier si un utilisateur spécifique existe
try:
    user = User.objects.get(username='admin')
    print(f"✓ Utilisateur 'admin' trouvé: {user.email}")
except User.DoesNotExist:
    print("✗ Utilisateur 'admin' n'existe pas!")
```

**Solution :** Créer l'utilisateur
```python
from apps.authentication.models import User

# Créer un superutilisateur
user = User.objects.create_superuser(
    username='admin',
    email='admin@taxometre.com',
    password='admin123',
    first_name='Admin',
    last_name='User',
    role='admin'
)
print(f"✓ Utilisateur créé: {user.username}")
```

### 2. Le mot de passe est incorrect

**Vérification :**
```python
from django.contrib.auth import authenticate

# Tester l'authentification
user = authenticate(username='admin', password='admin123')
if user:
    print(f"✓ Authentification réussie: {user.username}")
else:
    print("✗ Échec de l'authentification - mot de passe incorrect")
```

**Solution :** Réinitialiser le mot de passe
```python
from apps.authentication.models import User

user = User.objects.get(username='admin')
user.set_password('admin123')
user.save()
print("✓ Mot de passe réinitialisé")
```

### 3. Tester l'API directement avec curl

```bash
# Test de login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

**Réponse attendue :**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@taxometre.com",
    "first_name": "Admin",
    "last_name": "User",
    "phone": null,
    "role": "admin"
  }
}
```

**Si vous obtenez une erreur 401 :**
```json
{
  "detail": "No active account found with the given credentials"
}
```

Cela signifie que l'utilisateur n'existe pas ou le mot de passe est incorrect.

### 4. Vérifier la configuration CORS

**Vérification dans `config/settings.py` :**
```python
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
```

**Test CORS :**
```bash
curl -X OPTIONS http://localhost:8000/api/auth/login/ \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST"
```

### 5. Vérifier les logs Django

Les logs devraient afficher plus de détails :
```bash
# Démarrer le serveur avec plus de détails
python manage.py runserver --verbosity=2
```

## Solution complète

### Étape 1 : Créer un utilisateur de test

Créez le fichier `create_test_user.py` :

```python
#!/usr/bin/env python
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, '/home/aurluce/Bureau/taxometre')
django.setup()

from apps.authentication.models import User

# Supprimer l'utilisateur s'il existe
if User.objects.filter(username='admin').exists():
    User.objects.filter(username='admin').delete()
    print("✓ Ancien utilisateur 'admin' supprimé")

# Créer un nouvel utilisateur admin
admin = User.objects.create_superuser(
    username='admin',
    email='admin@taxometre.com',
    password='admin123',
    first_name='Admin',
    last_name='User',
    phone='+237 123 456 789',
    role='admin'
)

print(f"✓ Utilisateur admin créé:")
print(f"  - Username: {admin.username}")
print(f"  - Email: {admin.email}")
print(f"  - Password: admin123")
print(f"  - Role: {admin.role}")
print(f"  - ID: {admin.id}")
```

Exécutez le script :
```bash
python create_test_user.py
```

### Étape 2 : Vérifier la base de données

```bash
# Se connecter à MySQL
mysql -u root -p taxometre_db

# Vérifier l'utilisateur
SELECT id, username, email, role, is_active, is_staff, is_superuser 
FROM users 
WHERE username = 'admin';
```

### Étape 3 : Tester le login

```bash
# Test avec curl
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' \
  | python -m json.tool
```

### Étape 4 : Vérifier le frontend

Ouvrez la console du navigateur (F12) et vérifiez :
1. La requête POST vers `/api/auth/login/`
2. Les headers de la requête
3. La réponse reçue

**Headers attendus :**
```
Content-Type: application/json
Origin: http://localhost:3000
```

**Réponse attendue :**
```json
{
  "access": "...",
  "refresh": "...",
  "user": {...}
}
```

## Configuration actuelle

### Backend (`config/settings.py`)
- `DEFAULT_PERMISSION_CLASSES`: `AllowAny` (permet l'accès public au login)
- `CustomTokenObtainPairView`: `permission_classes = [AllowAny]`
- CORS: `CORS_ALLOW_ALL_ORIGINS = True`

### Frontend (`frontend/lib/api.ts`)
- URL: `http://localhost:8000/api/auth/login/`
- Method: `POST`
- Body: `{"username": "...", "password": "..."}`

## Vérifications rapides

1. **Le serveur Django est-il en cours d'exécution ?**
   ```bash
   curl http://localhost:8000/admin/
   ```

2. **La base de données est-elle accessible ?**
   ```bash
   python manage.py dbshell
   ```

3. **Les migrations sont-elles appliquées ?**
   ```bash
   python manage.py showmigrations
   ```

4. **L'utilisateur existe-t-il ?**
   ```bash
   python manage.py shell -c "from apps.authentication.models import User; print(User.objects.count())"
   ```

## Erreurs courantes

### "No active account found with the given credentials"
- **Cause :** Utilisateur n'existe pas ou mot de passe incorrect
- **Solution :** Créer l'utilisateur ou réinitialiser le mot de passe

### "CSRF Failed: CSRF token missing or incorrect"
- **Cause :** CSRF activé pour les API
- **Solution :** Utiliser `@csrf_exempt` ou désactiver CSRF pour les API

### "Connection refused"
- **Cause :** Serveur Django non démarré
- **Solution :** Démarrer le serveur avec `python manage.py runserver`

## Script de diagnostic automatique

Créez `diagnostic.py` :

```python
#!/usr/bin/env python
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, '/home/aurluce/Bureau/taxometre')
django.setup()

from apps.authentication.models import User
from django.contrib.auth import authenticate

print("=" * 60)
print("DIAGNOSTIC D'AUTHENTIFICATION")
print("=" * 60)

# 1. Vérifier les utilisateurs
print("\n1. UTILISATEURS DANS LA BASE DE DONNÉES")
print("-" * 60)
users = User.objects.all()
if users.exists():
    for user in users:
        print(f"  ✓ {user.username} ({user.email}) - Role: {user.role}")
else:
    print("  ✗ Aucun utilisateur trouvé!")

# 2. Tester l'authentification
print("\n2. TEST D'AUTHENTIFICATION")
print("-" * 60)
test_user = 'admin'
test_pass = 'admin123'

user = authenticate(username=test_user, password=test_pass)
if user:
    print(f"  ✓ Authentification réussie pour '{test_user}'")
else:
    print(f"  ✗ Échec de l'authentification pour '{test_user}'")
    print(f"     Vérifiez le mot de passe: '{test_pass}'")

# 3. Vérifier la configuration
print("\n3. CONFIGURATION")
print("-" * 60)
print(f"  AUTH_USER_MODEL: {django.conf.settings.AUTH_USER_MODEL}")
print(f"  DEFAULT_PERMISSION_CLASSES: {django.conf.settings.REST_FRAMEWORK.get('DEFAULT_PERMISSION_CLASSES')}")

print("\n" + "=" * 60)
```

Exécutez le diagnostic :
```bash
python diagnostic.py