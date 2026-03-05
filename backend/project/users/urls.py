


from django.urls import path
from users import views

urlpatterns = [
    path('send-otp/',views.SendRegistrationOTP.as_view()), # send otp
    path('verify-otp/',views.VerifyOtpAndCreateAccount.as_view()), # send otp

    path('login/',views.LoginViewRefreshToken.as_view()) # login and generate token for registered user.
]