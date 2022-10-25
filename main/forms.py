from django import forms
from .models import UserInfo,ContactUs

class Signup(forms.Form):
	first_name = forms.CharField(max_length = 50,widget=forms.TextInput(attrs={'class':"form-attr","placeholder":"Enter first name"}))
	last_name = forms.CharField(max_length = 50,widget=forms.TextInput(attrs={'class':"form-attr","placeholder":"Enter last name"}))
	email_address = forms.EmailField(max_length = 254,widget=forms.EmailInput(attrs={'class':"form-attr","placeholder":"Enter Email"}))
	phone = forms.IntegerField(widget=forms. NumberInput(attrs={'class':"form-attr","placeholder":"Enter phone"}))
	password = forms.CharField(max_length = 50,widget=forms.PasswordInput(attrs={'class':"form-attr","placeholder":"Enter Password"}))

class Login(forms.Form):
	username = forms.CharField(max_length = 100,widget=forms.TextInput(attrs={'class':"form-attr","placeholder":"Enter first_name+last_name"}))
	password = forms.CharField(max_length = 50,widget=forms.PasswordInput(attrs={'class':"form-attr","placeholder":"Enter Password"}))

class ContactUsForm(forms.Form):
	your_name = forms.CharField(max_length = 50,widget=forms.TextInput(attrs={'class':"form-control"}))
	email_address = forms.EmailField(max_length = 254,widget=forms.EmailInput(attrs={'class':"form-control"}))
	Your_message = forms.CharField(max_length = 1024,widget=forms.Textarea(attrs={'class':"form-control"}))
