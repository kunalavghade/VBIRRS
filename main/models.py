from django.db import models


class UserInfo(models.Model):
    fullName = models.CharField(max_length=50)
    userName = models.CharField(max_length=50, unique=True)
    email = models.EmailField(max_length=254, unique=True)
    phone = models.IntegerField()
    password = models.CharField(max_length=50)


class ContactUs(models.Model):
    your_name = models.CharField(max_length=50)
    email_address = models.EmailField(max_length=254)
    Your_message = models.CharField(max_length=1024)
