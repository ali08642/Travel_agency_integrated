from django import forms

class HotelSearchForm(forms.Form):
    destination_code = forms.CharField(max_length=10, required=True, label="Destination Code")
    country_code = forms.CharField(max_length=5, required=True, label="Country Code")
    language = forms.CharField(max_length=3, required=True, label="Language")
    from_record = forms.IntegerField(required=True, label="From Record")
    to_record = forms.IntegerField(required=True, label="To Record")
    use_secondary_language = forms.BooleanField(required=False, label="Use Secondary Language", initial=False)
