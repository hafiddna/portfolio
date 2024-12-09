import React from "react";

export default function CMSDetailProjects({
    params
}
: {
    params: { id: string }
}
) {
    const { id } = params;

    console.log("id", id)

    return (
        <>
            <div className="sm:border-b sm:border-zinc-800 sm:h-[150px] lg:h-[100px]">
                <div
                    className="max-w-7xl mx-auto flex flex-col gap-4 lg:gap-10 px-6 lg:px-8 lg:flex-row lg:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
                            Title
                        </h2>
                        <p className="mt-4 text-sm text-zinc-400">
                            Description
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                    </div>
                </div>
            </div>
        </>
    )
}
