# users/tasks.py
from celery import shared_task
from django.conf import settings
from twilio.rest import Client
from pyfcm import FCMNotification
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from email.mime.text import MIMEText
import base64

# ---------------------
# Gmail OAuth2 helper
# ---------------------
# def send_gmail_oauth2_email(subject, body, to_emails):
#     """
#     Sends email using Gmail API OAuth2.
#     """
#     creds = Credentials(
#         None,
#         refresh_token=settings.GMAIL_REFRESH_TOKEN,
#         client_id=settings.GMAIL_CLIENT_ID,
#         client_secret=settings.GMAIL_CLIENT_SECRET,
#         token_uri="https://oauth2.googleapis.com/token",
#     )
#     service = build("gmail", "v1", credentials=creds)

#     for email in to_emails:
#         mime_message = MIMEText(body, "plain")
#         mime_message["to"] = email
#         mime_message["from"] = settings.GMAIL_FROM_EMAIL
#         mime_message["subject"] = subject

#         raw = base64.urlsafe_b64encode(mime_message.as_bytes()).decode()
#         service.users().messages().send(userId="me", body={"raw": raw}).execute()


# ---------------------
# Celery Tasks
# ---------------------

# @shared_task(bind=True, max_retries=3, default_retry_delay=15)
# def send_sos_email(self, subject, body, to_emails):
#     """
#     Sends SOS email to list of recipients using Gmail OAuth2.
#     Retries up to 3 times if it fails.
#     """
#     try:
#         send_gmail_oauth2_email(subject, body, to_emails)
#         print(f"[Celery] Email sent to: {to_emails}")
#     except Exception as e:
#         print(f"[Celery] Email sending failed: {e}")
#         raise self.retry(exc=e)


# @shared_task(bind=True)
# def send_sos_sms(self, message, phones):
#     """
#     Sends SOS SMS to list of phone numbers using Twilio.
#     """
#     client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
#     results = {}
#     for phone in phones:
#         try:
#             sms = client.messages.create(
#                 body=message,
#                 from_=settings.TWILIO_PHONE_NUMBER,
#                 to=phone
#             )
#             results[phone] = {"sid": sms.sid, "status": sms.status}
#         except Exception as e:
#             results[phone] = {"error": str(e)}
#     print("[Celery] SMS result:\n", results)
#     return results


# @shared_task(bind=True)
# def send_sos_push(self, tokens, title, body):
#     """
#     Sends push notifications to multiple devices using FCM.
#     """
#     push_service = FCMNotification(api_key=settings.FCM_SERVER_KEY)
#     result = push_service.notify_multiple_devices(
#         registration_ids=tokens,
#         message_title=title,
#         message_body=body
#     )
#     print("[Celery] Push result:\n", result)
#     return result

from celery import shared_task
from django.conf import settings
from twilio.rest import Client
from pyfcm import FCMNotification


@shared_task(bind=True)
def send_sos_whatsapp(self, message, phones):
    """
    Sends SOS alert via WhatsApp using Twilio.
    Works with either sandbox or business number from settings.
    """
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    results = {}

    from_whatsapp = f"whatsapp:{settings.TWILIO_WHATSAPP_NUMBER}"

    for phone in phones:
        try:
            to_whatsapp = f"whatsapp:{phone}"
            msg = client.messages.create(
                from_=from_whatsapp,
                to=to_whatsapp,
                body=message,
            )
            results[phone] = {"sid": msg.sid, "status": msg.status}
        except Exception as e:
            results[phone] = {"error": str(e)}

    print("[Celery] WhatsApp results:\n", results)
    return results


@shared_task(bind=True)
def send_sos_sms(self, message, phones):
    """
    Sends SOS alert via SMS using Twilio.
    """
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    results = {}

    for phone in phones:
        try:
            msg = client.messages.create(
                body=message,
                from_=settings.TWILIO_PHONE_NUMBER,
                to=phone,
            )
            results[phone] = {"sid": msg.sid, "status": msg.status}
        except Exception as e:
            results[phone] = {"error": str(e)}

    print("[Celery] SMS results:\n", results)
    return results


@shared_task(bind=True)
def send_sos_push(self, tokens, title, body):
    """
    Sends push notifications to multiple devices using FCM.
    """
    push_service = FCMNotification(api_key=settings.FCM_SERVER_KEY)
    result = push_service.notify_multiple_devices(
        registration_ids=tokens,
        message_title=title,
        message_body=body,
    )
    print("[Celery] Push result:\n", result)
    return result
