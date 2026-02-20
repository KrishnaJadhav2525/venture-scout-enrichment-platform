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
        if (lower.includes('fund') || lower.includes('raise') || lower.includes('seed')) return { label: 'Funding', color: 'badge-green', dotColor: 'bg-green-500' };
        if (lower.includes('hir') || lower.includes('join') || lower.includes('appoint')) return { label: 'Hire', color: 'badge-blue', dotColor: 'bg-blue-500' };
        if (lower.includes('launch') || lower.includes('releas') || lower.includes('product')) return { label: 'Launch', color: 'badge-indigo', dotColor: 'bg-indigo-500' };
        if (lower.includes('press') || lower.includes('featur') || lower.includes('award')) return { label: 'Press', color: 'badge-gray', dotColor: 'bg-amber-500' };
        return { label: 'Update', color: 'badge-gray', dotColor: 'bg-gray-400' };
    };

    return (
        <div className="relative pl-1">
            {sorted.map((signal, idx) => {
                const category = getCategoryBadge(signal.text);
                return (
                    <div key={idx} className="relative pb-6 last:pb-0 border-l border-border ml-2 pl-4">
                        {/* Dot */}
                        <div
                            className={`absolute -left-[6px] top-1.5 w-3 h-3 rounded-full ${category.dotColor}`}
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
