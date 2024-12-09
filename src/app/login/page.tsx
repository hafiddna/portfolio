import type { Metadata } from "next";
import { Card  } from "@/components/card";
import LoginPage from "@/app/login/login";

export const metadata: Metadata = {
    title: "Login",
};

export default function Login() {
    return (
        <div className="flex w-screen h-screen justify-center items-center bg-gradient-to-tl from-zinc-900 via-zinc-400/10 to-zinc-900">
            <Card>
                <div className="flex flex-col z-10 w-full max-w-md overflow-hidden rounded-2xl">
                    <div className="flex flex-col items-center justify-center space-y-3 border-b border-zinc-800 px-4 py-6 pt-8 text-center sm:px-16">
                        <h3 className="text-xl font-semibold text-zinc-100 group-hover:text-white font-display">Login</h3>
                        <p className="text-sm leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300">Use your email and password to login</p>
                    </div>
                    <LoginPage />
                </div>
            </Card>
        </div>
    );
}
