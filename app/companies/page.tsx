'use client';

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import companiesData from '@/data/companies.json';
import { Company, SortField, SortDirection } from '@/lib/types';
import { saveSearch, getCachedEnrichment } from '@/lib/localStorage';
import FilterBar from '@/components/FilterBar';
import CompanyTable from '@/components/CompanyTable';

const ITEMS_PER_PAGE = 10;

function CompaniesContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Read state from URL
    const urlQuery = searchParams.get('q') || '';
    const urlIndustry = searchParams.get('industry') || '';
    const urlStage = searchParams.get('stage') || '';
    const urlLocation = searchParams.get('location') || '';
    const urlHeadcount = searchParams.get('headcount') || '';
    const urlTag = searchParams.get('tag') || '';

    const [query, setQuery] = useState(urlQuery);
    const [sortField, setSortField] = useState<SortField>('founded');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [toast, setToast] = useState('');

    const companies = companiesData as Company[];

    // Extract unique filter values
    const industries = useMemo(() => [...new Set(companies.map((c) => c.industry))].sort(), [companies]);
    const stages = useMemo(() => [...new Set(companies.map((c) => c.stage))], [companies]);
    const locations = useMemo(() => [...new Set(companies.map((c) => c.location))].sort(), [companies]);
    const headcounts = useMemo(() => [...new Set(companies.map((c) => c.headcount))], [companies]);

    // Sync query input with URL
    useEffect(() => {
        setQuery(urlQuery);
    }, [urlQuery]);

    // Update URL params
    const updateURL = useCallback(
        (params: Record<string, string>) => {
            const newParams = new URLSearchParams();
            const merged = {
                q: urlQuery,
                tag: urlTag,
                industry: urlIndustry,
                stage: urlStage,
                location: urlLocation,
                headcount: urlHeadcount,
                ...params,
            };
            Object.entries(merged).forEach(([key, value]) => {
                if (value) newParams.set(key, value);
            });
            router.push(`/companies?${newParams.toString()}`, { scroll: false });
        },
        [router, urlQuery, urlTag, urlIndustry, urlStage, urlLocation, urlHeadcount]
    );

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query !== urlQuery) {
                updateURL({ q: query });
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query, urlQuery, updateURL]);

    // Reset page on filter/search change
    useEffect(() => {
        setCurrentPage(1);
    }, [urlQuery, urlTag, urlIndustry, urlStage, urlLocation, urlHeadcount]);

    // Filter and search
    const filteredCompanies = useMemo(() => {
        let result = companies.map(c => {
            const THESIS_TAGS = ["ai", "deeptech", "b2b", "saas", "llm", "developer-tools", "climate", "fintech"];
            const matchingTags = c.tags.filter(t => THESIS_TAGS.includes(t.toLowerCase()));
            const matchScore = Math.round((matchingTags.length / THESIS_TAGS.length) * 100);

            return {
                ...c,
                match: matchScore,
                matchedTags: matchingTags
            };
        });

        // Search
        if (urlQuery) {
            const q = urlQuery.toLowerCase();
            result = result.filter(
                (c) =>
                    c.name.toLowerCase().includes(q) ||
                    c.description.toLowerCase().includes(q) ||
                    c.tags.some((t) => t.toLowerCase().includes(q))
            );
        }

        // Filters
        if (urlIndustry) result = result.filter((c) => c.industry === urlIndustry);
        if (urlStage) result = result.filter((c) => c.stage === urlStage);
        if (urlLocation) result = result.filter((c) => c.location === urlLocation);
        if (urlHeadcount) result = result.filter((c) => c.headcount === urlHeadcount);
        if (urlTag) {
            const tQuery = urlTag.toLowerCase();
            result = result.filter((c) => c.tags.some((t) => t.toLowerCase() === tQuery));
        }

        // Sort
        result.sort((a, b) => {
            if (sortField === 'match') {
                const aVal = typeof a.match === 'number' ? a.match : 0;
                const bVal = typeof b.match === 'number' ? b.match : 0;
                return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
            }
            const aVal = a[sortField];
            const bVal = b[sortField];
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return sortDirection === 'asc'
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
            }
            return 0;
        });

        return result;
    }, [companies, urlQuery, urlTag, urlIndustry, urlStage, urlLocation, urlHeadcount, sortField, sortDirection]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE));
    const paginatedCompanies = filteredCompanies.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleSort = (field: SortField) => {
        if (field === sortField) {
            setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleClearFilters = () => {
        setQuery('');
        router.push('/companies', { scroll: false });
    };

    const handleSaveSearch = () => {
        saveSearch(urlQuery, {
            industry: urlIndustry || undefined,
            stage: urlStage || undefined,
            location: urlLocation || undefined,
            headcount: urlHeadcount || undefined,
        });
        setToast('Search saved!');
        setTimeout(() => setToast(''), 3000);
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Companies</h1>
                </div>
                <button onClick={handleSaveSearch} className="btn-secondary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                    Save Search
                </button>
            </div>

            {/* Search */}
            <div className="mb-4">
                <div className="relative max-w-lg">
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name, description, or tags..."
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6">
                <FilterBar
                    industries={industries}
                    stages={stages}
                    locations={locations}
                    headcounts={headcounts}
                    selectedIndustry={urlIndustry}
                    selectedStage={urlStage}
                    selectedLocation={urlLocation}
                    selectedHeadcount={urlHeadcount}
                    onIndustryChange={(v) => updateURL({ industry: v })}
                    onStageChange={(v) => updateURL({ stage: v })}
                    onLocationChange={(v) => updateURL({ location: v })}
                    onHeadcountChange={(v) => updateURL({ headcount: v })}
                    onClearFilters={handleClearFilters}
                />
            </div>

            {/* Active Tag Filter */}
            {urlTag && (
                <div className="mb-4">
                    <button
                        onClick={() => updateURL({ tag: '' })}
                        className="tag-chip flex items-center gap-1.5"
                    >
                        Filtered by: {urlTag}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Table */}
            <CompanyTable
                companies={paginatedCompanies}
                totalCount={filteredCompanies.length}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
            />

            {/* Pagination */}
            {filteredCompanies.length > ITEMS_PER_PAGE && (
                <div className="flex items-center justify-between mt-4 px-1">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-muted">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Toast */}
            {toast && <div className="toast">{toast}</div>}
        </div>
    );
}

export default function CompaniesPage() {
    return (
        <Suspense fallback={<div className="text-sm text-muted">Loading...</div>}>
            <CompaniesContent />
        </Suspense>
    );
}
