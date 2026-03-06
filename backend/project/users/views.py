
from django.shortcuts import render
from rest_framework.response import Response

# CBVs
from rest_framework.views import APIView

import random

# model
from users.models import AccountHolder

# serializer
from users.serializers import AccountHolderSerializer


# services
from users.services import send_sms_otp

from users.models import OtpVerification

class SendRegistrationOTP(APIView):

    """
    this view is for sending otp to user for the credentials we recived meanwhile,also checks for the user if its exists already with an status 'active'  
    """

    def post(self,request):
        # Validate incoming fields and save as inactive user instance.
        serializer = AccountHolderSerializer(data=request.data)

        if not serializer.is_valid(raise_exception=True):
            return Response(serializer.errors)
        
        contact = serializer.validated_data["contact"]

        # Remove user if already present as inactive in db.
        existing_user = AccountHolder.objects.filter(contact=contact,status="active").first()

        if existing_user:
            return Response({"error":"User already exits."})

        # Delete Old OTP in db.
        OtpVerification.objects.filter(contact=contact).delete()

        # Generate random 6 digit OTP.
        random_otp = str(random.randint(100000,999999))
        
        # Store OTP in db.
        store_user_and_otp = OtpVerification.objects.create(
                                                            username=serializer.validated_data["username"],contact=contact, 
                                                            otp=random_otp, 
                                                            status = "inactive",
                                                            password = serializer.validated_data["password"]
                                                        ) 

        # Sends sms otp by twilio.
        send_sms_otp(contact , store_user_and_otp.otp)

        return Response({"message":"OTP sent successfully."})

        

class VerifyOtpAndCreateAccount(APIView):
    
    def post(self,request):
        print('--------------------------')
        print("Running Verify Otp View :----------------")
        print('--------------------------')

        otp = request.data.get('otp')
        contact = request.data.get("contact")

         # Check for Duplicate User.
        if AccountHolder.objects.filter(contact=contact,status="active").exists():
            return Response({"error": "User already exists"}, status=400)

        # Check for any stored OTP and user data in db..
        user_otp_object = OtpVerification.objects.filter(contact=contact,status="inactive").first()
    
        # If not otp object found in Db. 
        if not user_otp_object:
            return Response({"message":"OTP not found."})
        
        # Check if OTP expired. 
        if user_otp_object.is_otp_expired():
            user_otp_object.delete()
            return Response({"message":"OTP expired."})
        
        # OTP Attempt exceed.
        if user_otp_object.is_blocked():
            user_otp_object.delete()
            return Response({"message":"Maximum attempts exceeded. Request new OTP."})
        
        # Wrong OTP
        if user_otp_object.otp != otp:
            user_otp_object.attempts +=1
            user_otp_object.save()

            remaining  = user_otp_object.max_attempts - user_otp_object.attempts

            return Response({
                            "error":"Invalid OTP.",
                            "remaining_attempts":remaining
                        })
                

        # Create New User followed by verified OTP.
        user = AccountHolder(
                  username=user_otp_object.username,
                  contact=user_otp_object.contact,
                  status="active"
              )
              
        user.set_password(user_otp_object.password)
        user.save()

        user_otp_object.delete()

        return Response({"message":"OTP verified successfully."},status=200)
        


# Login view
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

class LoginViewRefreshToken(APIView):
    """
    Class View for generating jwt tokens for user.
    """
    def post(self,request):
        contact = request.data.get('contact')
        password = request.data.get('password')

        # authenticate user cred.
        user = authenticate(contact = contact,password = password)

        if not user:
            return Response({"error":"invalid credentials"},status=401)
        
        # Generate token 
        refresh = RefreshToken.for_user(user)

        return Response({
            "access":str(refresh.access_token),
            "refresh":str(refresh),
            "user":{
                "id":user.id,
                "username":user.username,
                "contact":user.contact,
                "status":user.status
            }
        })


