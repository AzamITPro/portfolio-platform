import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
from app.core.logging import logger


class EmailService:
    @staticmethod
    def send_email(to_email: str, subject: str, body: str, reply_to: str = None) -> bool:
        """
        Send an email via SMTP. If credentials are not configured, log it safely.
        """
        if not settings.SMTP_PASSWORD:
            logger.info(
                f"[MOCK EMAIL] To: {to_email} | Subject: {subject} | Reply-To: {reply_to}\nContent:\n{body}"
            )
            return True

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
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
            server.quit()
            logger.info(f"Email successfully delivered to {to_email}")
            return True
        except Exception as e:
            logger.error(f"Failed to deliver email to {to_email}: {e}")
            return False

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
* Tip: You can simply click 'Reply' on this email from your phone to reply directly to {sender_name} ({sender_email}).
"""
        EmailService.send_email(
            to_email=settings.ADMIN_NOTIFICATION_EMAIL,
            subject=f"🔔 New Portfolio Message: {subject} (from {sender_name})",
            body=email_body,
            reply_to=sender_email,
        )


email_service = EmailService()