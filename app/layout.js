import { League_Spartan } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/theme-provider';


const spartan = League_Spartan({ subsets: ['latin'], weight: ['700', '500'] })

export const metadata = {
  title: 'Invoice App',
  description: 'Tracking invoice receipt',
}

export default function RootLayout(props) {
  return (
    <html lang="en">
      <body className={`${spartan.className} antialiased`}>
        <ThemeProvider>
          {props.children}
          {props.modal}
        </ThemeProvider>
      </body>
    </html>
  )
}
