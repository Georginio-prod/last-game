import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ModalProvider } from "@/providers/modal-provider";
import { ToasterProvider } from "@/providers/toast-provider";
import { ThemeProvider } from "@/providers/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shoppi-M",
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ToasterProvider/>
        <ModalProvider/>
        {children}
        </ThemeProvider>
        </body>
    </html>
    </ClerkProvider>
    
  );
}
