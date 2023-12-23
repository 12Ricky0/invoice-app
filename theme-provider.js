'use client'
import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext({})
export default function ThemeProvider({ children }) {

    const [theme, setTheme] = useState('light')

    useEffect(() => {
        try {

            if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark')
                document.documentElement.classList.remove('light')

            } else {
                document.documentElement.classList.remove('dark')
                document.documentElement.classList.add('light')

            }

        } catch (error) {

        }
    })

    return <ThemeContext.Provider value={{ setTheme, theme }}>{children}</ThemeContext.Provider>

}