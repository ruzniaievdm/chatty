from django.contrib import admin

from .models import Message, Channel

admin.site.register(Message)
admin.site.register(Channel)
# Register your models here.
