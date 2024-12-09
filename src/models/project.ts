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
        source: Source[];
    };
}

export interface Source {
    label: string;
    url: string;
}
