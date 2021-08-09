from collections import namedtuple
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import JSONParser, FileUploadParser, MultiPartParser
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated
from accounts import serializers
from core.models import User, TargetName, TargetType, Owner, RebateName, RebateType
from rest_framework.views import APIView
from django.db import transaction, DatabaseError
from datetime import datetime


TargetTimeline = namedtuple('Timeline', ('target_name', 'target_type'))
CustomTemplate = namedtuple('Timeline2', ('target', 'rebate'))
Range = namedtuple('Range', ['start', 'end'])

def get_all_type_rebate():
    all_name = dict()
    owner = get_object_or_404(Owner.objects.all(), name='Default')
    target_name = get_object_or_404(TargetName.objects.all(), owner=owner)
    target_type = TargetType.objects.filter(target_name_id=target_name.id)
    for query in target_type:
        if query.name not in all_name:
            all_name[query.name] = query.name
    return all_name

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
def get_owner(request, *args, **kwargs):
    """Get user information"""
    owners = Owner.objects.all().distinct('name')
    owners = owners.exclude(name='Default')
    serializer = serializers.ReadOwnerSerializer(owners, many=True)
    return Response({'data': serializer.data}, status=status.HTTP_200_OK)

@api_view(['GET', ])
@permission_classes([AllowAny, ])
def get_test(request, *args, **kwargs):
    # Create column
    column = []
    all_name = dict()
    owner = get_object_or_404(Owner.objects.all(), name='Default')
    target_name = get_object_or_404(TargetName.objects.all(), owner=owner)
    target_type = TargetType.objects.filter(target_name_id=target_name.id).order_by('min_rate')
    for query in target_type:
        if query.name not in all_name:
            all_name[query.name] = query.name
    print(all_name)
    rebate_name_column = {
        "title": 'Rebate Name',
        "field": 'name',
        "align": "center",
    }
    column.append(rebate_name_column)
    for target in all_name:
        obj = {
            "title": target,
            "field": target,
            "align": "center",
            "type": "numeric",
            "initialEditValue": 0
        }
        column.append(obj)

    # Create row
    rows = []
    rebate_names = RebateName.objects.filter(owner=owner)
    for index, rebate_name in enumerate(rebate_names):
        obj = dict()
        for item in RebateType.objects.filter(rebate_name_id=rebate_name.id):
            obj[item.name] = item.rate
        obj['name'] = rebate_name.name
        obj['index'] = index
        obj['id'] = rebate_name.id
        rows.append(obj)
    return Response({'data': {"column": column, "rows": rows}}, status=status.HTTP_200_OK)


