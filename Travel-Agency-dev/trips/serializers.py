from rest_framework import serializers
from .models import Trip, TripBooking


class TripListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = ['image', 'title', 'price']

class TripDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = '__all__'

class TripBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripBooking
        fields = ['adult_count', 'child_count']
        read_only_fields = ['total_price']
