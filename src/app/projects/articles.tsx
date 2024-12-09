"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/card";
import { db } from "@/lib/firebase";
import { Category } from "@/models/category";
import { Project } from "@/models/project";
import { Article } from "@/app/projects/article";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { FaEye } from "react-icons/fa6";

const SkeletonCard = () => (
    <>
        <div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2">
            <Card>
                <span>
                    <article className="relative w-full h-full p-4 md:p-8">
                        <div className="flex items-center justify-between gap-2">
                            <span className="h-4 w-20 bg-zinc-700 rounded-md animate-pulse" />
                            <span className="h-4 w-10 bg-zinc-700 rounded-md animate-pulse" />
                        </div>

                        <h2 className="mt-4 h-10 w-full bg-zinc-700 rounded-md animate-pulse"></h2>
                        <p className="mt-4 lg:mb-8 h-9 w-full bg-zinc-700 rounded-md animate-pulse"></p>
                        <p className="hidden lg:block absolute bottom-4 md:bottom-8 h-6 w-1/2 bg-zinc-700 rounded-md animate-pulse"></p>
                    </article>
                </span>
            </Card>

            <div className="flex flex-col w-full gap-8 mx-auto border-t border-gray-900/10 lg:mx-0 lg:border-t-0">
                {Array(2).fill(0).map((_, index) => (
                    <Card key={index}>
                        <div>
                            <article className="p-4 md:p-8">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="h-4 w-20 bg-zinc-700 rounded-md animate-pulse"/>
                                    <span className="h-4 w-10 bg-zinc-700 rounded-md animate-pulse"/>
                                </div>

                                <h2 className="mt-4 h-10 w-full bg-zinc-700 rounded-md animate-pulse"></h2>
                                <p className="mt-4 lg:mb-8 h-9 w-full bg-zinc-700 rounded-md animate-pulse"></p>
                            </article>
                        </div>
                    </Card>
                ))}
            </div>
        </div>

        <div className="hidden w-full h-px md:block bg-zinc-800"/>

        <div className="max-w-2xl mx-auto lg:mx-0">
            <h3 className="h-9 w-full bg-zinc-700 rounded-md animate-pulse"/>
            <p className="mt-4 h-6 w-full bg-zinc-700 rounded-md animate-pulse"/>
        </div>

        <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
            <div className="grid grid-cols-1 gap-4">
                {Array(16).fill(0).map((_, index) => index % 3 === 0 && (
                    <Card key={index}>
                        <div>
                            <article className="p-4 md:p-8">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="h-4 w-20 bg-zinc-700 rounded-md animate-pulse"/>
                                    <span className="h-4 w-10 bg-zinc-700 rounded-md animate-pulse"/>
                                </div>

                                <h2 className="mt-4 h-10 w-full bg-zinc-700 rounded-md animate-pulse"></h2>
                                <p className="mt-4 lg:mb-8 h-9 w-full bg-zinc-700 rounded-md animate-pulse"></p>
                            </article>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4">
                {Array(16).fill(0).map((_, index) => index % 3 === 1 && (
                    <Card key={index}>
                        <div>
                            <article className="p-4 md:p-8">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="h-4 w-20 bg-zinc-700 rounded-md animate-pulse"/>
                                    <span className="h-4 w-10 bg-zinc-700 rounded-md animate-pulse"/>
                                </div>

                                <h2 className="mt-4 h-10 w-full bg-zinc-700 rounded-md animate-pulse"></h2>
                                <p className="mt-4 lg:mb-8 h-9 w-full bg-zinc-700 rounded-md animate-pulse"></p>
                            </article>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4">
                {Array(16).fill(0).map((_, index) => index % 3 === 2 && (
                    <Card key={index}>
                        <div>
                            <article className="p-4 md:p-8">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="h-4 w-20 bg-zinc-700 rounded-md animate-pulse"/>
                                    <span className="h-4 w-10 bg-zinc-700 rounded-md animate-pulse"/>
                                </div>

                                <h2 className="mt-4 h-10 w-full bg-zinc-700 rounded-md animate-pulse"></h2>
                                <p className="mt-4 lg:mb-8 h-9 w-full bg-zinc-700 rounded-md animate-pulse"></p>
                            </article>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    </>
);

export default function Articles() {
    const [data, setData] = useState<Project[]>([]);
    const [sorted, setSorted] = useState<Project[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const categoriesRef = collection(db, "categories");
                const categoriesSnapshot = await getDocs(categoriesRef);
                const categoriesData = categoriesSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setCategories(categoriesData as Category[]);

                const projectsRef = collection(db, "projects");
                const sortedQuery = query(projectsRef, where("metadata.status", "==", true), orderBy("metadata.views", "desc"));
                const sortedSnapshot = await getDocs(sortedQuery);
                const projects = sortedSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setData(projects as Project[]);
                setSorted(projects.slice(3) as Project[]);
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
        !loading ? (
            <>
                <div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2">
                    <Card>
                        <Link href={`/projects/${data[0]?.slug}`}>
                            <article className="relative w-full h-full p-4 md:p-8">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="text-xs text-zinc-100">
                                        {data[0]?.metadata && data[0]?.metadata.date.seconds ? (
                                            <time dateTime={new Date(data[0]?.metadata.date.seconds * 1000).toISOString()}>
                                                {Intl.DateTimeFormat(undefined, {
                                                    dateStyle: "medium",
                                                }).format(new Date(data[0]?.metadata.date.seconds * 1000))}
                                            </time>
                                        ) : (
                                            <span>SOON</span>
                                        )}
                                    </div>
                                    <span className="flex items-center gap-1 text-xs text-zinc-500">
                                        <FaEye className="w-4 h-4"/>{" "}
                                        {Intl.NumberFormat("en-US", {notation: "compact"}).format(data[0]?.metadata && data[0]?.metadata.views || 0)}
                                    </span>
                                </div>

                                <h2 id="featured-post" className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display">
                                    {data[0]?.title}
                                </h2>
                                <p className="mt-4 lg:mb-8 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300">
                                    {data[0]?.description}
                                </p>
                                <div className="absolute bottom-4 md:bottom-8">
                                    <p className="hidden text-zinc-200 hover:text-zinc-50 lg:block">
                                        Read more <span aria-hidden="true">&rarr;</span>
                                    </p>
                                </div>
                            </article>
                        </Link>
                    </Card>

                    {data[1] && data[2] && (
                        <div className="flex flex-col w-full gap-8 mx-auto border-t border-gray-900/10 lg:mx-0 lg:border-t-0">
                            {[data[1], data[2]].map((project) => (
                                <Card key={project.slug}>
                                    <Article project={project} />
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                <div className="hidden w-full h-px md:block bg-zinc-800"/>

                <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
                    {categories.map((category, index) => sorted.filter((projects) => projects.category === category.id).length > 0 && (
                        <div key={index}>
                            <div className="max-w-2xl mx-auto lg:mx-0">
                                <h3 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
                                    {category.title}
                                </h3>
                                <p className="mt-4 text-zinc-400">
                                    {category.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {sorted.filter((projects) => projects.category === category.id).map((project: Project) => (
                                    <Card key={project.slug}>
                                        <Article project={project}/>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/*<div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">*/}
                    {/*    <div className="grid grid-cols-1 gap-4">*/}
                    {/*        {sorted.filter((_, i) => i % 3 === 0).map((project) => (*/}
                    {/*            <Card key={project.slug}>*/}
                    {/*                <Article project={project} views={views[project.slug] ?? 0} />*/}
                    {/*            </Card>*/}
                    {/*        ))}*/}
                    {/*    </div>*/}
                    {/*    <div className="grid grid-cols-1 gap-4">*/}
                    {/*        {sorted.filter((_, i) => i % 3 === 1).map((project) => (*/}
                    {/*            <Card key={project.slug}>*/}
                    {/*                <Article project={project} views={views[project.slug] ?? 0} />*/}
                    {/*            </Card>*/}
                    {/*        ))}*/}
                    {/*    </div>*/}
                    {/*    <div className="grid grid-cols-1 gap-4">*/}
                    {/*        {sorted.filter((_, i) => i % 3 === 2).map((project) => (*/}
                    {/*            <Card key={project.slug}>*/}
                    {/*                <Article project={project} views={views[project.slug] ?? 0} />*/}
                    {/*            </Card>*/}
                    {/*        ))}*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            </>
        ) : (
            <SkeletonCard />
        )
    )
}
