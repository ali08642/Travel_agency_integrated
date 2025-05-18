from django.db import models
from jwtauth.models import CustomUser

class Passenger(models.Model):
    PASSENGER_CHOICES=[
        ("adult", "ADULT"),
        ("child", "CHILD"),
        ("infant", "INFANT"),
    ]
    GENDER_CHOICES=[
        ("male", "MALE"),
        ("female", "FEMALE"),
        ("transgender", "TRANSGENDER"),
    ]

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    gender = models.CharField(max_length= 12, choices=GENDER_CHOICES)
    passport_no = models.CharField(max_length=50)
    expiry_date = models.DateField(default="2030-12-31")
    passenger_type = models.CharField(max_length=50, choices=PASSENGER_CHOICES)
    nationality = models.CharField(max_length=50, default='Pakistan')
    date_of_birth = models.DateField()


    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class FlightBooking(models.Model):
    STATUS_CHOICES=[
        ("pending", "PENDING"),
        ("completed", "COMPLETED"),
        ("cancelled", "CANCELLED"),
    ]

    flight_id = models.CharField(max_length=255, null=True, blank=True)
    passengers = models.ManyToManyField(Passenger)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    booked_at = models.DateTimeField(auto_now_add=True)
    is_paid = models.BooleanField(default=False)
    stripe_session_id = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    total_price = models.DecimalField(default=1000.0, max_digits=6, decimal_places=2)
    currency = models.CharField(max_length=5, default="usd")

    def __str__(self):
        return f"{self.user}-{self.flight_id}"
