
# Models
from friends.models import FriendRequest,Friendship
from users.models import AccountHolder

# Serializer 
from rest_framework import serializers


class UserSearchSerializer(serializers.ModelSerializer):
    """
    Returns Query Result With FriendShip Relation Status
    """

    status = serializers.SerializerMethodField()

    class Meta:
        model = AccountHolder
        fields = ["id", "username", "contact", "status"]

    def get_status(self, obj):

        if obj.is_friend:
            return "friends"

        if obj.is_pending:
            return "pending"

        return "not_friends"
    


class CreateFriendRequestSerializer(serializers.ModelSerializer):

    """
    Create FriendRequest.
    """
    
    sender = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = FriendRequest
        fields = "__all__"
        extra_kwargs = {
            "status" : {"read_only":True},
            "created_at" : {'read_only':True}
        }


class FriendRequestSerializer(serializers.ModelSerializer):
    """List Friend Request Serializer"""

    sender_username = serializers.CharField(source="sender.username", read_only=True)
    sender_contact = serializers.CharField(source="sender.contact", read_only=True)

    class Meta:
        model = FriendRequest
        fields = ["id","sender","sender_username","sender_contact","status","created_at",]

        read_only_fields = ["status","created_at"]


class Accept_Or_Reject_RequestSerializer(serializers.ModelSerializer):
    """
    Update Friend Request Status. 
    """
    class Meta:
        model = FriendRequest
        fields = "__all__"
        read_only_fields = ["created_at","reciever"]