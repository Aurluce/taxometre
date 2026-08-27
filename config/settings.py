import os
from pathlib import Path
from datetime import timedelta

from dotenv import load_dotenv
import dj_database_url


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()


# ============================================================
# BASE DIRECTORY
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent


# ============================================================
# SECURITY
# ============================================================

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "django-insecure-taxometre-development-key"
)

DEBUG = os.getenv("DEBUG", "False").lower() == "true"


# ============================================================
# ALLOWED HOSTS
# ============================================================

ALLOWED_HOSTS = [
    host.strip()
    for host in os.getenv(
        "ALLOWED_HOSTS",
        "localhost,127.0.0.1"
    ).split(",")
    if host.strip()
]


# ============================================================
# APPLICATIONS
# ============================================================

INSTALLED_APPS = [

    # --------------------------------------------------------
    # Django
    # --------------------------------------------------------

    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # --------------------------------------------------------
    # Third-party
    # --------------------------------------------------------

    "rest_framework",
    "corsheaders",
    "rest_framework_simplejwt",
    "drf_yasg",
    "django_filters",
    "import_export",

    # --------------------------------------------------------
    # Local applications
    # --------------------------------------------------------

    "apps.authentication",
    "apps.vehicles",
    "apps.trips",
    "apps.events",
    "apps.alerts",
    "apps.stats",
    "apps.fleet_management",
]


# ============================================================
# MIDDLEWARE
# ============================================================

MIDDLEWARE = [

    "corsheaders.middleware.CorsMiddleware",

    "django.middleware.security.SecurityMiddleware",

    # WhiteNoise permet de servir les fichiers statiques
    # directement depuis Render.
    "whitenoise.middleware.WhiteNoiseMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",

    "django.middleware.common.CommonMiddleware",

    "django.middleware.csrf.CsrfViewMiddleware",

    "django.contrib.auth.middleware.AuthenticationMiddleware",

    "django.contrib.messages.middleware.MessageMiddleware",

    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# ============================================================
# URL / WSGI
# ============================================================

ROOT_URLCONF = "config.urls"

WSGI_APPLICATION = "config.wsgi.application"


# ============================================================
# TEMPLATES
# ============================================================

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",

        "DIRS": [],

        "APP_DIRS": True,

        "OPTIONS": {
            "context_processors": [

                "django.template.context_processors.debug",

                "django.template.context_processors.request",

                "django.contrib.auth.context_processors.auth",

                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


# ============================================================
# DATABASE
# ============================================================
#
# LOCAL:
#   Si DATABASE_URL n'existe pas, Django utilise MySQL/XAMPP.
#
# RENDER:
#   Si DATABASE_URL existe, Django utilise PostgreSQL.
#
# ============================================================

DATABASE_URL = os.getenv("DATABASE_URL")


if DATABASE_URL:

    # --------------------------------------------------------
    # Production - PostgreSQL / Render
    # --------------------------------------------------------

    DATABASES = {
        "default": dj_database_url.parse(
            DATABASE_URL,
            conn_max_age=600,
            ssl_require=True,
        )
    }

else:

    # --------------------------------------------------------
    # Développement local - MySQL / XAMPP
    # --------------------------------------------------------

    DATABASES = {
        "default": {

            "ENGINE": "django.db.backends.mysql",

            "NAME": os.getenv(
                "DATABASE_NAME",
                "taxometre_db"
            ),

            "USER": os.getenv(
                "DATABASE_USER",
                "root"
            ),

            "PASSWORD": os.getenv(
                "DATABASE_PASSWORD",
                ""
            ),

            "HOST": os.getenv(
                "DATABASE_HOST",
                "127.0.0.1"
            ),

            "PORT": os.getenv(
                "DATABASE_PORT",
                "3306"
            ),

            "OPTIONS": {
                "charset": "utf8mb4",

                "init_command": (
                    "SET sql_mode='STRICT_TRANS_TABLES'"
                ),
            },
        }
    }


# ============================================================
# CUSTOM USER MODEL
# ============================================================

AUTH_USER_MODEL = "authentication.User"


# ============================================================
# PASSWORD VALIDATION
# ============================================================

AUTH_PASSWORD_VALIDATORS = [

    {
        "NAME":
            "django.contrib.auth.password_validation."
            "UserAttributeSimilarityValidator",
    },

    {
        "NAME":
            "django.contrib.auth.password_validation."
            "MinimumLengthValidator",
    },

    {
        "NAME":
            "django.contrib.auth.password_validation."
            "CommonPasswordValidator",
    },

    {
        "NAME":
            "django.contrib.auth.password_validation."
            "NumericPasswordValidator",
    },
]


# ============================================================
# INTERNATIONALIZATION
# ============================================================

LANGUAGE_CODE = "fr-fr"

TIME_ZONE = "Africa/Douala"

USE_I18N = True

USE_TZ = True


# ============================================================
# STATIC FILES
# ============================================================

STATIC_URL = "/static/"

STATIC_ROOT = BASE_DIR / "staticfiles"


# WhiteNoise : compression et cache des fichiers statiques
STATICFILES_STORAGE = (
    "whitenoise.storage.CompressedManifestStaticFilesStorage"
)


# ============================================================
# MEDIA FILES
# ============================================================

MEDIA_URL = "/media/"

MEDIA_ROOT = BASE_DIR / "media"


# ============================================================
# DEFAULT PRIMARY KEY
# ============================================================

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# ============================================================
# CORS
# ============================================================
#
# TEMPORAIREMENT ouvert pour faciliter le développement.
#
# Plus tard, il faudra remplacer CORS_ALLOW_ALL_ORIGINS
# par une liste précise des domaines autorisés.
#
# ============================================================

CORS_ALLOW_ALL_ORIGINS = True

CORS_ALLOW_CREDENTIALS = True


# ============================================================
# DJANGO REST FRAMEWORK
# ============================================================

REST_FRAMEWORK = {

    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],

    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],

    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",

        "rest_framework.filters.SearchFilter",

        "rest_framework.filters.OrderingFilter",
    ],

    "DEFAULT_PAGINATION_CLASS":
        "rest_framework.pagination.PageNumberPagination",

    "PAGE_SIZE": 20,
}


