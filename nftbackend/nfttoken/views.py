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
from rest_framework import status

#serializers
from .serializers import TestSerializer, AttributesSerializer, MetaDataSerializer, MetaDataGetSerializer, ImagePostSerializer

from nfttoken.serializerObjects.testserializers import testSerializerObject

from .models import MetaData, Attributes, NftImage

from django.conf import settings

@api_view(['GET'])
@permission_classes([AllowAny])
def Test(request):
    testObject = testSerializerObject(False)
    serializer = TestSerializer(testObject)
    return Response(serializer.data)

# @api_view(['POST'])
# @permission_classes([AllowAny])
# def TestPost(request):
#     MetaData.objects.all().delete()
#     Attributes.objects.all().delete()
#     request_data = request.data
#     print("request_data", request_data)
#     metadata_serializer = MetaDataSerializer(data=request_data)
#     metadata_serializer.is_valid()
#     metadata_serializer2 = metadata_serializer.save()
#     print("result2", metadata_serializer2)

#     metadata = MetaData.objects.last()
#     print("metadata", metadata)
#     att = metadata.metadata.all()
#     metadata.attributes = att
#     print("att", att)

#     serializer = MetaDataSerializer(metadata)
#     return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def postImage(request):
    serializer = ImagePostSerializer(data = request.data)
    if serializer.is_valid():
        serializer.save()
        # serializer.data['file']
        print(request.get_host(),serializer.data['file'])
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        print('error', serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def getImage(request, id):
    image = NftImage.objects.filter(id=id).first()
    print(image.file.url)
    serializer = ImagePostSerializer(image)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def mintToken(request):
    serializer = MetaDataSerializer(data = request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        print('error', serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def getToken(request, id):
    metadata = MetaData.objects.filter(token_id=id).first()
    att = metadata.metadata.all()
    metadata.attributes = att
    serializer = MetaDataGetSerializer(metadata, context={'base_url': request.get_host()})
    return Response(serializer.data)
