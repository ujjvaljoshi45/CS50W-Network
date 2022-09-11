from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile/<str:pUsername>", views.profile, name="profile"),
    path("following", views.following, name="following"),

    #API
    path("api/showposts", views.showPosts, name="showposts"),
    path("api/addpost", views.addPost, name="addpost"),
    path("api/editpost/<int:postIndex>", views.editPost, name="editpost"),
    path('api/likepost/<int:postIndex>', views.likePost, name="likepost"),
    path('api/unlikepost/<int:postIndex>', views.unlikePost, name="dislikepost"),
    path('api/follow/<int:profileId>', views.follow, name="follow"),
    path('api/unfollow/<int:profileId>', views.unfollow, name="unfollow"),
]
