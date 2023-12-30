'use client';
import { useContext } from "react";
import { ThemeContext } from "@/theme-provider";
import Image from "next/image";
import Link from "next/link";


export default function Header({ dp }) {
    const { theme, setTheme } = useContext(ThemeContext)
    let userTheme
    if (typeof window !== "undefined") {
        userTheme = localStorage.getItem("theme") || ""
    }

    function handleClick() {
        setTheme(theme === 'light' ? 'dark' : 'light')
        localStorage.setItem('theme', theme)
    }

    return (
        <header className="h-[72px] lg:h-[100vh] lg:w-[103px] lg:fixed bg-primary-dark-blue flex flex-row lg:flex-col lg:rounded-tr-[20px] lg:rounded-br-[20px] justify-between relative z-[1001]">
            <Link href="/">
                <div className="w-[72px] h-[72px] bg-primary-violet lg:rounded-tr-[20px] lg:w-[103px] lg:h-[103px] lg:rounded-br-[20px] bg-logo bg-auto bg-center bg-no-repeat">

                </div>
            </Link>
            <nav className="inline-flex lg:flex lg:flex-col items-center justify-center">
                <div className="cursor-pointer">
                    <Image
                        src={`${userTheme === 'light' ? "/assets/icon-moon.svg" : "/assets/icon-sun.svg"}`}
                        alt="logo"
                        width={20}
                        height={20}
                        onClick={handleClick}
                        className="w-auto"
                    />
                </div>
                <div className=" border-r border-r-secondary-light-blue h-[72px] lg:border-r-0 lg:h-0 lg:mx-0 lg:w-[103px] lg:border-b lg:border-b-secondary-light-blue items-center ml-6 lg:mt-6 " />
                {/* <div className="bg-image-avatar w-[32px] h-[32px] bg-contain rounded-2xl mx-6 lg:my-6 lg:mx-0" /> */}
                <Link href="/">
                    <Image
                        src={dp}
                        alt="empty image"
                        height={200}
                        width={240}
                        className="w-[32px] cursor-pointer h-[32px] bg-contain rounded-2xl mx-6 lg:my-6 lg:mx-0"
                    />
                </Link>
            </nav>
        </header>
    )
}