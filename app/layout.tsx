import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ModalProvider } from "@/providers/modal-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Georginio-Prod",
  description: "Site de E-com",
  icons: {
    icon: [
      {
        
        url: "/icons8-buy-with-card-96.png",
        href: "/icons8-buy-with-card-96.png",
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
<html lang="en">
      <body className={inter.className}>
        <ModalProvider/>
        {children}
        </body>
    </html>
    </ClerkProvider>
    
  );
}
