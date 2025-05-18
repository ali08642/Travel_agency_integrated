import requests
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from .forms import HotelSearchForm
import hashlib
import time
from .models import Hotel, Room, Image, Booking
from .serializers import HotelSerializer
from django.views.decorators.csrf import csrf_exempt
from urllib.parse import urlencode
@csrf_exempt
def fetch_hotels(request):
    print("pohnch gay")
    # Ensure that only POST requests are accepted from React
    if request.method == "POST":
        # Collect data from the POST request body (sent by React)
        try:
            data = request.body.decode('utf-8')  # Get the raw JSON string
            json_data = json.loads(data)  # Parse it into a dictionary
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
       
        # Extract parameters from the parsed data
        country_code = json_data.get('country_code')
        destination_code = json_data.get('destination_code')
        language = json_data.get('language')
        from_record = json_data.get('from_record')
        to_record = json_data.get('to_record')

        # Prepare parameters for the external API call (HotelBeds or similar)
        base_url = "https://api.test.hotelbeds.com/hotel-content-api/1.0/hotels"

        params = {
            "fields": "all",
            "destinationCode":destination_code,
            "countryCode":country_code,
            "language":language,
            "from":from_record,
            "to":to_record,
            "useSecondaryLanguage": 0
            
        }
        full_url = f"{base_url}?{urlencode(params)}"
        print(f"Sending API request to: {full_url}")  # Debugging line to check the full URL    
        # API headers (authentication and security)
        headers = {
            "Api-key": "703feda3aeb02b66f71a4b8878e9d13c",  # Replace with your actual API key
            "X-Signature": hashlib.sha256(("703feda3aeb02b66f71a4b8878e9d13c" + "fbf7bd5165" + str(int(time.time()))).encode()).hexdigest(),
            "Accept": "application/json",
            "Accept-Encoding": "gzip",
        }

        # Send the request to the external API
        try:
            response = requests.get(base_url, params=params, headers=headers)
            if response.status_code == 200:
                data = response.json()  # Extract the JSON response from the external API
                print("api req success")
                # Optionally, serialize the data using Django REST Framework (if needed)        
                # Optionally, store the data in the database (custom function)

                ############################
                store_in_databs(data)
                
                # Return the JSON data back to React
                #hotels_array = data.get('hotels', [])
                #return JsonResponse({'hotels': hotels_array}, safe=False)  # Return the hotels array
                return JsonResponse(data)
            
            else:
                # Handle the case where the API request fails
                print("api req failed")
                print(response.url)
                return JsonResponse({'error': 'API request failed'}, status=response.status_code)
        except requests.exceptions.RequestException as e:
            return JsonResponse({'error': f'Error: {str(e)}'}, status=500)

    else:
        # If not a POST request, return an error
        return JsonResponse({'error': 'Invalid HTTP method'}, status=405)

import json

@csrf_exempt
def select_room(request):

    if request.method == "POST":
        try:
            data = request.body.decode('utf-8')  # Get the raw JSON string
            json_data = json.loads(data)  # Parse it into a dictionary
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        
        rate_key_url = "https://api.test.hotelbeds.com/hotel-api/1.0/hotels"  
        
        check_in = json_data.get('checkIn')
        check_out =json_data.get('checkOut')
        rooms = json_data.get('rooms') #no of rooms
        adults = json_data.get('adults')
        #children = json_data.get('children')
        hotelSelected = json_data.get('hotelCode')
        print(check_in, check_out, rooms, adults, hotelSelected)
    
        payload = json.dumps({
        "stay": {
            "checkIn": check_in,
            "checkOut": check_out
        },
        "occupancies": [
            {
            "rooms": rooms,
            "adults": adults,
            "children": 0
            }
           
        ],
        "hotels": {
            "hotel": [
            hotelSelected
            ]
        }
        })
        headers = {
        "Api-key": "703feda3aeb02b66f71a4b8878e9d13c",  # Replace with actual API key
        "X-Signature": hashlib.sha256(("703feda3aeb02b66f71a4b8878e9d13c" + "fbf7bd5165" + str(int(time.time()))).encode()).hexdigest(),
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        
        'Content-Type': 'application/json'
        }

        try:
            response = requests.post(rate_key_url, headers=headers, data=payload)

            if response.status_code == 200:
                data = response.json() 

                return JsonResponse(data)  # Return the rate key to React
            else:
                return JsonResponse({'error': 'API request failed'}, status=response.status_code)
        except requests.exceptions.RequestException as e:
            return JsonResponse({'error': f'Error: {str(e)}'}, status=500)
        
    else:
        return JsonResponse({'error': 'wrong HTTP method'}, status=405)







