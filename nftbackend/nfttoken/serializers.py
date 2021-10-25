from django.db import models
from django.db.models import fields
from rest_framework import serializers
from .models import Attributes, MetaData, NftImage

class TestSerializer(serializers.Serializer):
    running = serializers.BooleanField()

class AttributesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attributes
        fields = ('trait_type', 'value')

class MetaDataSerializer(serializers.ModelSerializer):
    attributes = AttributesSerializer(many=True, allow_null=True)
    class Meta:
        model = MetaData
        fields = ('description', 'external_url', 'image', 'name', 'attributes')
    def create(self, validated_data):
        attributes_data = validated_data.pop('attributes')
        metadata = MetaData.objects.create(**validated_data)
        for attribute_data in attributes_data:
            Attributes.objects.create(metadata=metadata, **attribute_data)
        return metadata

class ImagePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = NftImage
        fields = '__all__'