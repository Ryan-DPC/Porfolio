'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import type { Skill } from '@/types';

export default function SkillsPage() {
    const t = useTranslations();
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/skills')
            .then((res) => res.json())
            .then((data) => {
                setSkills(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const grouped = useMemo(() => {
        return skills.reduce<Record<string, Skill[]>>((acc, skill) => {
            const key = skill.category.toLowerCase();
            if (!acc[key]) acc[key] = [];
            acc[key].push(skill);
            return acc;
        }, {});
    }, [skills]);

    const categoryLabel = (category: string) => {
        const key = category.toLowerCase();
        if (key === 'frontend' || key === 'backend' || key === 'tools' || key === 'other') {
            return t(`skills.categories.${key}`);
        }
        return category;
    };

    if (loading) {
        return (
            <div className="section-padding">
                <div className="container-custom">
                    <div className="skeleton h-12 w-64 mx-auto mb-8"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="skeleton h-24"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="section-padding">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                        {t('skills.title')}
                    </h1>
                </motion.div>

                {Object.keys(grouped).length === 0 ? (
                    <p className="text-center text-text-dark-secondary dark:text-text-secondary">
                        {t('skills.empty')}
                    </p>
                ) : (
                    <div className="space-y-10">
                        {Object.entries(grouped).map(([category, items], groupIndex) => (
                            <motion.section
                                key={category}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: groupIndex * 0.1 }}
                            >
                                <h2 className="text-2xl font-bold mb-4">
                                    {categoryLabel(category)}
                                </h2>
                                <div className="space-y-4">
                                    {items.map((skill) => (
                                        <div key={skill.id}>
                                            <div className="flex justify-between mb-1 text-sm">
                                                <span className="font-medium">{skill.name}</span>
                                                <span className="text-electric-blue">{skill.level}%</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-dark-border dark:bg-light-border overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${skill.level}%` }}
                                                    transition={{ duration: 0.8, delay: 0.2 }}
                                                    className="h-full rounded-full bg-electric-blue"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
