# users/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UpdateFCMTokenView
from .views import GoogleAuthView
from .views import (RegisterView, MeView,LoginView, ChangePasswordView, TrustedContactViewSet, LogoutView, UpdateLocationView, CurrentLocationView,SafePlaceViewSet,ChatMessageViewSet,MergedSafePlacesView,EmergencyMediaViewSet,SOSAlertView
)

router = DefaultRouter()
router.register(r"trusted-contacts", TrustedContactViewSet, basename="trustedcontacts")
router.register(r"safe-places", SafePlaceViewSet, basename="safeplaces")
router.register(r"chat", ChatMessageViewSet, basename="chat")
router.register(r"emergency-media", EmergencyMediaViewSet, basename="emergencymedia")

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("me/", MeView.as_view(), name="me"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("", include(router.urls)),
    path("location/update/", UpdateLocationView.as_view(), name="update_location"),
    path("location/current/", CurrentLocationView.as_view(), name="current_location"),
    path("location/current/<int:user_id>/", CurrentLocationView.as_view(), name="current_location_user"),
    path("safeplaces/merged/", MergedSafePlacesView.as_view(), name="merged_safeplaces"),
    path("fcm/update/", UpdateFCMTokenView.as_view(), name="update_fcm"),
    path("sos/", SOSAlertView.as_view(), name="sos_alert"),
    path("auth/google/", GoogleAuthView.as_view(), name="google_auth"),
]

