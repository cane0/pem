
from rest_framework import serializers
from django.contrib.auth.models import User
from users.models import UserProfile
from ..models import (
    Juice, ItemInOrder, Order
)

class CheckSomethingSerializer(serializers.Serializer):
    key = serializers.CharField(required=True)
    value = serializers.CharField(required=True)

    def validate(self, data):
        key = data.get('key')
        value = data.get('value')

        if key not in ['email', 'username']:
            raise serializers.ValidationError("Invalid 'key' value. It should be either 'email' or 'username'.")

        return data

class JuiceModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Juice
        fields = ('id', 'name', 'description', 'price', 'image')

class UserSerializer(serializers.ModelSerializer):
    phone_number = serializers.SerializerMethodField()
    otp = serializers.SerializerMethodField()
    addresses = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = '__all__'

    def get_phone_number(self, user):
        return user.profile.phone_number
    
    def get_otp(self, user):
        return user.profile.otp
    
    def get_addresses(self, user):
        return user.profile.addresses.all()

class UserAdditionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['user', 'phone_number', 'otp']

class ItemInOrderSerializer(serializers.ModelSerializer):
    item_name = serializers.SerializerMethodField()
    item_image_url = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()
    unit_price = serializers.SerializerMethodField()
    
    class Meta:
        model = ItemInOrder
        fields = '__all__'
    
    def get_item_image_url(self, obj):
        if obj.item and obj.item.image:
            return self.context['request'].build_absolute_uri(obj.item.image.url)
        return None
    
    def get_item_name(self, obj):
        return obj.item.name
    
    def get_total_price(self, obj):
        return int(obj.quantity * obj.item.price)
    
    def get_unit_price(self, obj):
        return int(obj.item.price)

class OrderSerializer(serializers.ModelSerializer):
    items = ItemInOrderSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()
    total_quantity = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = (
            'items', 'date', 'is_confirmed',
            'user', 'id', 'total_price', 
            'total_quantity', "is_delivered",
            "is_cancelled", "is_returned",
            "is_refunded", "is_reviewed",
            "is_on_hold", 
        )
    
    def get_total_price(self, obj):
        return int(obj.calculate_total_price())
    
    def get_total_quantity(self, obj):
        return obj.items.count()

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Juice
        fields = '__all__'
    
