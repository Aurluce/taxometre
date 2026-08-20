# 🚕 Taxomètre

**Taxomètre** est une plateforme intelligente de gestion et de suivi des véhicules, développée avec **Django REST Framework** et **Next.js**.

La plateforme permet de gérer les véhicules, les trajets, les événements, les alertes, les statistiques et les opérations de flotte, avec une API REST destinée notamment aux applications mobiles et interfaces web.

---

## ✨ Fonctionnalités

### 🚗 Gestion des véhicules

* Enregistrement des véhicules
* Consultation des informations des véhicules
* Suivi de l'état des véhicules
* Gestion des configurations
* Gestion de flotte

### 📍 Suivi des trajets

* Création et gestion des trajets
* Suivi des informations de trajet
* Données GPS
* Distance parcourue
* Statistiques de trajet

### 🚨 Alertes

* Gestion des alertes
* Détection des événements importants
* Gestion des dépassements de limites
* Suivi des événements liés aux véhicules

### 📊 Statistiques

* Statistiques des trajets
* Statistiques des véhicules
* Données de flotte
* Indicateurs de performance

### 👤 Authentification

* Création de comptes utilisateurs
* Authentification JWT
* Gestion des utilisateurs
* Gestion des permissions

### 🌐 API REST

L'ensemble du backend est exposé via une API REST développée avec **Django REST Framework**.

---

## 🏗️ Architecture

```text
taxometre/
│
├── apps/
│   ├── alerts/
│   ├── authentication/
│   ├── events/
│   ├── fleet_management/
│   ├── stats/
│   ├── trips/
│   └── vehicles/
│
├── config/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── frontend/
│   └── Next.js application
│
├── media/
├── static/
├── staticfiles/
│
├── manage.py
├── requirements.txt
├── .gitignore
└── README.md
```

---

## 🛠️ Technologies utilisées

### Backend

* Python
* Django 4.2
* Django REST Framework
* Simple JWT
* Django CORS Headers
* Django Filters
* drf-yasg
* django-import-export
* Pillow

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Base de données

En développement :

* MySQL
* XAMPP

Pour le déploiement cloud, PostgreSQL peut être utilisé.

---

## ⚙️ Installation

### 1. Cloner le projet

```bash
git clone https://github.com/Aurluce/taxometre.git
cd taxometre
```

---

### 2. Créer un environnement virtuel

Linux/macOS :

```bash
python3 -m venv venv
source venv/bin/activate
```

Windows :

```bash
python -m venv venv
venv\Scripts\activate
```

---

### 3. Installer les dépendances

```bash
pip install -r requirements.txt
```

---

## 🔐 Configuration de l'environnement

Créer un fichier `.env` à la racine du projet :

```env
SECRET_KEY=your-secret-key
DEBUG=True

ALLOWED_HOSTS=localhost,127.0.0.1

DATABASE_NAME=taxometre_db
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
```

> ⚠️ Le fichier `.env` ne doit jamais être envoyé sur GitHub.

---

## 🗄️ Configuration MySQL

Le développement local utilise MySQL.

Créer une base de données :

```sql
CREATE DATABASE taxometre_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Puis vérifier la configuration dans :

```text
config/settings.py
```

---

## 🧩 Migrations

Après avoir configuré la base de données :

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## 👤 Créer un administrateur

```bash
python manage.py createsuperuser
```

Puis suivre les instructions.

---

## 🚀 Lancer le serveur Django

```bash
python manage.py runserver
```

Le backend sera accessible à :

```text
http://127.0.0.1:8000/
```

---

## 📚 Documentation de l'API

Le projet utilise **drf-yasg** pour générer la documentation OpenAPI/Swagger.

Après le démarrage du serveur, la documentation peut être accessible via les routes configurées dans :

```text
config/urls.py
```

---

## 🖥️ Frontend Next.js

Le frontend se trouve dans :

```text
frontend/
```

Installer les dépendances :

```bash
cd frontend
npm install
```

Lancer le serveur de développement :

```bash
npm run dev
```

Le frontend sera généralement accessible sur :

```text
http://localhost:3000
```

---

## 🔗 Communication Frontend / Backend

Le frontend Next.js communique avec l'API Django REST.

Exemple :

```text
Next.js
   │
   │ HTTP / REST
   ▼
Django REST Framework
   │
   ▼
MySQL / PostgreSQL
```

L'URL de l'API doit être configurée dans les variables d'environnement du frontend.

---

## 🔑 Authentification JWT

L'API utilise **JSON Web Tokens (JWT)** pour l'authentification.

Le principe est :

```text
Client
   │
   │ Login
   ▼
Django API
   │
   │ Access Token
   ▼
Client
   │
   │ Authorization: Bearer <token>
   ▼
API protégée
```

Les endpoints d'authentification sont définis dans :

```text
apps/authentication/
```

---

## 📱 Applications clientes

L'API Taxomètre est conçue pour pouvoir être consommée par plusieurs clients :

```text
                    ┌──────────────┐
                    │ Django API   │
                    └──────┬───────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
          Next.js        Flutter       IoT
          Web App       Mobile App    Devices
```

Cette architecture permet notamment d'intégrer des dispositifs de suivi GPS et des équipements embarqués.

---

## 🌍 Déploiement

Le backend peut être déployé sur une plateforme cloud supportant Python/Django.

Configuration de production recommandée :

```env
DEBUG=False
SECRET_KEY=<strong-secret-key>
ALLOWED_HOSTS=<production-domain>
```

La base de données de production peut utiliser PostgreSQL.

---

## 🔒 Sécurité

Avant un déploiement en production :

* Désactiver `DEBUG`
* Utiliser une vraie `SECRET_KEY`
* Configurer `ALLOWED_HOSTS`
* Restreindre les origines CORS
* Ne jamais publier `.env`
* Utiliser HTTPS
* Protéger les endpoints sensibles
* Configurer correctement les permissions DRF
* Utiliser une base de données de production sécurisée

---

## 🧪 Tests

Les tests peuvent être exécutés avec :

```bash
python manage.py test
```

---

## 📌 État du projet

🚧 **Projet en développement**

Les fonctionnalités sont progressivement développées et intégrées.

---

## 👨‍💻 Auteur

**Aurluce Feudjio**

Full-Stack Software Developer

Technologies principales :

```text
Python
Django
Django REST Framework
React
Next.js
TypeScript
Flutter
SQL
```

---

## 📄 Licence

Ce projet est actuellement destiné à un usage de développement et de démonstration.

La licence pourra être définie ultérieurement.
