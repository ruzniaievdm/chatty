# from rest_framework.generic import generic
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.viewsets import GenericViewSet

from chat.models import Conversation
from .serializers import ConversationSerializer


class ConversationViewSet(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    serializer_class = ConversationSerializer
    queryset = Conversation.objects.none()
    lookup_field = "name"

    def get_queryset(self):
        queryset = Conversation.objects.filter(
            name__contains=f'__{self.request.user.username}'
        )
        return queryset

    def get_serializer_context(self):
        return {
            'request': self.request,
            'user': self.request.user
        }
