
from rest_framework import serializers
from .models import Hotel, Room, Image

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__' 


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__' 

class HotelSerializer(serializers.ModelSerializer):
    # nclude the related models using nested serializers
    rooms = RoomSerializer(many=True, read_only=True)
    images = ImageSerializer(many=True, read_only=True)

    class Meta:
        model = Hotel
        fields = '__all__' 
