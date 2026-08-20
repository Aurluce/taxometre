# Requête SQL pour insérer un utilisateur dans MySQL

## Structure de la table

La table `users` est créée par Django à partir du modèle `User` qui étend `AbstractUser`.

### Champs de la table users

```sql
DESCRIBE users;
```

| Champ | Type | Description |
|-------|------|-------------|
| id | bigint | Clé primaire (auto-incrément) |
| password | varchar(128) | Mot de passe hashé |
| last_login | datetime | Dernière connexion |
| is_superuser | tinyint(1) | Superutilisateur |
| username | varchar(150) | Nom d'utilisateur (unique) |
| first_name | varchar(150) | Prénom |
| last_name | varchar(150) | Nom |
| email | varchar(254) | Email (unique) |
| is_staff | tinyint(1) | Accès admin |
| is_active | tinyint(1) | Compte actif |
| date_joined | datetime | Date de création |
| phone | varchar(20) | Téléphone |
| address | text | Adresse |
| role | varchar(20) | Rôle (owner/admin/driver/viewer) |
| is_verified | tinyint(1) | Email vérifié |
| company_name | varchar(100) | Nom de l'entreprise |
| company_address | text | Adresse de l'entreprise |
| company_phone | varchar(20) | Téléphone de l'entreprise |
| last_login_ip | varchar(45) | Dernière IP de connexion |
| created_at | datetime | Date de création |
| updated_at | datetime | Date de modification |

## Requête SQL d'insertion

### Méthode 1 : Insertion simple (recommandée pour tests)

```sql
INSERT INTO users (
    username,
    first_name,
    last_name,
    email,
    password,
    phone,
    address,
    role,
    is_verified,
    company_name,
    company_address,
    company_phone,
    is_active,
    is_staff,
    is_superuser,
    date_joined,
    last_login_ip
) VALUES (
    'admin',
    'Admin',
    'User',
    'admin@taxometre.com',
    'pbkdf2_sha256$600000$dummy$dummy',  -- Mot de passe hashé (voir ci-dessous)
    '+237 123 456 789',
    'Douala, Cameroun',
    'admin',
    1,
    'TaxoMètre SARL',
    '123 Rue Principale, Douala',
    '+237 123 456 790',
    1,
    1,
    1,
    NOW(),
    '127.0.0.1'
);
```

### Méthode 2 : Insertion avec mot de passe en clair (pour développement)

**ATTENTION :** Cette méthode est uniquement pour le développement. En production, utilisez toujours des mots de passe hashés.

```sql
-- D'abord, créer l'utilisateur avec un mot de passe temporaire
INSERT INTO users (
    username,
    first_name,
    last_name,
    email,
    password,
    phone,
    role,
    is_active,
    is_staff,
    is_superuser,
    date_joined
) VALUES (
    'testuser',
    'Test',
    'User',
    'test@example.com',
    'test12345',  -- Mot de passe en clair (NON SÉCURISÉ)
    '+237 987 654 321',
    'owner',
    1,
    0,
    0,
    NOW()
);
```

**Puis, hasher le mot de passe avec Django :**

```bash
# Ouvrir le shell Django
python manage.py shell

# Exécuter le code Python suivant
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

User = get_user_model()

# Récupérer l'utilisateur
user = User.objects.get(username='testuser')

# Hasher le mot de passe
user.password = make_password('test12345')
user.save()

print(f"Mot de passe hashé: {user.password}")
```

### Méthode 3 : Insertion complète avec tous les champs

```sql
INSERT INTO users (
    username,
    first_name,
    last_name,
    email,
    password,
    phone,
    address,
    role,
    is_verified,
    company_name,
    company_address,
    company_phone,
    last_login_ip,
    is_active,
    is_staff,
    is_superuser,
    date_joined,
    created_at,
    updated_at
) VALUES (
    'jean.dupont',
    'Jean',
    'Dupont',
    'jean.dupont@example.com',
    'pbkdf2_sha256$36000$dummy$dummy',
    '+237 111 222 333',
    '123 Avenue de la République, Douala',
    'owner',
    1,
    'Transport Dupont SARL',
    '456 Boulevard du 20 Mai, Yaoundé',
    '+237 111 222 334',
    '192.168.1.100',
    1,
    0,
    0,
    NOW(),
    NOW(),
    NOW()
);
```

