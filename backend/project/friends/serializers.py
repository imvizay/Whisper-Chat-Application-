
# Models
from friends.models import FriendRequest,Friendship
from users.models import AccountHolder

# Serializer 
from rest_framework import serializers
from rest_framework.validators import ValidationError


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
        fields = ['status']

    def validate(self, attrs):
        request = self.context["request"]

        # only receiver can accpet.
        if self.instance.reciever != request.user:
            return ValidationError("You are not allowed to update this request.")
        
        if self.instance.status != "pending":
            raise serializers.ValidationError(
                "This request has already been processed."
            )

        return attrs
    

    def update(self, instance, validated_data):

        new_status = validated_data.get("status")

        instance.status = new_status
        instance.save()

        # create friendship if accepted
        if new_status == "accepted":

            Friendship.objects.get_or_create(
                user_1=instance.sender,
                user_2=instance.reciever
            )

        return instance

        

    