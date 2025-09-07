import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import nodemailer from "nodemailer";
import { database } from "../../lib/database";

type QuotePayload = {
  projectType?: string;
  services?: string[];
  location?: string;
  size?: string;
  status?: string;
  timeline?: string;
  budget?: string;
  urgency?: string;
  name?: string;
  email?: string;
  phone?: string;
  comments?: string;
  images?: string[]; // Will store filenames
};

export async function POST(request: Request) {
  try {
    console.log("Quote API called");
    
    // Parse FormData instead of JSON
    const formData = await request.formData();
    const body: QuotePayload = {};
    
    // Extract form fields
    for (const [key, value] of Array.from(formData.entries())) {
      if (key === 'images' && value instanceof File) {
        // Handle single image
        if (!body.images) body.images = [];
        body.images.push(value.name || 'image.jpg'); // Store filename for now
      } else if (key === 'services' && typeof value === 'string') {
        // Handle services array (comma-separated)
        body.services = value.split(',').map(s => s.trim()).filter(s => s);
      } else if (typeof value === 'string') {
        // Handle regular string fields
        (body as any)[key] = value;
      }
    }
    
    console.log("Parsed quote data:", body);

    // Send emails using SMTP configuration
    try {
      // Load admin configuration
      const dataDir = join(process.cwd(), 'data');
      const homepageFile = join(dataDir, 'homepage.json');
      
      let adminConfig;
      try {
        const configData = await readFile(homepageFile, 'utf-8');
        adminConfig = JSON.parse(configData);
      } catch (error) {
        console.log("Admin configuration not found - skipping email send");
        adminConfig = null;
      }

      if (adminConfig && adminConfig.smtpHost && adminConfig.smtpUsername && adminConfig.smtpPassword) {
        // Create transporter
        const transporter = nodemailer.createTransport({
          host: adminConfig.smtpHost,
          port: parseInt(adminConfig.smtpPort) || 587,
          secure: false,
          auth: {
            user: adminConfig.smtpUsername,
            pass: adminConfig.smtpPassword,
          },
        });

        const fromEmail = adminConfig.fromEmail || adminConfig.smtpUsername;
        const companyName = adminConfig.companyName || 'Ace Construction';

        // Send customer confirmation email
        if (body.email) {
          await transporter.sendMail({
            from: fromEmail,
            to: body.email,
            subject: `Thank you for your quote request - ${companyName}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2563eb;">Thank You for Your Quote Request!</h2>
                <p>Dear ${body.name || 'Valued Customer'},</p>
                <p>We've received your quote request and our team will review it within 30 minutes. Here are the details:</p>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #1e40af; margin-top: 0;">Project Details</h3>
                  <p><strong>Project Type:</strong> ${body.projectType || 'Not specified'}</p>
                  <p><strong>Services:</strong> ${body.services?.join(', ') || 'Not specified'}</p>
                  <p><strong>Location:</strong> ${body.location || 'Not specified'}</p>
                  <p><strong>Size:</strong> ${body.size || 'Not specified'}</p>
                  <p><strong>Timeline:</strong> ${body.timeline || 'Not specified'}</p>
                  <p><strong>Budget:</strong> ${body.budget || 'Not specified'}</p>
                  <p><strong>Urgency:</strong> ${body.urgency || 'Not specified'}</p>
                  ${body.comments ? `<p><strong>Comments:</strong> ${body.comments}</p>` : ''}
                </div>
                
                <p>Our team will contact you at <strong>${body.phone || body.email}</strong> within 30 minutes to discuss your project and provide a detailed quote.</p>
                
                <p>If you have any urgent questions, please don't hesitate to call us directly.</p>
                
                <hr style="margin: 30px 0;">
                <p style="color: #666; font-size: 14px;">
                  <strong>${companyName}</strong><br>
                  ${adminConfig.footerAddress || ''}<br>
                  Phone: ${adminConfig.footerPhone || ''}<br>
                  Email: ${adminConfig.footerEmail || ''}
                </p>
              </div>
            `,
          });
          console.log("Customer confirmation email sent successfully");
        }

        // Send admin notification email
        if (adminConfig.adminEmails) {
          const adminEmails = adminConfig.adminEmails.split(',').map((email: string) => email.trim()).filter((email: string) => email);
          
          if (adminEmails.length > 0) {
            await transporter.sendMail({
              from: fromEmail,
              to: adminEmails.join(', '),
              subject: `New Quote Request - ${companyName}`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #dc2626;">New Quote Request Received!</h2>
                  <p>A new quote request has been submitted through your website.</p>
                  
                  <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
                    <h3 style="color: #dc2626; margin-top: 0;">Customer Information</h3>
                    <p><strong>Name:</strong> ${body.name || 'Not provided'}</p>
                    <p><strong>Email:</strong> ${body.email || 'Not provided'}</p>
                    <p><strong>Phone:</strong> ${body.phone || 'Not provided'}</p>
                  </div>
                  
                  <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #1e40af; margin-top: 0;">Project Details</h3>
                    <p><strong>Project Type:</strong> ${body.projectType || 'Not specified'}</p>
                    <p><strong>Services:</strong> ${body.services?.join(', ') || 'Not specified'}</p>
                    <p><strong>Location:</strong> ${body.location || 'Not specified'}</p>
                    <p><strong>Size:</strong> ${body.size || 'Not specified'}</p>
                    <p><strong>Timeline:</strong> ${body.timeline || 'Not specified'}</p>
                    <p><strong>Budget:</strong> ${body.budget || 'Not specified'}</p>
                    <p><strong>Urgency:</strong> ${body.urgency || 'Not specified'}</p>
                    ${body.comments ? `<p><strong>Comments:</strong> ${body.comments}</p>` : ''}
                  </div>
                  
                  <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; color: #0369a1;"><strong>Action Required:</strong> Please contact the customer within 30 minutes as promised.</p>
                  </div>
                  
                  <p style="color: #666; font-size: 14px;">
                    Quote ID: ${Date.now().toString()}<br>
                    Submitted: ${new Date().toLocaleString()}
                  </p>
                </div>
              `,
            });
            console.log("Admin notification email sent successfully");
          }
        }
      } else {
        console.log("SMTP configuration not complete - skipping email send");
      }
    } catch (emailError) {
      console.error("Failed to send emails:", emailError);
      // Continue execution even if email fails
    }

    // Save quote data to database or local file
    try {
      const newQuote = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...body
      };

      // Try to save to database first
      if (database.isConfigured()) {
        await database.query(
          'INSERT INTO quotes (data) VALUES ($1)',
          [JSON.stringify(newQuote)]
        );
        console.log("Quote data saved to database successfully");
      } else {
        // Fallback to local file system
        const dataDir = join(process.cwd(), 'data');
        const quotesFile = join(dataDir, 'quotes.json');
        
        // Ensure data directory exists
        await mkdir(dataDir, { recursive: true });
        
        // Read existing quotes or create new array
        let quotes = [];
        try {
          const existingData = await readFile(quotesFile, 'utf-8');
          quotes = JSON.parse(existingData);
        } catch {
          // File doesn't exist or is invalid, start with empty array
        }
        
        quotes.push(newQuote);
        
        // Write back to file
        await writeFile(quotesFile, JSON.stringify(quotes, null, 2));
        console.log("Quote data saved to file system successfully");
      }
    } catch (saveError) {
      console.error("Failed to save quote data:", saveError);
      // Continue execution even if save fails
    }

    return NextResponse.json({ 
      ok: true, 
      message: "Quote request submitted successfully! We'll contact you within 30 minutes.",
      quoteId: Date.now().toString()
    }, { status: 200 });
    
  } catch (error) {
    console.error("Quote API error:", error);
    return NextResponse.json({ 
      ok: false, 
      error: `Failed to process quote request: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or call us directly.` 
    }, { status: 500 });
  }
}

