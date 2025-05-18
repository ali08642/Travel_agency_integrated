from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Hotel(models.Model):
    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to='hotels/', null=True, blank=True)
    location = models.CharField(max_length=255)
    description = models.TextField()
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.location})"

class Room(models.Model):
    ROOM_TYPES = [
        ('single', 'Single'),
        ('double', 'Double'),
        ('suite', 'Suite'),
    ]

    image = models.ImageField(upload_to='rooms/', null=True, blank=True)
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='rooms')
    room_type = models.CharField(max_length=20, choices=ROOM_TYPES)
    price_per_night = models.DecimalField(max_digits=8, decimal_places=2)
    number = models.CharField(max_length=10)

    def __str__(self):
        return f"Room {self.number} - {self.hotel.name}"

class RoomBooking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    check_in = models.DateField()
    check_out = models.DateField()
    booked_at = models.DateTimeField(auto_now_add=True)
    is_paid = models.BooleanField(default=False)
    stripe_session_id = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"Booking by {self.user.email} for Room {self.room.number}"

class Review(models.Model):
    RATING_CHOICES = [
    (1, 'Very Bad'),
    (2, 'Bad'),
    (3, 'Average'),
    (4, 'Good'),
    (5, 'Excellent'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(choices=RATING_CHOICES)  # e.g., 1–5
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.hotel.name} - {self.rating}★"
