import { Inter } from "next/font/google"
import '@/app/globals.css'
import { ClientProviders } from "@/app/providers/client-providers";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script src="https://unpkg.com/react-scan/dist/auto.global.js" />
      </head>
      <body className={inter.className}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}