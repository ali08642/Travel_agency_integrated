# Generated by Django 5.1.3 on 2025-05-06 14:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Flights', '0005_flightbooking_currency_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='flightbooking',
            name='currency',
            field=models.CharField(default='usd', max_length=5),
        ),
        migrations.AlterField(
            model_name='passenger',
            name='gender',
            field=models.CharField(choices=[('male', 'MALE'), ('female', 'FEMALE'), ('transgender', 'TRANSGENDER')], max_length=12),
        ),
    ]
