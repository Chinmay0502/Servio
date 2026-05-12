import axios from "axios";

// ---------------- SEND EMAIL USING BREVO ----------------
export const sendEmail = async (options) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Servio",
          email: "servios269@gmail.com",
        },
        to: [
          {
            email: options.to,
          },
        ],
        subject: options.subject,
        htmlContent: options.html,
        textContent: options.text || "No content provided",
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Brevo Email Sent:", response.data);
    return true;
  } catch (error) {
    console.log("❌ Brevo Email Error:");
    console.log(error.response?.data || error.message);
    return false;
  }
};

// ---------------- VERIFY EMAIL TEMPLATE ----------------
export const generateVerifyEmailOption = (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify/${token}`;

  return {
    to: email,
    subject: "Verify your email address",
    text: `
Welcome to Servio!

Thank you for registering. Please verify your email address to complete your registration.

Verify your email:
${verificationUrl}

This verification link will expire in 24 hours.

If you did not create an account, you can safely ignore this email.
    `,
    html: `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
    <table width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <table width="100%" max-width="500px" style="background: #ffffff; padding: 24px; border-radius: 8px;">
            <tr>
              <td>
                <h2 style="margin-top: 0; color: #111827;">Welcome to Servio</h2>

                <p style="color: #374151; font-size: 14px;">
                  Thank you for registering. Please verify your email address to complete your registration.
                </p>

                <div style="margin: 24px 0; text-align: center;">
                  <a
                    href="${verificationUrl}"
                    style="
                      background-color: #2563eb;
                      color: #ffffff;
                      padding: 12px 20px;
                      text-decoration: none;
                      border-radius: 6px;
                      font-weight: bold;
                      display: inline-block;
                    "
                  >
                    Verify Email
                  </a>
                </div>

                <p style="color: #6b7280; font-size: 13px;">
                  This verification link will expire in <strong>24 hours</strong>.
                </p>

                <p style="color: #6b7280; font-size: 13px;">
                  If you did not create an account, you can safely ignore this email.
                </p>

                <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />

                <p style="color: #9ca3af; font-size: 12px;">
                  © ${new Date().getFullYear()} Servio. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `,
  };
};

// ---------------- USER STATUS CHANGE TEMPLATE ----------------
export const generateUserStatusChangeOption = (email, status) => {
  const isBlocked = status === "BLOCKED";

  return {
    to: email,
    subject: `Your Servio Account Has Been ${
      isBlocked ? "Blocked" : "Reactivated"
    }`,
    text: `
Hello,

This is to inform you that your Servio account status has been updated.

Current Status: ${status}

${
  isBlocked
    ? "Your account has been temporarily blocked due to policy or administrative reasons."
    : "Your account has been reactivated and you can continue using Servio services."
}

If you believe this was a mistake or need assistance, please contact our support team.

Regards,
Servio Support Team
    `,
    html: `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
    <table width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <table width="100%" max-width="500px" style="background: #ffffff; padding: 24px; border-radius: 8px;">
            <tr>
              <td>
                <h2 style="margin-top: 0; color: #111827;">
                  Account Status Updated
                </h2>

                <p style="color: #374151; font-size: 14px;">
                  This is to inform you that your <strong>Servio</strong> account status has been updated.
                </p>

                <p style="color: #111827; font-size: 14px;">
                  <strong>Current Status:</strong>
                  <span style="color: ${isBlocked ? "#dc2626" : "#16a34a"};">
                    ${status}
                  </span>
                </p>

                ${
                  isBlocked
                    ? `
                      <p style="color: #374151; font-size: 14px;">
                        Your account has been temporarily blocked due to policy or administrative reasons.
                      </p>
                    `
                    : `
                      <p style="color: #374151; font-size: 14px;">
                        Your account has been reactivated. You can now continue using Servio services.
                      </p>
                    `
                }

                <p style="color: #6b7280; font-size: 13px;">
                  If you believe this was a mistake or need assistance, please contact our support team.
                </p>

                <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />

                <p style="color: #9ca3af; font-size: 12px;">
                  © ${new Date().getFullYear()} Servio. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `,
  };
};

// ---------------- OTP TEMPLATE ----------------
export const generateOtpEmailOption = (email, otp, serviceName) => {
  return {
    to: email,
    subject: "Your Service OTP Verification Code",
    text: `
Your OTP for the service ${serviceName} is: ${otp}

This OTP is valid for 5 minutes.

Do not share this OTP with anyone.
    `,
    html: `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 20px;">
    <table width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <table width="100%" style="max-width: 500px; background: #ffffff; padding: 24px; border-radius: 10px;">
            
            <tr>
              <td style="text-align: center;">
                <h2 style="margin: 0; color: #111827;">Servio Verification</h2>
              </td>
            </tr>

            <tr>
              <td style="padding-top: 20px;">
                <p style="color: #374151; font-size: 14px;">
                  Your service <strong>${serviceName}</strong> is about to begin.
                </p>

                <p style="color: #374151; font-size: 14px;">
                  Please share the following OTP with your service worker to start the task.
                </p>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding: 24px 0;">
                <div style="
                  font-size: 32px;
                  letter-spacing: 8px;
                  font-weight: bold;
                  color: #2563eb;
                  background: #eff6ff;
                  padding: 16px 24px;
                  border-radius: 8px;
                  display: inline-block;
                ">
                  ${otp}
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <p style="color: #6b7280; font-size: 13px;">
                  ⏳ This OTP is valid for <strong>5 minutes</strong>.
                </p>

                <p style="color: #dc2626; font-size: 13px;">
                  ⚠️ Do NOT share this OTP with anyone except your assigned worker.
                </p>
              </td>
            </tr>

            <tr>
              <td>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />

                <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                  © ${new Date().getFullYear()} Servio. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `,
  };
};