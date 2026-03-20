import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Message
from users.models import AccountHolder


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        self.room_group_name = f'chat_{self.chat_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)

        message = data['message']
        receiver_id = data['receiver_id']
        sender_id = data.get("sender_id")

        # Save message to DB
        msg_obj = await self.save_message(
            sender_id, receiver_id, message
        )

        # Send to room
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': msg_obj.content,
                'sender_id': msg_obj.sender.id,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))

    @sync_to_async
    def save_message(self, sender_id, receiver_id, message):
        sender = AccountHolder.objects.get(id=sender_id)
        receiver = AccountHolder.objects.get(id=receiver_id)

        return Message.objects.create(
            chat_id=self.chat_id,
            sender=sender,
            content=message
        )