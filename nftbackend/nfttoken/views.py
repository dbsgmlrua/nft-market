from django.db import models
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import serializers
from django.core import serializers as ser
import io
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer

# Create your views here.

#rest_framworks
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.serializers import Serializer

#serializers
from .serializers import TestSerializer, AttributesSerializer, MetaDataSerializer

from nfttoken.serializerObjects.testserializers import testSerializerObject

from .models import MetaData, Attributes

@api_view(['GET'])
@permission_classes([AllowAny])
def Test(request):
    testObject = testSerializerObject(False)
    serializer = TestSerializer(testObject)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def TestPost2(request):
    MetaData.objects.all().delete()
    Attributes.objects.all().delete()
    # request_data = request.data
    # print("request_data", request_data)
    # attributes_data = request_data.pop('attributes')
    # print("request_data2", request_data)
    # print("description", request_data['description'])
    # metadata = MetaData.objects.create(
    #     description = request_data['description'],
    #     external_url = request_data['external_url'],
    #     image = request_data['image'],
    #     name = request_data['name']
    # )
    # print("metadata", metadata)
    # for attribute_data in attributes_data:
    #     print("attribute_data", attribute_data)
    #     Attributes.objects.create(metadata=metadata, **attribute_data)

    metadata2 = MetaData.objects.first()

    print("metadata2", metadata2)
    serializer = MetaDataSerializer(metadata2)
    return Response(serializer.data)



@api_view(['POST'])
@permission_classes([AllowAny])
def TestPost(request):
    MetaData.objects.all().delete()
    Attributes.objects.all().delete()
    request_data = request.data
    print("request_data", request_data)
    metadata_serializer = MetaDataSerializer(data=request_data)
    metadata_serializer.is_valid()
    metadata_serializer2 = metadata_serializer.save()
    print("result2", metadata_serializer2)

    metadata = MetaData.objects.last()
    print("metadata", metadata)
    att = metadata.metadata.all()
    metadata.attributes = att
    print("att", att)

    serializer = MetaDataSerializer(metadata)
    return Response(serializer.data)