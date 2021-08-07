import datetime
from abc import ABC

from django.core.management import BaseCommand, CommandError
# from core.models import User
from django.contrib.auth.models import Group, Permission, ContentType
from core.models import User, TargetName, TargetType, RebateName, RebateType, Owner
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

        if Owner.objects.count() < 1:
            self.stdout.write("Create default data")
            owner = Owner.objects.create(
                name="Default"
            )

            target_name = TargetName.objects.create(
                owner=owner,
                name="default"
            )

            TargetType.objects.create(
                name="ต่ำ",
                min_rate=100,
                max_rate=200,
                target_name_id=target_name.id
            )

            TargetType.objects.create(
                name="กลาง",
                min_rate=201,
                max_rate=300,
                target_name_id=target_name.id
            )

            TargetType.objects.create(
                name="สูง",
                min_rate=301,
                max_rate=None,
                target_name_id=target_name.id
            )

            rebate_name1 = RebateName.objects.create(
                name='Bonus รายลูกค้า',
                owner_id=owner.id
            )

            rebate_name2 = RebateName.objects.create(
                name='Bonus ยอดขาย',
                owner_id=owner.id
            )

            RebateType.objects.create(
                rebate_name_id=rebate_name1.id,
                name='ต่ำ',
                rate=200
            )

            RebateType.objects.create(
                rebate_name_id=rebate_name2.id,
                name='ต่ำ',
                rate=200
            )

            RebateType.objects.create(
                rebate_name_id=rebate_name1.id,
                name='สูง',
                rate=400
            )

            RebateType.objects.create(
                rebate_name_id=rebate_name2.id,
                name='สูง',
                rate=400
            )
        else:
            self.stdout.write("Already have default")

