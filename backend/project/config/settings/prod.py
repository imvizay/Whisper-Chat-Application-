# prod.py
import dj_database_url
from .base import *

DEBUG = False

ALLOWED_HOSTS = ['*']


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