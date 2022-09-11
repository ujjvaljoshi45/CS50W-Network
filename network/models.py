from operator import mod
from pyexpat import model
from statistics import mode
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    follower = models.ManyToManyField(User, blank=True ,related_name='followers')
    following = models.ManyToManyField(User, blank=True, related_name='following')

    def __str__(self):
        return self.user.username

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    body = models.CharField(max_length=250,null=True,blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    like = models.ManyToManyField(User, blank=True, related_name='likes')

    def serialize(self):
        return {
            "user":self.user.username,
            "body":self.body,
            "createdAt":self.createdAt,
            "like":self.like.count()
        }
    def __str__(self):
        return self.user.username
    