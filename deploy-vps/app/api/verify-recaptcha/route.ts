import { NextRequest, NextResponse } from 'next/server';
import { readFile } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: "reCAPTCHA token is required" 
      }, { status: 400 });
    }

    // Load admin configuration to get reCAPTCHA settings
    let adminConfig;
    try {
      const dataDir = join(process.cwd(), 'data');
      const homepageFile = join(dataDir, 'homepage.json');
      const configData = await readFile(homepageFile, 'utf-8');
      adminConfig = JSON.parse(configData);
    } catch (error) {
      return NextResponse.json({ 
        success: false, 
        error: "Failed to load admin configuration" 
      }, { status: 500 });
    }

    // Check if reCAPTCHA is enabled
    if (!adminConfig.recaptchaEnabled) {
      return NextResponse.json({ 
        success: true, 
        message: "reCAPTCHA is disabled" 
      });
    }

    // Check if secret key is configured
    if (!adminConfig.recaptchaSecretKey) {
      return NextResponse.json({ 
        success: false, 
        error: "reCAPTCHA secret key not configured" 
      }, { status: 500 });
    }

    // Verify reCAPTCHA token with Google
    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: adminConfig.recaptchaSecretKey,
        response: token,
        remoteip: request.ip || request.headers.get('x-forwarded-for') || 'unknown'
      })
    });

    const recaptchaResult = await recaptchaResponse.json();

    if (recaptchaResult.success) {
      return NextResponse.json({ 
        success: true, 
        message: "reCAPTCHA verification successful" 
      });
    } else {
      console.error('reCAPTCHA verification failed:', recaptchaResult['error-codes']);
      return NextResponse.json({ 
        success: false, 
        error: "reCAPTCHA verification failed",
        details: recaptchaResult['error-codes']
      }, { status: 400 });
    }

  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error during reCAPTCHA verification" 
    }, { status: 500 });
  }
}
