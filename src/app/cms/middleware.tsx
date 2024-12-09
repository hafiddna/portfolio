"use client";
import { redirect } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function CMSMiddleware() {
    const [user, loading] = useAuthState(auth);

    if (!loading) {
        if (!user) {
            redirect("/");
        }
    }

    return null;
}
