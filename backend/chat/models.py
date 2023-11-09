import uuid
from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Conversation(models.Model):
    id = models.CharField(default=uuid.uuid4, editable=False,
                          primary_key=True, max_length=36)
    name = models.CharField(max_length=128)
    online = models.ManyToManyField(to=User, blank=True)

    def get_online_count(self):
        return self.online.count()

    def join(self, user):
        self.online.add(user)
        self.save()

    def leave(self, user):
        self.online.remove(user)
        self.save()

    def __str__(self):
        return f"{self.name} ({self.get_online_count()})"

    @property
    def last_50_messages(self):
        return self.messages.all().order_by("timestamp")[:50]


class Message(models.Model):
    id = models.CharField(default=uuid.uuid4, editable=False,
                          primary_key=True, max_length=36)
    conversation = models.ForeignKey(
        Conversation, on_delete=models.CASCADE, related_name="messages", default=""
    )
    from_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="messages_from_me", default=""
    )
    to_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="messages_to_me", default=""
    )
    content = models.CharField(max_length=512)
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"From {self.from_user.username} to {self.to_user.username}: {self.content} [{self.timestamp}]"
