"use client";
import { motion, useMotionTemplate, useSpring } from "framer-motion";

import React, { PropsWithChildren, ReactNode } from "react";

export const Card: React.FC<PropsWithChildren> = ({ children, disableAnimation = false, borderless = false } : { children?: ReactNode; disableAnimation?: boolean; borderless?: boolean }) => {
    const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

    // TODO: Resolve any type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function onMouseMove({ currentTarget, clientX, clientY }: any) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }
    const maskImage = useMotionTemplate`radial-gradient(240px at ${mouseX}px ${mouseY}px, white, transparent)`;
    const style = { maskImage, WebkitMaskImage: maskImage };

    return (
        <div onMouseMove={onMouseMove} className={`overflow-hidden relative duration-700 ${!borderless ? 'border rounded-xl border-zinc-600' : ''} ${disableAnimation ? '' : 'hover:bg-zinc-800/10 group md:gap-8 hover:border-zinc-400/50'}`}>
            <div className="pointer-events-none">
                <div className="absolute inset-0 z-0  transition duration-1000 [mask-image:linear-gradient(black,transparent)]" />
                {disableAnimation ? null : (
                    <>
                        <motion.div
                            className="absolute inset-0 z-10  bg-gradient-to-br opacity-100  via-zinc-100/10  transition duration-1000 group-hover:opacity-50 "
                            style={style}
                        />
                        <motion.div
                            className="absolute inset-0 z-10 opacity-0 mix-blend-overlay transition duration-1000 group-hover:opacity-100"
                            style={style}
                        />
                    </>
                )}
            </div>

            {children}
        </div>
    );
};
