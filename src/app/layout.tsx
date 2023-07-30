import { cn } from "@/lib/utils"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Armand Sallé",
  description: "Armand Sallé is a frontend engineer currently working at Dalma. He cares about design and experience.",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Armand Sallé",
    description:
      "Armand Sallé is a frontend engineer currently working at Dalma. He cares about design and experience.",
    images: [
      {
        url: "https://armand-salle.fr/og.png",
        alt: "Armand Sallé",
      },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-stone-50 min-h-screen py-12")}>{children}</body>
    </html>
  )
}
