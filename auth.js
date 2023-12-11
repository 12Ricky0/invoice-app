import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { NextResponse } from "next/server";

export const config = {
    theme: {
        logo: "https://next-auth.js.org/img/logo/logo-sm.png",
    },
    providers: [
        GitHub,
        Google
    ],
    callbacks: {
        // authorized({ auth, request: { nextUrl } }) {
        //     const isLoggedIn = !!auth?.user;
        //     const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
        //     if (isOnDashboard) {
        //         if (isLoggedIn) return true;
        //         return false; // Redirect unauthenticated users to login page
        //     } else if (isLoggedIn) {
        //         return Response.redirect(new URL('/dashboard', nextUrl));
        //     }
        //     return true;
        // },
        authorized({ request, auth }) {
            const { pathname } = request.nextUrl
            if (pathname === "/dashboard") return !!auth
            return true
        },
    },
};
export const { handlers, auth, signIn, signOut } = NextAuth(config)