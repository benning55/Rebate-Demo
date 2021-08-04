import datetime
from abc import ABC

from django.core.management import BaseCommand, CommandError
# from core.models import User
from django.contrib.auth.models import Group, Permission, ContentType
from core.models import User


class Command(BaseCommand):
    """Django command to add db"""

    def handle(self, *args, **options):
        users = User.objects.all()

        if users.count() < 1:
            self.stdout.write("Create Super User")
            User.objects.create_superuser(
                username='admin',
                password='admin@kmitl'
            )
        else:
            self.stdout.write("Already have super user")
