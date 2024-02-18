import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
//const inter = Grandstander({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cermat online testy',
  description: 'Cermat Test application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className=''>
      <body className={`${inter.className} bg-white dark:bg-slate-900 dark:text-white`}>{children}</body>
    </html>
  )
}
