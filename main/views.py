from django.shortcuts import render, HttpResponse, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User, auth
from django.contrib import messages
from .forms import Signup, Login, ContactUsForm

# from django.core.mail import send_mail, BadHeaderError
from .models import UserInfo, ContactUs
from django.http import JsonResponse

# import requests

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

serviceAccountKey = {
  "type": "service_account",
  "project_id": "database-1c96e",
  "private_key_id": "56ab78de64e3acb4b69d06b29a78866189c1ff14",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQChGOxbapyRort5\nHjLo23BFKF428HV/eH/CQh38sp1I7t3imJdK554b6Ekzou9qPdPZ2BoTQMtBnHbN\nCycc+kqVg+759lrKh+vdFSHdErl2//AP2LHXQ43CCGjp9KmkEBbFxQPhbiKj3mQF\no531qDPohM2BaXrNcEZqrur7y2X1WQs0L7AitlT6XLFKJFgUuOjG50QfqIyR02LM\ngYq1l8s22YhlVLJF2g+qwDsGkfuAO63obYpNSI4BjAJFprA7MDIojATuFHV7RfZ2\nFhulr0BY/a5yentTne4/F4679cLECHL1gsRaE3o7tTwONnLwiTcnjw1suhuYXFYy\n9A1U7tyLAgMBAAECggEAFrvDUZyNibO9jE2pq4ND/aPBCom2Ww2wdxkIzZ87Djlp\n0HnuEmD1xpm/XW0R0hv1fcQUMewD2Ddx6w+MLnes92/N1TJhr5ECGjR1jz1UNNR7\nQRE4T4NgntARq2pJAjZPBbZUDNzo6y0NT7UTgRYtH76V7ZGVWyZhRC7OSZ1zaZg0\nuxdYk2pMzoLMdt1YwPOER99bLwjGcmwn64sS+s1lPLbQEw0qB3w+QCiMiZFLLLL4\n/m7Oo+jzopX7q0S0EPfQkIKC+2SQqtmP9TYU1bkxYGU0EA9LQcelgFGzsStdzT2i\nOf72dYYpK9iwW8kiWN/DPb4zhu5ZOLT2bY3qMb7FOQKBgQDb1uW1ARbBhDer08EZ\nyRoXdwBTzQp6FT1QVTgbhBKkydskDOKYH4nFGOfk/0Xe8369sypjOfzlqRIlYDeC\nTHTyfZ2WYqFhFG015NggFe/xJ75uTBTdTDB6t7EgmG2MyUSz0mAb4ZGrHVncyyfx\nwVtc+VZQk9dssbNZ/1KjXH7mRwKBgQC7mHyQEbN//SBfJdxR5O+jhHypcw0WBjm4\nTyQNDOp4LqMUTlXuI0xSYgvNhc/VHYpt+k7ZrciMARIxFamDA3excdeu4u7WmQjb\neFG3uxguEeyXuW0/lvttRiazJnbwXUSfxFCMnEpMn1ymI5RPLKEjmBjeqPug5KAF\nqdOiNWHFnQKBgQDAst/rBydRPXonDZhH5/UM+Gy7CBHU7WUvU2O5Cs3k0GNceEbv\nHUYAFFLAcdpnEXzY/4F6NMwu60JSrMI7XpVsMRu/RHk8xVDtWsjvZwtJkZLkz5/C\nUxRznSyP68yrCYlFLnS8O78aBMJOPW2oBdr15kD4pH7CcglKK/nd5Cf/5QKBgFC+\nYV7hP5FnMffCJAJbt4l6DO4iRw+jvlRGPA4h8QmpiSfET9gf+Um8Sbg8UCg6fsq3\nYhjvY9Je46Wc3Uk2xN3rUhpEMujLFbThJMsgDFhH/r2PYiZspetytlWFyMvMWS0r\nIkBjRNeWABrCVaN+Yh0f6hRsR2IJBZdqcVzv/RVBAoGAKjO/fVzp7JjRjfZ+37Nt\nBOOmAJ51s+4TDjZnIp/qW4RDp/40x2Q6rgNuKsWwc4jF+sPdgtbB42HBXWlyMJVf\njiDJMBCnup1nEpiChn5eFzkhn6UBM40mRvDi76s+Wrl+ZYNsosM3SFiG3o8wUAzo\nXRFbPPmrGZs5gmhsme+Klxc=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-wgvlo@database-1c96e.iam.gserviceaccount.com",
  "client_id": "100774660557246534195",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-wgvlo%40database-1c96e.iam.gserviceaccount.com"
}

if not firebase_admin._apps:
    cred = credentials.Certificate(serviceAccountKey)
    firebase_admin.initialize_app(cred, {
    'databaseURL' : 'https://database-1c96e-default-rtdb.firebaseio.com/'
    })
database = db.reference('/')

def index(request):
    return render(request, "index.html", {"title": "Home"})


def signup(request):
    if request.method == "POST":
        form = Signup(request.POST)
        if form.is_valid():
            fullName = form.cleaned_data["full_name"]
            userName = form.cleaned_data["user_name"]
            email = form.cleaned_data["email_address"]
            phone = form.cleaned_data["phone"]
            password = form.cleaned_data["password"]
            if User.objects.filter(username=userName).exists():
                form = Signup()
                messages.error(request, ("Username Taken"))
                render(request, "signup.html", {"form": form}, status=422)
            else:
                User.objects.create_user(
                    first_name=fullName,
                    email=email,
                    password=password,
                    username=userName,
                ).save()
                UserInfo(
                    fullName=fullName,
                    userName=userName,
                    email=email,
                    phone=phone,
                    password=password,
                ).save()
                user_ref = database.child('users')
                user_ref.update({
                    userName : ['None']
                    })
                return redirect("/login")
    form = Signup()
    return render(request, "signup.html", {"form": form})


@login_required(login_url="/login")
def main(request):
    return render(request, "index.html")


def logout(request):
    auth.logout(request)
    return redirect("./login", {"user": None})


def login(request):
    if request.method == "POST":
        form = Login(request.POST)
        if form.is_valid():
            username = form.cleaned_data["username"]
            password = form.cleaned_data["password"]
            user = auth.authenticate(username=username, password=password)
            if user is not None and not user.is_staff:
                auth.login(request, user)
                return redirect("./main")
            else:
                messages.error(request, ("Invalid Credentials!"))
                return redirect("./login", {"form": form})
    else:
        form = Login()
        return render(request, "login.html", {"form": form, "title": "Login"})


def about(request):
    return render(request, "about.html")


def contact(request):
    if request.method == "POST":
        form = ContactUsForm(request.POST)
        if form.is_valid():
            your_name = form.cleaned_data["your_name"]
            email_address = form.cleaned_data["email_address"]
            Your_message = form.cleaned_data["Your_message"]
            ContactUs(
                Your_message=Your_message,
                email_address=email_address,
                your_name=your_name,
            ).save()
            messages.success(request, "We've received your message!Thank You!")
            form = ContactUsForm()
            return render(request, "contactus.html", {"form": form}, status=200)
    else:
        form = ContactUsForm()
        return render(request, "contactus.html", {"form": form})
