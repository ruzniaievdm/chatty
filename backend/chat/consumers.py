import json

from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth import get_user_model

from .models import Message, Channel

User = get_user_model()


class ChatConsumer(WebsocketConsumer):
    def fetch_messages(self, data):
        messages = Message.last_messages(self.room_group_name, 30)
        content = {
            'command': 'fetch_messages',
            'messages': self.messages_to_json(messages),
        }
        self.send_messages(content)

    def new_message(self, data):
        user = User.objects.get(username='admin')
        channel = Channel.objects.get(name=self.room_group_name)
        message = Message.objects.create(
            sender=user,
            content=data['message'],
            channel=channel,
        )

        content = {
            'command': 'new_message',
            'message': self.message_to_json(message)
        }

        return self.send_message(content)

    commands = {
        'fetch_messages': fetch_messages,
        'new_message': new_message
    }

    def messages_to_json(self, messages):
        result = []
        for message in messages:
            result.append(self.message_to_json(message))
        return result

    def message_to_json(self, message):
        return {
            'sender': message.sender.username,
            'content': message.content,
            'created_at': str(message.created_at),
            'id': str(message.id),
        }

    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_%s" % self.room_name

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data['command']](self, data)

    def send_messages(self, messages):
        self.send(text_data=json.dumps(messages))

    def send_message(self, message):
        self.send(text_data=json.dumps(message))