@csrf_exempt
def book_room(request):
    if request.method == "POST":
        try:
            body_json = request.body.decode('utf-8')  # Get the raw JSON string
            #json_data = json.loads(data)  # Parse it into a dictionary
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        booking_url = "https://api.test.hotelbeds.com/hotel-api/1.0/bookings"  
        
       
        headers = {
            "Api-key": "703feda3aeb02b66f71a4b8878e9d13c",  # Replace with actual API key
            "X-Signature": hashlib.sha256(("703feda3aeb02b66f71a4b8878e9d13c" + "fbf7bd5165" + str(int(time.time()))).encode()).hexdigest(),
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip',
            'Content-Type': 'application/json'
        }

        try:
            response = requests.post(booking_url, data = body_json, headers=headers)

            if response.status_code == 200:
                data = response.json() 
        
                return JsonResponse(data)  # Return the booking confirmation to React
            else:
                return JsonResponse({'error': 'API request failed'}, status=response.status_code)
        except requests.exceptions.RequestException as e:
            return JsonResponse({'error': f'Error: {str(e)}'}, status=500)
        
    else:
        return JsonResponse({'error': 'wrong HTTP method'}, status=405)
from .models import Hotel, Room, Image


def store_in_databs(data):
    # Loop through each hotel in the JSON response
    if 'hotels' not in data: 
        print("No hotels found matching your Destination.")
        return
    for hotel_data in data.get('hotels', []):

        # Create a new hotel instance
        description = hotel_data['description']['content'] if 'description' in hotel_data else None
        address = f"{hotel_data['address']['content']}, Street {hotel_data['address']['street']}" if 'address' in hotel_data else None
        phone_numbers = " ".join([mbls.get('phoneNumber', '') for mbls in hotel_data.get('phones', [])])
        coordinates = f"GPS: latitude: {hotel_data.get('coordinates', {}).get('latitude', '')}, longitude: {hotel_data.get('coordinates', {}).get('longitude', '')}"

        hotel, created = Hotel.objects.update_or_create(
            hotelCode=hotel_data['code'],  #lookkup field based on code update a record if it exists alrdy if not create a new one
            defaults={
                'name': hotel_data['name']['content'],
                'description': description,
                'country_code': hotel_data.get('countryCode', {}),
                'destination_code': hotel_data.get('destinationCode', {}),
                'address': address,
                'city': hotel_data['city']['content'],
                'email': hotel_data.get('email', {}),
                'phone_numbers': phone_numbers,
                'coordinates': coordinates,
                'ranking': hotel_data.get('ranking', {})
            }
        )

        # Loop through the rooms data and create Room instances
        for room_data in hotel_data.get('rooms', []):
            Room.objects.update_or_create(
                hotel=hotel,  #lookup field based on hotel instance
                defaults={
                    'room_code': room_data['roomCode'],
                    'is_parentRoom': room_data.get('isParentRoom', {}),
                    'min_pax': room_data.get('minPax', {}),
                    'max_pax': room_data.get('maxPax', {}),
                    'max_adults': room_data['maxAdults'],
                    'max_children': room_data.get('maxChildren', {}),
                    'minAdults': room_data.get('minAdults', {}),
                    'room_type': room_data.get('roomType', {}),
                    'characteristic_code': room_data.get('characteristicCode', {})
                },
            )



        # Loop through the images data and create Image instances
        for image_data in hotel_data.get('images', []):
            Image.objects.update_or_create(
                hotel=hotel,
                defaults={
                    'image_type_code': image_data.get('imageTypeCode', {}),
                    'path': image_data.get('path', {}),
                    'order':image_data.get('order', {}),
                    'visualOrder': image_data.get('visualOrder', {})
                },
            )
    print("Successfully processed and saved hotel data.")



def save_booking_from_api_response(user, booking_data, stripe_intent_id):
    hotel = booking_data['booking']['hotel']
    room = hotel['rooms'][0]
    paxes = room['paxes']

    guest_names = [f"{p['name']} {p['surname']}" for p in paxes]

    booking = HotelBooking.objects.create(
        user=user,
        reference=booking_data['booking']['reference'],
        hotel_name=hotel['name'],
        status=booking_data['booking']['status'],
        check_in=hotel['checkIn'],
        check_out=hotel['checkOut'],
        total_amount=booking_data['booking']['totalNet'],
        currency=booking_data['booking']['currency'],
        guests=", ".join(guest_names),
        stripe_payment_intent_id=stripe_intent_id,
    )

    return booking

from rest_framework.permissions import IsAuthenticated

import json
import stripe
from django.http import JsonResponse
from django.conf import settings
from .models import Booking
import logging
import os
from django.conf import settings

# Configure logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)
handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)
#from django.contrib.auth.models import User  # assuming default User model

print(os.environ.get('STRIPE_SECRET_KEY'))
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')

