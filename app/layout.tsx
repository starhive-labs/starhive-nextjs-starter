import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Starhive starter",
    description: "Starhive & Next.js Starter",
};

export default function RootLayout({
  children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`gradient-background ${inter.className}`}>
        {children}
        </body>
        </html>
    );
}
