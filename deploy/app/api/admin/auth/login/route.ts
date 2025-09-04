import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Hardcoded admin credentials - simple and works!
    if (email === "admin@aceconstruction.local" && password === "admin123") {
      // Set a simple session cookie
      const cookieStore = await cookies();
      cookieStore.set("admin_logged_in", "true", {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return Response.json({ success: true });
    }

    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}