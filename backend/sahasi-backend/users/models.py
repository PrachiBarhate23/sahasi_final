# users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class User(AbstractUser):
    phone = models.CharField(max_length=20, blank=True)
    is_verified = models.BooleanField(default=False)
    fcm_token = models.CharField(max_length=512, blank=True, null=True)

    # ADD THESE
    address = models.CharField(max_length=255, blank=True, null=True)
    blood_group = models.CharField(max_length=10, blank=True, null=True)
    emergency_contact = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.username


class TrustedContact(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="trusted_contacts")
    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=30)
    email = models.EmailField(blank=True)
    fcm_token = models.CharField(max_length=255, blank=True, null=True)
    relationship = models.CharField(max_length=60, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.owner.username})"


class Location(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="locations")
    latitude = models.FloatField()
    longitude = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.latitude}, {self.longitude}"
    

class SafePlace(models.Model):
    CATEGORY_CHOICES = [
        ("police", "Police Station"),
        ("hospital", "Hospital"),
        ("shelter", "Shelter"),
        ("other", "Other"),
    ]

    name = models.CharField(max_length=200)
    latitude = models.FloatField()
    longitude = models.FloatField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    address = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.category})"
    
# users/models.py

class ChatMessage(models.Model):
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sent_messages"
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="received_messages"
    )
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-timestamp"]

    def __str__(self):
        return f"From {self.sender.username} to {self.receiver.username}: {self.message[:30]}"

# --- Emergency Evidence Media ---
class EmergencyMedia(models.Model):
    MEDIA_CHOICES = [
        ("photo", "Photo"),
        ("video", "Video"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="emergency_media")
    file = models.FileField(upload_to="emergency_media/%Y/%m/%d/")
    media_type = models.CharField(max_length=10, choices=MEDIA_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} - {self.media_type} - {self.created_at:%Y-%m-%d %H:%M:%S}"

class SOSAlert(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sos_alerts")
    message = models.TextField(blank=True, null=True)  # optional custom message
    is_active = models.BooleanField(default=True)      # active until user cancels
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"SOS from {self.user.username} at {self.created_at:%Y-%m-%d %H:%M:%S}"
