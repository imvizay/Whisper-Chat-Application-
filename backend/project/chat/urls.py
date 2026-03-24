from django.urls import path
from chat.views import get_or_create_chat , get_chat_messages , get_friend_lastseen

urlpatterns = [
   path("get-chat/", get_or_create_chat),
   path("chat/<int:chat_id>/messages/", get_chat_messages),
   path('last-seen/<int:pk>/',get_friend_lastseen)
]
