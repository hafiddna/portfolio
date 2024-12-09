import React from "react";

export default function CMSDetailBlog({
  params
}
: {
  params: { id: string }
}
) {
    const { id } = params;

    return (
        <>
            <div className="max-w-2xl mx-auto lg:mx-0">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
                    Title
                </h2>
                <p className="mt-4 text-zinc-400">
                    Description
                </p>
            </div>
        </>
    )
}
