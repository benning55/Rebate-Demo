from django.urls import path
from . import views

urlpatterns = [
    path('user/', views.get_user, name='get_user_info'),
    path('register/', views.register, name='register'),
    path('target/default/', views.TargetDefaultManage.as_view()),
    path('rebate/default/', views.RebateDefaultManage.as_view()),
    path('column/', views.get_column),
    path('custom/', views.CustomManage.as_view())
]