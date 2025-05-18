from rest_framework import serializers
from .models import FlightBooking


class FlightBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlightBooking
        fields = ['flight_id']
