from collections import namedtuple

from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import JSONParser, FileUploadParser, MultiPartParser
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.template.loader import render_to_string
from django.http import HttpResponse
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth.models import Permission, ContentType
from django.db.models import Q
from django.core.files.base import ContentFile
import tempfile
from weasyprint import HTML
from accounts import serializers
from core.models import User, TargetName, TargetType
from rest_framework.views import APIView
from django.db import transaction, DatabaseError


TargetTimeline = namedtuple('Timeline', ('target_name', 'target_type'))

@api_view(['GET', ])
@permission_classes([IsAuthenticated, ])
def get_user(request, *args, **kwargs):
    """Get user information"""
    user = request.user
    query = User.objects.get(pk=user.id)
    serializer = serializers.UserSerializer(query)
    return Response({'data': serializer.data}, status=status.HTTP_200_OK)


@api_view(['POST', ])
@permission_classes([AllowAny, ])
@parser_classes([MultiPartParser])
def register(request, format=None):
    """
    Register
    """
    if request.method == 'POST':
        data = request.data
        serializer = serializers.UserRegisterSerializer(data=data, many=False)
        if serializer.is_valid():
            new_user = User.objects.create(
                username=data['username'],
                email=data['email'],
                picture=data['picture']
            )
            new_user.set_password(data['password'])
            new_user.save()
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        else:
            print(serializer.errors['email'])
        return Response({'data': 'benning'}, status=status.HTTP_200_OK)


@api_view(['GET', ])
@permission_classes([AllowAny, ])
def get_target_default(request, format=None):
    """
    Register
    """
    if request.method == 'GET':
        target_name = get_object_or_404(TargetName.objects.all(), name='Default')
        target_type = TargetType.objects.filter(target_name_id=target_name.id).order_by('min_rate')
        target_time_line = TargetTimeline(
            target_name=target_name,
            target_type=target_type
        )
        serializer = serializers.TargetSerializer(target_time_line)
        return Response({'data': serializer.data}, status=status.HTTP_200_OK)


# class TargetManage(APIView):
#     """
#     Access target model
#     """
#
#     def get(self, request, *args, **kwargs):
#         """Get all target"""
#         pk = kwargs.get("pk")
#         start_date = request.query_params.get('start_date', None)
#         end_date = request.query_params.get('end_date', None)
#         name = request.query_params.get('name', None)
#         if name is None:
#             return Response({'detail': 'error'}, status=status.HTTP_400_BAD_REQUEST)
#         target_name = get_object_or_404(TargetName.objects.)
#         if pk is None:
