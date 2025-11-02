# sahasi/settings.py
from pathlib import Path
from decouple import config, Csv
from datetime import timedelta
import os

BASE_DIR = Path(__file__).resolve().parent.parent


SECRET_KEY = config("SECRET_KEY")
DEBUG = config("DEBUG", default=False, cast=bool)
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django_extensions',
    # Django
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party
    "rest_framework",
    "rest_framework_simplejwt.token_blacklist",  # for logout/blacklist
    "corsheaders",
    "channels",

    # Local apps
    "users",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "sahasi.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {"context_processors": [
            "django.template.context_processors.debug",
            "django.template.context_processors.request",
            "django.contrib.auth.context_processors.auth",
            "django.contrib.messages.context_processors.messages",
        ]},
    },
]

WSGI_APPLICATION = "sahasi.wsgi.application"
ASGI_APPLICATION = "sahasi.asgi.application"

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer"
    }
}


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": config("DB_NAME"),
        "USER": config("DB_USER"),
        "PASSWORD": config("DB_PASSWORD"),
        "HOST": config("DB_HOST", default="localhost"),
        "PORT": config("DB_PORT", default=5432, cast=int),
    }
}

if os.environ.get("DOCKER_ENV", False):
    DATABASES["default"]["HOST"] = "db" 
AUTH_USER_MODEL = "users.User"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=6),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=14),
    "AUTH_HEADER_TYPES": ("Bearer",),
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": True,
}

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:19006",
    "http://127.0.0.1:19006",
    "exp://koevycm-anonymous-8081.exp.direct",  # <-- add your tunnel URL
]


CORS_ALLOW_ALL_ORIGINS = True  # for testing (disable in production)


MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# Email (SMTP)
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_USE_TLS = True
EMAIL_PORT = 587
EMAIL_HOST_USER = "sahasi.alerts@gmail.com"
EMAIL_HOST_PASSWORD = "YOUR_APP_PASSWORD"  # Use App Password (recommended)

# Twilio (SMS)
# Twilio (SMS + WhatsApp)
TWILIO_ACCOUNT_SID = config("TWILIO_ACCOUNT_SID", default="")
TWILIO_AUTH_TOKEN = config("TWILIO_AUTH_TOKEN", default="")
TWILIO_PHONE_NUMBER = config("TWILIO_PHONE_NUMBER", default="")
TWILIO_WHATSAPP_NUMBER = config("TWILIO_WHATSAPP_NUMBER", default="whatsapp:+14155238886")
TWILIO_WHATSAPP_TEMPLATE_SID = config("TWILIO_WHATSAPP_TEMPLATE_SID", default="")


# Firebase (Push Notifications)
FCM_SERVER_KEY = config("FCM_SERVER_KEY", default="")

# Gmail API (OAuth2)
GMAIL_CLIENT_ID = config("GMAIL_CLIENT_ID", default="")
GMAIL_CLIENT_SECRET = config("GMAIL_CLIENT_SECRET", default="")
GMAIL_REFRESH_TOKEN = config("GMAIL_REFRESH_TOKEN", default="")
GMAIL_FROM_EMAIL = config("GMAIL_FROM_EMAIL", default="")

# (Optional: for frontend Google Sign-In)
GOOGLE_OAUTH_CLIENT_ID = config("GOOGLE_OAUTH_CLIENT_ID", default="")

# --- Fast2SMS ---
FAST2SMS_API_KEY = "73VNE1OjsHkS6zl4bdvfQpcDngKPAt0exqYoCWuw82GXi5Fah9QaCKtzxSNA2iO891f0TLZM4Jg6BWoG"

# --- Celery / Redis ---
CELERY_BROKER_URL = "redis://127.0.0.1:6379/0"
CELERY_RESULT_BACKEND = "redis://127.0.0.1:6379/0"
CELERY_TASK_ALWAYS_EAGER = False# ensure tasks run async via worker

TWOFACTOR_API_KEY = config("TWOFACTOR_API_KEY", default="")