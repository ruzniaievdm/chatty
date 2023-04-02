from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Message(models.Model):
    user = models.ForeignKey(
        User, related_name='messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.user.username

    @classmethod
    def last_messages(cls, offset: int):
        return cls.objects.order_by('-timestamp').all()[:offset]
