# Generated by Django 4.0 on 2023-04-05 09:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0001_initial'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='message',
            unique_together=set(),
        ),
    ]
