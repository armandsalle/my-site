import { cn } from "@/lib/utils"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Armand Sallé",
  description: "Armand Sallé is a frontend engineer currently working at Dalma. He cares about design and experience.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-stone-50")}>{children}</body>
    </html>
  )
}
