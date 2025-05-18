from django.urls import path
from .views import FlightListAPIView, FlightBookingAPIView, FlightBookingListAPIView, FlightBookingDetailsAPIView, FlightBookingDeleteAPIView, payment_success, payment_cancel

urlpatterns = [
    path('flights', FlightListAPIView.as_view()),
    path('flights/booking/', FlightBookingAPIView.as_view()),
    path('flights/booking/list/', FlightBookingListAPIView.as_view()),
    path('flights/booking/list/<str:flight_id>/', FlightBookingDetailsAPIView.as_view()),
    path('flights/booking/cancel', FlightBookingDeleteAPIView.as_view()),
    path('flight/payment/success/', payment_success),
    path('flight/payment/cancel/', payment_cancel),
]