## Générer un mot de passe hashé

### Option 1 : Via Django Shell

```bash
python manage.py shell
```

```python
from django.contrib.auth.hashers import make_password

# Générer un hash pour un mot de passe
password = 'MonMotDePasse123!'
hashed = make_password(password)
print(f"Mot de passe: {password}")
print(f"Hash: {hashed}")
```

### Option 2 : Via script Python

Créez un fichier `generate_password.py` :

```python
#!/usr/bin/env python
import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, '/home/aurluce/Bureau/taxometre')
django.setup()

from django.contrib.auth.hashers import make_password

password = input("Entrez le mot de passe: ")
hashed = make_password(password)

print(f"\nMot de passe hashé:")
print(hashed)
print(f"\nRequête SQL:")
print(f"INSERT INTO users (username, password, ...) VALUES ('admin', '{hashed}', ...);")
```

Exécutez le script :

```bash
python generate_password.py
```

## Exemples de rôles disponibles

```sql
-- Propriétaire
INSERT INTO users (username, role, ...) VALUES ('owner1', 'owner', ...);

-- Administrateur
INSERT INTO users (username, role, ...) VALUES ('admin1', 'admin', ...);

-- Chauffeur
INSERT INTO users (username, role, ...) VALUES ('driver1', 'driver', ...);

-- Visualisateur
INSERT INTO users (username, role, ...) VALUES ('viewer1', 'viewer', ...);
```

## Vérifier l'insertion

```sql
-- Voir tous les utilisateurs
SELECT id, username, email, first_name, last_name, role, is_active, is_staff, is_superuser 
FROM users;

-- Voir un utilisateur spécifique
SELECT * FROM users WHERE username = 'admin';

-- Compter les utilisateurs
SELECT COUNT(*) FROM users;

-- Vérifier les rôles
SELECT role, COUNT(*) as count 
FROM users 
GROUP BY role;
```

## Créer un superutilisateur (méthode recommandée)

La méthode la plus simple et sécurisée est d'utiliser la commande Django :

```bash
cd /home/aurluce/Bureau/taxometre
python manage.py createsuperuser
```

Cette commande vous demandera :
- Nom d'utilisateur
- Adresse email
- Mot de passe (deux fois)

Le mot de passe sera automatiquement hashé et sécurisé.

## Script complet d'insertion

Créez un fichier `create_test_users.py` :

```python
#!/usr/bin/env python
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, '/home/aurluce/Bureau/taxometre')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Créer un superutilisateur admin
if not User.objects.filter(username='admin').exists():
    admin = User.objects.create_superuser(
        username='admin',
        email='admin@taxometre.com',
        password='admin123',
        first_name='Admin',
        last_name='User',
        phone='+237 123 456 789',
        role='admin'
    )
    print(f"✓ Admin créé: {admin.username}")

# Créer un propriétaire
if not User.objects.filter(username='owner1').exists():
    owner = User.objects.create_user(
        username='owner1',
        email='owner@example.com',
        password='owner123',
        first_name='Jean',
        last_name='Dupont',
        phone='+237 111 222 333',
        role='owner',
        company_name='Transport Dupont SARL'
    )
    print(f"✓ Propriétaire créé: {owner.username}")

# Créer un chauffeur
if not User.objects.filter(username='driver1').exists():
    driver = User.objects.create_user(
        username='driver1',
        email='driver@example.com',
        password='driver123',
        first_name='Paul',
        last_name='Martin',
        phone='+237 444 555 666',
        role='driver'
    )
    print(f"✓ Chauffeur créé: {driver.username}")

print("\n✓ Tous les utilisateurs ont été créés avec succès!")
```

Exécutez le script :

```bash
python create_test_users.py
```

## Notes importantes

1. **Sécurité** : Ne jamais insérer de mots de passe en clair dans la base de données
2. **Hash** : Django utilise PBKDF2 avec SHA256 pour hasher les mots de passe
3. **Unique** : Les champs `username` et `email` doivent être uniques
4. **Création recommandée** : Utilisez toujours `createsuperuser` ou `create_user` de Django plutôt que des INSERT SQL directs
5. **Migration** : Si vous modifiez le modèle, exécutez `python manage.py makemigrations` puis `python manage.py migrate`