@api_view(['GET', ])
@permission_classes([AllowAny, ])
def get_column(request, *args, **kwargs):
    """Get user information"""
    all_name = dict()
    owner = get_object_or_404(Owner.objects.all(), name='Default')
    target_name = get_object_or_404(TargetName.objects.all(), owner=owner)
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
        owner = get_object_or_404(Owner.objects.all(), name='Default')
        target_name = get_object_or_404(TargetName.objects.all(), owner_id=owner.id)
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

                        for rebate_type in RebateType.objects.filter(name=deleted_target.name, rebate_name__owner__name="Default"):
                            rebate_type.delete()

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
        # Create column
        column = []
        all_name = dict()
        owner = get_object_or_404(Owner.objects.all(), name='Default')
        target_name = get_object_or_404(TargetName.objects.all(), owner=owner)
        target_type = TargetType.objects.filter(target_name_id=target_name.id).order_by('min_rate')
        for query in target_type:
            if query.name not in all_name:
                all_name[query.name] = query.name
        rebate_name_column = {
            "title": 'Rebate Name',
            "field": 'name',
            "align": "center",
        }
        column.append(rebate_name_column)
        for target in all_name:
            obj = {
                "title": target,
                "field": target,
                "align": "center",
                "type": "numeric",
                "initialEditValue": 0
            }
            column.append(obj)

        # Create row
        rows = []
        rebate_names = RebateName.objects.filter(owner=owner)
        for index, rebate_name in enumerate(rebate_names):
            obj = dict()
            for item in RebateType.objects.filter(rebate_name_id=rebate_name.id):
                obj[item.name] = item.rate
            obj['name'] = rebate_name.name
            obj['index'] = index
            obj['id'] = rebate_name.id
            rows.append(obj)
        return Response({'data': {"column": column, "rows": rows}}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        data = request.data
        try:
            with transaction.atomic():
                owner = get_object_or_404(Owner.objects.all(), name="Default")

                rebate_name_dict = dict()
                for i in RebateName.objects.filter(owner_id=owner.id):
                    if i.id not in rebate_name_dict:
                        rebate_name_dict[i.id] = i.id

                for item in data:
                    if item.get('id') is not None:
                        rebate_name = get_object_or_404(RebateName.objects.all(), pk=item.get('id'))

                        # remove exist id from dict
                        if item.get('id') in rebate_name_dict:
                            rebate_name_dict.pop(item.get('id'), None)

                        all_target_type = get_all_type_rebate()
                        for rebate_type in RebateType.objects.filter(rebate_name_id=rebate_name.id):
                            if rebate_type.name in all_target_type:
                                all_target_type.pop(rebate_type.name, None)
                            name = rebate_type.name
                            rebate_type.rate = item.get(name)
                            rebate_type.save()

                        for left in all_target_type:
                            if item.get(left) is None:
                                RebateType.objects.create(
                                    rebate_name=rebate_name,
                                    name=left,
                                    rate=0
                                )
                            else:
                                RebateType.objects.create(
                                    rebate_name=rebate_name,
                                    name=left,
                                    rate=item.get(left)
                                )
                    else:
                        rebate_name = RebateName.objects.create(
                            name=item.get('name'),
                            owner_id=owner.id
                        )
                        all_target_type = get_all_type_rebate()
                        for target_name in all_target_type:
                            RebateType.objects.create(
                                name=target_name,
                                rate=item.get(target_name),
                                rebate_name=rebate_name
                            )

                # Delete the left one
                for id in rebate_name_dict:
                    deleted_rebate = get_object_or_404(RebateName.objects.all(), pk=id)
                    deleted_rebate.delete()
                return Response({'data': 'success'}, status=status.HTTP_200_OK)
        except DatabaseError as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CustomManage(APIView):
    """
    Make custom rebate and target
    """
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        owner = get_object_or_404(Owner.objects.all(), name='Default')
        target = get_object_or_404(TargetName.objects.all(), owner=owner)
        rebate = RebateName.objects.filter(owner_id=owner.id)
        template = CustomTemplate(
            target=target,
            rebate=rebate
        )
        serializer = serializers.CustomTemplateSerializer(template)
        return Response({'data': serializer.data}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        data = request.data
        serializer = serializers.WriteCustomSerializer(data=data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    owner_obj = serializer.validated_data.get('owner')
                    target_obj = serializer.validated_data.get('target')
                    rebate_list = data.get('rebate')

                    queryset = Owner.objects.filter(name=owner_obj.get('name'))
                    for i in queryset:
                        r1 = Range(start=owner_obj.get('start_date'), end=owner_obj.get('end_date'))
                        r2 = Range(i.start_date, end=i.end_date)
                        latest_start = max(r1.start, r2.start)
                        earliest_end = min(r1.end, r2.end)
                        delta = (earliest_end - latest_start).days + 1
                        overlap = max(0, delta)
                        if overlap > 0:
                            raise DatabaseError(f'Date overlap with {i.start_date} - {i.end_date}')

                    # create owner
                    owner = Owner.objects.create(
                        name=owner_obj.get('name'),
                        start_date=owner_obj.get('start_date'),
                        end_date=owner_obj.get('end_date')
                    )

                    if target_obj.get('name') == 'default':
                        name = None
                    else:
                        name = target_obj.get('name')

                    # create target
                    target_name = TargetName.objects.create(
                        name=name,
                        owner_id=owner.id
                    )
                    for target in target_obj.get('target_type'):
                        TargetType.objects.create(
                            target_name_id=target_name.id,
                            name=target.get('name'),
                            min_rate=target.get('min_rate'),
                            max_rate=target.get('max_rate')
                        )

                    # create rebate
                    for item in rebate_list:
                        rebate_name = RebateName.objects.create(
                            name=item.get('name'),
                            owner_id=owner.id
                        )
                        all_target_type = get_all_type_rebate()
                        for target_name in all_target_type:
                            RebateType.objects.create(
                                name=target_name,
                                rate=item.get(target_name),
                                rebate_name=rebate_name
                            )

                    return Response({'data': 'success'}, status=status.HTTP_200_OK)
            except DatabaseError as e:
                transaction.rollback()
                return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'detail': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class CalculateManage(APIView):
    """Manage to calculate bonus via rebate"""
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        data = request.data
        serializer = serializers.WriteSomeSerializer(data=data)
        if serializer.is_valid():
            info = []
            rows = []
            compound_value = 0
            total_amt_list = [0]
            name = serializer.validated_data.get('owner_name')
            date = serializer.validated_data.get('date')
            values = serializer.validated_data.get('values')
            queryset = Owner.objects.filter(name=name)
            queryset = queryset.filter(start_date__lte=date, end_date__gte=date)

            if queryset.count() == 0:
                return Response({'detail': 'There no data between this date data please go settings.'}, status=status.HTTP_400_BAD_REQUEST)

            owner = queryset.first()

            # find target range
            target_name = TargetName.objects.get(owner_id=owner.id)
            target_types = TargetType.objects.filter(target_name_id=target_name.id)

            # crate column
            column = [
                {
                    "title": "No",
                    "field": "no",
                    "align": "center",
                    "type": "numeric",
                    "cellStyle": {
                        "border": '1px solid #757575',
                    },
                    "headerStyle": {
                        "border": '1px solid #757575',
                    }
                },
                {
                    "title": "Order Name",
                    "field": "order",
                    "align": "center",
                    "cellStyle": {
                        "border": '1px solid #757575',
                    },
                    "headerStyle": {
                        "border": '1px solid #757575',
                    }
                },
                {
                    "title": "Order Value",
                    "field": "order_value",
                    "align": "center",
                    "cellStyle": {
                        "border": '1px solid #757575',
                    },
                    "headerStyle": {
                        "border": '1px solid #757575',
                    }
                },
                {
                    "title": "Value",
                    "field": "value",
                    "align": "center",
                    "cellStyle": {
                        "border": '1px solid #757575',
                    },
                    "headerStyle": {
                        "border": '1px solid #757575',
                    }
                },
            ]
            for item in RebateName.objects.filter(owner_id=owner.id):
                obj = {
                    "title": item.name,
                    "field": item.name,
                    "align": "center",
                    "type": "numeric",
                    "cellStyle": {
                        "border": '1px solid #757575',
                    },
                    "headerStyle": {
                        "border": '1px solid #757575',
                    }
                }
                column.append(obj)
            column.append({
                "title": "Total",
                "field": "total",
                "align": "center",
                "type": "numeric",
                "cellStyle": {
                    "border": '1px solid #757575',
                },
                "headerStyle": {
                    "border": '1px solid #757575',
                }
            })
            column.append({
                "title": "Total Amt",
                "field": "total_amt",
                "align": "center",
                "type": "numeric",
                "cellStyle": {
                    "border": '1px solid #757575',
                },
                "headerStyle": {
                    "border": '1px solid #757575',
                }
            })
            column.append({
                "title": "Left to pay",
                "field": "left_to_pay",
                "align": "center",
                "type": "numeric",
                "cellStyle": {
                    "border": '1px solid #757575',
                },
                "headerStyle": {
                    "border": '1px solid #757575',
                }
            })

            # create row
            for index, value in enumerate(values):
                if values[value] is not None:
                    # print(values[value])
                    compound_value += values[value]
                    box = 0
                    range_obj = dict()
                    # print(compound_value)
                    query = target_types.filter(min_rate__lte=compound_value, max_rate__gte=compound_value).first()
                    # test = target_types.filter(min_rate__lte=values[value], max_rate__gte=values[value])
                    # for i in test:
                    #     print(i.min_rate)
                    if query is None:
                        query = target_types.order_by('-min_rate').first()
                        if compound_value >= query.min_rate:
                            query = query
                        else:
                            continue
                    rage_name = query.name

                    range_obj['no'] = index+1
                    range_obj['order'] = value
                    range_obj['order_value'] = compound_value
                    range_obj['value'] = query.name
                    # find rebate_type to get value
                    rebate_names = RebateName.objects.filter(owner_id=owner.id)
                    rebate_list = []
                    total = 0
                    for rebate_name in rebate_names:
                        for rebate_type in RebateType.objects.filter(rebate_name_id=rebate_name.id):
                            if rebate_type.name == rage_name:
                                obj = {
                                    "rebate_name": rebate_name.name,
                                    "type_name": rebate_type.name,
                                    "value": rebate_type.rate
                                }
                                range_obj[rebate_name.name] = rebate_type.rate
                                total += rebate_type.rate
                                rebate_list.append(obj)
                                box += rebate_type.rate

                    # start real calculate here
                    range_obj['total'] = total
                    total_amt = compound_value * total
                    range_obj['total_amt'] = total_amt
                    if index == 0:
                        range_obj['left_to_pay'] = 0
                    else:
                        range_obj['left_to_pay'] = abs(total_amt_list[-1]-total_amt)
                    total_amt_list.append(total_amt)
                    # print(compound_value)
                    # print(total_amt_list)
                    # compound_total = total*compound_value
                    # print(compound_total)
                    # sum_total_amt = sum(total_amt_list)
                    # print(sum_total_amt)
                    # print(compound_total-sum_total_amt)
                    # range_obj['reserved'] = compound_total-sum_total_amt
                    # range_obj['compound_total'] = compound_total
                    # range_obj['sum_total_amt'] = sum_total_amt
                    # print(range_obj)
                    rows.append(range_obj)
                    # rage_obj['rebate'] = rebate_list
                    # rage_obj['target'] = query.name
                    # rage_obj['start_date'] = owner.start_date.strftime("%d/%m/%Y")
                    # rage_obj['end_date'] = owner.end_date.strftime("%d/%m/%Y")
                    # rage_obj["min_rate"] = query.min_rate
                    # rage_obj['max_rate'] = query.max_rate
                    # rage_obj['title'] = value.capitalize()
                    # info.append(rage_obj)
            # print(info)
            data = {
                "column": column,
                "rows": rows
            }
            # print(column)
            return Response({'data': data}, status=status.HTTP_200_OK)
        else:
            print(serializer.errors)
            return Response({'data': 'success'}, status=status.HTTP_200_OK)