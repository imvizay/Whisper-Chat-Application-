from django.db import models

from users.models import AccountHolder

# Create your models here.



# FriendShip And FriendRequest Models
REQ_STATUS = [
    ("pending","pending"),
    ('accepted','accepted'),
    ('cancelled','cancelled')
]
class FriendRequest(models.Model):

    """
    Friend Request Model in which request made by users to other users for becoming friend with each other get stores. 
    """

    sender  = models.ForeignKey(AccountHolder,on_delete=models.CASCADE,related_name="sent_friend_req",db_index=True)
    reciever = models.ForeignKey(AccountHolder,on_delete=models.CASCADE,related_name="recieved_friend_req",db_index=True)
    status = models.CharField(max_length=15,choices=REQ_STATUS,default='pending')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('sender','reciever')

    def __str__(self):
        return f'{self.sender} --> {self.reciever} ({self.status})'
    


class Friendship(models.Model):

    "FriendShip models in which friend relation will get stores."

    user_1 = models.ForeignKey( AccountHolder, on_delete=models.CASCADE, 
                               related_name="friendship_user_1", 
                               db_index=True )

    user_2 = models.ForeignKey( AccountHolder, on_delete=models.CASCADE, 
                               related_name="friendship_user_2", 
                               db_index=True )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user_1", "user_2")

    def __str__(self):
        return f"{self.user_1} <--> {self.user_2}"
    

    
class BlockList(models.Model):

    "Model for storing blocked users."

    blocker = models.ForeignKey(AccountHolder,on_delete=models.CASCADE,related_name="blocked_user")
    blocked = models.ForeignKey(AccountHolder,on_delete=models.CASCADE,related_name="blocked_by")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("blocker", "blocked")

    def __str__(self):
        return f"{self.blocker} blocked {self.blocked}"
