from django.shortcuts import render, HttpResponse, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User, auth
from django.contrib import messages
from .forms import Signup, Login, ContactUsForm
from .models import UserInfo, ContactUs
from django.http import JsonResponse
import time
from urllib.request import urlopen
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import cv2
from .YoloDetect import detect, detect_names
from .fire import *
from datetime import datetime


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
                createuser(userName)
                return redirect("/login")
    form = Signup()
    return render(request, "signup.html", {"form": form})
@login_required(login_url="/login")
def main(request):
    if request.method == "POST":
        image_path = request.POST["src"]
        path = None
        if image_path != "":
            path = default_storage.save(f'./Yolo/{request.user.username}-{datetime.now().strftime("%Y%m%d-%H%M%S")}.jpg', ContentFile(urlopen(image_path).read()))
        else:
            file = request.FILES["uploadfile"]
            path = default_storage.save(f'./Yolo/{request.user.username}-{datetime.now().strftime("%Y%m%d-%H%M%S")}.jpg', file)
        if path is not None:
            print(path)
            veggies = detect_names(path)
        # if default_storage.exists(path):
            # default_storage.delete(path)
        time.sleep(10)
        return JsonResponse(
            {
                "msg": "Received",
                'veggies': veggies,
                "recipe" : get_recipe(veggies)
            }
        )
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
