import datetime
from abc import ABC

from django.core.management import BaseCommand, CommandError
# from core.models import User
from django.contrib.auth.models import Group, Permission, ContentType
from core.models import User, TargetName, TargetType
from django.utils.timezone import now


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

        target_name = TargetName.objects.all()

        if target_name.count() < 1:
            self.stdout.write("Create default target")
            name = TargetName.objects.create(
                name="Default",
            )

            TargetType.objects.create(
                name="ต่ำ",
                min_rate=100,
                max_rate=200,
                target_name_id=name.id
            )

            TargetType.objects.create(
                name="กลาง",
                min_rate=201,
                max_rate=300,
                target_name_id=name.id
            )

            TargetType.objects.create(
                name="สูง",
                min_rate=301,
                max_rate=None,
                target_name_id=name.id
            )
        else:
            self.stdout.write("Already have target default")
