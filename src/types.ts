export interface Repository {
    id: number;
    user: string;
    repoName: string;
    url: string;
    stars: string | number;
    description: string;
    topics: string[];
    repoLink: string;
    commits?: number;
}