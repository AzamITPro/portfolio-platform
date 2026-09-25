import smtplib
import httpx
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
from app.core.logging import logger


class EmailService:
    @staticmethod
    def send_email(to_email: str, subject: str, body: str, reply_to: str = None) -> bool:
        """
        Send an email via Resend HTTP API (Port 443) or fallback to standard SMTP.
        """
        # 1. Primary Production Method: Resend HTTP API (Bypasses all cloud firewall port restrictions)
        if settings.RESEND_API_KEY:
            try:
                headers = {
                    "Authorization": f"Bearer {settings.RESEND_API_KEY.strip()}",
                    "Content-Type": "application/json",
                }
                payload = {
                    "from": "Azzam Portfolio <onboarding@resend.dev>",
                    "to": [to_email],
                    "subject": subject,
                    "text": body,
                }
                if reply_to:
                    payload["reply_to"] = reply_to

                with httpx.Client(timeout=10.0) as client:
                    res = client.post("https://api.resend.com/emails", headers=headers, json=payload)
                    if res.is_success:
                        logger.info(f"[Resend API] Email delivered successfully to {to_email}")
                        return True
                    else:
                        logger.error(f"[Resend API] Error {res.status_code}: {res.text}")
            except Exception as e:
                logger.error(f"[Resend API] Request failed: {e}")

        # 2. Secondary Fallback: Direct SMTP (Works locally or on non-restricted networks)
        if settings.SMTP_PASSWORD:
            try:
                msg = MIMEMultipart()
                msg["From"] = f"Azzam Portfolio <{settings.SMTP_USER}>"
                msg["To"] = to_email
                msg["Subject"] = subject
                if reply_to:
                    msg["Reply-To"] = reply_to

                msg.attach(MIMEText(body, "plain", "utf-8"))

                server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10)
                server.starttls()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD.replace(" ", ""))
                server.send_message(msg)
                server.quit()
                logger.info(f"[SMTP] Email delivered to {to_email}")
                return True
            except Exception as e:
                logger.error(f"[SMTP] Failed: {e}")

        # 3. Development Fallback (Logs to console safely)
        logger.info(f"[MOCK EMAIL] To: {to_email} | Subject: {subject} | Reply-To: {reply_to}")
        return True

    @staticmethod
    def notify_admin_new_inquiry(sender_name: str, sender_email: str, subject: str, message: str):
        email_body = f"""New Contact Inquiry Received via Your Portfolio!

--------------------------------------------------
Sender Name  : {sender_name}
Sender Email : {sender_email}
Subject      : {subject}
--------------------------------------------------

Message:
{message}

--------------------------------------------------
* Tip: You can click 'Reply' directly on this email from your phone to reply to {sender_name} ({sender_email}).
"""
        EmailService.send_email(
            to_email=settings.ADMIN_NOTIFICATION_EMAIL,
            subject=f"🔔 New Portfolio Message: {subject} (from {sender_name})",
            body=email_body,
            reply_to=sender_email,
        )


email_service = EmailService()