# Generated by Django 4.0 on 2023-09-29 16:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0005_remove_conversation_id_remove_message_id_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='conversation',
            old_name='uuid',
            new_name='id',
        ),
        migrations.RenameField(
            model_name='message',
            old_name='uuid',
            new_name='id',
        ),
    ]
