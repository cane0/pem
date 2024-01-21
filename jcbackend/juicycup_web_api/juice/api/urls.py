from rest_framework import routers
from django.urls import include, path, re_path
from .views import (
    UserInfo, AdditionalUserInfo, SendOTP, VerifyOTP,
    UserLogout, GetCSRFToken, JuicesViewSet, CheckSomething,
    OrderViewSet, 
)

router = routers.DefaultRouter()
router.register(r'juices', JuicesViewSet)
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
    path('send-otp/', SendOTP.as_view(), name='send-otp'),
    path('verify-otp/', VerifyOTP.as_view(), name='verify-otp'),
    path('get-csrf-token/', GetCSRFToken.as_view(), name='get_csrf_token'),
    path('user-info/', UserInfo.as_view(), name='user-info'),
    path('additional-user-info/<phone_number>/', AdditionalUserInfo.as_view(), name='additional-user-info'),
    path('check-something/', CheckSomething.as_view(), name='check-something'),
    # path(),
    # path(),
    # path(),
    # path(),
    path('orders/user_orders/', OrderViewSet.as_view({'get', 'user_orders'}), name='user-orders'),
    # path(),
    path('logout/', UserLogout.as_view(), name='logout'),
]
