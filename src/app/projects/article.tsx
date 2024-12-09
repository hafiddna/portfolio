import React from "react";
import Link from "next/link";
import { Project } from "@/models/project";
import { FaEye } from "react-icons/fa6";

type Props = {
    project: Project;
};

export const Article: React.FC<Props> = ({ project }) => {
    return (
        <Link href={`/projects/${project.slug}`}>
            <article className="p-4 md:p-8">
                <div className="flex justify-between gap-2 items-center">
					<span className="text-xs duration-1000 text-zinc-200 group-hover:text-white group-hover:border-zinc-200 drop-shadow-orange">
						{project.metadata && project.metadata.date.seconds ? (
                            <time dateTime={new Date(project.metadata.date.seconds * 1000).toISOString()}>
                                {Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
                                    new Date(project.metadata.date.seconds * 1000),
                                )}
                            </time>
                        ) : (
                            <span>SOON</span>
                        )}
					</span>
                    <span className="text-zinc-500 text-xs  flex items-center gap-1">
						<FaEye className="w-4 h-4" />{" "}
                        {Intl.NumberFormat("en-US", { notation: "compact" }).format(project.metadata && project.metadata.views || 0)}
					</span>
                </div>
                <h2 className="z-20 text-xl font-medium duration-1000 lg:text-3xl text-zinc-200 group-hover:text-white font-display">
                    {project.title}
                </h2>
                <p className="z-20 mt-4 text-sm duration-1000 text-zinc-400 group-hover:text-zinc-200">
                    {project.description}
                </p>
            </article>
        </Link>
    );
};
