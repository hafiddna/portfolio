import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const calSans = localFont({
    src: "../fonts/CalSans-SemiBold.ttf",
    variable: "--font-calsans",
    weight: "600",
});

export const metadata: Metadata = {
    title: {
        default: "Home | hafiddna.vercel.app",
        template: "%s | hafiddna.vercel.app",
    },
    description: "Senior Web Developer of venturo.id and Freelancer",
    openGraph: {
        title: "hafiddna.vercel.app",
        description: "Senior Web Developer of venturo.id and Freelancer",
        url: "https://hafiddna.vercel.app",
        siteName: "hafiddna.vercel.app",
        images: [
            {
                url: "https://hafiddna.vercel.app/og.svg",
                width: 1920,
                height: 1080,
            },
        ],
        locale: "en-US",
        type: "website",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    twitter: {
        title: "Hafid Dian Nurfaujan Ahat",
        card: "summary_large_image",
    },
    icons: {
        shortcut: "/favicon.svg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={[inter.variable, calSans.variable].join(" ")}>
            <body className={`antialiased bg-black ${process.env.NODE_ENV === "development" ? "debug-screens" : undefined}`}>
                {children}

                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
