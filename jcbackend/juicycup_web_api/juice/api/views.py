from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import BasePermission
from django.contrib.auth.models import User
from users.models import (UserProfile) 
from .serializers import (
    UserSerializer, UserAdditionalSerializer, JuiceModelSerializer,
    CheckSomethingSerializer, OrderSerializer,
)
from rest_framework.views import APIView
from rest_framework import viewsets, status
from django_otp.plugins.otp_totp.models import TOTPDevice
from twilio.rest import Client
import random, secrets
from django.utils import timezone
from django.contrib.auth import login, logout
from django.contrib.auth.hashers import make_password, check_password
from django.http import HttpResponseServerError
from twilio.base.exceptions import TwilioRestException
from ..models import (
    Juice, ItemInOrder, Order,
)

def get_otp():
    otp = str(random.randint(0, 999999))
    return (6 - len(otp)) * '0' + otp

class JuicesViewSet(viewsets.ModelViewSet):
    queryset = Juice.objects.all().order_by('id')
    serializer_class = JuiceModelSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            instance = serializer.save()

            items_data = request.data.get('items', [])
            for item_data in items_data:
                item_data['single_date_order'] = instance
                ItemInOrder.objects.create(
                    single_date_order = instance,
                    item = Juice.objects.get(pk=item_data['item']),
                    quantity = item_data['quantity'],
                    is_confirmed = True
                )
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['GET'])
    def user_orders(self, request, *args, **kwargs):
        user_id = self.request.query_params.get('user_id')

        if not user_id:
            return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        user_orders = Order.objects.filter(user=user_id).order_by('-date')
        serializer = self.get_serializer(user_orders, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

class CustomHeaderPermission(BasePermission):
    def has_permission(self, request, view):
        
        required_header_name = 'X-PU2zIE-ValU3'
        required_header_value = '2001-01-23'

        return request.headers.get(required_header_name) == required_header_value

class AdditionalUserInfo(APIView):
    permission_classes = (CustomHeaderPermission, )

    def get(self, request, phone_number):
        user_profile = UserProfile.objects.filter(phone_number=phone_number).first()
        
        if not user_profile:
            return Response({'detail': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UserAdditionalSerializer(user_profile)
        return Response({'user_profile': serializer.data})

class CheckSomething(APIView):
    
    def post(self, request):
        serializer = CheckSomethingSerializer(data=request.data)

        if serializer.is_valid():
            search_key = serializer.validated_data['key']
            search_value = serializer.validated_data['value']

            if search_key == 'email':
                exists_or_not = User.objects.filter(email=search_value).exists()
            else:
                exists_or_not = User.objects.filter(username=search_value).exists()

            return Response({'exists': exists_or_not}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserInfo(APIView):

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({'user': serializer.data})
    
class SendOTP(APIView):

    def post(self, request):
        phone_number = request.data.get('phone_number')

        user_profile = UserProfile.objects.filter(phone_number=phone_number).first()

        helper_response = 'old account'

        if user_profile:
            user = user_profile.user
        else:
            
            random_id = secrets.token_hex(3)
            placeholder_username = 'pholder_' + str(random_id)
            
            generated_password = secrets.token_hex(10)

            user = User.objects.create(username=placeholder_username, password=make_password(generated_password))
            user_profile = UserProfile.objects.create(phone_number=phone_number, user=user)

        if 'pholder_' in user_profile.user.username:
            helper_response = 'new account'

        otp = get_otp()

        user_profile.otp = otp
        user_profile.save()

        account_sid = 'AC9e5f9e8df67b1a4e7323cd6560d24f1d'
        auth_token = '980f859461c65cab2cd7c2f615034a27'
        twilio_phone_number = '+16592216126'

        client = Client(account_sid, auth_token)

        try:
            message = client.messages.create(
                body=f'Your OTP is: {otp}',
                from_=twilio_phone_number,
                to=phone_number
            )
            return Response({'detail': 'OTP sent successfully', 'account': helper_response})
        except TwilioRestException as e:
            user.delete()
            # Handle the Twilio exception
            if e.code == 21211:
                # Invalid 'To' Phone Number
                return Response({'error': 'Invalid phone number or number does not exist'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                # Handle other Twilio exceptions as needed 21408
                print(e.code)
                return Response({'error': 'Twilio derange hein Papa'}, status=status.HTTP_400_BAD_REQUEST)

    
class VerifyOTP(APIView):
    
    def post(self, request):
        phone_number = request.data.get('phone_number')
        try:
            user = UserProfile.objects.filter(phone_number=phone_number).first().user
        except:
            return Response({'error': 'Number does not exist'})
        
        otp = request.data.get('otp')

        saved_otp = user.profile.otp

        print(saved_otp, otp)

        helper_response = 'old account'

        if saved_otp == otp:
            if 'pholder_' in user.username:
                helper_response = 'new account'
                user.email = request.data.get('email')
                user.username = request.data.get('username')
                user.first_name = request.data.get('first_name')
                user.last_name = request.data.get('last_name')

                user.save()

                serializer = UserSerializer(user)
                login(request, user)

                return Response({'message': 'Set a username', 'account': helper_response})
                
            else:
                serializer = UserSerializer(user)
                login(request, user)
            return Response({'detail': 'OTP verified successfully', 'user_info': serializer.data, 'account': helper_response})
            
        else:
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

class UserLogout(APIView):
    
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)
    
class GetCSRFToken(APIView):
    def get(self, request):
        csrf_token = request.COOKIES.get('csrftoken', '')
        session_id = request.COOKIES.get('sessionid', '')

        response_data = {
            'csrftoken': csrf_token,
            'sessionid': session_id,
            'message': 'CSRF token retrieved successfully'
        }

        return Response(response_data)


