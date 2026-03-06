from django.shortcuts import render

# Generics CBVs
from rest_framework.generics import CreateAPIView , UpdateAPIView , ListAPIView

# Models 
from friends.models import FriendRequest, Friendship
from users.models import AccountHolder

# ORM Utilis.
from django.db.models import Q, Exists, OuterRef
from rest_framework.permissions import IsAuthenticated


# Serializer Models
from friends.serializers import ( UserSearchSerializer, 
                                  CreateFriendRequestSerializer , 
                                  Accept_Or_Reject_RequestSerializer,
                                  FriendRequestSerializer )



class SearchUsersView(ListAPIView):

    serializer_class = UserSearchSerializer

    def get_queryset(self):

        query = self.request.query_params.get("query")
        current_user = self.request.user

        sent_requests = FriendRequest.objects.filter(
            sender=current_user,
            reciever=OuterRef("pk"),
            status="pending"
        )

        friendships = Friendship.objects.filter(
            Q(user_1=current_user, user_2=OuterRef("pk")) |
            Q(user_1=OuterRef("pk"), user_2=current_user)
        )

        users = AccountHolder.objects.filter(
            Q(username__icontains=query) |
            Q(contact__icontains=query)
        ).exclude(id=current_user.id).annotate(

            is_pending=Exists(sent_requests),
            is_friend=Exists(friendships)

        )[:50]

        return users

class CreateFriendRequest(CreateAPIView):
    queryset = FriendRequest.objects.all()
    serializer_class = CreateFriendRequestSerializer

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
        

class LoadFriendRequestReceived(ListAPIView):
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequestSerializer

    def get_queryset(self):
        current_user = self.request.user
        qs = FriendRequest.objects.filter(reciever=current_user , status = "pending").select_related("sender").order_by('-created_at') 
        return qs


class Accept_Or_Reject_Request(UpdateAPIView):
    queryset = FriendRequest.objects.all()
    serializer_class = Accept_Or_Reject_RequestSerializer
