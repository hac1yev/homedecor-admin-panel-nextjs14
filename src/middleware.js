import { NextResponse } from 'next/server';

const authPages = ['/login','/register'];

const isAuthPage = (url) => authPages.includes(url)
 
export async function middleware(request) {
    const { url,nextUrl,cookies } = request; 
    const accessToken = cookies.get("accessToken");

    if(nextUrl.pathname === '/') {
        if(accessToken?.value) {
            return NextResponse.redirect(new URL("/dashboard", url));
        }else{
            return NextResponse.redirect(new URL("/login", url))
        }
    }

    if(nextUrl.pathname.startsWith('/dashboard')) {
        if(accessToken?.value) {
            return NextResponse.next();
        }else{
            return NextResponse.redirect(new URL("/login", url));
        }
    }

    const isAuthPageRequested = isAuthPage(nextUrl.pathname);

    if(isAuthPageRequested) {
        if(accessToken?.value) {
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