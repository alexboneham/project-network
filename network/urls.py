
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("new", views.new, name="new"),
    path("following", views.following, name="following"),
    path("users/<str:name>", views.profile, name="profile"),
    # API paths
    path("users/<int:id>/follow", views.follow, name="follow")
]
