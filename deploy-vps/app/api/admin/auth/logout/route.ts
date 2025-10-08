import { SimpleAuthService } from "../../../../lib/simple-auth";

export async function POST() {
  try {
    // Clear all session cookies
    await SimpleAuthService.clearSessionCookies();
    return Response.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return Response.json({ error: "Logout failed" }, { status: 500 });
  }
}