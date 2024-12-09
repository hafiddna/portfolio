"use client";
import { GetServerSideProps } from "next";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, updateDoc, doc, addDoc } from "firebase/firestore";
import {PageStatistic} from "@/models/page-statistic";

type DeviceType = "Desktop" | "Mobile" | "Tablet" | "Unknown";

interface OSBrowserInfo {
    page: string;
    os?: string;
    browser?: string;
    device?: DeviceType;
}

export const getServerSideProps: GetServerSideProps<OSBrowserInfo> = async (context) => {
    const userAgent = context.req.headers["user-agent"] || "";

    let initialDeviceType: OSBrowserInfo["device"] = "Unknown";
    let os = "Unknown OS";
    let browser = "Unknown Browser";

    if (/mobile/i.test(userAgent)) {
        initialDeviceType = "Mobile";
    } else if (/tablet|ipad/i.test(userAgent)) {
        initialDeviceType = "Tablet";
    } else if (/desktop|macintosh|windows|linux/i.test(userAgent)) {
        initialDeviceType = "Desktop";
    }

    if (/windows/i.test(userAgent)) {
        os = "Windows";
    } else if (/macintosh/i.test(userAgent)) {
        os = "macOS";
    } else if (/linux/i.test(userAgent)) {
        os = "GNU/Linux";
    } else if (/android/i.test(userAgent)) {
        os = "Android";
    } else if (/iphone|ipad/i.test(userAgent)) {
        os = "iOS";
    }

    if (/chrome/i.test(userAgent)) {
        browser = "Chrome";
    } else if (/firefox/i.test(userAgent)) {
        browser = "Firefox";
    } else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
        browser = "Safari";
    } else if (/edg/i.test(userAgent)) {
        browser = "Edge";
    } else if (/msie|trident/i.test(userAgent)) {
        browser = "Internet Explorer";
    }

    return {
        props: {
            page: context.params?.page as string,
            os,
            browser,
            device: initialDeviceType,
        },
    };
};

export default function Analytic({
    page,
    os,
    browser,
    device,
}: OSBrowserInfo) {
    const pageStatisticRef = collection(db, "page_statistics");
    const pageStatisticQuery = query(pageStatisticRef, where("name", "==", page));

    function detectOS(): string {
        const platform = navigator.platform.toLowerCase();

        if (platform.includes("win")) return "Windows";
        if (platform.includes("mac")) return "macOS";
        if (platform.includes("linux")) return "GNU/Linux";
        if (/android/i.test(navigator.userAgent)) return "Android";
        if (/iphone|ipad|ipod/i.test(navigator.userAgent)) return "iOS";

        return "Unknown OS";
    }

    function detectBrowser(): string {
        const userAgent = navigator.userAgent;

        if (/chrome/i.test(userAgent)) return "Chrome";
        if (/firefox/i.test(userAgent)) return "Firefox";
        if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return "Safari";
        if (/edg/i.test(userAgent)) return "Edge";
        if (/msie|trident/i.test(userAgent)) return "Internet Explorer";

        return "Unknown Browser";
    }

    function getDeviceType(): DeviceType {
        const userAgent = navigator.userAgent.toLowerCase();
        const width = window.innerWidth;

        if (/mobile/i.test(userAgent)) return "Mobile";
        if (/tablet|ipad/i.test(userAgent)) return "Tablet";
        if (width >= 1024) return "Desktop";

        return "Unknown";
    }

    getDocs(pageStatisticQuery).then((snapshot) =>{
        const pageStatistics: PageStatistic[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        fetch(`https://api.ipdata.co?api-key=${process.env.NEXT_PUBLIC_IPDATA_API_KEY}`).then((data) => {
            data.json().then((res) => {
                const newVisitor = {
                    ...res,
                    device: device == "Unknown" || !device ? getDeviceType() : device,
                    browser: browser == "Unknown Browser" || !browser ? detectBrowser() : browser,
                    operating_system: os == "Unknown OS" || !os ? detectOS() : os,
                    date: {
                        seconds: Math.floor(Date.now() / 1000),
                        nanoseconds: Math.floor(Date.now() * 1_000_000 + (performance.now() % 1) * 1_000_000)
                    }
                }

                if (!pageStatistics[0]) {
                    addDoc(pageStatisticRef, {
                        name: page,
                        views: 1,
                        visitor: [
                            newVisitor
                        ]
                    }).then(() => {});
                } else {
                    const visitorUpdate = pageStatistics[0].visitor;
                    if (visitorUpdate) {
                        visitorUpdate.push(newVisitor);
                    }
                    const projectRef = doc(db, "page_statistics", pageStatistics[0].id);
                    updateDoc(projectRef, {
                        "views": pageStatistics[0].views ? pageStatistics[0].views + 1 : 1,
                        "visitor": visitorUpdate
                    }).then(() => {});
                }
            });
        });
    });

    return null;
}
