import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator

from .models import User, Post
from .forms import *

# Define global variables
PAGINATION_LIMIT = 10

def index(request):
    posts = Post.objects.all().order_by("-timestamp")
    page_obj = paginate(request, posts, PAGINATION_LIMIT)

    return render(request, "network/index.html", {
        "form": NewPostForm(),
        "posts": page_obj,
        "title": "All Posts",
        "liked_posts": liked_posts(request)
    })


@login_required
def following(request):
    following = User.objects.get(pk=request.user.id).following.all()
    posts = Post.objects.filter(author__in = following)
    page_obj = paginate(request, posts, PAGINATION_LIMIT)

    return render(request, "network/index.html", {
        "form": NewPostForm(),
        "title": "Following",
        "posts": page_obj,
        "liked_posts": liked_posts(request)
    })


@login_required
def new(request):
    if request.method == 'POST':

        # Validate form data
        form = NewPostForm(request.POST)
        if form.is_valid():

            # Create new post in database
            data = form.cleaned_data
            p = Post(content = data["content"], author = User.objects.get(pk=request.user.id))
            p.save()
            messages.success(request, "Successfully added a new post!")

    return HttpResponseRedirect(reverse("index"))

@csrf_exempt
@login_required
def edit_post(request, id):
    if request.method != "PUT":
        return JsonResponse({"error": "Request method must be PUT"})

    p = Post.objects.get(pk=id)

    if request.user != p.author:
        return JsonResponse({"error": "Not valid user"})

    data = json.loads(request.body)
    p.content = data["newContent"]
    p.save()
    
    return JsonResponse({"success": "Post has been edited"})

@csrf_exempt
@login_required
def like_post(request, id):
    if request.method != "PUT":
        return JsonResponse({"error": "Request method must be PUT"})
    
    p = Post.objects.get(pk=id)

    likers = p.likers.all()

    try:
        if request.user in likers:
            # Unlike post
            p.likers.remove(request.user)
            return JsonResponse({
                "success": "User un-liked post",
                "count": p.likers.count()
            }, safe=False)
        else: 
            # Like post
            p.likers.add(request.user)
            return JsonResponse({
                "success": "User liked post",
                "count": p.likers.count()
            }, safe=False)
    except:
        return JsonResponse({"error": "Something went wrong"})


@csrf_exempt
def profile(request, name):
    if request.method != 'GET' and request.method != 'PUT':

        print(f"Method was: {request.method}")
        return HttpResponse('Error')
    
    # Query database for info about profile user
    profile = User.objects.get(username = name)
    isFollowing = True if profile.followers.filter(username=request.user) else False

    if request.method == 'GET':

        # Load context infomation for profile page view
        posts = profile.posts.all().order_by('-id')
        page_obj = paginate(request, posts, PAGINATION_LIMIT)

        return render(request, "network/profile.html", {
            "user_profile": profile,
            "posts": page_obj,
            "isFollowing": isFollowing,
            "liked_posts": liked_posts(request)
        })
    
    else:

        # Request method is PUT.
        # API for processing following/unfollowing of profile
        if not request.user.is_authenticated:
            return JsonResponse({"error": "User is not logged in"})

        if isFollowing == False:
            profile.followers.add(User.objects.get(pk=request.user.id))
            isFollowing = True
        elif isFollowing:
            profile.followers.remove(User.objects.get(pk=request.user.id))
            isFollowing = False
        else:
            return JsonResponse({"error": "Database returned unknown response"}) 
        
        count = profile.followers.all().count()

        return JsonResponse({"isFollowing": isFollowing, "count": count}, safe=False)


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]
        image = request.POST["image"]

        # Add default image if not provided
        if not image:
            image = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.image = image
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")



def paginate(request, posts, num):

    # Helper function for pagination
    paginator = Paginator(posts, num)
    page_num = request.GET.get('page')
    page_obj = paginator.get_page(page_num)

    return page_obj



def liked_posts(request):
    if request.user.is_authenticated:
        return request.user.liked_posts.all()

    return None
