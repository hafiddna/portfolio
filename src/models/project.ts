export interface Project {
    id: string;
    category?: string;
    title?: string;
    slug?: string;
    description?: string;
    content?: string;
    metadata?: {
        date: {
            nanoseconds: number;
            seconds: number;
        };
        status: string;
        tags: string[];
        views: number;
        source: source[];
    };
}

interface source {
    label: string;
    url: string;
}
