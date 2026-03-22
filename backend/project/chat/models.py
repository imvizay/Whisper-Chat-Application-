from users.models import AccountHolder
from django.db import models


class Chat(models.Model):
    users = models.ManyToManyField(AccountHolder)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat {self.id}"
    

class Message(models.Model):
    STATUS_CHOICES = [
        ("sent", "Sent"),
        ("delivered", "Delivered"),
        ("seen", "Seen"),
    ]

    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(AccountHolder, on_delete=models.CASCADE,related_name='sender_message')
    receiver = models.ForeignKey(AccountHolder,on_delete=models.CASCADE,related_name="receiver_message")
    content = models.TextField()

    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="sent")

    def __str__(self):
        return f"{self.sender} - {self.content[:20]}"
    

class UserStatus(models.Model):
    user = models.OneToOneField(AccountHolder, on_delete=models.CASCADE)
    is_online = models.BooleanField(default=False)
    last_seen = models.DateTimeField(null=True, blank=True)
    

    def __str__(self):
        return f"{self.user} - {'Online' if self.is_online else 'Offline'}"