'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AdminNav } from '@/components/layout/AdminNav';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { formatFileSize } from '@/lib/utils/file-formatting';
import type { File as PortfolioFile, Folder } from '@/types';

export default function AdminFilesPage() {
    const t = useTranslations('admin.files');
    const tc = useTranslations('common');
    const [files, setFiles] = useState<PortfolioFile[]>([]);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [folderId, setFolderId] = useState<string | null>(null);
    const [folderStack, setFolderStack] = useState<{ id: string | null; name: string }[]>([
        { id: null, name: 'Root' },
    ]);
    const [newFolderName, setNewFolderName] = useState('');
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const load = (currentFolderId: string | null = folderId) => {
        setLoading(true);
        const params = new URLSearchParams({ all: 'true' });
        if (currentFolderId) params.set('folderId', currentFolderId);

        fetch(`/api/files?${params}`)
            .then((res) => res.json())
            .then((data) => {
                setFiles(data.files || []);
                setFolders(data.folders || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        load(folderId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [folderId]);

    const openFolder = (folder: Folder) => {
        setFolderStack((prev) => [...prev, { id: folder.id, name: folder.name }]);
        setFolderId(folder.id);
    };

    const goToBreadcrumb = (index: number) => {
        const next = folderStack.slice(0, index + 1);
        setFolderStack(next);
        setFolderId(next[next.length - 1].id);
    };

    const createFolder = async () => {
        if (!newFolderName.trim()) return;
        const res = await fetch('/api/folders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newFolderName.trim(), parentId: folderId }),
        });
        if (res.ok) {
            setNewFolderName('');
            load();
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files;
        if (!selected || selected.length === 0) return;

        setUploading(true);
        const formData = new FormData();
        Array.from(selected).forEach((file) => formData.append('files', file));
        if (folderId) formData.append('folderId', folderId);

        const res = await fetch('/api/files/upload', {
            method: 'POST',
            body: formData,
        });

        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (res.ok) load();
    };

    const deleteFile = async (id: string) => {
        if (!confirm(tc('confirmDelete'))) return;
        const res = await fetch(`/api/files?id=${id}`, { method: 'DELETE' });
        if (res.ok) load();
    };

    const deleteFolder = async (id: string) => {
        if (!confirm(tc('confirmDelete'))) return;
        const res = await fetch(`/api/folders/${id}`, { method: 'DELETE' });
        if (res.ok) load();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg dark:from-light-bg dark:via-light-surface dark:to-light-bg">
            <div className="container-custom section-padding">
                <AdminNav />
                <h1 className="text-3xl font-bold gradient-text mb-2">{t('title')}</h1>
                <p className="text-sm text-text-dark-secondary dark:text-text-secondary mb-6">
                    {t('maxSize')}
                </p>

                <div className="flex flex-wrap gap-2 mb-6 text-sm">
                    {folderStack.map((crumb, index) => (
                        <button
                            key={`${crumb.id}-${index}`}
                            type="button"
                            onClick={() => goToBreadcrumb(index)}
                            className="text-electric-blue hover:underline"
                        >
                            {crumb.name}
                            {index < folderStack.length - 1 ? ' /' : ''}
                        </button>
                    ))}
                </div>

                <Card className="mb-8 space-y-4">
                    <div className="flex flex-col md:flex-row gap-3">
                        <Input
                            label={t('folderName')}
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                        />
                        <div className="flex items-end">
                            <Button type="button" variant="outline" onClick={createFolder}>
                                {t('newFolder')}
                            </Button>
                        </div>
                    </div>
                    <div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleUpload}
                        />
                        <Button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                        >
                            {uploading ? tc('loading') : t('upload')}
                        </Button>
                    </div>
                </Card>

                {loading ? (
                    <div className="skeleton h-40" />
                ) : (
                    <div className="space-y-3">
                        {folders.map((folder) => (
                            <Card key={folder.id} className="flex items-center justify-between gap-4">
                                <button
                                    type="button"
                                    className="text-left font-medium hover:text-electric-blue"
                                    onClick={() => openFolder(folder)}
                                >
                                    📁 {folder.name}
                                </button>
                                <Button variant="danger" size="sm" onClick={() => deleteFolder(folder.id)}>
                                    {tc('delete')}
                                </Button>
                            </Card>
                        ))}

                        {files.map((file) => (
                            <Card key={file.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <div className="font-medium">{file.originalName}</div>
                                    <div className="text-sm text-text-dark-secondary dark:text-text-secondary">
                                        {formatFileSize(file.size)} · {file.mimeType}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <a href={file.downloadUrl} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="sm">{tc('open')}</Button>
                                    </a>
                                    <Button variant="danger" size="sm" onClick={() => deleteFile(file.id)}>
                                        {tc('delete')}
                                    </Button>
                                </div>
                            </Card>
                        ))}

                        {folders.length === 0 && files.length === 0 && (
                            <p className="text-text-dark-secondary dark:text-text-secondary">
                                {t('empty')}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
