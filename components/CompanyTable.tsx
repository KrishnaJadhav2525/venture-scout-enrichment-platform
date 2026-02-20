'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Company, SortField, SortDirection } from '@/lib/types';

interface CompanyTableProps {
    companies: Company[];
    totalCount: number;
    sortField: SortField;
    sortDirection: SortDirection;
    onSort: (field: SortField) => void;
}

function StageBadge({ stage }: { stage: string }) {
    const classMap: Record<string, string> = {
        'Pre-seed': 'badge badge-gray',
        'Seed': 'badge badge-blue',
        'Series A': 'badge badge-green',
    };
    return <span className={classMap[stage] || 'badge badge-gray'}>{stage}</span>;
}

function SortArrow({ field, sortField, sortDirection }: { field: SortField; sortField: SortField; sortDirection: SortDirection }) {
    if (field !== sortField) {
        return (
            <svg className="text-slate-300 ml-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
            </svg>
        );
    }
    return sortDirection === 'asc' ? (
        <svg className="text-primary ml-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 9l5-5 5 5" />
        </svg>
    ) : (
        <svg className="text-primary ml-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 15l5 5 5-5" />
        </svg>
    );
}

export default function CompanyTable({ companies, totalCount, sortField, sortDirection, onSort }: CompanyTableProps) {
    const router = useRouter();
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const sortableColumns: { label: string; field: SortField }[] = [
        { label: 'Company', field: 'name' },
        { label: 'Match', field: 'match' },
        { label: 'Industry', field: 'industry' },
        { label: 'Stage', field: 'stage' },
        { label: 'Location', field: 'location' },
        { label: 'Founded', field: 'founded' },
    ];

    if (companies.length === 0) {
        return (
            <div className="card p-12 text-center">
                <svg className="mx-auto mb-4 text-muted" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
                <h3 className="text-base font-semibold text-foreground mb-1">No companies found</h3>
                <p className="text-sm text-muted">Try adjusting your search or filters.</p>
            </div>
        );
    }

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(new Set(companies.map(c => c.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectRow = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const next = new Set(selectedIds);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setSelectedIds(next);
    };

    const handleExportCSV = () => {
        const selected = companies.filter(c => selectedIds.has(c.id));
        const headers = ['Company', 'Industry', 'Stage', 'Location', 'Founded', 'Match'];
        const csv = [
            headers.join(','),
            ...selected.map(c => [
                `"${c.name}"`,
                `"${c.industry}"`,
                `"${c.stage}"`,
                `"${c.location}"`,
                c.founded,
                typeof c.match === 'number' ? c.match : ''
            ].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'venture-scout-export.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setSelectedIds(new Set()); // Clear selection after export
    };

    const handleSaveToList = () => {
        alert(`Saved ${selectedIds.size} companies to your list.`);
        setSelectedIds(new Set());
    };

    const isAllSelected = companies.length > 0 && selectedIds.size === companies.length;

    return (
        <div className="relative">
            {/* Desktop View */}
            <div className="hidden md:block card overflow-hidden">
                <div className="bg-slate-50/95 backdrop-blur px-4 py-3 border-b border-border sticky top-0 z-20 flex justify-between items-center transition-colors">
                    <span className="text-sm font-medium text-foreground">{totalCount} {totalCount === 1 ? 'company' : 'companies'} found</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur">
                            <tr className="border-b border-border shadow-sm">
                                <th className="text-left px-4 py-3 w-10">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={handleSelectAll}
                                        className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                    />
                                </th>
                                {sortableColumns.map((col) => (
                                    <th
                                        key={col.field}
                                        className="text-left px-4 py-3 font-semibold text-foreground cursor-pointer select-none hover:bg-slate-100/50 transition-colors"
                                        onClick={() => onSort(col.field)}
                                    >
                                        <div className="flex items-center">
                                            {col.label}
                                            <SortArrow field={col.field} sortField={sortField} sortDirection={sortDirection} />
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {companies.map((company) => {
                                const isSelected = selectedIds.has(company.id);
                                return (
                                    <tr
                                        key={company.id}
                                        onClick={() => router.push(`/companies/${company.id}`)}
                                        className={`border-b border-border last:border-0 hover:bg-slate-50/80 transition-colors cursor-pointer ${isSelected ? 'bg-indigo-50/30' : ''}`}
                                    >
                                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={(e) => {
                                                    // This uses native onChange, the onClick wrapper isn't needed here
                                                }}
                                                onClick={(e) => handleSelectRow(e, company.id)}
                                                className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <span className="font-medium text-foreground">{company.name}</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {company.tags.slice(0, 3).map((tag) => (
                                                        <Link
                                                            key={tag}
                                                            href={`/companies?tag=${encodeURIComponent(tag)}`}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="tag-chip hover:bg-slate-200 cursor-pointer transition-colors"
                                                        >
                                                            {tag}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {typeof company.match === 'number' ? (
                                                <div className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium border ${company.match >= 80 ? 'bg-green-100 text-green-700 border-green-200' : company.match >= 50 ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                                                    {company.match}%
                                                </div>
                                            ) : (
                                                <span className="text-muted text-xs">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-muted">{company.industry}</td>
                                        <td className="px-4 py-3"><StageBadge stage={company.stage} /></td>
                                        <td className="px-4 py-3 text-muted">{company.location}</td>
                                        <td className="px-4 py-3 text-muted">{company.founded}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {companies.map((company) => {
                    const isSelected = selectedIds.has(company.id);
                    return (
                        <div
                            key={company.id}
                            onClick={() => router.push(`/companies/${company.id}`)}
                            className={`card p-4 transition-colors cursor-pointer ${isSelected ? 'ring-2 ring-primary border-transparent' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => { }}
                                        onClick={(e) => handleSelectRow(e, company.id)}
                                        className="rounded border-slate-300 text-primary focus:ring-primary h-5 w-5 cursor-pointer"
                                    />
                                    <h3 className="font-semibold text-lg text-foreground">{company.name}</h3>
                                </div>
                                {typeof company.match === 'number' && (
                                    <div className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium border ${company.match >= 80 ? 'bg-green-100 text-green-700 border-green-200' : company.match >= 50 ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                                        {company.match}%
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3 ml-8">
                                <StageBadge stage={company.stage} />
                                <span className="text-sm text-muted">{company.industry}</span>
                            </div>

                            <div className="flex flex-wrap gap-1 ml-8 mb-2">
                                {company.tags.slice(0, 3).map((tag) => (
                                    <Link
                                        key={tag}
                                        href={`/companies?tag=${encodeURIComponent(tag)}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="tag-chip hover:bg-slate-200 cursor-pointer transition-colors"
                                    >
                                        {tag}
                                    </Link>
                                ))}
                            </div>

                            <div className="flex items-center gap-3 text-xs text-muted ml-8 pt-2 border-t border-border">
                                <span>{company.location}</span>
                                <span>·</span>
                                <span>Est. {company.founded}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Floating Action Bar */}
            {selectedIds.size > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 shadow-2xl rounded-full px-6 py-3 flex items-center gap-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
                    <span className="text-white font-medium text-sm">
                        {selectedIds.size} selected
                    </span>
                    <div className="w-px h-5 bg-slate-700" />
                    <button
                        onClick={handleExportCSV}
                        className="text-sm text-slate-300 hover:text-white flex items-center gap-2 transition-colors font-medium"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" x2="12" y1="15" y2="3" />
                        </svg>
                        Export CSV
                    </button>
                    <div className="w-px h-5 bg-slate-700 mx-2" />
                    <button
                        onClick={handleSaveToList}
                        className="text-sm text-slate-300 hover:text-white flex items-center gap-2 transition-colors font-medium"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                        Save to List
                    </button>

                    <button
                        onClick={() => setSelectedIds(new Set())}
                        className="p-1 px-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors ml-4"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}
