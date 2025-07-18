# Generated by Django 5.2 on 2025-04-30 15:10

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Hotels', '0002_roombooking_is_paid_roombooking_stripe_session_id'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Trip',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(blank=True, null=True, upload_to='trip_images/')),
                ('title', models.CharField(max_length=100)),
                ('destination', models.CharField(max_length=50)),
                ('origin', models.CharField(max_length=50)),
                ('domestic', models.BooleanField(default=True)),
                ('group_tour', models.BooleanField(default=True)),
                ('description', models.TextField()),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('price', models.IntegerField()),
                ('booking_last_date', models.DateField()),
                ('hotel', models.ManyToManyField(to='Hotels.hotel')),
            ],
        ),
        migrations.CreateModel(
            name='TripBooking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('adult_count', models.IntegerField()),
                ('child_count', models.IntegerField()),
                ('total_price', models.IntegerField(blank=True, null=True)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('trip', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='trips.trip')),
            ],
        ),
    ]
