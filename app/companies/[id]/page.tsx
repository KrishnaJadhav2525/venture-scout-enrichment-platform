'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import companiesData from '@/data/companies.json';
import { Company, Signal, EnrichedData } from '@/lib/types';
import { getCachedEnrichment, cacheEnrichment } from '@/lib/localStorage';
import SignalsTimeline from '@/components/SignalsTimeline';
import NoteEditor from '@/components/NoteEditor';
import SaveToListModal from '@/components/SaveToListModal';
import EnrichmentCard from '@/components/EnrichmentCard';
import EnrichmentLoading from '@/components/EnrichmentLoading';

function StageBadge({ stage }: { stage: string }) {
    const classMap: Record<string, string> = {
        'Pre-seed': 'badge badge-gray',
        'Seed': 'badge badge-blue',
        'Series A': 'badge badge-green',
    };
    return <span className={classMap[stage] || 'badge badge-gray'}>{stage}</span>;
}

export default function CompanyProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const company = (companiesData as Company[]).find((c) => c.id === resolvedParams.id);

    const [showListModal, setShowListModal] = useState(false);
    const [enrichment, setEnrichment] = useState<EnrichedData | null>(null);
    const [enrichLoading, setEnrichLoading] = useState(false);
    const [enrichError, setEnrichError] = useState('');

    // Load cached enrichment
    useEffect(() => {
        if (company) {
            const cached = getCachedEnrichment(company.id);
            if (cached) setEnrichment(cached);
        }
    }, [company]);

    if (!company) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-semibold text-foreground mb-2">Company not found</h2>
                <Link href="/companies" className="text-primary hover:underline text-sm">
                    ← Back to companies
                </Link>
            </div>
        );
    }

    const handleEnrich = async () => {
        setEnrichLoading(true);
        setEnrichError('');
        try {
            const res = await fetch('/api/enrich', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ website: company.website }),
            });
            const data = await res.json();
            if (!res.ok || data.error) {
                throw new Error(data.error || 'Enrichment failed');
            }
            setEnrichment(data);
            cacheEnrichment(company.id, data);
        } catch (err) {
            setEnrichError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setEnrichLoading(false);
        }
    };

    // Signals timeline should only show mock data signals
    const allSignals: Signal[] = company.signals || [];

    const enrichmentStatus = enrichment ? (() => {
        const enrichedDate = new Date(enrichment.scrapedAt);
        const diffHours = (Date.now() - enrichedDate.getTime()) / (1000 * 60 * 60);

        const dateStr = enrichedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const timeStr = enrichedDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        const formatted = `${dateStr} at ${timeStr}`;

        if (diffHours < 1) return { text: formatted, status: 'fresh' };
        if (diffHours > 24 * 7) return { text: formatted, status: 'stale' };
        return { text: formatted, status: 'normal' };
    })() : null;

    return (
        <div className="max-w-4xl">
            {/* Breadcrumb */}
            <Link href="/companies" className="text-sm text-muted hover:text-primary transition-colors mb-4 inline-flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to companies
            </Link>

            {/* Header */}
            <div className="card p-6 mb-6 mt-2">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">{company.name}</h1>
                        <div className="flex items-center gap-2 mb-3">
                            <a
                                href={company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                            >
                                {company.website}
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                                </svg>
                            </a>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            <StageBadge stage={company.stage} />

                            {/* Match Score Badge */}
                            {(enrichment?.thesisMatch || company.enriched?.thesisMatch) ? (() => {
                                const match = enrichment?.thesisMatch || company.enriched?.thesisMatch;
                                if (!match) return null;
                                let colorClass = 'bg-gray-100 text-gray-700 border-gray-200';
                                if (match.score >= 80) colorClass = 'bg-green-100 text-green-700 border-green-200';
                                else if (match.score >= 50) colorClass = 'bg-amber-100 text-amber-700 border-amber-200';

                                return (
                                    <div className={`px-2 py-0.5 rounded-full border text-xs font-semibold flex items-center gap-1 ${colorClass}`} title={match.reasoning}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
                                        {match.score}% Match
                                    </div>
                                );
                            })() : null}

                            <span className="text-sm text-muted">{company.location}</span>
                            <span className="text-sm text-muted">·</span>
                            <span className="text-sm text-muted">Founded {company.founded}</span>
                            <span className="text-sm text-muted">·</span>
                            <span className="text-sm text-muted">{company.headcount} employees</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {company.tags.map((tag) => (
                                <Link key={tag} href={`/companies?tag=${encodeURIComponent(tag)}`} className="tag-chip hover:bg-slate-200 cursor-pointer transition-colors">
                                    {tag}
                                </Link>
                            ))}
                        </div>
                        {/* Phase 5: Timestamp precision */}
                        {enrichmentStatus && (
                            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted">
                                Last enriched: {enrichmentStatus.text}
                                {enrichmentStatus.status === 'fresh' && (
                                    <span className="flex items-center gap-1 ml-1 text-green-600 font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                        Fresh
                                    </span>
                                )}
                                {enrichmentStatus.status === 'stale' && (
                                    <span className="flex items-center gap-1 ml-1 text-amber-600 font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                        Stale — consider re-enriching
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => setShowListModal(true)} className="btn-secondary">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                            </svg>
                            Save to List
                        </button>
                        <button
                            onClick={handleEnrich}
                            disabled={enrichLoading}
                            className={`btn-primary ${enrichLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {enrichLoading ? (
                                <>
                                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                    </svg>
                                    Fetching live data...
                                </>
                            ) : enrichment ? (
                                <>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                    </svg>
                                    Re-enrich
                                </>
                            ) : (
                                <>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="m21 21-4.3-4.3" />
                                    </svg>
                                    Enrich
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Error */}
            {enrichError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center justify-between">
                    <span>{enrichError}</span>
                    <button onClick={handleEnrich} className="text-red-700 font-medium hover:underline ml-4">
                        Try Again
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (Content) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card p-5">
                        <h2 className="text-base font-semibold text-foreground mb-3">About</h2>
                        <p className="text-sm text-foreground leading-relaxed">{company.description}</p>
                    </div>

                    <div className="card p-5">
                        <h2 className="text-base font-semibold text-foreground mb-3">Signals</h2>
                        <SignalsTimeline signals={allSignals} />
                    </div>

                    <div className="card p-5">
                        <h2 className="text-base font-semibold text-foreground mb-3">Analyst Notes</h2>
                        <NoteEditor companyId={company.id} />
                    </div>
                </div>

                {/* Right Column (Live Enrichment) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        {enrichLoading ? (
                            <EnrichmentLoading />
                        ) : enrichment ? (
                            <EnrichmentCard data={enrichment} />
                        ) : (
                            <div className="card p-6 border-dashed border-border/60 bg-slate-50/50 flex flex-col items-center justify-center text-center min-h-[300px]">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                                    <svg className="text-slate-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                </div>
                                <h3 className="text-sm font-medium text-foreground mb-1.5">No enrichment data yet</h3>
                                <p className="text-xs text-muted leading-relaxed">Click Enrich to pull live data from this company's website.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            <SaveToListModal
                companyId={company.id}
                isOpen={showListModal}
                onClose={() => setShowListModal(false)}
            />
        </div>
    );
}
