'use client'

import { signIn, signOut } from "next-auth/react";

export default function Login({ user }) {
    if (user && user) {
        return (
            <section className="text-center mt-6">
                <button className="h-[48px] w-[112px] mr-6 rounded-[24px] bg-primary-violet hover:bg-primary-light-violet cursor-pointer text-white font-bold text-[15px]" onClick={() => signOut()}>Sign out</button>
            </section>
        )
    }
    return (
        <section className="text-center mt-6">
            <button className="h-[48px] w-[112px] mr-6 rounded-[24px] bg-primary-violet hover:bg-primary-light-violet cursor-pointer text-white font-bold text-[15px]" onClick={() => signIn()}>Sign in</button>
        </section>
    )
}