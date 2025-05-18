from django.db import models

class Hotel(models.Model):
    hotelCode = models.IntegerField(unique=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    country_code = models.CharField(max_length=5, null=True, blank=True)    
    destination_code = models.CharField(max_length=5, null =True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)  
    city = models.CharField(max_length=100, null=True, blank=True) 
    email = models.EmailField(null=True, blank=True)
    phone_numbers = models.CharField(max_length=255, null=True, blank=True)  # Assuming this is a JSON field
    coordinates = models.CharField(max_length=100, null=1, blank=1)  #long langtitudes
    ranking = models.IntegerField(null=True, blank=True)  
    def __str__(self):
        return self.name


class Room(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='rooms')
    room_code = models.CharField(max_length=20, null=True, blank=True)
    is_parentRoom = models.BooleanField(null=True, blank=True)
    min_pax = models.IntegerField(null=True, blank=True)
    max_pax = models.IntegerField(null=True, blank=True)
    max_adults = models.IntegerField(null=True, blank=True)
    max_children = models.IntegerField(null=True, blank=True)
    minAdults = models.IntegerField(null=True, blank=True)
    room_type = models.CharField(max_length=20, null=True, blank=True)
    characteristic_code = models.CharField(max_length=20, null=True, blank=True)   
    def __str__(self):
        return f"{self.room_code} - {self.room_type}"

class availableRoom(models.Model):
    name = models.CharField(max_length=255, null=True, blank=True) #e.g twin room
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='available_rooms')
    room_code = models.CharField(max_length=20, null=True, blank=True)
    

class Image(models.Model):    
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='images')
    image_type_code = models.CharField(max_length=20, null=True, blank=True)
    path = models.CharField(max_length=255, null=True, blank=True)  
    order = models.IntegerField(null=True, blank=True)
    visualOrder = models.IntegerField(null=True, blank=True)  

    def __str__(self):
        return f"Image {self.path} for {self.hotel.name}"

class User(models.Model):   
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # Store hashed passwords
    first_name = models.CharField(max_length=30, null=True, blank=True)
    last_name = models.CharField(max_length=30, null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)

    def __str__(self):
        return self.username
  
class Booking(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('cancelled', 'Cancelled'),
    ]
    #user = models.ForeignKey(User, on_delete=models.CASCADE)
    id = models.AutoField(primary_key=True)
    reference = models.CharField(max_length=100, unique=True)
    hotel_name = models.CharField(max_length=255)
    check_in = models.DateField()
    check_out = models.DateField()
    total_amount = models.FloatField()
    currency = models.CharField(max_length=10)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    stripe_session_id = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.hotel_name} - {self.check_in} to {self.check_out}"