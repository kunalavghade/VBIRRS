from django.contrib import admin
from django.urls import path,include
from main import views

urlpatterns = [
	path('',views.index,name='index page'),
	path('login',views.login,name='login page'),
	path('signup',views.signup,name='signup page'),
	# path('main',views.main,name='main page'),
	path('contactus',views.contactus,name='contactus page'),
	path('about',views.about,name='about page'),
	path('logout',views.logout,name='logout page')
]