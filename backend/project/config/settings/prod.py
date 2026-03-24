# prod.py
import dj_database_url
from .base import *

DEBUG = False

ALLOWED_HOSTS = ['https://whisper-7bux.onrender.com']

CORS_ALLOWED_ORIGINS = [
    'https://whisper-chat-application.onrender.com'
]

DATABASES = {
    "default": dj_database_url.parse(os.getenv("DATABASE_URL"))
}

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [os.getenv("REDIS_URL")],
        },
    },
}