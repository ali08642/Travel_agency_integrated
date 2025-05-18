import requests
from .models import FlightBooking
import stripe
from django.conf import settings


stripe.api_key = settings.STRIPE_SECRET_KEY

def create_checkout_session(amount, currency, success_url, cancel_url, metadata=None):
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': currency,
                'unit_amount': int(amount * 100),
                'product_data': {
                    'name': 'Booking Payment',
                },
            },
            'quantity': 1,
        }],
        mode='payment',
        metadata=metadata or {},
        success_url=success_url,
        cancel_url=cancel_url,
    )
    return session
