import React from "react";
import type { Metadata } from "next";
import ContactItem from "@/app/contact/contact";
import Analytic from "@/components/analytic";
import { Navigation } from "@/components/nav";

export const metadata: Metadata = {
    title: "Contact",
};

export default function Contact() {
    return (
        <>
            <div className=" bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
                <Navigation />
                <ContactItem />
            </div>
            <Analytic page="/contact" />
        </>
    );
}
