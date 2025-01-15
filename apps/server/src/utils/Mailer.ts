import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER || "souvikmukhopadhyay4@gmail.com",
    pass: process.env.NODEMAILER_PASS || "ajpa cbms uvux alco",
  },
});

export const EmailSent = async (
  toEmail: string,
  otp: string,
  type: string,
  data: any | null
) => {
  const SignupEmailTemplate = `<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>EventSync Email Templates</title>
<style>
    body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    color: #333;
    }
    .container {
    max-width: 600px;
    margin: 0 auto;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
    .header {
    padding: 20px;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    }
    .content {
    padding: 30px;
    text-align: center;
    }
    .footer {
    padding: 20px;
    text-align: center;
    font-size: 12px;
    }
    .code {
    padding: 20px;
    font-size: 24px;
    font-weight: bold;
    border-radius: 5px;
    margin-top: 20px;
    }
    .note {
    font-size: 14px;
    margin-top: 20px;
    }
</style>
</head>
<body>
    <table role="presentation" style="width: 100%; padding: 40px 0; background-color: #f0f4f8;">
        <tr>
        <td style="text-align: center;">
            <div class="container" style="background-color: #00509e; color: #ffffff;">
            <div class="header" style="background-color: #003f7f;">EventSync</div>
            <div class="content">
                <h1 style="font-size: 32px; margin-bottom: 10px;">Verify Your Email</h1>
                <p>Thank you for signing up with EventSync. Use the OTP code below to verify your email address:</p>
                <div class="code" style="background-color: #ffdd57; color: #003f7f;">${otp}</div>
                <p class="note" style="color: #c1d5e0;">This code will expire in 5 minutes. If you did not sign up, please ignore this email.</p>
            </div>
            <div class="footer" style="background-color: #003f7f; color: #c1d5e0;">© 2024 EventSync. All rights reserved.</div>
            </div>
        </td>
        </tr>
    </table>
  </body>
</html>`;
  const EventEmailTemplate = `<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>EventSync Email Templates</title>
<style>
    body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    color: #333;
    }
    .container {
    max-width: 600px;
    margin: 0 auto;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
    .header {
    padding: 20px;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    }
    .content {
    padding: 30px;
    text-align: center;
    }
    .footer {
    padding: 20px;
    text-align: center;
    font-size: 12px;
    }
    .code {
    padding: 20px;
    font-size: 24px;
    font-weight: bold;
    border-radius: 5px;
    margin-top: 20px;
    }
    .note {
    font-size: 14px;
    margin-top: 20px;
    }
</style>
</head>
<body>
    <table role="presentation" style="width: 100%; padding: 40px 0; background-color: #faf3dd;">
        <tr>
        <td style="text-align: center;">
            <div class="container" style="background-color: #fb8500; color: #ffffff;">
            <div class="header" style="background-color: #ff6700;">EventSync</div>
            <div class="content">
                <h1 style="font-size: 32px; margin-bottom: 10px;">Event Creation Verification</h1>
                <p>We need to verify your identity to proceed with creating your event. Enter the OTP code below:</p>
                <div class="code" style="background-color: #ffe6cc; color: #fb8500;">${otp}</div>
                <p class="note" style="color: #ffe6cc;">This code will expire in 5 minutes. If you did not request this, please ignore this email.</p>
            </div>
            <div class="footer" style="background-color: #ff6700; color: #ffe6cc;">© 2024 EventSync. All rights reserved.</div>
            </div>
        </td>
        </tr>
    </table>
  </body>
</html>`;
  const TicketEmailTemplate = `<html>
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EventSync Email Templates</title>
  <style>
      body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      color: #333;
      }
      .container {
      max-width: 600px;
      margin: 0 auto;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      }
      .header {
      padding: 20px;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      }
      .content {
      padding: 30px;
      text-align: center;
      }
      .footer {
      padding: 20px;
      text-align: center;
      font-size: 12px;
      }
      .code {
      padding: 20px;
      font-size: 24px;
      font-weight: bold;
      border-radius: 5px;
      margin-top: 20px;
      }
      .note {
      font-size: 14px;
      margin-top: 20px;
      }
  </style>
  </head>
  <body>
      <table role="presentation" style="width: 100%; padding: 40px 0; background-color: #f4f1f1;">
          <tr>
          <td style="text-align: center;">
              <div class="container" style="background-color: #34a853; color: #ffffff;">
              <div class="header" style="background-color: #2a9134;">EventSync</div>
              <div class="content">
                  <h1 style="font-size: 32px; margin-bottom: 10px;">Ticket Confirmation</h1>
                  <p>Thank you for booking your ticket with EventSync! Your ticket has been successfully confirmed. Details are below:</p>
                  <div class="code" style="background-color: #c3e6cb; color: #2a9134;">
                  Event: ${data!.eventName || "N/A"}<br>
                  Date: ${data!.eventDate || "N/A"}<br>
                  Venue: ${data!.eventVenue || "N/A"}
                  </div>
                  <p class="note" style="color: #c3e6cb;">If you have any questions, please contact our support team.</p>
              </div>
              <div class="footer" style="background-color: #2a9134; color: #c3e6cb;">© 2024 EventSync. All rights reserved.</div>
              </div>
          </td>
          </tr>
      </table>
    </body>
  </html>`;
  //   const emailTemplates = [
  //     // Template 1: Email Verify for Signup
  //     `<html>
  //         <head>
  //         <meta charset="UTF-8">
  //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //         <title>EventSync Email Templates</title>
  //         <style>
  //             body {
  //             font-family: 'Arial', sans-serif;
  //             margin: 0;
  //             padding: 0;
  //             color: #333;
  //             }
  //             .container {
  //             max-width: 600px;
  //             margin: 0 auto;
  //             border-radius: 8px;
  //             overflow: hidden;
  //             box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  //             }
  //             .header {
  //             padding: 20px;
  //             text-align: center;
  //             font-size: 24px;
  //             font-weight: bold;
  //             }
  //             .content {
  //             padding: 30px;
  //             text-align: center;
  //             }
  //             .footer {
  //             padding: 20px;
  //             text-align: center;
  //             font-size: 12px;
  //             }
  //             .code {
  //             padding: 20px;
  //             font-size: 24px;
  //             font-weight: bold;
  //             border-radius: 5px;
  //             margin-top: 20px;
  //             }
  //             .note {
  //             font-size: 14px;
  //             margin-top: 20px;
  //             }
  //         </style>
  //         </head>
  //         <body>
  //             <table role="presentation" style="width: 100%; padding: 40px 0; background-color: #f0f4f8;">
  //                 <tr>
  //                 <td style="text-align: center;">
  //                     <div class="container" style="background-color: #00509e; color: #ffffff;">
  //                     <div class="header" style="background-color: #003f7f;">EventSync</div>
  //                     <div class="content">
  //                         <h1 style="font-size: 32px; margin-bottom: 10px;">Verify Your Email</h1>
  //                         <p>Thank you for signing up with EventSync. Use the OTP code below to verify your email address:</p>
  //                         <div class="code" style="background-color: #ffdd57; color: #003f7f;">${otp}</div>
  //                         <p class="note" style="color: #c1d5e0;">This code will expire in 5 minutes. If you did not sign up, please ignore this email.</p>
  //                     </div>
  //                     <div class="footer" style="background-color: #003f7f; color: #c1d5e0;">© 2024 EventSync. All rights reserved.</div>
  //                     </div>
  //                 </td>
  //                 </tr>
  //             </table>
  //           </body>
  //         </html>`,
  //     // Template 2: Verify User While Creating an Event
  //     `<html>
  //         <head>
  //         <meta charset="UTF-8">
  //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //         <title>EventSync Email Templates</title>
  //         <style>
  //             body {
  //             font-family: 'Arial', sans-serif;
  //             margin: 0;
  //             padding: 0;
  //             color: #333;
  //             }
  //             .container {
  //             max-width: 600px;
  //             margin: 0 auto;
  //             border-radius: 8px;
  //             overflow: hidden;
  //             box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  //             }
  //             .header {
  //             padding: 20px;
  //             text-align: center;
  //             font-size: 24px;
  //             font-weight: bold;
  //             }
  //             .content {
  //             padding: 30px;
  //             text-align: center;
  //             }
  //             .footer {
  //             padding: 20px;
  //             text-align: center;
  //             font-size: 12px;
  //             }
  //             .code {
  //             padding: 20px;
  //             font-size: 24px;
  //             font-weight: bold;
  //             border-radius: 5px;
  //             margin-top: 20px;
  //             }
  //             .note {
  //             font-size: 14px;
  //             margin-top: 20px;
  //             }
  //         </style>
  //         </head>
  //         <body>
  //             <table role="presentation" style="width: 100%; padding: 40px 0; background-color: #faf3dd;">
  //                 <tr>
  //                 <td style="text-align: center;">
  //                     <div class="container" style="background-color: #fb8500; color: #ffffff;">
  //                     <div class="header" style="background-color: #ff6700;">EventSync</div>
  //                     <div class="content">
  //                         <h1 style="font-size: 32px; margin-bottom: 10px;">Event Creation Verification</h1>
  //                         <p>We need to verify your identity to proceed with creating your event. Enter the OTP code below:</p>
  //                         <div class="code" style="background-color: #ffe6cc; color: #fb8500;">${otp}</div>
  //                         <p class="note" style="color: #ffe6cc;">This code will expire in 5 minutes. If you did not request this, please ignore this email.</p>
  //                     </div>
  //                     <div class="footer" style="background-color: #ff6700; color: #ffe6cc;">© 2024 EventSync. All rights reserved.</div>
  //                     </div>
  //                 </td>
  //                 </tr>
  //             </table>
  //           </body>
  //         </html>`,
  //     // Template 3: Confirm Ticket (No OTP Needed)
  //     `<html>
  //         <head>
  //         <meta charset="UTF-8">
  //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //         <title>EventSync Email Templates</title>
  //         <style>
  //             body {
  //             font-family: 'Arial', sans-serif;
  //             margin: 0;
  //             padding: 0;
  //             color: #333;
  //             }
  //             .container {
  //             max-width: 600px;
  //             margin: 0 auto;
  //             border-radius: 8px;
  //             overflow: hidden;
  //             box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  //             }
  //             .header {
  //             padding: 20px;
  //             text-align: center;
  //             font-size: 24px;
  //             font-weight: bold;
  //             }
  //             .content {
  //             padding: 30px;
  //             text-align: center;
  //             }
  //             .footer {
  //             padding: 20px;
  //             text-align: center;
  //             font-size: 12px;
  //             }
  //             .code {
  //             padding: 20px;
  //             font-size: 24px;
  //             font-weight: bold;
  //             border-radius: 5px;
  //             margin-top: 20px;
  //             }
  //             .note {
  //             font-size: 14px;
  //             margin-top: 20px;
  //             }
  //         </style>
  //         </head>
  //         <body>
  //             <table role="presentation" style="width: 100%; padding: 40px 0; background-color: #f4f1f1;">
  //                 <tr>
  //                 <td style="text-align: center;">
  //                     <div class="container" style="background-color: #34a853; color: #ffffff;">
  //                     <div class="header" style="background-color: #2a9134;">EventSync</div>
  //                     <div class="content">
  //                         <h1 style="font-size: 32px; margin-bottom: 10px;">Ticket Confirmation</h1>
  //                         <p>Thank you for booking your ticket with EventSync! Your ticket has been successfully confirmed. Details are below:</p>
  //                         <div class="code" style="background-color: #c3e6cb; color: #2a9134;">
  //                         Event: ${data.eventName}<br>
  //                         Date: ${data.eventDate}<br>
  //                         Venue: ${data.eventVenue}
  //                         </div>
  //                         <p class="note" style="color: #c3e6cb;">If you have any questions, please contact our support team.</p>
  //                     </div>
  //                     <div class="footer" style="background-color: #2a9134; color: #c3e6cb;">© 2024 EventSync. All rights reserved.</div>
  //                     </div>
  //                 </td>
  //                 </tr>
  //             </table>
  //           </body>
  //         </html>`,
  //   ];
  try {
    let emailHTML;
    if (type === "UserOtp") {
      emailHTML = SignupEmailTemplate;
    } else if (type === "EverntOtp") {
      emailHTML = EventEmailTemplate;
      // } else if (type === "RegisterOtp") {
      //   emailHTML = TicketEmailTemplate;
    } else {
      return false;
    }

    await transporter.sendMail({
      from: "MarketView <no-reply@example.com>",
      to: toEmail,
      subject: "Verify your email",
      html: emailHTML,
    });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};
