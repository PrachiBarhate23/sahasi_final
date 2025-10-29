# users/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import TrustedContact, Location, SafePlace 
from .models import ChatMessage,EmergencyMedia,SOSAlert

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id", "username", "email", "first_name", "last_name", 
            "phone", "is_verified", "fcm_token",
            "address", "blood_group", "emergency_contact"
        ]

class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "last_name", "phone", "address", "blood_group", "emergency_contact"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ["username", "email", "password", "first_name", "last_name", "phone"]

    def validate_email(self, value):
        if value and User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email already in use.")
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(**validated_data, password=password)
        return user

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=6)

class TrustedContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrustedContact
        fields = ["id", "name", "phone", "email", "relationship", "created_at"]
        read_only_fields = ["id", "created_at"]

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ["id", "latitude", "longitude", "timestamp"]
        read_only_fields = ["id", "timestamp"]

class SafePlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SafePlace
        fields = ["id", "name", "latitude", "longitude", "category", "address", "created_at"]
        read_only_fields = ["id", "created_at"]



class ChatMessageSerializer(serializers.ModelSerializer):
    sender = serializers.ReadOnlyField(source="sender.username")
    receiver = serializers.ReadOnlyField(source="receiver.username")

    class Meta:
        model = ChatMessage
        fields = ["id", "sender", "receiver", "message", "timestamp", "is_read"]
        read_only_fields = ["id", "timestamp", "is_read", "sender", "receiver"]

class EmergencyMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyMedia
        fields = ["id", "file", "media_type", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate(self, attrs):
        f = attrs.get("file")
        mtype = attrs.get("media_type")

        ct = getattr(f, "content_type", None)
        if ct:
            if mtype == "photo" and not ct.startswith("image/"):
                raise serializers.ValidationError({"file": "Expected an image file for media_type='photo'."})
            if mtype == "video" and not ct.startswith("video/"):
                raise serializers.ValidationError({"file": "Expected a video file for media_type='video'."})

        # Optional: 50 MB max
        if f and f.size > 50 * 1024 * 1024:
            raise serializers.ValidationError({"file": "File too large (max 50 MB)."})
        return attrs

class SOSAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = SOSAlert
        fields = ["id", "message", "is_active", "created_at"]
        read_only_fields = ["id", "created_at", "is_active"]