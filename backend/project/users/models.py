from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class AccountHolder(AbstractUser):
    """
    User account
    """
    username = models.CharField(max_length=16, unique=True)
    contact = models.CharField(max_length=16, unique=True)
    status = models.CharField( max_length=10,
                               choices=[('inactive','inactive'),('active','active'),('blocked','blocked') ],
                            )
    
    USERNAME_FIELD = "contact"
    REQUIRED_FIELDS = ["username"]


class Profile(models.Model):
    """
    User's Profile Model for further Kyc or Details.
    """
    user = models.OneToOneField(AccountHolder,on_delete=models.CASCADE)
    profile_pic = models.ImageField(upload_to='profile_pic/',null=True,blank=True)
    gender = models.CharField(max_length=10,
                              choices=[("male","Male"),("female","Female"),('others',"Others")],
                              default="others")

from django.utils import timezone
from datetime import timedelta
class OtpVerification(models.Model):
    username = models.CharField(max_length=20,unique=True,default="vizaymeena")
    password = models.CharField(max_length=8,default="anjani123")
    status = models.CharField(max_length=20,default="inactive")
    contact = models.CharField(max_length=10,blank=False,null=False)
    otp = models.CharField(max_length=6,blank=False,null=False)
    created_at = models.DateTimeField(auto_now_add=True , blank=True,null=False)
    attempts = models.IntegerField(default=0)
    max_attempts = 3
    expiry = models.DateTimeField(db_index=True)
    

    def save(self,*args,**kwargs):
        if not self.expiry:
            self.expiry = timezone.now() + timedelta(minutes=2)

        super().save(*args,**kwargs)

    # checks for otp expiry.
    def is_otp_expired(self):
        return timezone.now() > self.expiry
    
    # check for user if blocked due to max attempts.
    def is_blocked(self):
        return self.attempts > self.max_attempts
    
    def __str__(self):
        return f"{self.contact} - {self.otp}"
