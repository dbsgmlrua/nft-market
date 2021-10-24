from django.urls import path
from . import views
from .views import Test,TestPost

urlpatterns = [
    path('test', Test),
    path('testpost', TestPost)
]
