import json
from re import T
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.urls import reverse

from .models import User,Post,Profile


def index(request):
    return render(request, "network/index.html")

def profile(request,pUsername):
    user = User.objects.get(username=pUsername)
    profile = Profile.objects.get(user=user.id)
    check = False
    for u in profile.follower.all():
        if u.username == request.user.username:
            check = True
    return render(request, "network/profile.html", {
        "profile":profile, 
        "user":User.objects.get(username=request.user.username),
        "check":check
        })

def following(request):
    return render(request, "network/following.html", {
        "following":Profile.objects.get(user=request.user.id).following.all()
        })

def showPosts(request):
    return JsonResponse({"posts": [post.serialize() for post in Post.objects.all()]})

@csrf_exempt
@login_required
def addPost(request):
    if request.method != "POST":
        return HttpResponse("Not a Post Request!")
    post = json.loads(request.body)
    newPost = Post(user=request.user, body=post["body"])
    newPost.save()
    return JsonResponse(post)

@csrf_exempt
@login_required
def editPost(request, postIndex):
    postIndex += 1
    if request.method != "POST":
        return HttpResponse("Not a Post Request!")
    newPost = json.loads(request.body)
    existingPost = Post.objects.get(user=request.user,pk=postIndex)
    existingPost.body= newPost["body"]
    existingPost.save()
    return JsonResponse("Success")

@csrf_exempt
@login_required
def likePost(request, postIndex):
    postIndex += 1
    post = Post.objects.get(pk=postIndex)
    post.like.add(request.user)
    post.save()
    return JsonResponse({"post":post.serialize()})

@csrf_exempt
@login_required
def unlikePost(request, postIndex):
    postIndex += 1
    post = Post.objects.get(pk=postIndex)
    post.like.remove(request.user)
    post.save()
    return JsonResponse({"post":post.serialize()})

@csrf_exempt
@login_required
def follow(request, profileId):
    if request.method != "POST":
        return HttpResponse("Not a Post Request!")
    user = json.loads(request.body)
    toBeFollowed = Profile.objects.get(id = profileId)
    toBeFollwer = Profile.objects.get(id = request.user.id - 1)
    toBeFollowed.follower.add(toBeFollwer.user)
    toBeFollwer.following.add(toBeFollowed.user)
    return HttpResponse("Success")

@csrf_exempt
@login_required
def unfollow(request,profileId):
    if request.method != "POST":
        return HttpResponse("Not a Post Request!")
    user = json.loads(request.body)
    toBeFollowed = Profile.objects.get(id = profileId)
    toBeFollwer = Profile.objects.get(id = request.user.id - 1)
    toBeFollowed.follower.remove(toBeFollwer.user)
    toBeFollwer.following.remove(toBeFollowed.user)
    return HttpResponse("Success")

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
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        profile = Profile(user=user)
        profile.save()
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
