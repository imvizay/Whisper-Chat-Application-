from django.http import JsonResponse
from chat.models import Chat
from users.models import AccountHolder
from chat.models import Message,UserStatus

from rest_framework.response import Response

from rest_framework.decorators import api_view

def get_or_create_chat(request):
    user1_id = request.GET.get("user1")
    user2_id = request.GET.get("user2")

    user1 = AccountHolder.objects.get(id=user1_id)
    user2 = AccountHolder.objects.get(id=user2_id)

    # Check if chat already exists
    chat = Chat.objects.filter(users=user1).filter(users=user2).first()

    if not chat:
        chat = Chat.objects.create()
        chat.users.add(user1, user2)

    return JsonResponse({
        "chat_id": chat.id
    })



@api_view(["GET"])
def get_chat_messages(request, chat_id):
    messages = Message.objects.filter(chat=chat_id).order_by("timestamp")

    data = [
        {
            "id": message.id,
            "message": message.content,
            "status":message.status,
            "sender_id": message.sender.id,
            "timestamp": message.timestamp,
        }
        for message in messages
    ]

    return Response(data)

@api_view(["GET"])
def get_friend_lastseen(request,pk):

    status = UserStatus.objects.filter(user=pk).first()

    return Response({
        "is_online": status.is_online if status else False,
        "last_seen": status.last_seen if status else None
    })
