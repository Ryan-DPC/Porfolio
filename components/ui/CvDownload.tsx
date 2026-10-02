'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';

interface CvDownloadProps {
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function CvDownload({
    variant = 'outline',
    size = 'md',
    className,
}: CvDownloadProps) {
    const t = useTranslations('cv');
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/media/cv')
            .then((res) => res.json())
            .then((data) => {
                if (data?.url) setUrl(data.url);
            })
            .catch(() => undefined);
    }, []);

    if (!url) return null;

    return (
        <a href={url} target="_blank" rel="noopener noreferrer" download>
            <Button variant={variant} size={size} className={className}>
                {t('download')}
            </Button>
        </a>
    );
}
