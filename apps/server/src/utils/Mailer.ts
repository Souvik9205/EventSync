import nodemailer from "nodemailer";
import qr from "qrcode";
import fs from "fs";
import path from "path";
import crypto from "crypto";

type EmailData = {
  eventName?: string;
  eventDate?: any;
  eventVenue?: string;
  attendanceId?: string;
};

type EmailType = "UserOtp" | "EventOtp" | "RegisterOtp";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

const baseStyles = `
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      color: #1f2937;
      background-color: #f3f4f6;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      border-radius: 12px;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 20px;
      text-align: center;
    }
    .content {
      padding: 30px;
      background-color: #ffffff;
    }
    .otp-box {
      background-color: #f0fdf4;
      border: 2px dashed #10b981;
      padding: 20px;
      text-align: center;
      border-radius: 10px;
      margin: 20px 0;
    }
    .otp-code {
      font-size: 40px;
      font-weight: 700;
      color: #065f46;
      letter-spacing: 0.1em;
      word-spacing: 10px;
      background-color: #ecfdf5;
      padding: 15px;
      border-radius: 8px;
    }
    .footer {
      background-color: #f3f4f6;
      color: #6b7280;
      text-align: center;
      padding: 15px;
      font-size: 12px;
    }
    .event-details {
      background-color: #f0fdf4;
      border-left: 4px solid #10b981;
      padding: 15px;
      margin: 20px 0;
    }
    .event-details p {
      margin: 5px 0;
      color: #065f46;
    }
    .event-cta {
      display: block;
      width: 200px;
      margin: 20px auto;
      padding: 12px;
      background-color: #10b981;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      text-align: center;
      font-weight: 600;
    }
    .playful-text {
      color: #6b7280;
      font-style: italic;
      text-align: center;
      margin-top: 15px;
    }
`;

const generateRandomString = (length = 8) => {
  return crypto.randomBytes(length).toString("hex");
};

const generateQRCodeFile = async (text: string): Promise<string | null> => {
  const folderPath = path.join(__dirname, "temp_qrcode");
  const randomFileName = `${generateRandomString()}.png`;
  const filePath = path.join(folderPath, randomFileName);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  try {
    const options = {
      scale: 20,
    };
    await qr.toFile(filePath, text, options);
    return filePath;
  } catch (error) {
    console.error("QR code generation error:", error);
    return null;
  }
};
const cleanupTempFiles = (filePaths: string[]) => {
  filePaths.forEach((filePath) => {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted temporary file: ${filePath}`);
      }
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
    }
  });
};

export const EmailSent = async (
  toEmail: string,
  otp: string,
  type: EmailType,
  data?: EmailData | null
): Promise<boolean> => {
  let qrCodeFilePath: string | null = null;
  const year = new Date().getFullYear();

  const SignupEmailTemplate = `
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>EventSync • Email Verification</title>
      <style>${baseStyles}</style>
    </head>
    <body>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding: 20px;">
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Email Verification</h1>
              </div>
              <div class="content">
                <h2 style="color: #10b981; text-align: center;">Verify Your Account</h2>
                <p style="text-align: center; color: #4b5563;">
                  To complete your EventSync registration, enter the verification code below:
                </p>
                <div class="otp-box">
                  <div class="otp-code">${otp.split("").join(" ")}</div>
                </div>
                <p style="text-align: center; color: #6b7280; font-size: 14px;">
                  This code is valid for 5 minutes. Do not share it with anyone.
                </p>
              </div>
              <div class="footer">
                © ${year} EventSync • Simplifying Event Management
              </div>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>`;
  const EventEmailTemplate = `
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>EventSync • Event Verification</title>
      <style>${baseStyles}</style>
    </head>
    <body>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding: 20px;">
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Event Creation</h1>
              </div>
              <div class="content">
                <h2 style="color: #10b981; text-align: center;">Verify Your Event</h2>
                <p style="text-align: center; color: #4b5563;">
                  Use the code below to confirm your event creation:
                </p>
                <div class="otp-box">
                  <div class="otp-code">${otp.split("").join(" ")}</div>
                </div>
                <p style="text-align: center; color: #6b7280; font-size: 14px;">
                  This verification code expires in 5 minutes.
                </p>
              </div>
              <div class="footer">
                © ${year} EventSync • Creating Memorable Experiences
              </div>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>`;

  const TicketEmailTemplate = async (data: EmailData): Promise<string> => {
    const googleCalendarLink =
      data.eventName && data.eventDate
        ? `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(data.eventName)}&dates=${encodeURIComponent(new Date(data.eventDate).toISOString().replace(/[-:]|\.\d{3}/g, ""))}&details=Event details&location=${encodeURIComponent(data.eventVenue || "")}`
        : "#";

    return `
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EventSync • Ticket Confirmation</title>
        <style>${baseStyles}</style>
      </head>
      <body>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding: 20px;">
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">Ticket Confirmed!</h1>
                </div>
                <div class="content">
                  <h2 style="color: #10b981; text-align: center;">Your Event Ticket</h2>
                  
                  <div class="event-details">
                    <p><strong>📅 Event:</strong> ${data.eventName || "N/A"}</p>
                    <p><strong>🕒 Date:</strong> ${data.eventDate || "N/A"}</p>
                    <p><strong>📍 Venue:</strong> ${data.eventVenue || "N/A"}</p>
                  </div>
  
                  <a href="${googleCalendarLink}" target="_blank" class="event-cta">
                    Add to Google Calendar
                  </a>
  
                  <p style="text-align: center; color: #4b5563;">
                    Your unique QR code is attached. Please present it at the event entrance.
                  </p>
                  
                  <p class="playful-text">
                    🎉 Don't be late! Awesome memories are waiting to be made! 😄
                  </p>
                </div>
                <div class="footer">
                  © ${year} EventSync • Turning Events into Experiences
                </div>
              </div>
            </td>
          </tr>
        </table>
      </body>
      </html>`;
  };
  try {
    let emailHTML: string;
    let subject: string;
    let attachment: any[] = [];

    switch (type) {
      case "UserOtp":
        if (!otp) throw new Error("OTP is required for UserOtp emails");
        emailHTML = SignupEmailTemplate;
        subject = "Verify your email";
        break;

      case "EventOtp":
        if (!otp) throw new Error("OTP is required for EventOtp emails");
        emailHTML = EventEmailTemplate;
        subject = "Event Creation Verification";
        break;

      case "RegisterOtp":
        if (!data)
          throw new Error("Event data is required for RegisterOtp emails");
        emailHTML = await TicketEmailTemplate(data);
        subject = "Ticket Confirmation";

        if (data.attendanceId) {
          qrCodeFilePath = await generateQRCodeFile(data.attendanceId!);
          if (!qrCodeFilePath) {
            throw new Error("Failed to generate QR code file");
          }
          attachment.push({
            filename: path.basename(qrCodeFilePath),
            path: qrCodeFilePath,
            cid: "unique@qrcode",
          });
        }
        break;

      default:
        throw new Error("Invalid email type");
    }
    await transporter.sendMail({
      from: "EventSync <no-reply@example.com>",
      to: toEmail,
      subject: subject,
      html: emailHTML,
      attachments: attachment,
    });

    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  } finally {
    if (type === "RegisterOtp") {
      cleanupTempFiles([
        path.join(__dirname, "temp_qrcode", path.basename(qrCodeFilePath!)),
      ]);
    }
  }
};
