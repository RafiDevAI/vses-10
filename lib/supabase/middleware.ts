import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request,
  })

  // For protected routes, we check if the auth cookie exists
  // The actual auth validation happens on the client side or in server components

  const authCookie = request.cookies.get("sb-auth-token")?.value

  // Redirect to login if accessing protected routes without authentication cookie
  const protectedPaths = ["/progress", "/profile"]
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  if (!authCookie && isProtectedPath) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  return response
}
