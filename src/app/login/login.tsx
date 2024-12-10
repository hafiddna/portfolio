"use client";
import React, { useState, useEffect } from "react";
import { redirect } from 'next/navigation'
import Loader from "@/components/loader";
import { auth } from "@/lib/firebase";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { AutoComplete, ConfigProvider, theme } from 'antd';
import type { AutoCompleteProps } from 'antd';
import { useSignInWithEmailAndPassword, useAuthState } from "react-firebase-hooks/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { z } from "zod";

const schema = z.object({
    email: z.string().email("Email field must be a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
})

type RegisterFormData = z.infer<typeof schema>;

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [options, setOptions] = React.useState<AutoCompleteProps['options']>([]);

    const [formData, setFormData] = useState<RegisterFormData>({email: 'example@example.com', password: 'password'});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
    const [user, userLoading] = useAuthState(auth);

    const handleSearch = (value: string) => {
        setOptions(() => {
            if (!value || value.includes('@')) {
                return [];
            }
            return ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'aol.com', 'qq.com'].map((domain) => ({
                label: `${value}@${domain}`,
                value: `${value}@${domain}`,
            }));
        });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            schema.parse(formData);

            await signInWithEmailAndPassword(formData.email, formData.password);
            setTimeout(() => {
                setLoading(false);
                redirect("/cms");
            }, 1000);
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                const fieldErrors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
                });
                setErrors(fieldErrors);
            } else {
                setError("The email or password is incorrect.");
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!userLoading) {
            if (user) {
                redirect("/cms");
            }
        }
    }, [user, userLoading]);

    return (
        <AntdRegistry>
            <ConfigProvider
                theme={{
                    algorithm: theme.darkAlgorithm
                }}
            >
                <form onSubmit={handleLogin} className="flex flex-col space-y-4 px-4 py-8 sm:px-16">
                    {error && <p className="text-red-500 text-xs text-center">{error}</p>}

                    <div>
                        <label className="block text-xs leading-8 text-zinc-400 group-hover:text-zinc-300 uppercase">
                            Email Address

                            <AutoComplete
                                style={{width: '100%'}}
                                onSearch={handleSearch}
                                options={options}
                                onChange={(e) => {
                                    setError('');
                                    setErrors({
                                        ...errors,
                                        email: '',
                                    });
                                    setFormData({...formData, email: e});
                                }}
                                value={formData.email}
                            >
                                <input
                                    autoComplete="email"
                                    className={`bg-transparent mt-1 block w-full appearance-none rounded-md border text-sm px-3 py-2 placeholder-zinc-400 text-white shadow-sm focus:border-white focus:outline-none focus:ring-white sm:text-sm duration-150 ${!errors.email ? 'border-zinc-600 hover:border-zinc-400/50' : 'border-red-500'}`}
                                    type="email"
                                    name="email"
                                    placeholder="example@example.com"
                                />
                            </AutoComplete>
                        </label>

                        {errors.email !== '' && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-xs leading-8 text-zinc-400 group-hover:text-zinc-300 uppercase">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                autoComplete="current-password"
                                aria-autocomplete="list"
                                className={`bg-transparent mt-1 block w-full appearance-none rounded-md border text-sm px-3 py-2 placeholder-zinc-400 text-white shadow-sm focus:border-white focus:outline-none focus:ring-white sm:text-sm duration-150 ${!errors.password ? 'border-zinc-600 hover:border-zinc-400/50' : 'border-red-500'}`}
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="password"
                                value={formData.password}
                                onChange={(e) => {
                                    setError('');
                                    setErrors({
                                        ...errors,
                                        password: '',
                                    });
                                    setFormData({...formData, password: e.target.value});
                                }}
                            />

                            <button
                                type="button"
                                className="absolute top-1/2 right-3 transform -translate-y-1/2"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash className="text-zinc-400 hover:text-zinc-300 duration-200" /> : <FaEye className="text-zinc-400 hover:text-zinc-300 duration-200" />}
                            </button>
                        </div>
                        {errors.password !== '' && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    <button
                        className="flex h-10 w-full items-center justify-center rounded-md leading-8 text-zinc-400 hover:text-zinc-300 border border-zinc-600 hover:border-zinc-400/50 text-sm transition-all focus:outline-none"
                        type="submit"
                    >
                        {loading ? (
                            <Loader />
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>
            </ConfigProvider>
        </AntdRegistry>
    )
}
