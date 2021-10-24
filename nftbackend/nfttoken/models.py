from django.db import models
from django.db.models.deletion import CASCADE

class MetaData(models.Model):
    item_id = models.IntegerField()
    description = models.TextField()
    external_url = models.TextField()
    image = models.TextField()
    name = models.TextField()

class Attributes(models.Model):
    metadata = models.ForeignKey(MetaData, related_name='metadata', on_delete=models.CASCADE)
    trait_type = models.TextField()
    value = models.TextField()