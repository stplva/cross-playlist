import { getToken } from 'next-auth/jwt'
import { NextResponse, type NextRequest } from 'next/server'

// Limit the middleware to paths starting with `/api/`
export const config = {
  matcher: ['/api/((?!auth/).*)'],
}

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  if (!token || !token.accessToken) {
    return Response.json(
      { success: false, message: 'Authentication failed' },
      { status: 401 }
    )
  }
  NextResponse.next()
}
