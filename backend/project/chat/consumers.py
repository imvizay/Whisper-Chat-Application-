import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Message, Chat, UserStatus
from users.models import AccountHolder
from django.utils import timezone


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        print("USER:", self.scope["user"])
        print("AUTH:", self.scope["user"].is_authenticated)

        # Reject unauthenticated users
        if not self.scope["user"].is_authenticated:
            await self.close()
            return

        self.user = self.scope["user"]

        self.chat_id = self.scope["url_route"]["kwargs"]["chat_id"]
        self.chat_room_name = f"chat_{self.chat_id}"

        await self.channel_layer.group_add(
            self.chat_room_name,
            self.channel_name
        )

        await self.accept()

        # Mark online
        await self.mark_online(self.user)

        # Broadcast online status
        await self.channel_layer.group_send(
            self.chat_room_name,
            {
                "type": "user_status_event",
                "user_id": self.user.id,
                "is_online": True
            }
        )

    async def disconnect(self, close_code):
        if hasattr(self, "chat_room_name"):
            await self.channel_layer.group_discard(
                self.chat_room_name,
                self.channel_name
            )

        if hasattr(self, "user") and self.user.is_authenticated:
            print("======================================")

            print("SELF USER value ",self.user)
            print("SELF USER ID Value ",self.user.id)

            print("++++++++++++++++++++++++++++++++++++++++")


            await self.mark_offline(self.user)

            # Broadcast offline status
            await self.channel_layer.group_send(
                self.chat_room_name,
                {
                    "type": "user_status_event",
                    "user_id": self.user.id,
                    "is_online": False,
                    "last_seen": str(timezone.now())
                }
            )

    async def receive(self, text_data):
        data = json.loads(text_data)

        message_type = data.get("type", "message")
        handler_name = f"handle_{message_type}"

        handler = getattr(self, handler_name, None)

        if handler:
            await handler(data)
        else:
            print(f"No handler for type: {message_type}")

    # ========================
    # HANDLE MESSAGE
    # ========================
    async def handle_message(self, data):
        content = data.get("content")

        if not content or not content.strip():
            return

        # do NOT trust frontend sender
        sender = self.user
        receiver_id = data.get("receiver")

        if not receiver_id:
            return

        message = await self.save_message(
            sender.id,
            receiver_id,
            content
        )

        # Check user online/offline
        is_online = await self.is_user_online(receiver_id)

        if is_online:
         await self.update_message_status(message.id, "delivered")


        # Broadcast message
        await self.channel_layer.group_send(
            self.chat_room_name,
            {
                "type": "chat_message",
                "id": message.id,
                "content": message.content,
                "sender_id": message.sender_id,
                "timestamp": str(message.timestamp),
                "status": message.status
            }
        )

    # ========================
    # SEND MESSAGE TO FRONTEND
    # ========================
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "type": "chat_message",
            "id": event["id"],
            "content": event["content"],  
            "sender_id": event["sender_id"],
            "status": event["status"],
            "timestamp": event["timestamp"],
        }))

    # ========================
    # SEND USER STATUS
    # ========================
    async def user_status_event(self, event):
        print("STATUS EVENT TRIGGERED:", event)

        await self.send(text_data=json.dumps({
            "type": "user_status",
            "user_id": event["user_id"],
            "is_online": event["is_online"],
            "last_seen": event.get("last_seen")
        }))

    # ===============
    # HANDLE SEEN
    # ================
    async def handle_seen(self, data):
        message_id = data.get("message_id")

        if not message_id:
            return

        await self.update_message_status(message_id, "seen")

        # notify sender
        await self.channel_layer.group_send(
            self.chat_room_name,
            {
                "type": "message_seen_event",
                "message_id": message_id,
                "status": "seen"
            }
        )

    async def message_seen_event(self, event):
         await self.send(text_data=json.dumps({
             "type": "message_seen",
             "message_id": event["message_id"],
             "status": event["status"]
         }))

    # HANDLE TYPING
    async def handle_typing(self,data):
        await self.channel_layer.group_send(
            self.chat_room_name,
            {
                "type":"typing_event",
                "user_id":self.user.id
            }
        )
    # Handle Stop typing
    async def handle_stop_typing(self,data):
        await self.channel_layer.group_send(
            self.chat_room_name,
            {
                "type":"stop_typing_event",
                "user_id":self.user.id
            }
        )

    # send typing event to frontend
    async def typing_event(self,event):
        await self.send(text_data=json.dumps({
            "type":"typing",
            "user_id":event["user_id"]
        }))
    
    # Send stop typing event to frontend
    async def stop_typing_event(self, event):
        await self.send(text_data=json.dumps({
            "type": "stop_typing",
            "user_id": event["user_id"],
        }))


         
    # ========================
    # DB HELPERS
    # ========================
    @sync_to_async
    def save_message(self, sender_id, receiver_id, content):
        chat = Chat.objects.get(id=self.chat_id)

        return Message.objects.create(
            chat_id=chat.id,
            sender_id=sender_id,
            receiver_id=receiver_id,
            content=content,
        )

    @sync_to_async
    def mark_online(self, user_id):
        status, _ = UserStatus.objects.get_or_create(user_id=user_id.id)
        status.is_online = True
        status.save()

    @sync_to_async
    def mark_offline(self, user):
        status, _ = UserStatus.objects.get_or_create(user_id=user.id)
        status.is_online = False
        status.last_seen = timezone.now()
        status.save()

    @sync_to_async
    def is_user_online(self,user_id):
        try:
            u = UserStatus.objects.get(id=user_id).is_online
            return u
        except:
            return False
        
    @sync_to_async
    def update_message_status(self, message_id, status):
        Message.objects.filter(id=message_id).update(status=status)