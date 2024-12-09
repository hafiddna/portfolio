"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/card";
import { db } from "@/lib/firebase";
import { Contact } from "@/models/contact";
import { collection, getDocs } from "firebase/firestore";
import { BiLogoDevTo } from "react-icons/bi";
import { FaMediumM } from "react-icons/fa";
import { FaGithub, FaXTwitter, FaInstagram, FaLinkedin, FaFacebook, FaHashnode, FaStackOverflow, FaCodepen, FaHackerrank, FaYoutube, FaTwitch, FaThreads, FaSquareBehance, FaDribbble } from "react-icons/fa6";
import { SiCodesandbox, SiLeetcode, SiCodewars, SiTopcoder } from "react-icons/si";

const SkeletonCard = () => (
    <Card>
        <div className="p-4 relative flex flex-col items-center gap-4 duration-700 group md:gap-8 md:py-24 lg:pb-48 md:p-16">
            <span className="absolute w-px h-2/3 bg-gradient-to-b from-zinc-500 via-zinc-500/50 to-transparent animate-pulse" aria-hidden="true" />
            <span className="relative z-10 flex items-center justify-center w-12 h-12 text-sm rounded-full text-zinc-200 animate-pulse bg-zinc-700" />
            <div className="z-10 flex flex-col items-center">
                <span className="h-9 w-40 bg-zinc-700 rounded-md animate-pulse"></span>
                <span className="mt-4 h-5 w-36 bg-zinc-700 rounded-md animate-pulse"></span>
            </div>
        </div>
    </Card>
);

export default function ContactItem() {
    const [data, setData] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, "contacts"));
                const contacts: Contact[] = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                const newSocials: Contact[] = [];
                contacts.forEach((user: Contact) => {
                    const newData = user;
                    if (user.icon === "x") {
                        newData.icon = <FaXTwitter size={20} />;
                    } else if (user.icon === "instagram") {
                        newData.icon = <FaInstagram size={20} />;
                    } else if (user.icon === "github") {
                        newData.icon = <FaGithub size={20} />;
                    } else if (user.icon === "linkedin") {
                        newData.icon = <FaLinkedin size={20} />;
                    } else if (user.icon === "facebook") {
                        newData.icon = <FaFacebook size={20} />;
                    } else if (user.icon === "hashnode") {
                        newData.icon = <FaHashnode size={20} />;
                    } else if (user.icon === "stackoverflow") {
                        newData.icon = <FaStackOverflow size={20} />;
                    } else if (user.icon === "codepen") {
                        newData.icon = <FaCodepen size={20} />;
                    } else if (user.icon === "hackerrank") {
                        newData.icon = <FaHackerrank size={20} />;
                    } else if (user.icon === "youtube") {
                        newData.icon = <FaYoutube size={20} />;
                    } else if (user.icon === "twitch") {
                        newData.icon = <FaTwitch size={20} />;
                    } else if (user.icon === "devto") {
                        newData.icon = <BiLogoDevTo size={20} />;
                    } else if (user.icon === "medium") {
                        newData.icon = <FaMediumM size={20} />;
                    } else if (user.icon === "codesandbox") {
                        newData.icon = <SiCodesandbox size={20} />;
                    } else if (user.icon === "threads") {
                        newData.icon = <FaThreads size={20} />;
                    } else if (user.icon === "behance") {
                        newData.icon = <FaSquareBehance size={20} />;
                    } else if (user.icon === "dribbble") {
                        newData.icon = <FaDribbble size={20} />;
                    } else if (user.icon === "leetcode") {
                        newData.icon = <SiLeetcode size={20} />;
                    } else if (user.icon === "codewars") {
                        newData.icon = <SiCodewars size={20} />;
                    } else if (user.icon === "topcoder") {
                        newData.icon = <SiTopcoder size={20} />;
                    }
                    newSocials.push(newData as Contact);
                });
                setData(newSocials);
            } catch (error) {
                console.error("Error fetching data: ", error);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 100);
            }
        };
        fetchData().then(() => {});
    }, []);

    return (
        <div className={`container flex items-center min-h-screen px-4 mx-auto ${data.length <= 3 ? "justify-center" : "py-32"}`}>
            {!loading ? (
                <div className="grid w-full grid-cols-1 gap-8 mx-auto mt-32 sm:mt-0 sm:grid-cols-3 lg:gap-16">
                    {data.map((s) => (
                        <Card key={s.id}>
                            <Link
                                href={s.href || "#"}
                                target="_blank"
                                className="p-4 relative flex flex-col items-center gap-4 duration-700 group md:gap-8 md:py-24 lg:pb-48 md:p-16"
                            >
                                <span className="absolute w-px h-2/3 bg-gradient-to-b from-zinc-500 via-zinc-500/50 to-transparent" aria-hidden="true" />
                                <span className="relative z-10 flex items-center justify-center w-12 h-12 text-sm duration-1000 border rounded-full text-zinc-200 group-hover:text-white group-hover:bg-zinc-900 border-zinc-500 bg-zinc-900 group-hover:border-zinc-200 drop-shadow-orange">
                                    { s.icon }
                                </span>{" "}
                                <div className="z-10 flex flex-col items-center">
                                    <span className="text-center lg:text-xl font-medium duration-150 xl:text-3xl text-zinc-200 group-hover:text-white font-display">
                                        {s.handle}
                                    </span>
                                    <span className="mt-4 text-sm text-center duration-1000 text-zinc-400 group-hover:text-zinc-200">
                                        {s.label}
                                    </span>
                                </div>
                            </Link>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid w-full grid-cols-1 gap-8 mx-auto mt-32 sm:mt-0 sm:grid-cols-3 lg:gap-16">
                    {Array(3).fill(0).map((_, i) => <SkeletonCard key={i}/>)}
                </div>
            )}
        </div>
    )
}