# ============================================================
# JWT
# ============================================================

JWT_SECRET = os.getenv(
    "JWT_SECRET",
    SECRET_KEY
)


SIMPLE_JWT = {

    "ACCESS_TOKEN_LIFETIME":
        timedelta(days=30),

    "REFRESH_TOKEN_LIFETIME":
        timedelta(days=90),

    "ROTATE_REFRESH_TOKENS": False,

    "BLACKLIST_AFTER_ROTATION": True,

    "ALGORITHM": "HS256",

    "SIGNING_KEY": JWT_SECRET,

    "AUTH_HEADER_TYPES": (
        "Bearer",
    ),
}


# ============================================================
# SECURITY SETTINGS - PRODUCTION
# ============================================================

if not DEBUG:

    # HTTPS / Render
    SECURE_PROXY_SSL_HEADER = (
        "HTTP_X_FORWARDED_PROTO",
        "https",
    )

    SECURE_SSL_REDIRECT = True

    SESSION_COOKIE_SECURE = True

    CSRF_COOKIE_SECURE = True

    SECURE_HSTS_SECONDS = 31536000

    SECURE_HSTS_INCLUDE_SUBDOMAINS = True

    SECURE_HSTS_PRELOAD = True


# ============================================================
# CSRF TRUSTED ORIGINS
# ============================================================

CSRF_TRUSTED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CSRF_TRUSTED_ORIGINS",
        ""
    ).split(",")
    if origin.strip()
]


# ============================================================
# LOGGING
# ============================================================

LOGGING = {

    "version": 1,

    "disable_existing_loggers": False,

    "formatters": {

        "verbose": {
            "format":
                "{levelname} {asctime} {module} {message}",

            "style": "{",
        },
    },

    "handlers": {

        "console": {
            "class": "logging.StreamHandler",

            "formatter": "verbose",
        },
    },

    "root": {

        "handlers": [
            "console"
        ],

        "level": "INFO",
    },
}
