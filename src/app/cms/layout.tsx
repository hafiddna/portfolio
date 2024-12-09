import React from "react";
import type { Metadata } from "next";
import CMSMiddleware from "@/app/cms/middleware";
import CMSContainer from "@/app/cms/cms-container";
import { CMSNavigation } from "@/components/cms-nav";

export const metadata: Metadata = {
    title: "CMS",
};

export default function CMSLayout({
    children,
}: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen bg-gradient-to-tl from-zinc-900 via-zinc-400/10 to-zinc-900">
            <div className="relative pb-16">
                <CMSNavigation />

                <div className="pt-20 md:pt-24 lg:pt-32">
                    <CMSContainer>
                        {children}
                    </CMSContainer>
                </div>

                <CMSMiddleware />
            </div>
        </div>
    );
}
