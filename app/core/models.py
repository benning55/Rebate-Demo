import datetime
import uuid
import os
from decimal import Decimal
from datetime import date
from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.models import BaseUserManager
from core.Types import Types
from simple_history.models import HistoricalRecords
from django.contrib.auth.models import Permission
from django.utils.timezone import now
from django.utils import timezone
from django.contrib.auth.models import Group


#
# def profile_image(instance, filename):
#     """Generate file"""
#     ext = filename.split('.')[-1]
#     filename = f'{uuid.uuid4()}.{ext}'
#     return os.path.join('upload/profile/', filename)


class Position(models.Model):
    name = models.CharField(max_length=255)
    commission_rate = models.DecimalField(max_digits=20, decimal_places=2, default=Decimal(0.00))
    isActive = models.BooleanField(default=True)
    history = HistoricalRecords()

    def __str__(self):
        return str(self.name)

    class Meta:
        verbose_name_plural = "Position & Commission"


class UserManager(BaseUserManager):
    """Manager for user profiles"""

    def create_user(self, username, password=None):
        """Create new user profile"""
        if not username:
            raise ValueError('User must have a username')

        user = self.model(username=username)

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, username, password=None):
        """Create and save a new superuser with given details"""
        user = self.create_user(
            username=username,
            password=password,
        )
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)

        return user.username


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model"""
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=255, unique=True)
    tel = models.CharField(max_length=12, blank=True)
    first_name = models.CharField(max_length=255, blank=True)
    last_name = models.CharField(max_length=255, blank=True)
    address = models.TextField(max_length=1024, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    history = HistoricalRecords()

    USERNAME_FIELD = 'username'

    objects = UserManager()

    def __str__(self):
        return f'{self.first_name} {self.last_name} as {self.username}'

    def get_group_permissions(self, obj=None):
        return True

    class Meta:
        verbose_name_plural = "Users"


class Owner(models.Model):
    """Create owner of rebate"""
    name = models.CharField(max_length=255)
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)
    create_date = models.DateField(auto_now=True)

    def __str__(self):
        return self.name


class RebateName(models.Model):
    """Name of the rebate"""
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(Owner, on_delete=models.CASCADE)
    create_date = models.DateField(auto_now=True)

    def __str__(self):
        return self.name


class RebateType(models.Model):
    """Rebate Type"""
    rebate_name = models.ForeignKey(RebateName, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    rate = models.DecimalField(decimal_places=2, max_digits=20, default=0)
    create_date = models.DateField(auto_now=True)

    def __str__(self):
        return f'{self.name} for {self.rebate_name.name}'


class TargetName(models.Model):
    """Create sell target"""
    name = models.CharField(max_length=255, unique=True)
    create_date = models.DateField(auto_now=True)

    def __str__(self):
        return self.name


class TargetType(models.Model):
    """Create sell target type ex. high low middle"""
    target_name = models.ForeignKey(TargetName, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    min_rate = models.DecimalField(decimal_places=2, max_digits=20, default=0)
    max_rate = models.DecimalField(decimal_places=2, max_digits=20, null=True)
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)
    create_date = models.DateField(auto_now=True)

    def __str__(self):
        return f'{self.name} for {self.target_name.name}'


