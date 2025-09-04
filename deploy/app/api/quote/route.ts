import { NextResponse } from "next/server";
import { Resend } from "resend";

type QuotePayload = {
  projectType?: string;
  services?: string[];
  location?: string;
  size?: string;
  status?: string;
  timeline?: string;
  budget?: string;
  name?: string;
  email?: string;
  phone?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as QuotePayload;

    // Send notification email via Resend if configured
    if (process.env.RESEND_API_KEY && process.env.QUOTE_NOTIFICATIONS_TO) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Ace Construction <noreply@aceconstruction.local>",
        to: process.env.QUOTE_NOTIFICATIONS_TO,
        subject: `New Quote Request: ${body.projectType ?? "Unknown project"}`,
        text: JSON.stringify(body, null, 2),
      });
    }

    // Placeholder for DB persistence (Supabase/MongoDB)
    // You can wire this to Supabase using service role key in a server-only context.

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }
}

