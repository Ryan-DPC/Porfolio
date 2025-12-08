// Auth types
export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    twoFactorEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface LoginCredentials {
    email: string;
    password: string;
    twoFactorCode?: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

// Project types
export interface Project {
    id: string;
    title_fr: string;
    title_en: string;
    description_fr: string;
    description_en: string;
    imageUrl?: string | null;
    technologies: string[];
    githubUrl?: string | null;
    liveUrl?: string | null;
    startDate: Date;
    endDate?: Date | null;
    featured: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateProjectInput {
    title_fr: string;
    title_en: string;
    description_fr: string;
    description_en: string;
    imageUrl?: string | null;
    technologies: string[];
    githubUrl?: string | null;
    liveUrl?: string | null;
    startDate: Date | string;
    endDate?: Date | string | null;
    featured?: boolean;
    order?: number;
}

// Skill types
export interface Skill {
    id: string;
    name: string;
    category: string;
    level: number;
    iconUrl?: string | null;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateSkillInput {
    name: string;
    category: string;
    level: number;
    iconUrl?: string | null;
    order?: number;
}

// Blog types
export interface BlogPost {
    id: string;
    slug: string;
    title_fr: string;
    title_en: string;
    content_fr: string;
    content_en: string;
    excerpt_fr?: string | null;
    excerpt_en?: string | null;
    coverImage?: string | null;
    published: boolean;
    publishedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateBlogPostInput {
    slug: string;
    title_fr: string;
    title_en: string;
    content_fr: string;
    content_en: string;
    excerpt_fr?: string | null;
    excerpt_en?: string | null;
    coverImage?: string | null;
    published?: boolean;
    publishedAt?: Date | string | null;
}

// File types
export interface File {
    id: string;
    name: string;
    originalName: string;
    path: string;
    size: number;
    mimeType: string;
    folderId?: string | null;
    isPublic: boolean;
    downloadUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Folder {
    id: string;
    name: string;
    parentId?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface FileWithFolder extends File {
    folder?: Folder | null;
}

export interface FolderWithChildren extends Folder {
    children?: Folder[];
    files?: File[];
}

// Contact types
export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
