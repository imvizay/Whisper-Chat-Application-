# models
from users.models import AccountHolder

from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer
from rest_framework.validators import ValidationError

import re
class AccountHolderSerializer(ModelSerializer):


    def validate(self, attrs):
        username = attrs.get("username","").strip()
        contact = attrs.get("contact","").strip()

        errors = {}
        
        # -------------------
        # Username Validation
        # -------------------
        if not username:
            errors["username"] = "username cannot be empty."
        else:
            username_pattern = r'^[A-Za-z][A-Za-z0-9_]*$'
            if not re.match(username_pattern,username):
                errors["username"] = ( "Username must start with a letter and contain only letters, numbers, or underscore.")

        # ------------------
        # Contact validation
        # ------------------
        contact_pattern = r'^[6-9]\d{9}$'
        if not contact:
            errors["contact"] = "contact cannot be empty."
        
        elif not re.match(contact_pattern,contact):
            errors["contact"] = ( "Contact must be a valid 10-digit Indian mobile number starting with 9, 8, 7, or 6")
        
        # ------------
        # If errors 
        # -------------
        if errors:
            raise ValidationError(errors)
        
        # --------------
        # If not errors proceed.
        # --------------
        return attrs


    class Meta:
        model = AccountHolder
        fields = "__all__"
        extra_kwargs = {
            "id":{"read_only":True}, 
            "password":{"write_only":True},
            "status":{"read_only":True},
            "account_status":{"read_only":True}   
        }

    def create(self, validated_data):
        password = validated_data.pop("password")

        user = AccountHolder(**validated_data)
        user.set_password(password)
        user.save()

        return user
    