from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Channel(models.Model):
    name = models.CharField(max_length=255)
    members = models.ManyToManyField(User, related_name='channels')

    def __str__(self) -> str:
        return self.name


class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    channel = models.ForeignKey(
        Channel, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f'From {self.sender.username} to {self.channel}'

    @classmethod
    def last_messages(cls, channel, offset: int):
        return cls.objects.filter(channel__name=channel).order_by('-created_at').all()[:offset]
