# Guide de Test - TaxoMètre

Ce guide explique comment tester la connexion entre le backend Django et le frontend Next.js.

## Prérequis

1. Python 3.8+ installé
2. Node.js 18+ installé
3. PostgreSQL ou SQLite configuré

## 1. Configuration du Backend Django

### Étape 1.1 : Appliquer les migrations

```bash
cd /home/aurluce/Bureau/taxometre
python manage.py makemigrations
python manage.py migrate
```

### Étape 1.2 : Créer un superutilisateur

```bash
python manage.py createsuperuser
```

Suivez les instructions pour créer un compte administrateur.

### Étape 1.3 : Démarrer le serveur Django

```bash
python manage.py runserver
```

Le serveur Django devrait démarrer sur `http://localhost:8000`

### Étape 1.4 : Vérifier l'API

Ouvrez votre navigateur et accédez à :
- Documentation Swagger : http://localhost:8000/swagger/
- API Users : http://localhost:8000/api/users/
- API Vehicles : http://localhost:8000/api/vehicles/
- API Alerts : http://localhost:8000/api/alerts/
- API Trips : http://localhost:8000/api/trips/

## 2. Configuration du Frontend Next.js

### Étape 2.1 : Installer les dépendances

```bash
cd /home/aurluce/Bureau/taxometre/frontend
npm install
```

### Étape 2.2 : Configurer les variables d'environnement

Le fichier `.env.local` a été créé avec la configuration suivante :
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Si votre backend Django n'est pas sur le port 8000, modifiez ce fichier en conséquence.

### Étape 2.3 : Démarrer le serveur Next.js

```bash
npm run dev
```

Le frontend devrait démarrer sur `http://localhost:3000`

## 3. Tests de Fonctionnalités

### Test 3.1 : Authentification

1. Accédez à http://localhost:3000/login
2. Connectez-vous avec les identifiants du superutilisateur créé précédemment
3. Vous devriez être redirigé vers le tableau de bord

**Résultat attendu :** 
- Le token JWT est stocké dans localStorage
- L'utilisateur est connecté
- Redirection vers /dashboard

### Test 3.2 : Tableau de bord

1. Après connexion, vérifiez que le tableau de bord affiche :
   - Le nombre total de véhicules
   - Le nombre de trajets actifs
   - Le nombre d'alertes critiques
   - La liste des véhicules récents

**Résultat attendu :**
- Les statistiques sont chargées depuis l'API
- Les véhicules récents sont affichés

### Test 3.3 : Page Véhicules

1. Cliquez sur "Véhicules" dans le menu latéral
2. Vérifiez que la liste des véhicules s'affiche
3. Testez le filtre par statut

**Résultat attendu :**
- Les véhicules sont chargés depuis `/api/vehicles/`
- Le filtrage fonctionne correctement

### Test 3.4 : Page Alertes

1. Cliquez sur "Alertes" dans le menu latéral
2. Vérifiez l'affichage des alertes
3. Testez les filtres (Toutes, Non lues, Critiques)
4. Testez les actions (Marquer comme lu, Résoudre)

**Résultat attendu :**
- Les alertes sont chargées depuis `/api/alerts/`
- Les filtres fonctionnent
- Les actions mettent à jour les alertes via l'API

### Test 3.5 : Page Utilisateurs

1. Cliquez sur "Utilisateurs" dans le menu latéral
2. Vérifiez l'affichage de la liste des utilisateurs

**Résultat attendu :**
- Les utilisateurs sont chargés depuis `/api/users/`

## 4. Vérification de la Base de Données

### Via Django Admin

1. Accédez à http://localhost:8000/admin
2. Connectez-vous avec le superutilisateur
3. Vérifiez que vous pouvez :
   - Voir les véhicules
   - Voir les alertes
   - Voir les trajets
   - Voir les utilisateurs

### Créer des données de test

```bash
# Ouvrir le shell Django
python manage.py shell

# Créer un véhicule de test
from apps.vehicles.models import Vehicle
v = Vehicle.objects.create(
    registration_number='TEST-123',
    brand='Toyota',
    model='Corolla',
    year=2022,
    status='active',
    owner_id=1  # ID du superutilisateur
)
```

## 5. Dépannage

### Problème : Erreur CORS

Si vous rencontrez des erreurs CORS, vérifiez que `django-cors-headers` est installé et configuré dans `config/settings.py` :

```python
INSTALLED_APPS = [
    ...
    'corsheaders',
    ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

### Problème : Token expiré

Le token JWT expire après un certain temps. Le système devrait automatiquement le renouveler. Si ce n'est pas le cas, déconnectez-vous et reconnectez-vous.

### Problème : Données non affichées

1. Vérifiez que le serveur Django est en cours d'exécution
2. Vérifiez les logs de la console du navigateur pour les erreurs
3. Vérifiez les logs du serveur Django pour les erreurs API
4. Assurez-vous que la base de données contient des données

## 6. Structure des Fichiers Créés/Modifiés

### Backend (Django)
- `apps/alerts/serializers.py` - Serializers pour les alertes
- `apps/alerts/views.py` - ViewSet pour les alertes
- `apps/alerts/urls.py` - URLs pour les alertes
- `apps/trips/serializers.py` - Serializers pour les trajets
- `apps/trips/views.py` - ViewSet pour les trajets
- `apps/trips/urls.py` - URLs pour les trajets
- `config/urls.py` - Configuration principale des URLs (modifiée)

### Frontend (Next.js)
- `frontend/lib/api.ts` - Client API centralisé
- `frontend/contexts/AuthContext.tsx` - Context pour l'authentification
- `frontend/hooks/useApi.ts` - Hooks personnalisés pour les appels API
- `frontend/.env.local` - Variables d'environnement
- `frontend/app/layout.tsx` - Layout racine avec AuthProvider
- `frontend/app/(auth)/login/page.tsx` - Page de login connectée
- `frontend/app/(dashboard)/layout.tsx` - Layout dashboard avec protection
- `frontend/app/(dashboard)/dashboard/page.tsx` - Dashboard connecté
- `frontend/app/(dashboard)/vehicles/page.tsx` - Page véhicules connectée
- `frontend/app/(dashboard)/alerts/page.tsx` - Page alertes connectée

## 7. Points de Contrôle

- [ ] Backend Django démarre sans erreur
- [ ] Migrations appliquées avec succès
- [ ] Superutilisateur créé
- [ ] API Swagger accessible
- [ ] Frontend Next.js démarre sans erreur
- [ ] Page de login fonctionne
- [ ] Connexion réussie et redirection vers dashboard
- [ ] Dashboard affiche les statistiques
- [ ] Page véhicules affiche la liste
- [ ] Page alertes affiche la liste
- [ ] Filtres fonctionnent
- [ ] Actions sur les alertes fonctionnent

## 8. Prochaines Étapes

Une fois les tests de base réussis, vous pouvez :

1. Ajouter la pagination aux listes
2. Implémenter la recherche
3. Ajouter la gestion des erreurs plus détaillée
4. Ajouter des indicateurs de chargement
5. Implémenter le refresh automatique du token
6. Ajouter des tests unitaires et d'intégration