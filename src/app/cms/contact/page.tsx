"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/card";
import { db } from "@/lib/firebase";
import { Contact } from "@/models/contact";
import { Button, Modal, Dropdown, notification, Popconfirm } from "antd";
import type { MenuProps } from 'antd';
import { collection, getDocs, query, where, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { BiLogoDevTo } from "react-icons/bi";
import { FaMediumM } from "react-icons/fa";
import { FaPlus, FaPen, FaRegTrashCan, FaArrowUpRightFromSquare, FaGithub, FaXTwitter, FaInstagram, FaLinkedin, FaFacebook, FaHashnode, FaStackOverflow, FaCodepen, FaHackerrank, FaYoutube, FaTwitch, FaThreads, FaSquareBehance, FaDribbble } from "react-icons/fa6";
import { SiCodesandbox, SiLeetcode, SiCodewars, SiTopcoder } from "react-icons/si";
import { z } from "zod";

const schema = z.object({
    label: z.string().min(1, "Label must be at least 1 character"),
    icon: z.string().min(1, "Icon must be at least 1 character"),
    handle: z.string().min(1, "Title must be at least 1 character"),
    href: z.string().url("URL field must be a valid URL"),
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

interface SocialOption {
    icon: JSX.Element;
    icon_title: JSX.Element;
    label: string;
}

const socials: SocialOption[] = [
    {
        icon: <FaXTwitter size={14} />,
        icon_title: <FaXTwitter size={20} />,
        label: "X",
    },
    {
        icon: <FaInstagram size={14} />,
        icon_title: <FaInstagram size={20} />,
        label: "Instagram",
    },
    {
        icon: <FaGithub size={14} />,
        icon_title: <FaGithub size={20} />,
        label: "GitHub",
    },
    {
        icon: <FaLinkedin size={14} />,
        icon_title: <FaLinkedin size={20} />,
        label: "LinkedIn",
    },
    {
        icon: <FaFacebook size={14} />,
        icon_title: <FaFacebook size={20} />,
        label: "Facebook",
    },
    {
        icon: <FaHashnode size={14} />,
        icon_title: <FaHashnode size={20} />,
        label: "Hashnode",
    },
    {
        icon: <FaStackOverflow size={14} />,
        icon_title: <FaStackOverflow size={20} />,
        label: "Stack Overflow",
    },
    {
        icon: <FaCodepen size={14} />,
        icon_title: <FaCodepen size={20} />,
        label: "CodePen",
    },
    {
        icon: <FaHackerrank size={14} />,
        icon_title: <FaHackerrank size={20} />,
        label: "HackerRank",
    },
    {
        icon: <FaYoutube size={14} />,
        icon_title: <FaYoutube size={20} />,
        label: "YouTube",
    },
    {
        icon: <FaTwitch size={14} />,
        icon_title: <FaTwitch size={20} />,
        label: "Twitch",
    },
    {
        icon: <BiLogoDevTo size={14} />,
        icon_title: <BiLogoDevTo size={20} />,
        label: "Dev.to",
    },
    {
        icon: <FaMediumM size={14} />,
        icon_title: <FaMediumM size={20} />,
        label: "Medium",
    },
    {
        icon: <SiCodesandbox size={14} />,
        icon_title: <SiCodesandbox size={20} />,
        label: "CodeSandbox",
    },
    {
        icon: <FaThreads size={14} />,
        icon_title: <FaThreads size={20} />,
        label: "Threads",
    },
    {
        icon: <FaSquareBehance size={14} />,
        icon_title: <FaSquareBehance size={20} />,
        label: "Behance",
    },
    {
        icon: <FaDribbble size={14} />,
        icon_title: <FaDribbble size={20} />,
        label: "Dribbble",
    },
    {
        icon: <SiLeetcode size={14} />,
        icon_title: <SiLeetcode size={20} />,
        label: "LeetCode",
    },
    {
        icon: <SiCodewars size={14} />,
        icon_title: <SiCodewars size={20} />,
        label: "CodeWars",
    },
    {
        icon: <SiTopcoder size={14} />,
        icon_title: <SiTopcoder size={20} />,
        label: "TopCoder",
    },
];

export default function CMSContact() {
    const [data, setData] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(false);
    const [socialData, setSocialData] = useState<SocialOption[]>(socials);

    const [modalVisible, setModalVisible] = useState<"" | "add" | "edit">("");
    const [modalTitle, setModalTitle] = useState<JSX.Element>(<></>);
    const [formData, setFormData] = useState<RegisterFormData>({handle: '', href: '', icon: '', label: ''});
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [api, contextHolder] = notification.useNotification();

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
                contacts.forEach((contact: Contact) => {
                    const newData = contact;
                    if (contact.icon === "x") {
                        newData.icon = <FaXTwitter size={20} />;
                    } else if (contact.icon === "instagram") {
                        newData.icon = <FaInstagram size={20} />;
                    } else if (contact.icon === "github") {
                        newData.icon = <FaGithub size={20} />;
                    } else if (contact.icon === "linkedin") {
                        newData.icon = <FaLinkedin size={20} />;
                    } else if (contact.icon === "facebook") {
                        newData.icon = <FaFacebook size={20} />;
                    } else if (contact.icon === "hashnode") {
                        newData.icon = <FaHashnode size={20} />;
                    } else if (contact.icon === "stackoverflow") {
                        newData.icon = <FaStackOverflow size={20} />;
                    } else if (contact.icon === "codepen") {
                        newData.icon = <FaCodepen size={20} />;
                    } else if (contact.icon === "hackerrank") {
                        newData.icon = <FaHackerrank size={20} />;
                    } else if (contact.icon === "youtube") {
                        newData.icon = <FaYoutube size={20} />;
                    } else if (contact.icon === "twitch") {
                        newData.icon = <FaTwitch size={20} />;
                    } else if (contact.icon === "devto") {
                        newData.icon = <BiLogoDevTo size={20} />;
                    } else if (contact.icon === "medium") {
                        newData.icon = <FaMediumM size={20} />;
                    } else if (contact.icon === "codesandbox") {
                        newData.icon = <SiCodesandbox size={20} />;
                    } else if (contact.icon === "threads") {
                        newData.icon = <FaThreads size={20} />;
                    } else if (contact.icon === "behance") {
                        newData.icon = <FaSquareBehance size={20} />;
                    } else if (contact.icon === "dribbble") {
                        newData.icon = <FaDribbble size={20} />;
                    } else if (contact.icon === "leetcode") {
                        newData.icon = <SiLeetcode size={20} />;
                    } else if (contact.icon === "codewars") {
                        newData.icon = <SiCodewars size={20} />;
                    } else if (contact.icon === "topcoder") {
                        newData.icon = <SiTopcoder size={20} />;
                    }
                    newSocials.push(newData as Contact);
                });
                setSocialData(socials.filter((s) => !newSocials.find((n) => n.label === s.label)));
                setData(newSocials);
            } catch (error: unknown) {
                console.log(error);
                setError("Failed to fetch data.");
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 100);
            }
        };
        fetchData().then(() => {});
    }, []);

    useEffect(() => {
        if (error !== "") {
            api['error']({
                message: error
            });
        }
    }, [error, api]);

    const onDropdownClick: MenuProps['onClick'] = ({ key }) => {
        const selected = socials.find((s) => s.label === key);
        if (selected) {
            setFormData({
                handle: '',
                href: '',
                icon: selected.label.toLowerCase().replace(/ /g, '').replace(/[^a-zA-Z0-9]/g, ''),
                label: selected.label,
            });
            setModalVisible("add");
            setModalTitle(
                <div className="flex items-center gap-2">
                    {selected.icon_title}
                    <span>{selected.label}</span>
                </div>
            )
        }
    };

    const successNotification = (title: string, description: string) => {
        api['success']({
            message: title,
            description: description
        });
    };

    const submitForm = async () => {
        setFormLoading(true);

        try {
            schema.parse(formData);

            if (modalVisible === "add") {
                const docRef = await addDoc(collection(db, "contacts"), formData);
                setData([
                    ...data,
                    {
                        ...formData,
                        id: docRef.id,
                        icon: socials.find((s) => s.label === formData.label)?.icon_title,
                    }
                ]);
                successNotification("Contact added", "The contact has been added successfully.");
                setSocialData(socialData.filter((s) => s.label !== formData.label));
            } else if (modalVisible === "edit") {
                const contactRef = collection(db, "contacts");
                const contactQuery = query(contactRef, where("label", "==", formData.label));
                const contactSnapshot = await getDocs(contactQuery);
                const contactDoc: Contact[] = contactSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                await updateDoc(doc(db, "contacts", contactDoc[0].id), formData);
                const updatedData = data.map((d) => d.id === contactDoc[0].id ?
                    {
                        ...formData,
                        id: contactDoc[0].id,
                        icon: socials.find((s) => s.label === formData.label)?.icon_title,
                    }
                    :
                    d
                );
                setData(updatedData);
                successNotification("Contact updated", "The contact has been updated successfully.");
            }

            resetForm();
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                const fieldErrors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
                });
                setErrors(fieldErrors);
            } else {
                setError("Failed to save data.");
            }
            setFormLoading(false);
        }
    }

    const resetForm = () => {
        setFormData({handle: '', href: '', icon: '', label: ''});
        setError('');
        setErrors({});
        setFormLoading(false);
        setModalVisible("");
    }

    const deleteContact = async (id: string) => {
        setFormLoading(true);

        try {
            await deleteDoc(doc(db, "contacts", id));
            setData(data.filter((d) => d.id !== id));
            setSocialData([...socialData, socials.find((s) => s.label === data.find((d) => d.id === id)?.label) as SocialOption]);
            successNotification("Contact deleted", "The contact has been deleted successfully.");
        } catch (error: unknown) {
            console.log(error);
            setError("Failed to delete contact.");
        } finally {
            setFormLoading(false);
        }
    }

    return (
        <>
            {contextHolder}

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
                        <Dropdown
                            trigger={["click"]}
                            menu={{
                                items: socialData.map((s) => ({
                                    key: s.label,
                                    icon: s.icon,
                                    label: s.label
                                })),
                                onClick: onDropdownClick
                            }}
                            placement="bottom"
                            arrow={{ pointAtCenter: true }}
                        >
                            <Button size="large" icon={<FaPlus size={12} />}>
                                Contact
                            </Button>
                        </Dropdown>
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

                                    <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition duration-300">
                                        <Button
                                            size="small"
                                        >
                                            <Link href={s.href || ''} target="_blank" rel="noopener noreferrer">
                                                <FaArrowUpRightFromSquare size={12}/>
                                            </Link>
                                        </Button>
                                        <Button
                                            size="small"
                                            icon={<FaPen size={12}/>}
                                            onClick={() => {
                                                setFormData({
                                                    handle: s.handle || '',
                                                    href: s.href || '',
                                                    icon: s.label && s.label.toLowerCase().replace(/ /g, '').replace(/[^a-zA-Z0-9]/g, '') || '',
                                                    label: s.label || '',
                                                });
                                                setModalVisible("edit");
                                                setModalTitle(
                                                    <div className="flex items-center gap-2">
                                                        {s.icon}
                                                        <span>{s.label}</span>
                                                    </div>
                                                )
                                            }}
                                        />
                                        <Popconfirm
                                            title="Are you sure you want to delete this contact?"
                                            onConfirm={() => {
                                                deleteContact(s.id).then(() => {})
                                            }}
                                            okText="Yes"
                                            cancelText="No"
                                            okButtonProps={{ loading: formLoading }}
                                        >
                                            <Button
                                                size="small"
                                                icon={<FaRegTrashCan size={12}/>}
                                            />
                                        </Popconfirm>
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

            <Modal
                title={modalTitle}
                centered
                open={modalVisible !== ""}
                onOk={submitForm}
                okText="Save"
                confirmLoading={formLoading}
                onCancel={resetForm}
            >
                <div className="flex flex-col space-y-4 mt-2.5">
                    <div>
                        <label htmlFor="handle" className="block text-xs leading-8 text-zinc-400 group-hover:text-zinc-300 uppercase">
                            Title
                        </label>

                        <input
                            className={`bg-transparent mt-1 block w-full appearance-none rounded-md border text-sm px-3 py-2 placeholder-zinc-400 text-white shadow-sm focus:border-white focus:outline-none focus:ring-white sm:text-sm duration-150 ${!errors.email ? 'border-zinc-600 hover:border-zinc-400/50' : 'border-red-500'}`}
                            id="handle"
                            type="text"
                            name="handle"
                            placeholder="Title"
                            value={formData.handle}
                            onChange={(e) => {
                                setError('');
                                setErrors({
                                    ...errors,
                                    handle: '',
                                });
                                setFormData({...formData, handle: e.target.value});
                            }}
                        />

                        {errors.handle !== '' && <p className="text-red-500 text-xs mt-1">{errors.handle}</p>}
                    </div>

                    <div>
                        <label htmlFor="href" className="block text-xs leading-8 text-zinc-400 group-hover:text-zinc-300 uppercase">
                            URL
                        </label>

                        <input
                            className={`bg-transparent mt-1 block w-full appearance-none rounded-md border text-sm px-3 py-2 placeholder-zinc-400 text-white shadow-sm focus:border-white focus:outline-none focus:ring-white sm:text-sm duration-150 ${!errors.email ? 'border-zinc-600 hover:border-zinc-400/50' : 'border-red-500'}`}
                            id="href"
                            type="url"
                            name="href"
                            placeholder="https://example.com"
                            value={formData.href}
                            onChange={(e) => {
                                setError('');
                                setErrors({
                                    ...errors,
                                    href: '',
                                });
                                setFormData({...formData, href: e.target.value});
                            }}
                        />

                        {errors.href !== '' && <p className="text-red-500 text-xs mt-1">{errors.href}</p>}
                    </div>
                </div>
            </Modal>
        </>
    )
}
