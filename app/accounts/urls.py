from django.urls import path
from . import views

urlpatterns = [
    path('user/', views.get_user, name='get_user_info'),
    path('register/', views.register, name='register'),
    path('target/default/', views.get_target_default)
]