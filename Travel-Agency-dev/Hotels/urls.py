from django.urls import path
from .views import HotelListApiView, RoomListByHotelApiView,\
      HotelDetailsApiView, RoomDetailsApiView, ReviewCreateAPIView,\
      RoomBookingAPIView, payment_cancel, payment_success


urlpatterns = [
    path('hotels/', HotelListApiView.as_view()),
    path('hotels/<int:hotel_id>/', HotelDetailsApiView.as_view()),
    path('hotels/<int:hotel_id>/rooms/', RoomListByHotelApiView.as_view()),
    path('hotels/<int:hotel_id>/rooms/<int:room_id>/', RoomDetailsApiView.as_view()),
    path('hotels/<int:hotel_id>/rooms/<int:room_id>/booking/', RoomBookingAPIView.as_view()),
    path('hotel/payment/success/', payment_success),
    path('hotel/payment/cancel/', payment_cancel),
    path('hotels/<int:hotel_id>/reviews/', ReviewCreateAPIView.as_view()),
]
