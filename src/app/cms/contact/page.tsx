/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/card";
import { db } from "@/lib/firebase";
import { Contact } from "@/models/contact";
import { Button, Modal } from "antd";
import { collection, getDocs, query, where, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { BiLogoDevTo } from "react-icons/bi";
import { FaMediumM } from "react-icons/fa";
import { FaGithub, FaXTwitter, FaInstagram, FaLinkedin, FaFacebook, FaHashnode, FaStackOverflow, FaCodepen, FaHackerrank, FaYoutube, FaTwitch, FaThreads, FaSquareBehance, FaDribbble } from "react-icons/fa6";
import { SiCodesandbox, SiLeetcode, SiCodewars, SiTopcoder } from "react-icons/si";
import { z } from "zod";

const schema = z.object({
    label: z.string(),
    icon: z.any(),
    handle: z.string().min(1, "Handle must be at least 1 character"),
    href: z.string().url("Href field must be a valid URL"),
})

type RegisterFormData = z.infer<typeof schema>;

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

export default function CMSContact() {
    const [data, setData] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(false);
    const [socialData, setSocialData] = useState([
        {
            icon: <FaXTwitter size={20} />,
            label: "X",
        },
        {
            icon: <FaInstagram size={20} />,
            label: "Instagram",
        },
        {
            icon: <FaGithub size={20} />,
            label: "GitHub",
        },
        {
            icon: <FaLinkedin size={20} />,
            label: "LinkedIn",
        },
        {
            icon: <FaFacebook size={20} />,
            label: "Facebook",
        },
        {
            icon: <FaHashnode size={20} />,
            label: "Hashnode",
        },
        {
            icon: <FaStackOverflow size={20} />,
            label: "Stack Overflow",
        },
        {
            icon: <FaCodepen size={20} />,
            label: "CodePen",
        },
        {
            icon: <FaHackerrank size={20} />,
            label: "HackerRank",
        },
        {
            icon: <FaYoutube size={20} />,
            label: "YouTube",
        },
        {
            icon: <FaTwitch size={20} />,
            label: "Twitch",
        },
        {
            icon: <BiLogoDevTo size={20} />,
            label: "Dev.to",
        },
        {
            icon: <FaMediumM size={20} />,
            label: "Medium",
        },
        {
            icon: <SiCodesandbox size={20} />,
            label: "CodeSandbox",
        },
        {
            icon: <FaThreads size={20} />,
            label: "Threads",
        },
        {
            icon: <FaSquareBehance size={20} />,
            label: "Behance",
        },
        {
            icon: <FaDribbble size={20} />,
            label: "Dribbble",
        },
        {
            icon: <SiLeetcode size={20} />,
            label: "LeetCode",
        },
        {
            icon: <SiCodewars size={20} />,
            label: "CodeWars",
        },
        {
            icon: <SiTopcoder size={20} />,
            label: "TopCoder",
        },
    ]);

    const [modalVisible, setModalVisible] = useState<"" | "add" | "edit">("");

    const [formData, setFormData] = useState<RegisterFormData>({handle: '', href: '', icon: '', label: ''});
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, "contacts"));
                const users = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                const newSocials: Contact[] = [];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                users.forEach((user: any) => {
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
                setSocialData(newSocials.filter((s) => socialData.some((sd) => sd.label === s.label)));
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
        <>
            <div className="sm:border-b sm:border-zinc-800 sm:h-[150px] lg:h-[100px]">
                <div
                    className="max-w-7xl mx-auto flex flex-col gap-4 lg:gap-10 px-6 lg:px-8 lg:flex-row lg:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
                            Contact
                        </h2>
                        <p className="mt-4 text-sm text-zinc-400">
                            In this page you can modify the contact information of the portfolio website.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button size="large">
                            Add Contact
                        </Button>
                    </div>
                </div>
            </div>

            <div className={`max-w-7xl -mt-24 sm:mt-4 flex items-center px-4 mx-auto justify-center`}>
                {!loading ? (
                    <div className="grid w-full grid-cols-1 gap-8 mx-auto mt-32 sm:mt-0 sm:grid-cols-3 lg:gap-16">
                        {data.map((s) => (
                            <Card key={s.id}>
                                <div
                                    className="p-4 relative flex flex-col items-center gap-4 duration-700 group md:gap-8 md:py-24 lg:pb-48 md:p-16">
                                    <span
                                        className="absolute w-px h-2/3 bg-gradient-to-b from-zinc-500 via-zinc-500/50 to-transparent"
                                        aria-hidden="true"/>
                                    <span
                                        className="relative z-10 flex items-center justify-center w-12 h-12 text-sm duration-1000 border rounded-full text-zinc-200 group-hover:text-white group-hover:bg-zinc-900 border-zinc-500 bg-zinc-900 group-hover:border-zinc-200 drop-shadow-orange">{s.icon}</span>
                                    {" "}
                                    <div className="z-10 flex flex-col items-center">
                                        <span
                                            className="text-center lg:text-xl font-medium duration-150 xl:text-3xl text-zinc-200 group-hover:text-white font-display">
                                            {s.handle}
                                        </span>
                                        <span
                                            className="mt-4 text-sm text-center duration-1000 text-zinc-400 group-hover:text-zinc-200">
                                            {s.label}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="grid w-full grid-cols-1 gap-8 mx-auto mt-32 sm:mt-0 sm:grid-cols-3 lg:gap-16">
                        {Array(3).fill(0).map((_, i) => <SkeletonCard key={i}/>)}
                    </div>
                )}
            </div>
        </>
    )
}
