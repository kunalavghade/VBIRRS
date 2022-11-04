from django import forms
from .models import UserInfo, ContactUs


class Signup(forms.Form):
    full_name = forms.CharField(
        max_length=50,
        widget=forms.TextInput(
            attrs={"class": "form-attr", "placeholder": "Full Name"}
        ),
    )
    user_name = forms.CharField(
        max_length=50,
        widget=forms.TextInput(attrs={"class": "form-attr", "placeholder": "Username"}),
    )
    email_address = forms.EmailField(
        max_length=254,
        widget=forms.EmailInput(attrs={"class": "form-attr", "placeholder": "Email"}),
    )
    phone = forms.IntegerField(
        min_value=0,
        widget=forms.NumberInput(attrs={"class": "form-attr", "placeholder": "Phone"}),
    )

    password = forms.CharField(
        max_length=50,
        widget=forms.PasswordInput(
            attrs={"class": "form-attr", "placeholder": "Password"}
        ),
    )


class Login(forms.Form):
    username = forms.CharField(
        max_length=100,
        widget=forms.TextInput(attrs={"class": "form-attr", "placeholder": "Username"}),
    )
    password = forms.CharField(
        max_length=50,
        widget=forms.PasswordInput(
            attrs={"class": "form-attr", "placeholder": "Password"}
        ),
    )


class ContactUsForm(forms.Form):
    your_name = forms.CharField(
        max_length=50, widget=forms.TextInput(attrs={"placeholder": "Name"})
    )
    email_address = forms.EmailField(
        max_length=254, widget=forms.EmailInput(attrs={"placeholder": "Email"})
    )
    Your_message = forms.CharField(
        max_length=1024,
        widget=forms.Textarea(attrs={"placeholder": "Message", "rows": 3}),
    )


class ImageForm(forms.Form):
    user = forms.CharField(widget=forms.HiddenInput())
    image_file = forms.FileField(widget=forms.FileInput(attrs={"accept": "image/*"}))
