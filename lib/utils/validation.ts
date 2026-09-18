import { z } from 'zod';

const optionalUrl = z.preprocess(
    (val) => (val === '' || val === undefined ? null : val),
    z.string().url().nullable().optional()
);

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    twoFactorCode: z.string().length(6).optional().or(z.literal('')),
});

export const projectSchema = z.object({
    title_fr: z.string().min(1, 'French title is required'),
    title_en: z.string().min(1, 'English title is required'),
    description_fr: z.string().min(1, 'French description is required'),
    description_en: z.string().min(1, 'English description is required'),
    imageUrl: optionalUrl,
    technologies: z.array(z.string()).min(1, 'At least one technology is required'),
    githubUrl: optionalUrl,
    liveUrl: optionalUrl,
    startDate: z.string().or(z.date()),
    endDate: z.preprocess(
        (val) => (val === '' || val === undefined ? null : val),
        z.string().or(z.date()).nullable().optional()
    ),
    featured: z.boolean().default(false),
    order: z.number().int().min(0).default(0),
});

export const skillSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    category: z.string().min(1, 'Category is required'),
    level: z.number().int().min(1).max(100),
    iconUrl: optionalUrl,
    order: z.number().int().min(0).default(0),
});

export const blogPostSchema = z.object({
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
    title_fr: z.string().min(1, 'French title is required'),
    title_en: z.string().min(1, 'English title is required'),
    content_fr: z.string().min(1, 'French content is required'),
    content_en: z.string().min(1, 'English content is required'),
    excerpt_fr: z.string().optional().nullable(),
    excerpt_en: z.string().optional().nullable(),
    coverImage: optionalUrl,
    published: z.boolean().default(false),
    publishedAt: z.preprocess(
        (val) => (val === '' || val === undefined ? null : val),
        z.string().or(z.date()).nullable().optional()
    ),
});

export const contactSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(1, 'Subject is required'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const folderSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    parentId: z.string().optional().nullable(),
});

export const fileUploadSchema = z.object({
    folderId: z.string().optional().nullable(),
});
