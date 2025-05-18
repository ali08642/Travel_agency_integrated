from django.urls import path
from . import views


urlpatterns = [
    path('search-hotels/', views.fetch_hotels, name='search_hotels'),
    path('select-room/', views.select_room, name='select_room'),
    path('book-room/', views.book_room, name='book_room'),
    path('process-booking/', views.process_booking, name='process_booking'),
    path('webhook/', views.stripe_webhook, name='stripe-webhook'),
    path('payment/success/', views.payment_success, name='payment_success'),
    #path('/payment/cancel/', views.payment_cancel, name='payment_cancel'),  
]
