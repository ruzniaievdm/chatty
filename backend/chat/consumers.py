from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer
from django.contrib.auth import get_user_model

from chat.models import Conversation, Message
from api.chats.serializers import MessageSerializer

User = get_user_model()


class ChatConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.user = None
        self.conversation_name = None
        self.conversation = None

    def connect(self):
        print("Connected!")
        self.user = self.scope['user']
        if not self.user.is_authenticated:
            return

        self.accept()
        self.conversation_name = f"{self.scope['url_route']['kwargs']['conversation_name']}"
        self.conversation, _ = Conversation.objects.get_or_create(
            name=self.conversation_name
        )
        async_to_sync(self.channel_layer.group_add)(
            self.conversation_name,
            self.channel_name,
        )

        self.send_json(
            {
                "type": "online_user_list",
                "users": [user.username for user in self.conversation.online.all()]
            }
        )

        async_to_sync(self.channel_layer.group_send)(
            self.conversation_name,
            {
                "type": "user_join",
                "user": self.user.username,
            },
        )
        self.conversation.online.add(self.user)

        self.send_json(
            {
                "type": "welcome_message",
                "message": "Hey there! You've successfully connected!",
            }
        )

        self.send_json(
            {
                "type": "last_50_messages",
                "messages": MessageSerializer(self.conversation.last_50_messages, many=True).data,
            }
        )

    def disconnect(self, code):
        if self.user.is_authenticated:
            async_to_sync(self.channel_layer.group_send)(
                self.conversation_name,
                {
                    "type": "user_leave",
                    "user": self.user.username,
                },
            )
            self.conversation.online.remove(self.user)
        return super().disconnect(code)

    def receive_json(self, content, **kwargs):
        message_type = content["type"]

        if message_type == "chat_message":
            message = Message.objects.create(
                from_user=self.user,
                to_user=self.get_receiver(),
                content=content['message'],
                conversation=self.conversation
            )
            async_to_sync(self.channel_layer.group_send)(
                self.conversation_name,
                {
                    "type": "chat_message_echo",
                    "name": self.user.username,
                    "message": MessageSerializer(message).data,
                },
            )
        return super().receive_json(content, **kwargs)

    def chat_message_echo(self, event):
        self.send_json(event)

    def get_receiver(self):
        usernames = self.conversation_name.split('__')

        for username in usernames:
            if username != self.user.username:
                return User.objects.get(username=username)

    def user_join(self, event):
        self.send_json(event)

    def user_leave(self, event):
        self.send_json(event)


# class ChatConsumer(WebsocketConsumer):
#     def fetch_messages(self, data):
#         messages = Message.last_messages(self.room_group_name, 30)
#         content = {
#             'command': 'fetch_messages',
#             'messages': self.messages_to_json(messages),
#         }
#         self.send_messages(content)

#     def new_message(self, data):
#         user = User.objects.get(username='admin')
#         channel = Channel.objects.get(name=self.room_group_name)
#         message = Message.objects.create(
#             sender=user,
#             content=data['message'],
#             channel=channel,
#         )

#         content = {
#             'command': 'new_message',
#             'message': self.message_to_json(message)
#         }

#         return self.send_message(content)

#     commands = {
#         'fetch_messages': fetch_messages,
#         'new_message': new_message
#     }

#     def messages_to_json(self, messages):
#         result = []
#         for message in messages:
#             result.append(self.message_to_json(message))
#         return result

#     def message_to_json(self, message):
#         return {
#             'sender': message.sender.username,
#             'content': message.content,
#             'created_at': str(message.created_at),
#             'id': str(message.id),
#         }

#     def connect(self):
#         print('connect')
#         self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
#         self.room_group_name = "chat_%s" % self.room_name

#         async_to_sync(self.channel_layer.group_add)(
#             self.room_group_name, self.channel_name
#         )
#         self.accept()

#     def disconnect(self, close_code):
#         async_to_sync(self.channel_layer.group_discard)(
#             self.room_group_name, self.channel_name
#         )

#     def receive(self, text_data):
#         data = json.loads(text_data)
#         self.commands[data['command']](self, data)

#     def send_messages(self, messages):
#         self.send(text_data=json.dumps(messages))

#     def send_message(self, message):
#         self.send(text_data=json.dumps(message))
