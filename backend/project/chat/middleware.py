import jwt
from urllib.parse import parse_qs
from django.conf import settings
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from users.models import AccountHolder
from django.contrib.auth.models import AnonymousUser


@database_sync_to_async
def get_user(user_id):
    try:
        return AccountHolder.objects.get(id=user_id)
    except:
        return AnonymousUser()


class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        print("RAW QUERY STRING:", scope["query_string"])

        query_string = scope.get("query_string", b"").decode()
        query_params = parse_qs(query_string)

        token = query_params.get("token")

        if token:
            token = token[0]
            print("TOKEN FOUND:", token)

            try:
                payload = jwt.decode(
                    token,
                    settings.SECRET_KEY,
                    algorithms=["HS256"]
                )

                print("PAYLOAD:", payload)

                user_id = payload.get("user_id")

                if user_id:
                    user = await get_user(user_id)
                    scope["user"] = user
                else:
                    scope["user"] = AnonymousUser()

            except Exception as e:
                print("JWT ERROR:", str(e))
                scope["user"] = AnonymousUser()
        else:
            print("NO TOKEN FOUND")
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)