from django.contrib import admin
from .models import Hotel, Room, RoomBooking, Review

admin.site.register(Hotel)
admin.site.register(Room)
admin.site.register(RoomBooking)
admin.site.register(Review)
