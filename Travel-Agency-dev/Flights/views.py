from rest_framework import generics
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from .models import Passenger, FlightBooking
from .serializers import FlightBookingSerializer
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .utils import create_checkout_session
from rest_framework.response import Response
import stripe
from django.http import HttpResponse
from django.conf import settings
import requests
from urllib.parse import quote


stripe.api_key = settings.STRIPE_SECRET_KEY
client_id = 'a7SbENpdu3tQ7kydbPqZaAXND002vNjX'
client_secret = 'xi68aNUI64mXUntt'


class FlightBookingListAPIView(generics.ListAPIView):
    queryset = FlightBooking.objects.all()
    serializer_class = FlightBookingSerializer
    permission_classes = [IsAuthenticated]

class FlightBookingDetailsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, flight_id):        # Step 1: Get access token from Amadeus
        print(flight_id)
        auth_url = "https://test.api.amadeus.com/v1/security/oauth2/token"
        headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        data = {
            "grant_type": "client_credentials",
            "client_id": client_id,
            "client_secret": client_secret
        }
        auth_response = requests.post(auth_url, headers=headers, data=data)

        if auth_response.status_code != 200:
            return Response({"error": "Failed to get token", "details": auth_response.text}, status=auth_response.status_code)

        access_token = auth_response.json().get('access_token')

        headers = {
            "Authorization": f"Bearer {access_token}"
        }

        url = f"https://test.api.amadeus.com/v1/booking/flight-orders/{flight_id}"
        response = requests.get(url, headers=headers)

        if response.status_code != 200:
            return Response(
                {"Error": "Failed to get booking details!",
                "Details": response.text
                },status=response.status_code )
        
        return Response(response.json(), status=200)

class FlightBookingDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]    

    def delete(self, request):
        flight_id = request.query_params.get('flight_id')
        flight_id = quote(flight_id)  # Just in case it's still encoded
        print(flight_id)
        instance = FlightBooking.objects.get(flight_id=flight_id)
        if instance:
            instance.delete()
        return Response({
            "Details": "Successfully Deleted!"
        }, status=204)


class FlightListAPIView(APIView):

    def get(self, request):
        originLocationCode = request.GET.get('originLocationCode')
        destinationLocationCode = request.GET.get('destinationLocationCode')
        departureDate = request.GET.get('departureDate')
        returnDate = request.GET.get('return')
        adults = request.GET.get('adults')
        children = request.GET.get('children')
        infants = request.GET.get('infants')
        travelClass = request.GET.get('class')
        nonStop = request.GET.get('nonStop')
        max_price = request.GET.get('maxPrice')
        max_results = request.GET.get('max')

        # Step 1: Get access token from Amadeus
        auth_url = "https://test.api.amadeus.com/v1/security/oauth2/token"
        headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        data = {
            "grant_type": "client_credentials",
            "client_id": client_id,
            "client_secret": client_secret
        }
        auth_response = requests.post(auth_url, headers=headers, data=data)

        if auth_response.status_code != 200:
            return Response({"error": "Failed to get token", "details": auth_response.text}, status=auth_response.status_code)

        access_token = auth_response.json().get('access_token')

        # Step 2: Search for flights
        flight_url = "https://test.api.amadeus.com/v2/shopping/flight-offers"
        headers = {
            "Authorization": f"Bearer {access_token}"
        }
        params = {
            "originLocationCode": originLocationCode,
            "destinationLocationCode": destinationLocationCode,
            "departureDate": departureDate,
            "adults": adults,
        }

        # Optional params
        if returnDate:
            params["returnDate"] = returnDate
        if children:
            params["children"] = children
        if infants:
            params["infants"] = infants
        if travelClass:
            params["travelClass"] = travelClass
        if nonStop:
            params["nonStop"] = nonStop
        if max_price:
            params["maxPrice"] = max_price
        if max_results:
            params["max"] = max_results

        flight_response = requests.get(flight_url, headers=headers, params=params)

        if flight_response.status_code == 200:
            return Response(flight_response.json())
        else:
            return Response({
                "error": "Failed to fetch flight data",
                "details": flight_response.text
            }, status=flight_response.status_code)

class FlightBookingAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        flight_offer = request.data.get('flight_data')
        travellers_data = request.data.get('travellers')  # list of traveler info
        
        if not flight_offer or not isinstance(travellers_data, list):
            return Response({"error": "Missing or invalid flight or traveler data."}, status=400)        

        travellers = []
        for idx, traveller in enumerate(travellers_data):

            first_name = traveller.get('first_name')
            last_name = traveller.get('last_name')
            gender = traveller.get('gender')
            nationality = traveller.get('nationality')
            passport_no = traveller.get('passport_no')
            dob = traveller.get('date_of_birth')
            type = traveller.get('passenger_type')

            Passenger.objects.update_or_create(
                passport_no=passport_no, 
                defaults={
                "first_name": first_name,
                "last_name": last_name, 
                "date_of_birth": dob, 
                "nationality": nationality,
                "gender": gender, 
                "passenger_type": type
            })
            travellers.append({
                "id": str(idx+1),
                "dateOfBirth": dob,
                "name": {
                "firstName": first_name,
                "lastName": last_name
                },
                "gender": gender.upper(),
                "contact": {
                "emailAddress": "example@example.com",
                "phones": [
                    {
                    "deviceType": "MOBILE",
                    "countryCallingCode": "92",
                    "number": "300000000"
                    }
                ]
                },
                "documents": [
                {
                    "documentType": "PASSPORT",
                    "number": passport_no,
                    "expiryDate": "2030-12-31",
                    "issuanceCountry": "PK",
                    "nationality": "PK",
                    "holder": True
                }
                ]
            })
            

        if not flight_offer or not travellers_data:
            return Response({"error": "Missing flight or traveler data."}, status=400)

        # Step 1: Get access token
        auth_url = "https://test.api.amadeus.com/v1/security/oauth2/token"
        token_data = {
            "grant_type": "client_credentials",
            "client_id": client_id,
            "client_secret": client_secret
        }
        token_headers = {"Content-Type": "application/x-www-form-urlencoded"}
        auth_response = requests.post(auth_url, data=token_data, headers=token_headers)

        if auth_response.status_code != 200:
            return Response({"error": "Auth failed", "details": auth_response.text}, status=auth_response.status_code)

        access_token = auth_response.json()['access_token']
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }

        # Step 2: Flight-offer-/pricing
        pricing_url = "https://test.api.amadeus.com/v1/shopping/flight-offers/pricing"
        pricing_body = {
            "data": {
                "type": "flight-offers-pricing",
                "flightOffers": [flight_offer]
            }
        }

        pricing_response = requests.post(pricing_url, json=pricing_body, headers=headers)
        if pricing_response.status_code != 200:
            return Response({"error": "Pricing failed", "details": pricing_response.text}, status=pricing_response.status_code)

        validated_offer = pricing_response.json()['data']['flightOffers'][0]

        # Step 3: Book the flight
        booking_url = "https://test.api.amadeus.com/v1/booking/flight-orders"
        booking_body = {
            "data": {
                "type": "flight-order",
                "flightOffers": [validated_offer],
                "travelers": travellers
            }
        }

        booking_response = requests.post(booking_url, json=booking_body, headers=headers)

        if booking_response.status_code == 201:
            booking_response = booking_response.json()['data']
            flight_id = booking_response.get('id')
            total_price = booking_response.get('flightOffers')[0].get('price').get('grandTotal')
            currency = booking_response.get('flightOffers')[0].get('price').get('billingCurrency')
            
            booking = FlightBooking.objects.create(flight_id=flight_id, total_price=total_price, user=request.user)
            for traveller in travellers_data:
                passport = traveller['passport_no']
                booking.passengers.add(Passenger.objects.get(passport_no=passport))

            checkout_url = create_checkout_session(
                amount=float(total_price),
                currency=currency,
                metadata={"booking_id": booking.pk},
                success_url='http://localhost:8000/api/flight/payment/success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url='http://localhost:8000/api/flight/payment/cancel?session_id={CHECKOUT_SESSION_ID}'
            )

            return Response({
                "booking success": True,
                "payment_url": checkout_url
            }, status=201)

        else:
            return Response({"error": "Booking failed", "details": booking_response.text}, status=booking_response.status_code)

def payment_success(request):
    session_id = request.GET.get('session_id')

    if not session_id:
        return HttpResponse("No session ID found.")

    try:
        session = stripe.checkout.Session.retrieve(session_id)
        booking_id = session.metadata.get('booking_id')

        booking = FlightBooking.objects.get(id=booking_id)
        if not booking.is_paid:
            booking.stripe_session_id = session_id
            booking.is_paid = True
            booking.save()

        return HttpResponse(f"✅ Payment confirmed for booking #{booking.id}.")

    except Exception as e:
        return HttpResponse(f"Error processing payment: {str(e)}")


def payment_cancel(request):
    session_id = request.GET.get('session_id')

    if not session_id:
        return HttpResponse("No session ID found.")

    try:
        session = stripe.checkout.Session.retrieve(session_id)
        booking_id = session.metadata.get('booking_id')

        booking = FlightBooking.objects.get(id=booking_id)
        booking.delete()

        return HttpResponse(f"Payment canceled so no flight is booked!!")

    except Exception as e:
        return HttpResponse(f"Error processing payment: {str(e)}")
