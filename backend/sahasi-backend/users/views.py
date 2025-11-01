# users/views.py
from rest_framework import generics, viewsets, permissions, status,serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import permissions
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer, ChangePasswordSerializer, TrustedContactSerializer
from .models import TrustedContact
from django.shortcuts import get_object_or_404
from .models import Location, SafePlace, ChatMessage,EmergencyMedia,SOSAlert   # updated import
from .serializers import LocationSerializer, SafePlaceSerializer, ChatMessageSerializer,EmergencyMediaSerializer,SOSAlertSerializer,UpdateProfileSerializer
import requests
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.mail import send_mail
from django.conf import settings
from twilio.rest import Client
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
import base64
from email.mime.text import MIMEText
from pyfcm import FCMNotification
from .tasks import send_sos_email, send_sos_push, send_sos_sms
from .utils.capture_media import capture_photo, capture_video


User = get_user_model()

def send_gmail_oauth2(subject, message, to_email):
    creds = Credentials(
        None,
        refresh_token=settings.GMAIL_REFRESH_TOKEN,
        client_id=settings.GMAIL_CLIENT_ID,
        client_secret=settings.GMAIL_CLIENT_SECRET,
        token_uri="https://oauth2.googleapis.com/token",
    )
    service = build("gmail", "v1", credentials=creds)

    mime_message = MIMEText(message)
    mime_message["to"] = to_email
    mime_message["from"] = settings.GMAIL_FROM_EMAIL
    mime_message["subject"] = subject

    raw = base64.urlsafe_b64encode(mime_message.as_bytes()).decode()
    service.users().messages().send(userId="me", body={"raw": raw}).execute()


class GoogleAuthView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        token = request.data.get("id_token")
        if not token:
            return Response({"detail": "id_token required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Verify token with Google
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), None)

            email = idinfo.get("email")
            name = idinfo.get("name", "")
            first_name = name.split(" ")[0] if name else ""
            last_name = " ".join(name.split(" ")[1:]) if len(name.split(" ")) > 1 else ""

            # Find or create user
            user, created = User.objects.get_or_create(email=email, defaults={
                "username": email.split("@")[0],
                "first_name": first_name,
                "last_name": last_name,
                "is_verified": True
            })

            # Issue JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": UserSerializer(user).data
            })
        except ValueError:
            return Response({"detail": "Invalid Google token"}, status=status.HTTP_400_BAD_REQUEST)
        
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print("REGISTER SERIALIZER ERRORS:", serializer.errors, flush=True)  # <-- Add this line
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]

class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_object(self):
        return self.request.user

class UpdateProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        serializer = UpdateProfileSerializer(instance=request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Profile completed"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        if not user.check_password(serializer.validated_data["old_password"]):
            return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(serializer.validated_data["new_password"])
        user.save()
        return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)

class TrustedContactViewSet(viewsets.ModelViewSet):
    serializer_class = TrustedContactSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return TrustedContact.objects.filter(owner=self.request.user).order_by("-created_at")
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"detail": "Refresh token required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Logged out."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)

#1. Update current user's location
class UpdateLocationView(generics.CreateAPIView):
    serializer_class = LocationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# 2. Get latest location of a user (only if trusted contact in future)
class CurrentLocationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id=None):
        if user_id:
            user = get_object_or_404(User, id=user_id)

        # Check: only allow self or trusted contact
            if user != request.user:
                if not TrustedContact.objects.filter(owner=user, phone=request.user.phone).exists() \
                    and not TrustedContact.objects.filter(owner=user, email=request.user.email).exists():
                        return Response({"detail": "Not authorized to see this user's location."}, status=status.HTTP_403_FORBIDDEN)
        else:
            user = request.user


        location = Location.objects.filter(user=user).order_by("-timestamp").first()
        if not location:
            return Response({"detail": "No location found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = LocationSerializer(location)
        return Response(serializer.data, status=status.HTTP_200_OK)

class SafePlaceViewSet(viewsets.ModelViewSet):
    queryset = SafePlace.objects.all().order_by("-created_at")
    serializer_class = SafePlaceSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Optional: filter safe places by category
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        category = request.query_params.get("category")
        if category:
            queryset = queryset.filter(category=category)
        return Response(SafePlaceSerializer(queryset, many=True).data)
    

class ChatMessageViewSet(viewsets.ModelViewSet):
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return ChatMessage.objects.filter(sender=user) | ChatMessage.objects.filter(receiver=user)

    def perform_create(self, serializer):
        receiver_id = self.request.data.get("receiver_id")
        if not receiver_id:
            raise serializers.ValidationError({"receiver_id": "Receiver ID required"})
        receiver = get_object_or_404(User, id=receiver_id)
        serializer.save(sender=self.request.user, receiver=receiver)

from math import radians, cos, sin, asin, sqrt

class MergedSafePlacesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def haversine(self, lon1, lat1, lon2, lat2):
        lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * asin(sqrt(a))
        km = 6371 * c
        return km * 1000  # meters

    def get(self, request):
        import requests as http
        lat = request.query_params.get("lat")
        lng = request.query_params.get("lng")
        radius = float(request.query_params.get("radius", 3000))
        category_filter = request.query_params.get("category")

        if not lat or not lng:
            return Response({"detail": "lat and lng required"}, status=status.HTTP_400_BAD_REQUEST)

        lat, lng = float(lat), float(lng)
        all_places = []

        # 1. Verified DB safe places
        for place in SafePlace.objects.all():
            distance = self.haversine(lng, lat, place.longitude, place.latitude)
            if distance <= radius and (not category_filter or place.category == category_filter):
                all_places.append({
                    "id": place.id,
                    "name": place.name,
                    "latitude": place.latitude,
                    "longitude": place.longitude,
                    "address": place.address,
                    "category": place.category,
                    "source": "verified",
                    "distance_meters": round(distance, 1)
                })

        # 2. OSM safe places
        query = f"""
        [out:json];
        (
          node["amenity"="police"](around:{radius},{lat},{lng});
          node["amenity"="hospital"](around:{radius},{lat},{lng});
          node["amenity"="shelter"](around:{radius},{lat},{lng});
        );
        out center;
        """
        url = "https://overpass-api.de/api/interpreter"
        resp = http.post(url, data={"data": query})
        if resp.status_code == 200:
            data = resp.json()
            for element in data.get("elements", []):
                category = element.get("tags", {}).get("amenity")
                if not category_filter or category == category_filter:
                    distance = self.haversine(lng, lat, element["lon"], element["lat"])
                    all_places.append({
                        "name": element.get("tags", {}).get("name", "Unknown"),
                        "latitude": element.get("lat"),
                        "longitude": element["lon"],
                        "address": element.get("tags", {}).get("addr:full", "No address"),
                        "category": category,
                        "source": "osm",
                        "distance_meters": round(distance, 1)
                    })

        all_places = sorted(all_places, key=lambda x: x["distance_meters"])
        return Response(all_places, status=status.HTTP_200_OK)


class EmergencyMediaViewSet(viewsets.ModelViewSet):
    serializer_class = EmergencyMediaSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return EmergencyMedia.objects.filter(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SOSAlertView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        sos = SOSAlert.objects.create(user=request.user, message=request.data.get("message", ""))

        # --- Try to capture emergency media (failsafe) ---
        media_links = []
        try:
            photo = capture_photo()
            if photo:
                m = EmergencyMedia.objects.create(user=request.user, file=photo, media_type="photo")
                media_links.append(request.build_absolute_uri(m.file.url))
        except Exception as e:
            print("Photo capture failed:", e)
        try:
            video = capture_video(duration=5)
            if video:
                m = EmergencyMedia.objects.create(user=request.user, file=video, media_type="video")
                media_links.append(request.build_absolute_uri(m.file.url))
        except Exception as e:
            print("Video capture failed:", e)

        # --- Latest location (if available) ---
        location = Location.objects.filter(user=request.user).order_by("-timestamp").first()

        # --- Build alert text ---
        alert_text = "🚨 SOS ALERT 🚨\n\n"
        alert_text += f"User: {request.user.get_full_name() or request.user.username}\n"
        alert_text += f"Email: {request.user.email}\n\n"
        if sos.message:
            alert_text += f"Message: {sos.message}\n"
        if location:
            alert_text += f"Last location: {location.latitude}, {location.longitude}\n"
            alert_text += f"Google Maps: https://maps.google.com/?q={location.latitude},{location.longitude}\n"
        if media_links:
            alert_text += "\nEmergency Media:\n" + "\n".join(media_links)
        alert_text += "\nThis is an automatic emergency alert from the Sahasi app."

        # --- Collect recipients ---
        contacts = request.user.trusted_contacts.all()
        emails = [c.email for c in contacts if c.email]
        phones = [c.phone for c in contacts if c.phone]
        tokens = [c.fcm_token for c in contacts if c.fcm_token]


        # --- Dispatch notifications asynchronously (Celery) ---
        if emails:
            send_sos_email.delay("🚨 SOS Alert", alert_text, emails)
        if tokens:
            send_sos_push.delay(tokens, "🚨 SOS Alert", alert_text)
        if phones:
            send_sos_sms.delay(alert_text, phones)

        return Response({
            "detail": "SOS triggered. Notifications are being sent in the background.",
            "media_links": media_links,
        }, status=status.HTTP_201_CREATED)

    def delete(self, request):
        sos = SOSAlert.objects.filter(user=request.user, is_active=True).last()
        if sos:
            sos.is_active = False
            sos.save()
            return Response({"detail": "SOS alert cancelled."}, status=status.HTTP_200_OK)
        return Response({"detail": "No active SOS found."}, status=status.HTTP_404_NOT_FOUND)



    
class UpdateFCMTokenView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        token = request.data.get("fcm_token")
        if not token:
            return Response({"detail": "fcm_token required"}, status=status.HTTP_400_BAD_REQUEST)
        
        request.user.fcm_token = token
        request.user.save()
        return Response({"detail": "Token updated."}, status=status.HTTP_200_OK)
