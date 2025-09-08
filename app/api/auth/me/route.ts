import { SimpleAuthService } from "../../../lib/simple-auth";

export async function GET() {
  try {
    const user = await SimpleAuthService.getCurrentUser();
    
    if (!user) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    return Response.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    return Response.json({ error: "Failed to get user info" }, { status: 500 });
  }
}
