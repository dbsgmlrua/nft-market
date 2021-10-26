from django.urls import path
from . import views
from .views import Test, postImage, getImage, mintToken, getToken

urlpatterns = [
    path('test', Test),
    # path('testpost', TestPost),
    path('postimage', postImage),
    path('minttoken', mintToken),
    path('getimage/<int:id>', getImage),
    path('gettoken/<int:id>', getToken)
]