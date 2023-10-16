//this comes from clerk.com authentication
import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  publicRoutes: ['/api/:path*'], //this allows get to protected outes
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
