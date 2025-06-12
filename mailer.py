import smtplib
import os
from email.mime.text import MIMEText
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")

def send_email(to, subject, body):
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = EMAIL_USER
    msg["To"] = to

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(EMAIL_USER, EMAIL_PASS)
            server.sendmail(EMAIL_USER, [to], msg.as_string())
        print(f"[✔] Email sent to {to}")
    except Exception as e:
        print(f"[✖] Failed to send email to {to}: {e}")

def send_success_email(to_email, name):
    subject = "🎉 Portfolio Verified & Profile Added"
    body = f"""
Hi {name},

Congratulations! 🎉 Your portfolio has been successfully verified and your profile has been added to the Portal.

You can now explore opportunities, get referrals, and connect with like-minded developers.

Thanks,  
Portfolio Verification Team
"""
    send_email(to_email, subject, body)


def send_failure_email(to_email, name, portfolio_link):
    subject = "⚠ Portfolio Verification Failed"
    body = f"""
Hi {name},

Unfortunately, your portfolio verification has failed.

Please ensure that your portfolio includes:
- A 'Projects' section
- A valid skillset
- Clear structure

You may contact the developer for a manual review.

Link you submitted: {portfolio_link}

Thanks,  
Portfolio Verification Team
"""
    send_email(to_email, subject, body)

