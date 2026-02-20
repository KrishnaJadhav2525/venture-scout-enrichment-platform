'use client';

import { EnrichedData } from '@/lib/types';
import Link from 'next/link';

interface EnrichmentCardProps {
    data: EnrichedData;
}

export default function EnrichmentCard({ data }: EnrichmentCardProps) {
    const formattedDate = new Date(data.scrapedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className="card p-5 pb-6 h-auto overflow-visible border-primary/20 bg-indigo-50/30">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                </div>
                <h4 className="text-sm font-semibold text-foreground">Live Enrichment</h4>
            </div>

            {/* Summary */}
            <div className="mb-4">
                <h5 className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Summary</h5>
                <p className="text-sm text-foreground leading-relaxed">{data.summary}</p>
            </div>

            {/* What They Do */}
            {data.whatTheyDo && data.whatTheyDo.length > 0 && (
                <div className="mb-4">
                    <h5 className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">What They Do</h5>
                    <ul className="space-y-1">
                        {data.whatTheyDo.map((item, idx) => (
                            <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Keywords */}
            {data.keywords && data.keywords.length > 0 && (
                <div className="mb-4">
                    <h5 className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Keywords</h5>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {data.keywords.map((kw, idx) => (
                            <Link key={idx} href={`/companies?tag=${encodeURIComponent(kw)}`} className="tag-chip">
                                {kw}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* AI Signals */}
            {data.signals && data.signals.length > 0 && (
                <div className="mb-4">
                    <h5 className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">AI Signals</h5>
                    <ul className="space-y-1.5">
                        {data.signals.map((signal, idx) => {
                            if (typeof signal === 'string') {
                                return (
                                    <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                                        <svg className="mt-0.5 text-green-500 flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 6L9 17l-5-5" />
                                        </svg>
                                        {signal}
                                    </li>
                                );
                            }

                            const colorMap = {
                                positive: 'bg-green-500',
                                neutral: 'bg-amber-400',
                                risk: 'bg-red-500'
                            };

                            return (
                                <li key={idx} className="text-sm text-foreground flex items-start gap-2 group relative">
                                    <div className={`mt-1.5 w-2 h-2 rounded-full ${colorMap[signal.type] || 'bg-slate-400'} flex-shrink-0`} />
                                    <span>{signal.text}</span>

                                    {signal.reasoning && (
                                        <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block z-10 w-64 p-2 bg-slate-800 text-white text-xs rounded shadow-lg pointer-events-none">
                                            {signal.reasoning}
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            {/* Source */}
            <div className="pt-4 mt-2 border-t border-border/50">
                {data.source.split(',').map((src, idx) => {
                    const cleanSrc = src.trim().replace('https://r.jina.ai/', '');
                    const displaySrc = cleanSrc.replace(/^https?:\/\/(www\.)?/, '');
                    return (
                        <p key={idx} className="text-xs text-muted flex items-center gap-1.5 mb-1.5 last:mb-0">
                            Source:
                            <a href={cleanSrc} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium inline-flex items-center gap-1">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                {displaySrc}
                            </a>
                            <span className="text-muted/50">·</span>
                            <span>Fetched {formattedDate}</span>
                        </p>
                    );
                })}
            </div>
        </div>
    );
}
