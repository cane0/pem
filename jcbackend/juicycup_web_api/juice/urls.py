
from django.urls import path
from .views import (
    vo, so
)

urlpatterns = [
    path('send-the-otp/', so, name='so'),
    path('verify/', vo, name='vo'),
]
