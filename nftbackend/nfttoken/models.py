from django.db import models
from django.db.models.deletion import CASCADE

class MetaData(models.Model):
    token_id = models.IntegerField(default=0)
    item_id = models.IntegerField(default=0)
    description = models.TextField(null=True)
    external_url = models.TextField(null=True)
    image = models.TextField()
    name = models.TextField()

class Attributes(models.Model):
    metadata = models.ForeignKey(MetaData, related_name='metadata', on_delete=models.CASCADE)
    trait_type = models.TextField()
    value = models.TextField()

#Image upload

class NftImage(models.Model):
    title = models.CharField(max_length=50 , null=True)
    file = models.ImageField(blank=True , null=True , upload_to ="post")
