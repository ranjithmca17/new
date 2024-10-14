


// // middleware.ts
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//     const path = request.nextUrl.pathname;
//     const isPublicPath = path === '/login' || path === '/signup';
//     const token = request.cookies.get('token')?.value || '';

//     if (isPublicPath && token) {
//         return NextResponse.redirect(new URL('/', request.url));
//     }

//     if (!isPublicPath && !token) {
//         return NextResponse.redirect(new URL('/login', request.url));
//     }
// }

// export const config = {
//     matcher: [
//     '/Pages/DashBoard',
//     '/Pages/Purchase',
//     '/Pages/Sales',
  
//     '/Component/TodayTopFive',
//     '/Component/LowStockFive',
//     '/',
//     '/profile',
//     '/login',
//     '/signup',
//     ],
// };





// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const token = request.cookies.get('token')?.value || '';
    const TOKEN_SECRET = new TextEncoder().encode(process.env.TOKEN_SECRET || 'Secret_Key');
    
    let userRole: string | null = null;
    
    // Verify token and extract user role
    if (token) {
        try {
            const { payload } = await jwtVerify(token, TOKEN_SECRET);
            userRole = payload.role;
        } catch (error) {
            console.error("Token verification failed:", error);
        }
    }

    const isPublicPath = ['/login', '/signup'].includes(path);
    const protectedPaths = ['/Pages/DashBoard', '/Pages/Purchase', '/Pages/Sales'];
    const componentPaths = ['/Component/TodayTopFive', '/Component/LowStockFive'];
    const adminPaths = ['/Components/AddVendor', '/Dashboard/Filter'];

    // Redirect logic
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    
    if (protectedPaths.concat(componentPaths).includes(path) && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    
    if (adminPaths.includes(path) && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
}

export const config = {
    matcher: [
        '/Pages/DashBoard',
        '/Pages/Purchase',
        '/Pages/Sales',
        '/Component/TodayTopFive',
        '/Component/LowStockFive',
        '/profile',
        '/login',
        '/signup',
        '/unauthorized',
    ],
};
