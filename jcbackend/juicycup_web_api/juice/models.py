from django.db import models
from users.models import UserProfile
from PIL import Image
from django.contrib.auth.models import User

class Juice(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='juice_images/', blank=True)

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.image:
            # Open the original image
            original_img = Image.open(self.image.path)

            # Perform your image formatting
            desired_height = original_img.height + 20
            desired_width = desired_height
            canvas = Image.new("RGBA", (desired_width, desired_height), (0, 0, 0, 0))

            paste_x = (desired_width - original_img.width) // 2
            paste_y = (desired_height - original_img.height) // 2

            canvas.paste(original_img, (paste_x, paste_y))

            # Save the formatted image back to the same path
            canvas.save(self.image.path)

class Address(models.Model):
    address_book = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='addresses')
    place_title = models.CharField(max_length=15, default='Home')
    room_number = models.CharField(max_length=15, blank=True, null=True)
    plot_number = models.CharField(max_length=15, blank=True, null=True)
    additional_info = models.CharField(max_length=15, blank=True, null=True)
    additional_phone_number = models.CharField(max_length=15, blank=True, null=True)
    place_name = models.TextField()
    full_name = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    latitude = models.CharField(max_length=25)
    longitude = models.CharField(max_length=25)
    image = models.ImageField(upload_to='address_images/', blank=True, null=True)
    is_default = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.address_book.user.username}'s address"

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=25)
    order_address = models.ForeignKey(Address, on_delete=models.SET_NULL, blank=True, null=True)
    is_confirmed = models.BooleanField(default=True)
    is_on_the_way = models.BooleanField(default=False)
    is_paid = models.BooleanField(default=False)
    is_delivered = models.BooleanField(default=False)
    is_cancelled = models.BooleanField(default=False)
    is_returned = models.BooleanField(default=False)
    is_refunded = models.BooleanField(default=False)
    is_reviewed = models.BooleanField(default=False)
    is_on_hold = models.BooleanField(default=False)
    is_gift_order = models.BooleanField(default=False)

    def calculate_total_price(self):
        total_price = 0
        for item in self.items.all():
            total_price += item.quantity * item.item.price
        return total_price

class ItemInOrder(models.Model):
    single_date_order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items', blank=True, null=True)
    item = models.ForeignKey(Juice, on_delete=models.DO_NOTHING)
    quantity = models.PositiveIntegerField()
    is_confirmed = models.BooleanField(default=True)
    is_on_the_way = models.BooleanField(default=False)
    is_paid = models.BooleanField(default=False)
    is_delivered = models.BooleanField(default=False)
    is_cancelled = models.BooleanField(default=False)
    is_returned = models.BooleanField(default=False)
    is_refunded = models.BooleanField(default=False)
    is_reviewed = models.BooleanField(default=False)
    is_on_hold = models.BooleanField(default=False)
    is_gift_order = models.BooleanField(default=False)