@csrf_exempt
def process_booking(request):
    if request.method == "POST":
        try:
            # Decode the JSON data from the request body
            booking_data = json.loads(request.body.decode('utf-8'))
            
            # Extract fields
            reference = booking_data['booking']['reference']
            booking_info = booking_data['booking']
            hotel_info = booking_info['hotel']

            #user = request.user
            booking, created = Booking.objects.update_or_create(
                reference=reference,  # Lookup field (reference must be unique)
                defaults={
                    'hotel_name': hotel_info['name'],
                    'check_in': hotel_info['checkIn'],
                    'check_out': hotel_info['checkOut'],
                    'total_amount': float(booking_info['pendingAmount']),
                    'currency': hotel_info['currency'],
                    'status': 'Pending' if booking_info['status'] == 'CONFIRMED' else 'pending',
                }
            )

            # Extract data from booking data
            reference = booking_data['booking']['reference']
            creation_date = booking_data['booking']['creationDate']
            hotel_name = booking_data['booking']['hotel']['name']
            price = int(float(booking_data['booking']['pendingAmount']) * 100)  # Convert to cents for Stripe
            currency = booking_data['booking']['currency']

            # Create a Stripe Checkout Session
            try:
                checkout_session = stripe.checkout.Session.create(
                    payment_method_types=['card'],
                    line_items=[{
                        'price_data': {
                            'currency': currency.lower(),
                            'unit_amount': price,
                            'product_data': {
                                'name': hotel_name,
                            },
                        },
                        'quantity': 1,
                    }],
                    mode='payment',
                    success_url='http://127.0.0.1:8000/api/payment/success/?session_id={CHECKOUT_SESSION_ID}',
                    cancel_url='http://127.0.0.1:8000/api/payment/cancel/?session_id={CHECKOUT_SESSION_ID}',
                    client_reference_id=str(booking.id),
                    metadata={
                        'reference': reference,
                        'creation_date': creation_date,
                    }
                )
                        # Update booking with Stripe session ID
                booking.stripe_session_id = checkout_session.id
                booking.save()

                return JsonResponse({
                    'url': checkout_session.url,
                    'sessionId': checkout_session.id,
                    'reference': reference,
                    'creation_date': creation_date,
                    'hotel_name': hotel_name,
                    'price': price / 100  # Convert back to dollars for display
                })
            except stripe.error.StripeError as e:
                logger.error(f"Stripe error: {str(e)}")
                return JsonResponse({'error': 'Payment processing error'}, status=500)
            except Exception as e:
                logger.error(f"Unexpected error: {str(e)}")
                return JsonResponse({'error': 'An unexpected error occurred'}, status=500)
        
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

    else:
        return JsonResponse({'error': 'Invalid HTTP method'}, status=405)



stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')
STRIPE_WEBHOOK_SECRET = os.environ.get('STRIPE_WEBHOOK_SECRET')


@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        return HttpResponse(status=400)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']

        print(f"Payment was successful for session {session['id']}")
        booking_id = session.get('client_reference_id')
        try:
            booking = Booking.objects.get(id=booking_id)
            booking.status = 'paid'
            booking.save()

        except Booking.DoesNotExist:
            return HttpResponse(status=404)

    return HttpResponse(status=200)

import stripe
from django.http import JsonResponse
from django.shortcuts import render
from .models import Booking
from django.conf import settings

# Set the Stripe API secret key
stripe.api_key = settings.STRIPE_SECRET_KEY  # Make sure your Stripe secret key is set in the settings file.

def payment_success(request):
    try:
    
        session_id = request.GET.get('session_id')

        if not session_id:
            return JsonResponse({'error': 'Session ID missing'}, status=400)

        session = stripe.checkout.Session.retrieve(session_id)

        if session['payment_status'] == 'paid':

            booking_id = session['client_reference_id']  

    
            try:
                booking = Booking.objects.get(id=booking_id)
                booking.status = 'paid'  # Update the booking status to 'paid'
                booking.save()


                return JsonResponse({
                    'message': 'Payment successful! Your booking has been confirmed.',
                    'booking_reference': booking.reference,
                    'hotel_name': booking.hotel_name,
                    'check_in': booking.check_in,
                    'check_out': booking.check_out,
                })
            except Booking.DoesNotExist:
                return JsonResponse({'error': 'Booking not found'}, status=404)

        else:
            return JsonResponse({'error': 'Payment not completed'}, status=400)

    except stripe.error.StripeError as e:
   
        return JsonResponse({'error': f'Stripe error: {str(e)}'}, status=500)

    except Exception as e:
   
        return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)


from django.shortcuts import render

def cancel_view(request):
    return render(request, 'cancel.html')  # Template to show cancellation message


if __name__ == '__main__':
    app.run(port=4242)