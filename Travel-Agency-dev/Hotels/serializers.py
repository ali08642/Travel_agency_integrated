from rest_framework import serializers
from .models import *
from django.utils import timezone

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['user', 'rating', 'comment', 'created_at']

class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['rating', 'comment']

    def create(self, validated_data):
        return Review.objects.create(**validated_data)

class HotelListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = ['id', 'name', 'image', 'location', 'rating', 'description']

class HotelDetailsSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)
    class Meta:
        model = Hotel
        fields = ['name', 'image', 'location', 'description', 'rating', 'reviews']

class RoomListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'room_type', 'image', 'price_per_night']

class RoomDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['room_type', 'image', 'price_per_night', 'number']

class RoomBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomBooking
        fields = ['check_in', 'check_out']
    
    def validate(self, data):
        check_in = data.get('check_in')
        check_out = data.get('check_out')

        if check_in > timezone.now():
            raise serializers.ValidationError("Check_in must be in future!")

        if check_in > check_out:
            raise serializers.ValidationError("Check_in must be less than check_out!")
        
        room = self.context.get('room')

        if room:
            overlapping = RoomBooking.objects.filter(
                room=room,
                check_in__lt=check_out,
                check_out__gt=check_in
            ).exists()

            if overlapping:
                raise serializers.ValidationError("This room is already booked for the selected dates.")

        return data

    def create(self, validated_data):
        room = self.context['room']
        user = self.context['request'].user
        return RoomBooking.objects.create(user=user, room=room, **validated_data)
