import { SimpleAuthService } from "../../../../lib/simple-auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Authenticate user
    const user = await SimpleAuthService.authenticate(email, password);
    
    if (!user) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Set simple session cookies
    await SimpleAuthService.setSessionCookies(user);

    return Response.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}