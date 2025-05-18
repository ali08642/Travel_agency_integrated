from django.shortcuts import render
from rest_framework import generics
from .models import Trip, TripBooking
from .serializers import TripListSerializer, TripDetailsSerializer, TripBookingSerializer


class TripsListAPIView(generics.ListAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripListSerializer

class TripDetailsAPIView(generics.RetrieveAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripDetailsSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'trip_id'

class TripBookingAPIView(generics.CreateAPIView):
    model = TripBooking
    serializer_class = TripBookingSerializer

    def perform_create(self, serializer):
        trip = Trip.objects.get(id=self.kwargs['trip_id'])
        serializer.save(customer=self.request.user, trip=trip)
