import { MetadataRoute } from "next"
import { BASE_URL } from '@/lib/constants'
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const projectsRef = collection(db, "projects");
    const projectQuery = query(projectsRef, where("metadata.status", "==", true));
    const projectSnapshot = await getDocs(projectQuery);

    return projectSnapshot.docs.map((item) => ({
        url: `${BASE_URL}/projects/${item.data().slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily'
    }))
}
