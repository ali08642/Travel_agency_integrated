from django.db import models
from hotelss.models import Hotel
from jwtauth.models import CustomUser

class Trip(models.Model):
    image = models.ImageField(upload_to='trip_images/', null=True, blank=True)
    title = models.CharField(max_length=100)
    destination = models.CharField(max_length=50)
    origin = models.CharField(max_length=50)
    domestic = models.BooleanField(default=True)
    group_tour = models.BooleanField(default=True)
    description = models.TextField()
    hotel = models.ManyToManyField(Hotel)
    start_date = models.DateField()
    end_date = models.DateField()
    price = models.IntegerField()
    booking_last_date = models.DateField()

    def __str__(self):
        return f"{self.title} ({self.destination})"

class TripBooking(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE)
    customer = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    adult_count = models.IntegerField()
    child_count = models.IntegerField()
    total_price = models.IntegerField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.trip and (self.adult_count is not None and self.child_count is not None):
            price_per_person = self.trip.price
            self.total_price = (price_per_person * self.adult_count) + ((price_per_person - 5000) * self.child_count)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Booking for {self.customer} on {self.trip}"
