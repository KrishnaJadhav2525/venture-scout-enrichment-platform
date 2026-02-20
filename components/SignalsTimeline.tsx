'use client';

import { Signal } from '@/lib/types';

interface SignalsTimelineProps {
    signals: Signal[];
}

export default function SignalsTimeline({ signals }: SignalsTimelineProps) {
    if (!signals || signals.length === 0) {
        return (
            <div className="text-sm text-muted py-4">
                No signals recorded yet. Signals appear after enrichment or manual entry.
            </div>
        );
    }

    const sorted = [...signals].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const getCategoryBadge = (text: string) => {
        const lower = text.toLowerCase();
        if (lower.includes('fund') || lower.includes('raise') || lower.includes('seed')) return { label: 'Funding', color: 'badge-blue' };
        if (lower.includes('hir') || lower.includes('join') || lower.includes('appoint')) return { label: 'Hire', color: 'badge-indigo' };
        if (lower.includes('launch') || lower.includes('releas') || lower.includes('product')) return { label: 'Launch', color: 'badge-green' };
        if (lower.includes('press') || lower.includes('featur') || lower.includes('award')) return { label: 'Press', color: 'badge-gray' };
        return { label: 'Update', color: 'badge-gray' };
    };

    return (
        <div className="relative pl-6">
            {/* Vertical line */}
            <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />

            {sorted.map((signal, idx) => {
                const category = getCategoryBadge(signal.text);
                return (
                    <div key={idx} className="relative pb-5 last:pb-0">
                        {/* Dot */}
                        <div
                            className="absolute -left-4 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-primary"
                        />

                        <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                            <span className="text-xs text-muted whitespace-nowrap font-medium min-w-[80px] pt-1">
                                {new Date(signal.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </span>
                            <div className="flex flex-col gap-1.5 w-full">
                                <div className="flex items-center gap-2">
                                    <span className={`badge ${category.color} text-[10px] py-0 px-1.5`}>{category.label}</span>
                                </div>
                                <span className="text-sm text-foreground leading-relaxed">{signal.text}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
