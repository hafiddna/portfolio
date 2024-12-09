"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import Loader from "@/components/loader";
import { auth } from "@/lib/firebase";
import { RiDashboardHorizontalFill, RiLogoutCircleRLine } from "react-icons/ri";

export const CMSNavigation: React.FC = () => {
    const ref = useRef<HTMLElement>(null);
    const [isIntersecting, setIntersecting] = useState(true);
    const [loading, setLoading] = useState(false);

    const logout = async () => {
        setLoading(true);
        await auth.signOut();

        setTimeout(() => {
            redirect("/");
        }, 1000);
    }

    useEffect(() => {
        if (!ref.current) return;
        const observer = new IntersectionObserver(([entry]) =>
            setIntersecting(entry.isIntersecting),
        );

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <header ref={ref}>
            <div className={`fixed inset-x-0 top-0 z-50 backdrop-blur duration-200 border-b ${isIntersecting ? "bg-zinc-900/0 border-transparent" : "bg-zinc-900/500 border-zinc-800"}`}>
                <div className="container grid grid-cols-12 items-center justify-between p-6 mx-auto">
                    <Link
                        href="/cms"
                        className="col-span-1 duration-200 text-zinc-400 hover:text-zinc-100"
                    >
                        <RiDashboardHorizontalFill className="w-5 h-5"/>
                    </Link>

                    <div className="col-span-10 flex justify-center gap-8">
                        <Link
                            href="/cms/projects"
                            className="duration-200 text-zinc-400 hover:text-zinc-100"
                        >
                            Projects
                        </Link>
                        <Link
                            href="/cms/blog"
                            className="duration-200 text-zinc-400 hover:text-zinc-100"
                        >
                            Blog
                        </Link>
                        <Link
                            href="/cms/contact"
                            className="duration-200 text-zinc-400 hover:text-zinc-100"
                        >
                            Contact
                        </Link>
                    </div>

                    <button className="col-span-1 duration-200 text-zinc-400 hover:text-zinc-100" onClick={logout}>
                        {loading ? (
                            <Loader />
                        ) : (
                            <RiLogoutCircleRLine className="w-5 h-5"/>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};
