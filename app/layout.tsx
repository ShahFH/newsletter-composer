import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import "./globals.css"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Newsletter Composer",
  description: "Create and manage newsletters with ease",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
            <header className="border-b ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-[18px] font-bold leading-0.5">
                <Link href="/templates">Spaces</Link>
                </h1>
              
            </div>
            <div className="flex items-center space-x-4">
              <p className=" font-medium text-[14px] text-[#475569]">Blog</p>
              <Link href="/templates">
                <p className="cursor-pointer font-medium text-[14px] text-[#737373] transition-all hover:text-black">
                  Templates
                </p>
              </Link>
              <Button size="sm" className=" bg-black rounded-[8px] w-[86px] h-[33px]">
              Contact
              </Button>
              
              <div className="w-8 h-8 rounded-full bg-gray-300">
                <Image
                  src="/Image.png"
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </header>
            {children}
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
