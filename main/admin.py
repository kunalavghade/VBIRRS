from django.contrib import admin
from . models import UserInfo,ContactUs
# Register your models here.

class UserInfoAdmin(admin.ModelAdmin):
	list_display = ("firstName","lastName","email","phone","password")


class ContactUsAdmin(admin.ModelAdmin):
	list_display = ("your_name","email_address","Your_message")


admin.site.register(UserInfo,UserInfoAdmin)
admin.site.register(ContactUs,ContactUsAdmin)