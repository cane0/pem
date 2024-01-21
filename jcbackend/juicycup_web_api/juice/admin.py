from django.contrib import admin
from .models import Juice, Address, Order, ItemInOrder

admin.site.register(Juice)
admin.site.register(Address)
admin.site.register(Order)
admin.site.register(ItemInOrder)
