from django.db import models
from rest_framework import serializers
from .models import Attributes, MetaData

class TestSerializer(serializers.Serializer):
    running = serializers.BooleanField()

class AttributesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attributes
        fields = ('trait_type', 'value')

class MetaDataSerializer(serializers.ModelSerializer):
    attributes = AttributesSerializer(many=True)
    class Meta:
        model = MetaData
        fields = ('description', 'external_url', 'image', 'name', 'attributes')
    def create(self, validated_data):
        print("validated_data", validated_data)
        attributes_data = validated_data.pop('attributes')
        print("validated_data2", validated_data)
        print("attributes_data", attributes_data)
        metadata = MetaData.objects.create(**validated_data)
        print("metadata", metadata)
        for attribute_data in attributes_data:
            print("attribute_data", attribute_data)
            Attributes.objects.create(metadata=metadata, **attribute_data)
        return metadata