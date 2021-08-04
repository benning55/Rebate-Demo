from rest_framework import serializers
from core.models import User
from django.contrib.auth.models import Permission
import requests
from core.Types import Types


class UserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    password = serializers.CharField(write_only=True)
    user_permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        exclude = ('groups', )
        depth = 1

    def get_user_permissions(self, obj):
        result = []
        for permission in obj.user_permissions.all():
            result.append(permission.codename)
        return result

# class RegisterSerializer(serializers.ModelSerializer):


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )
    picture = serializers.ImageField()

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'picture')
