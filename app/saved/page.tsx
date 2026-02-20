'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SavedSearch } from '@/lib/types';
import { getSavedSearches, deleteSavedSearch } from '@/lib/localStorage';

export default function SavedSearchesPage() {
    const router = useRouter();
    const [searches, setSearches] = useState<SavedSearch[]>([]);

    useEffect(() => {
        setSearches(getSavedSearches());
    }, []);

    const refresh = () => setSearches(getSavedSearches());

    const handleRerun = (search: SavedSearch) => {
        const params = new URLSearchParams();
        if (search.query) params.set('q', search.query);
        if (search.filters.industry) params.set('industry', search.filters.industry);
        if (search.filters.stage) params.set('stage', search.filters.stage);
        if (search.filters.location) params.set('location', search.filters.location);
        if (search.filters.headcount) params.set('headcount', search.filters.headcount);
        router.push(`/companies?${params.toString()}`);
    };

    const handleDelete = (searchId: string) => {
        deleteSavedSearch(searchId);
        refresh();
    };

    const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days === 1) return '1 day ago';
        return `${days} days ago`;
    };

    return (
        <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Saved Searches</h1>
                <p className="text-sm text-muted mt-1">{searches.length} saved {searches.length === 1 ? 'search' : 'searches'}</p>
            </div>

            {/* Searches */}
            {searches.length === 0 ? (
                <div className="card p-12 text-center">
                    <svg className="mx-auto mb-4 text-muted" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                    <h3 className="text-base font-semibold text-foreground mb-1">No saved searches</h3>
                    <p className="text-sm text-muted">Save a search from the Companies page to see it here.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {searches.map((search) => {
                        const filterEntries = Object.entries(search.filters).filter(
                            ([, v]) => v
                        ) as [string, string][];

                        return (
                            <div key={search.id} className="card p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        {/* Query */}
                                        <div className="flex items-center gap-2 mb-1">
                                            <svg className="text-muted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="11" cy="11" r="8" />
                                                <path d="m21 21-4.3-4.3" />
                                            </svg>
                                            <span className="text-sm font-medium text-foreground">
                                                {search.query ? `"${search.query}"` : 'All companies'}
                                            </span>
                                        </div>

                                        {/* Filter chips */}
                                        {filterEntries.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {filterEntries.map(([key, value]) => (
                                                    <span key={key} className="badge badge-indigo text-[11px]">
                                                        {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Timestamp */}
                                        <p className="text-xs text-muted mt-2">Saved {timeAgo(search.savedAt)}</p>
                                    </div>

                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button onClick={() => handleRerun(search)} className="btn-primary text-sm py-2">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                            Re-run
                                        </button>
                                        <button onClick={() => handleDelete(search.id)} className="btn-secondary text-sm py-2 text-red-500 hover:text-red-600">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
