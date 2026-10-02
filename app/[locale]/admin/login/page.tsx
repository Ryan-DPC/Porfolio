'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function AdminLoginPage() {
    const t = useTranslations('admin.login');
    const router = useRouter();
    const pathname = usePathname();
    const locale = pathname?.split('/')[1] || 'fr';
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        twoFactorCode: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    twoFactorCode: formData.twoFactorCode || undefined,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || t('error'));
            }

            router.push(`/${locale}/admin/dashboard`);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : t('error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg dark:from-light-bg dark:via-light-surface dark:to-light-bg">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="glass-effect rounded-lg p-8">
                    <h1 className="text-3xl font-bold text-center mb-8">
                        {t('title')}
                    </h1>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-md text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="email"
                            label={t('email')}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            autoComplete="email"
                        />

                        <Input
                            type="password"
                            label={t('password')}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            autoComplete="current-password"
                        />

                        <Input
                            type="text"
                            label={t('twoFactorCode')}
                            value={formData.twoFactorCode}
                            onChange={(e) => setFormData({ ...formData, twoFactorCode: e.target.value })}
                            placeholder="000000"
                            maxLength={6}
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? '...' : t('submit')}
                        </Button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
