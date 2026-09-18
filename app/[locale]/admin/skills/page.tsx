'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AdminNav } from '@/components/layout/AdminNav';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import type { Skill } from '@/types';

const emptyForm = {
    name: '',
    category: 'Frontend',
    level: 50,
    iconUrl: '',
    order: 0,
};

export default function AdminSkillsPage() {
    const t = useTranslations('admin.skills');
    const tc = useTranslations('common');
    const [skills, setSkills] = useState<Skill[]>([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const load = () => {
        fetch('/api/skills')
            .then((res) => res.json())
            .then((data) => {
                setSkills(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        load();
    }, []);

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const handleEdit = (skill: Skill) => {
        setEditingId(skill.id);
        setForm({
            name: skill.name,
            category: skill.category,
            level: skill.level,
            iconUrl: skill.iconUrl || '',
            order: skill.order,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const payload = {
            name: form.name,
            category: form.category,
            level: Number(form.level),
            iconUrl: form.iconUrl || null,
            order: Number(form.order) || 0,
        };

        const res = await fetch(editingId ? `/api/skills/${editingId}` : '/api/skills', {
            method: editingId ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        setSaving(false);
        if (res.ok) {
            resetForm();
            load();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(tc('confirmDelete'))) return;
        const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' });
        if (res.ok) load();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg dark:from-light-bg dark:via-light-surface dark:to-light-bg">
            <div className="container-custom section-padding">
                <AdminNav />
                <h1 className="text-3xl font-bold gradient-text mb-8">{t('title')}</h1>

                <Card className="mb-8">
                    <h2 className="text-xl font-bold mb-4">
                        {editingId ? t('edit') : t('new')}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label={t('name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                            <Input label={t('category')} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
                            <Input type="number" min={1} max={100} label={t('level')} value={form.level} onChange={(e) => setForm({ ...form, level: Number(e.target.value) })} required />
                            <Input type="number" label={t('order')} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
                        </div>
                        <div className="flex gap-3">
                            <Button type="submit" disabled={saving}>
                                {saving ? tc('loading') : tc('save')}
                            </Button>
                            {editingId && (
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    {tc('cancel')}
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>

                {loading ? (
                    <div className="skeleton h-40" />
                ) : skills.length === 0 ? (
                    <p className="text-text-dark-secondary dark:text-text-secondary">{t('empty')}</p>
                ) : (
                    <div className="space-y-3">
                        {skills.map((skill) => (
                            <Card key={skill.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <div className="font-bold">{skill.name}</div>
                                    <div className="text-sm text-text-dark-secondary dark:text-text-secondary">
                                        {skill.category} · {skill.level}%
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleEdit(skill)}>
                                        {tc('edit')}
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(skill.id)}>
                                        {tc('delete')}
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
