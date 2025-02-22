import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

// Define types for the request body
interface EmailRequestBody {
  to: string;
  subject: string;
  text: string;
  html?: string; // Optional HTML support
}

export async function POST(req: Request) {
  // Parse the incoming JSON request body
  const { to, subject, text, html }: EmailRequestBody = await req.json();

  // Create a Nodemailer transporter with the updated SMTP settings
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Gmail as the email provider
    auth: {
      user: process.env.EMAIL_USER, // Sender's email address (use environment variable)
      pass: process.env.EMAIL_PASS, // Sender's password or app-specific password (use environment variable)
    },
    // Explicit SMTP settings for Gmail
    tls: {
      rejectUnauthorized: false, // Optional: helps with ignoring untrusted certificates if any
    },
    // Using port 587 for TLS, which is recommended for Gmail
    // If you're using port 465, set `secure: true` for SSL
    secure: false, // Set to false for TLS (port 587)
    port: 587, // Port for TLS
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender email address
    to, // Receiver email address
    subject,
    text, // Plain text email body
    html, // Optional HTML support
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
  }
}
