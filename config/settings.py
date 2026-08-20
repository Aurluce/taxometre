import os
from pathlib import Path
from datetime import timedelta

from dotenv import load_dotenv

load_dotenv()

# ============================================================
# BASE DIRECTORY
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent


# ============================================================
# SECURITY
# ============================================================

SECRET_KEY = os.getenv(
    'SECRET_KEY',
    'django-insecure-taxometre-development-key'
)

DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'

ALLOWED_HOSTS = os.getenv(
    'ALLOWED_HOSTS',
    'localhost,127.0.0.1,10.16.130.107'
).split(',')


# ============================================================
# INSTALLED APPS
# ============================================================

INSTALLED_APPS = [

    # Django
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party
    'rest_framework',
    'corsheaders',
    'rest_framework_simplejwt',
    'drf_yasg',
    'django_filters',
    'import_export',

    # Local apps
    'apps.authentication',
    'apps.vehicles',
    'apps.trips',
    'apps.events',
    'apps.alerts',
    'apps.stats',
    'apps.fleet_management',
]


# ============================================================
# MIDDLEWARE
# ============================================================

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',

    'django.middleware.security.SecurityMiddleware',

    'django.contrib.sessions.middleware.SessionMiddleware',

    'django.middleware.common.CommonMiddleware',

    'django.middleware.csrf.CsrfViewMiddleware',

    'django.contrib.auth.middleware.AuthenticationMiddleware',

    'django.contrib.messages.middleware.MessageMiddleware',

    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


# ============================================================
# URL / WSGI
# ============================================================

ROOT_URLCONF = 'config.urls'

WSGI_APPLICATION = 'config.wsgi.application'


# ============================================================
# TEMPLATES
# ============================================================

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',

        'DIRS': [],

        'APP_DIRS': True,

        'OPTIONS': {
            'context_processors': [

                'django.template.context_processors.debug',

                'django.template.context_processors.request',

                'django.contrib.auth.context_processors.auth',

                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


# ============================================================
# DATABASE - MYSQL XAMPP
# ============================================================

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',

        # Nom de la base créée dans phpMyAdmin
        'NAME': os.getenv(
            'DATABASE_NAME',
            'taxometre_db'
        ),

        # Utilisateur MySQL XAMPP par défaut
        'USER': os.getenv(
            'DATABASE_USER',
            'root'
        ),

        # XAMPP utilise généralement un mot de passe vide
        'PASSWORD': os.getenv(
            'DATABASE_PASSWORD',
            ''
        ),

        # MySQL XAMPP
        'HOST': os.getenv(
            'DATABASE_HOST',
            '127.0.0.1'
        ),

        # Port MySQL XAMPP
        'PORT': os.getenv(
            'DATABASE_PORT',
            '3306'
        ),

        'OPTIONS': {
            'charset': 'utf8mb4',

            'init_command': (
                "SET sql_mode='STRICT_TRANS_TABLES'"
            ),
        },
    }
}


# ============================================================
# CUSTOM USER MODEL
# ============================================================

AUTH_USER_MODEL = 'authentication.User'


# ============================================================
# PASSWORD VALIDATION
# ============================================================

AUTH_PASSWORD_VALIDATORS = [

    {
        'NAME':
        'django.contrib.auth.password_validation.'
        'UserAttributeSimilarityValidator',
    },

    {
        'NAME':
        'django.contrib.auth.password_validation.'
        'MinimumLengthValidator',
    },

    {
        'NAME':
        'django.contrib.auth.password_validation.'
        'CommonPasswordValidator',
    },

    {
        'NAME':
        'django.contrib.auth.password_validation.'
        'NumericPasswordValidator',
    },
]


# ============================================================
# INTERNATIONALIZATION
# ============================================================

LANGUAGE_CODE = 'fr-fr'

TIME_ZONE = 'Africa/Douala'

USE_I18N = True

USE_TZ = True


# ============================================================
# STATIC FILES
# ============================================================

STATIC_URL = 'static/'

STATIC_ROOT = BASE_DIR / 'staticfiles'


# ============================================================
# MEDIA FILES
# ============================================================

MEDIA_URL = 'media/'

MEDIA_ROOT = BASE_DIR / 'media'


# ============================================================
# DEFAULT PRIMARY KEY
# ============================================================

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# ============================================================
# CORS
# ============================================================

CORS_ALLOW_ALL_ORIGINS = True

CORS_ALLOW_CREDENTIALS = True


# ============================================================
# DJANGO REST FRAMEWORK
# ============================================================

REST_FRAMEWORK = {

    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],

    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],

    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',

        'rest_framework.filters.SearchFilter',

        'rest_framework.filters.OrderingFilter',
    ],

    'DEFAULT_PAGINATION_CLASS':
        'rest_framework.pagination.PageNumberPagination',

    'PAGE_SIZE': 20,
}


# ============================================================
# JWT
# ============================================================

SIMPLE_JWT = {

    'ACCESS_TOKEN_LIFETIME':
        timedelta(days=30),

    'REFRESH_TOKEN_LIFETIME':
        timedelta(days=90),

    'ROTATE_REFRESH_TOKENS': False,

    'BLACKLIST_AFTER_ROTATION': True,

    'ALGORITHM': 'HS256',

    'SIGNING_KEY':
        os.getenv('JWT_SECRET', SECRET_KEY),

    'AUTH_HEADER_TYPES': ('Bearer',),
}


# ============================================================
# LOGGING
# ============================================================

LOGGING = {

    'version': 1,

    'disable_existing_loggers': False,

    'formatters': {

        'verbose': {
            'format':
                '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },

    'handlers': {

        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },

    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}