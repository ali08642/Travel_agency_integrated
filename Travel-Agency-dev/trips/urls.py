from django.urls import path
from .views import TripsListAPIView, TripDetailsAPIView, TripBookingAPIView


urlpatterns = [
    path('trips/', TripsListAPIView.as_view()),
    path('trips/<int:trip_id>/', TripDetailsAPIView.as_view()),
    path('trips/<int:trip_id>/booking/', TripBookingAPIView.as_view()),
]
