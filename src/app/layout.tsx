import type { Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/react";
import Header from "@/components/layout/header";
import './globals.css'

export const metadata: Metadata = {
  title: "Copywrit.ai",
  description: "Copywrit.ai",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Header />
        <TRPCReactProvider>
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}