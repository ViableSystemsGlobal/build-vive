import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import { join } from "path";
import nodemailer from "nodemailer";

const DATA_DIR = join(process.cwd(), "data");
const DATA_FILE = join(DATA_DIR, "homepage.json");

export async function POST(request: NextRequest) {
  try {
    const { testEmail } = await request.json();

    if (!testEmail) {
      return NextResponse.json({ error: "Test email is required" }, { status: 400 });
    }

    // Load admin configuration
    let adminConfig;
    try {
      const data = await readFile(DATA_FILE, "utf-8");
      adminConfig = JSON.parse(data);
    } catch (error) {
      return NextResponse.json({ error: "Failed to load admin configuration" }, { status: 500 });
    }

    // Check if SMTP is configured
    if (!adminConfig.smtpHost || !adminConfig.smtpUsername || !adminConfig.smtpPassword) {
      return NextResponse.json({ error: "SMTP configuration is incomplete" }, { status: 400 });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: adminConfig.smtpHost,
      port: parseInt(adminConfig.smtpPort) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: adminConfig.smtpUsername,
        pass: adminConfig.smtpPassword,
      },
    });

    // Send test email
    const info = await transporter.sendMail({
      from: adminConfig.fromEmail || adminConfig.smtpUsername,
      to: testEmail,
      subject: `Test Email - ${adminConfig.companyName || 'Ace Construction'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">✅ Email Configuration Test</h2>
          <p>This is a test email to verify your SMTP configuration is working correctly.</p>
          <p><strong>Company:</strong> ${adminConfig.companyName || 'Ace Construction'}</p>
          <p><strong>SMTP Host:</strong> ${adminConfig.smtpHost}</p>
          <p><strong>Port:</strong> ${adminConfig.smtpPort}</p>
          <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 14px;">
            If you received this email, your SMTP configuration is working correctly! 
            You can now receive quote request notifications.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ 
      success: true, 
      messageId: info.messageId,
      message: "Test email sent successfully!" 
    });

  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json({ 
      error: "Failed to send test email", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
