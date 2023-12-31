import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

export const config = {
    theme: {
        logo: "public/assets/logo.svg",
    },
    providers: [
        GitHub
    ],
    callbacks: {
        authorized({ request: { nextUrl }, auth }) {
            const { pathname } = nextUrl
            if (pathname === "/dashboard") return !!auth;
            return true;

        },
    },
};
export const { handlers, auth, signIn, signOut } = NextAuth(config)