from rest_framework import generics
from .models import Hotel, Room, RoomBooking
from .serializers import HotelListSerializer, RoomListSerializer,\
    HotelDetailsSerializer, RoomDetailsSerializer, ReviewCreateSerializer,\
    RoomBookingSerializer
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from Flights.utils import create_checkout_session
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime
from django.http import HttpResponse
import stripe


class HotelListApiView(generics.ListAPIView):
    queryset = Hotel.objects.all()
    serializer_class = HotelListSerializer
    filter_backend = [DjangoFilterBackend]
    filterset_fields = ['name', 'location', 'rating'] 

class HotelDetailsApiView(generics.RetrieveAPIView):
    queryset = Hotel.objects.all()
    serializer_class = HotelDetailsSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'hotel_id'

class RoomListByHotelApiView(generics.ListAPIView):
    serializer_class = RoomListSerializer
    filter_backend = [DjangoFilterBackend]
    filterset_fields = ['name', 'location', 'rating']

    def get_queryset(self):
        hotel_id = self.kwargs['hotel_id']
        return Room.objects.filter(hotel=hotel_id)

class RoomDetailsApiView(generics.RetrieveAPIView):
    serializer_class = RoomDetailsSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'room_id'

    def get_queryset(self):
        hotel_id = self.kwargs['hotel_id']
        return Room.objects.filter(hotel=hotel_id)

class ReviewCreateAPIView(generics.CreateAPIView):
    serializer_class = ReviewCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        hotel_id = self.kwargs['hotel_id']
        hotel = get_object_or_404(Hotel, pk=hotel_id)
        serializer.save(hotel=hotel, user=self.request.user)

class RoomBookingAPIView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, hotel_id, room_id):
        room = get_object_or_404(Room, pk=room_id)

        check_in_str = request.data.get('check_in')
        check_in_naive = datetime.strptime(check_in_str, "%Y-%m-%d")
        check_in = timezone.make_aware(check_in_naive)

        check_out_str = request.data.get('check_out')
        check_out_naive = datetime.strptime(check_out_str, "%Y-%m-%d")
        check_out = timezone.make_aware(check_out_naive)

        if check_in < timezone.now():
            raise ValueError("Check_in must be in future!")

        if check_in > check_out:
            raise ValueError("Check_in must be less than check_out!")
        
        if room:
            overlapping = RoomBooking.objects.filter(
                room=room,
                check_in__lt=check_out,
                check_out__gt=check_in
            ).exists()

            if overlapping:
                raise ValueError("This room is already booked for the selected dates.")

        
        booking = RoomBooking.objects.create(user=request.user, room=room, check_in=check_in, check_out=check_out)

        success_url = 'http://127.0.0.1:8000/api/hotel/payment/success/?session_id={CHECKOUT_SESSION_ID}'
        cancel_url = 'http://127.0.0.1:8000/api/hotel/payment/cancel/?session_id={CHECKOUT_SESSION_ID}'

        # Convert to datetime objects
        check_in_date = datetime.strptime(check_in_str, "%Y-%m-%d")
        check_out_date = datetime.strptime(check_out_str, "%Y-%m-%d")

        # Calculate difference
        days_diff = (check_out_date - check_in_date).days



        session = create_checkout_session(
            amount=room.price_per_night*days_diff,
            currency='pkr',
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={'booking_id': booking.id, 'type': 'room'}
        )

        booking.stripe_session_id = session.id
        booking.save()

        return Response({"checkout_url": session.url})

def payment_success(request):
    session_id = request.GET.get('session_id')

    if not session_id:
        return HttpResponse("No session ID found.")

    try:
        session = stripe.checkout.Session.retrieve(session_id)
        booking_id = session.metadata.get('booking_id')

        booking = RoomBooking.objects.get(id=booking_id)
        if not booking.is_paid:
            booking.is_paid = True
            booking.save()

        return HttpResponse(f"Payment confirmed for booking #{booking.id}.")

    except Exception as e:
        return HttpResponse(f"Error processing payment: {str(e)}")


def payment_cancel(request):
    session_id = request.GET.get('session_id')

    if not session_id:
        return HttpResponse("No session ID found.")

    try:
        session = stripe.checkout.Session.retrieve(session_id)
        booking_id = session.metadata.get('booking_id')

        booking = RoomBooking.objects.get(id=booking_id)
        booking.delete()

        return HttpResponse(f"Payment canceled so no flight is booked!!")

    except Exception as e:
        return HttpResponse(f"Error processing payment: {str(e)}")

