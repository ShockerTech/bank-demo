import os
from pathlib import Path
from datetime import timedelta
import dj_database_url

# Base directory path
BASE_DIR = Path(__file__).resolve().parent.parent

# Secret Key: Set this as an environment variable for production
SECRET_KEY = os.getenv('SECRET_KEY', 'demo-secret-key-change-in-production')

# Debug mode: Set this to False in production
DEBUG = os.getenv('DEBUG', 'True') == 'True'

# Allowed Hosts: Set this as an environment variable in production
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# Automatically add Railway's domain
if 'RAILWAY_STATIC_URL' in os.environ:
    railway_url = os.environ.get('RAILWAY_STATIC_URL', '')
    railway_domain = railway_url.replace('https://', '').replace('http://', '')
    if railway_domain:
        ALLOWED_HOSTS.append(railway_domain)

# Add Railway domains
ALLOWED_HOSTS.extend([
    '.railway.app',
    'bank-demo.railway.internal'
])

# CSRF Settings for Railway - ADDED NETLIFY DOMAIN
CSRF_TRUSTED_ORIGINS = [
    'https://bank-demo-production.up.railway.app',
    'https://*.railway.app',
    'https://bank-demo01.netlify.app',  # ← ADDED NETLIFY DOMAIN
]

# CORS settings - ADDED NETLIFY DOMAIN
CORS_ALLOWED_ORIGINS = [
    'https://bank-demo-production.up.railway.app',
    'https://*.railway.app',
    'https://bank-demo01.netlify.app',  # ← ADDED NETLIFY DOMAIN
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]

CORS_ALLOW_CREDENTIALS = True

# Installed Apps
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    
    # Local apps
    'apps.accounts',
    'apps.banking',
]

# Middleware configuration
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# URL configuration
ROOT_URLCONF = 'config.urls'

# Templates
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

# WSGI Application
WSGI_APPLICATION = 'config.wsgi.application'

# Database configuration
DATABASE_URL = os.getenv('DATABASE_URL')

if DATABASE_URL:
    DATABASES = {
        'default': dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=600,
            conn_health_checks=True,
        )
    }
    print(f"Database configured with: {DATABASE_URL.split('@')[1] if DATABASE_URL else 'No database'}")
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
    print("Warning: Using SQLite database - DATABASE_URL not set")

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

# JWT Authentication Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}

# Password Validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Localization Settings
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files settings
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files settings
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default auto field
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Security Settings - UPDATED THESE LINES
SECURE_SSL_REDIRECT = False
SESSION_COOKIE_SECURE = True    # CHANGED to True
CSRF_COOKIE_SECURE = True       # CHANGED to True

# Security headers (safe to keep)
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# URL settings to prevent conflicts
APPEND_SLASH = True