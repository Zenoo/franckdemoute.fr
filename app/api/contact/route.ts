import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Create and configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT ? +process.env.EMAIL_PORT : 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// HTML email template
const generateEmailTemplate = (
  name: string,
  email: string,
  userMessage: string
) => `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #007BFF;">New Message Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="border-left: 4px solid #007BFF; padding-left: 10px; margin-left: 0;">
        ${userMessage.replace(/\n/g, "<br>")}
      </blockquote>
      <p style="font-size: 12px; color: #888;">Click reply to respond to the sender.</p>
    </div>
  </div>
`;

type Payload = {
  name: string;
  email: string;
  message: string;
};

// Helper function to send an email via Nodemailer
async function sendEmail(payload: Payload, message: string) {
  const { name, email, message: userMessage } = payload;

  try {
    await transporter.sendMail({
      from: {
        name,
        address: email,
      },
      to: process.env.EMAIL_ADDRESS,
      subject: `New Message From ${name}`,
      text: message,
      html: generateEmailTemplate(name, email, userMessage),
    });
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error while sending email:", error.message);
      return false;
    } else {
      return false;
    }
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { name, email, message: userMessage } = payload;

    const message = `New message from ${name}\n\nEmail: ${email}\n\nMessage:\n\n${userMessage}\n\n`;

    // Send email
    const emailSuccess = await sendEmail(payload, message);

    if (emailSuccess) {
      return NextResponse.json(
        {
          success: true,
          message: "Message and email sent successfully!",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send email, please try again later.",
      },
      { status: 500 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("API Error:", error.message);

      return NextResponse.json(
        {
          success: false,
          message: "Server error occurred.",
        },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "An unknown error occurred.",
        },
        { status: 500 }
      );
    }
  }
}
