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
from core.models import User, TargetName, TargetType, Owner, RebateName, RebateType
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


@api_view(['GET', ])
@permission_classes([AllowAny, ])
def get_column(request, *args, **kwargs):
    """Get user information"""
    all_name = dict()
    target_name = get_object_or_404(TargetName.objects.all(), name='Default')
    target_type = TargetType.objects.filter(target_name_id=target_name.id)
    for query in target_type:
        if query.name not in all_name:
            all_name[query.name] = query.name
    data = {
        "title": 'Name',
        "field": 'name',
        "align": "center",
        "lookup": all_name
    }
    return Response({'data': data}, status=status.HTTP_200_OK)


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


class TargetDefaultManage(APIView):
    """
    Manage target default
    """
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        target_name = get_object_or_404(TargetName.objects.all(), name='Default')
        target_type = TargetType.objects.filter(target_name_id=target_name.id).order_by('min_rate')
        target_time_line = TargetTimeline(
            target_name=target_name,
            target_type=target_type
        )
        serializer = serializers.TargetSerializer(target_time_line)
        return Response({'data': serializer.data}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """
        Update or Create or Delete the default target type
        """
        data = request.data
        serializer = serializers.WriteTargetSerializer(data=data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    target_name = serializer.validated_data.get('target_name_id')

                    current_ids = dict()
                    query_target_type = TargetType.objects.filter(target_name_id=target_name.id)
                    for query_id in query_target_type:
                        current_ids[query_id.id] = 0

                    for item in serializer.validated_data.get('target_types'):
                        if item.get('id') is not None:
                            target = item.get('id')
                            target.name = item.get('name', target.name)
                            target.min_rate = item.get('min_rate', target.min_rate)
                            target.max_rate = item.get('max_rate', target.max_rate)
                            target.save()
                            # Check if there are delete item
                            if target.id in current_ids:
                                current_ids.pop(target.id, None)
                        else:
                            TargetType.objects.create(
                                name=item.get('name'),
                                min_rate=item.get('min_rate'),
                                max_rate=item.get('max_rate'),
                                target_name_id=target_name.id
                            )

                    # Delete the left one
                    for id in current_ids:
                        deleted_target = get_object_or_404(TargetType.objects.all(), pk=id)
                        deleted_target.delete()

                    return Response({'data': 'success'}, status=status.HTTP_200_OK)
            except DatabaseError as e:
                transaction.rollback()
                return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'detail': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class RebateDefaultManage(APIView):
    """
    handle all transaction with default rebate
    """
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        owner = get_object_or_404(Owner.objects.all(), name='Default')
        rebate_name = RebateName.objects.filter(owner_id=owner.id)
        serializer = serializers.ReadRebateNameSerializer(rebate_name, many=True)
        return Response({'data': serializer.data}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        data = request.data
        serializer = serializers.WriteRebateNameSerializer(data=data, many=True)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    og_rebate_name = dict()
                    owner = get_object_or_404(Owner.objects.all(), name='Default')
                    for name in RebateName.objects.filter(owner=owner):
                        if name.id not in og_rebate_name:
                            og_rebate_name[name.id] = name.id

                    # check if have rebate name id
                    for item in serializer.validated_data:
                        if item.get('id') is not None:
                            og_rebate_type = dict()
                            rebate_name = item.get('id')

                            # add all og rebate_type to dict
                            for og in RebateType.objects.filter(rebate_name=rebate_name):
                                if og.id not in og_rebate_type:
                                    og_rebate_type[og.id] = og.id

                            # Create or update rebate_type
                            for item2 in item.get('rebate_type'):
                                if item2.get('id') is not None:
                                    rebate_type = item2.get('id')
                                    rebate_type.name = item2.get('name', rebate_type.name)
                                    rebate_type.rate = item2.get('rate', rebate_type.rate)
                                    rebate_type.rebate_name = rebate_name
                                    rebate_type.save()

                                    # check if it have in og if has remove from og
                                    if rebate_type.id in og_rebate_type:
                                        og_rebate_type.pop(rebate_type.id, None)
                                else:
                                    RebateType.objects.create(
                                        name=item2.get('name'),
                                        rate=item2.get('rate'),
                                        rebate_name=rebate_name
                                    )
                            # Delete og that left out
                            for id in og_rebate_type:
                                deleted_target = get_object_or_404(RebateType.objects.all(), pk=id)
                                deleted_target.delete()

                            # check if it have in og rebate name if has remove from og
                            if rebate_name.id in og_rebate_name:
                                og_rebate_name.pop(rebate_name.id, None)
                        else:
                            """" Create new rebate_name and type """
                            owner = get_object_or_404(Owner.objects.all(), name='Default')
                            rebate_name = RebateName.objects.create(
                                name=item.get('name'),
                                owner=owner
                            )

                            # Create new rebate type:
                            for item2 in item.get('rebate_type'):
                                RebateType.objects.create(
                                    name=item2.get('name'),
                                    rate=item2.get('rate'),
                                    rebate_name=rebate_name
                                )

                    # Delete og_rebate_name that left out
                    for id in og_rebate_name:
                        deleted_target = get_object_or_404(RebateName.objects.all(), pk=id)
                        deleted_target.delete()
                    return Response({'data': 'success'}, status=status.HTTP_200_OK)
            except DatabaseError as e:
                transaction.rollback()
                return Response({'data': 'success'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            print(serializer.errors)
            return Response({'data': 'success'}, status=status.HTTP_400_BAD_REQUEST)