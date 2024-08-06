import { NextResponse } from 'next/server';
import { verifyRefreshToken } from './lib/auth';

const authPages = ['/login','/register'];

const isAuthPage = (url) => authPages.includes(url)
 
export async function middleware(request) {
    const { url,nextUrl,cookies } = request; 
    const refreshToken = cookies.get("refreshToken");

    const isValidRefreshToken = await verifyRefreshToken(refreshToken?.value);    

    if(nextUrl.pathname === '/') {
        if(isValidRefreshToken) {
            return NextResponse.redirect(new URL("/dashboard", url));
        }else{
            return NextResponse.redirect(new URL("/login", url))
        }
    }

    if(nextUrl.pathname.startsWith('/dashboard')) {
        if(isValidRefreshToken) {
            return NextResponse.next();
        }else{
            return NextResponse.redirect(new URL("/login", url));
        }
    }

    const isAuthPageRequested = isAuthPage(nextUrl.pathname);

    if(isAuthPageRequested) {
        if(isValidRefreshToken) {
            const response = NextResponse.redirect(new URL('/dashboard', url));
            return response;                        
        }else{
            return NextResponse.next();
        }
    }
    
    return NextResponse.redirect(new URL('/', url))
}
 
export const config = {
  matcher: ['/','/login','/dashboard/:path*']
}