from django.core.management.base import BaseCommand
from Flights.utils import fetch_and_save_flights

class Command(BaseCommand):
    help = 'Fetches and saves flight data from external API'

    def handle(self, *args, **kwargs):
        self.stdout.write("Fetching flights...")
        fetch_and_save_flights()
        self.stdout.write("Done fetching flights.")


