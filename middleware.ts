import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './lib/i18n/settings';

// Create i18n middleware
const intlMiddleware = createIntlMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'always',
});

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Apply i18n middleware first
    const response = intlMiddleware(request);

    // Check if it's an admin route (after locale prefix)
    const isAdminRoute = pathname.match(/^\/(en|fr)\/admin/);
    const isLoginRoute = pathname.match(/^\/(en|fr)\/admin\/login/);

    if (isAdminRoute && !isLoginRoute) {
        const accessToken = request.cookies.get('access_token')?.value;

        if (!accessToken) {
            const locale = pathname.split('/')[1] || defaultLocale;
            const loginUrl = new URL(`/${locale}/admin/login`, request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // In a real app, you'd verify the token here
        // For now, we just check if it exists
    }

    return response;
}

export const config = {
    matcher: [
        // Match all pathnames except for
        // - … if they start with `/api`, `/_next` or `/_vercel`
        // - … the ones containing a dot (e.g. `favicon.ico`)
        '/((?!api|_next|_vercel|.*\\..*).*)',
    ],
};
