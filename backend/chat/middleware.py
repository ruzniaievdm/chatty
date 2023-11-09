from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from rest_framework.authtoken.models import Token
from urllib.parse import parse_qs


@database_sync_to_async
def get_user(token_key):
    try:
        token = Token.objects.get(key=token_key)
        return token.user
    except Token.DoesNotExists:
        return AnonymousUser()


class TokenAuthMiddleware(BaseMiddleware):
    """Simple token based authentication.

    Clients should authenticate by passing the token key in the query parameters.
    For example:
        b'token=8ec29747410fc64cb332658fd4b35c2c89246498'
    """

    def __init__(self, inner):
        super().__init__(inner)

    async def __call__(self, scope, receive, send):
        query_params = parse_qs(scope["query_string"].decode())
        token_key = query_params["token"][0]
        scope['user'] = AnonymousUser() if token_key is None else await get_user(token_key)
        return await super().__call__(scope, receive, send)
