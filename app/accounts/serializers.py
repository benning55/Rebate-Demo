from rest_framework import serializers
from core.models import User, TargetName, TargetType
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


class ReadTargetNameSerializer(serializers.ModelSerializer):
    create_date = serializers.SerializerMethodField()

    class Meta:
        model = TargetName
        fields = '__all__'

    def get_create_date(self, obj):
        if obj.create_date is None:
            return None
        date = obj.create_date
        return date.strftime("%Y/%m/%d")


class ReadTargetTypeSerializer(serializers.ModelSerializer):
    create_date = serializers.SerializerMethodField()
    start_date = serializers.SerializerMethodField()
    end_date = serializers.SerializerMethodField()

    class Meta:
        model = TargetType
        fields = '__all__'

    def get_create_date(self, obj):
        if obj.create_date is None:
            return None
        date = obj.create_date
        return date.strftime("%Y/%m/%d")

    def get_start_date(self, obj):
        if obj.start_date is None:
            return None
        date = obj.start_date
        return date.strftime("%Y/%m/%d")

    def get_end_date(self, obj):
        if obj.end_date is None:
            return None
        date = obj.end_date
        return date.strftime("%Y/%m/%d")

class TargetSerializer(serializers.Serializer):
    target_name = ReadTargetNameSerializer()
    target_type = ReadTargetTypeSerializer(many=True)


class WriteTargetNameSerializer(serializers.Serializer):
    id = serializers.PrimaryKeyRelatedField(queryset=TargetName.objects.all())


class WriteTargetTypeSerializer(serializers.Serializer):
    id = serializers.PrimaryKeyRelatedField(queryset=TargetType.objects.all(), required=False)
    name = serializers.CharField(max_length=255)
    min_rate = serializers.DecimalField(decimal_places=2, max_digits=20)
    max_rate = serializers.DecimalField(decimal_places=2, max_digits=20, allow_null=True)


class WriteTargetSerializer(serializers.Serializer):
    target_name_id = serializers.PrimaryKeyRelatedField(queryset=TargetName.objects.all())
    target_types = WriteTargetTypeSerializer(many=True)