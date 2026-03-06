
from django.urls import path
from friends.views import SearchUsersView , CreateFriendRequest , LoadFriendRequestReceived
urlpatterns = [
    path('search-friends/',SearchUsersView.as_view()),
    path('add-friends/',CreateFriendRequest.as_view()) ,
    path('requests-recieved/',LoadFriendRequestReceived.as_view())
]