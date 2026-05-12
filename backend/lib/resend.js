import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (options) => {
  try {
    const data = await resend.emails.send({
      from: "Servio <onboarding@resend.dev>",
      to: [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    console.log("Resend Email Sent:", data);
    return true;
  } catch (error) {
    console.log("Resend Email Error:", error);
    return false;
  }
};