from django.shortcuts import render
from .models import Juice
from django.contrib.auth.models import User

# def Show

def vo(request):
    return render(request, 'juice/p.html')

def so(request):
    return render(request, 'juice/so.html')
