import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import get_settings

settings = get_settings()

def send_reset_password_email(email_to: str, otp_code: str):
    """Gửi email chứa link reset mật khẩu"""
    
    subject = f"Mã xác nhận khôi phục mật khẩu Hometic"
    
    body = f"""
    <html>
        <head>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f1ea; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f1ea; padding: 40px 0;">
                <tr>
                    <td align="center">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 500px; background-color: #ffffff; border-radius: 40px; overflow: hidden; box-shadow: 0 20px 40px rgba(35, 74, 74, 0.08); border: 1px solid #e5e1d8;">
                            <tr>
                                <td style="padding: 50px 40px 20px 40px; text-align: center;">
                                    <h1 style="margin: 0; font-size: 32px; font-weight: 900; color: #234a4a; letter-spacing: -1.5px;">HOMETIC<span style="color: #ed7f1a;">.</span></h1>
                                    <div style="height: 2px; width: 40px; background-color: #ed7f1a; margin: 15px auto 0 auto;"></div>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding: 20px 40px 40px 40px; text-align: center;">
                                    <h2 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 700; color: #1a1a1a;">Khôi phục mật khẩu</h2>
                                    <p style="margin: 0; font-size: 15px; color: #71717a; line-height: 1.6;">Chào bạn, chúng tôi đã nhận được yêu cầu thiết lập lại mật khẩu của bạn. Vui lòng sử dụng mã xác nhận an toàn dưới đây:</p>
                                    
                                    <div style="margin: 35px 0; padding: 30px; background-color: #fdfaf4; border: 1px dashed #ed7f1a; border-radius: 24px;">
                                        <div style="font-size: 11px; font-weight: 800; color: #ed7f1a; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">Mã xác thực (OTP)</div>
                                        <div style="font-size: 42px; font-weight: 900; letter-spacing: 8px; color: #234a4a; font-family: 'Courier New', monospace;">
                                            {otp_code}
                                        </div>
                                    </div>

                                    <p style="margin: 0; font-size: 13px; color: #a1a1aa;">
                                        Mã có hiệu lực trong vòng <strong style="color: #234a4a;">15 phút</strong>.<br>
                                        Tuyệt đối không chia sẻ mã này với bất kỳ ai.
                                    </p>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding: 30px 40px; background-color: #234a4a; text-align: center;">
                                    <p style="margin: 0; font-size: 12px; color: #ffffff; opacity: 0.8; line-height: 1.5;">
                                        Nếu bạn không thực hiện yêu cầu này, hãy đổi mật khẩu ngay lập tức để bảo vệ tài khoản.<br><br>
                                        © 2026 Hometic Store. Nâng tầm không gian sống.<br>
                                        Hồ Chí Minh City, Vietnam.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
    </html>
    """

    msg = MIMEMultipart()
    msg['From'] = settings.smtp_from
    msg['To'] = email_to
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'html'))
    
    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
            server.starttls()
            server.login(settings.smtp_user, settings.smtp_password)
            server.send_message(msg)
        return True
    except Exception as e:
        print(f"Lỗi gửi email: {e}")
        return False
