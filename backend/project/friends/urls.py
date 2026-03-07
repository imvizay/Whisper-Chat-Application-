
from django.urls import path
from friends.views import SearchUsersView , CreateFriendRequest , LoadFriendRequestReceived , Accept_Or_Reject_Request
urlpatterns = [
    path('search-friends/',SearchUsersView.as_view()),
    path('add-friends/',CreateFriendRequest.as_view()) ,
    path('requests-recieved/',LoadFriendRequestReceived.as_view()),

    # update request status
    path('request-action/<int:pk>/',Accept_Or_Reject_Request.as_view())
]