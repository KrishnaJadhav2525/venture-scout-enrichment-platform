'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import companiesData from '@/data/companies.json';
import { Company, VCList } from '@/lib/types';
import { getLists, createList, deleteList, removeCompanyFromList } from '@/lib/localStorage';
import ExportButton from '@/components/ExportButton';

export default function ListsPage() {
    const [lists, setLists] = useState<VCList[]>([]);
    const [expandedList, setExpandedList] = useState<string | null>(null);
    const [showNewInput, setShowNewInput] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [toast, setToast] = useState('');

    const companies = companiesData as Company[];

    useEffect(() => {
        setLists(getLists());
    }, []);

    const refresh = () => setLists(getLists());

    const handleCreateList = () => {
        if (!newListName.trim()) return;
        createList(newListName.trim());
        setNewListName('');
        setShowNewInput(false);
        refresh();
        setToast('List created!');
        setTimeout(() => setToast(''), 3000);
    };

    const handleDeleteList = (listId: string) => {
        if (confirm('Are you sure you want to delete this list?')) {
            deleteList(listId);
            refresh();
        }
    };

    const handleRemoveCompany = (listId: string, companyId: string) => {
        removeCompanyFromList(listId, companyId);
        refresh();
    };

    const getCompaniesForList = (list: VCList): Company[] => {
        return list.companyIds
            .map((id) => companies.find((c) => c.id === id))
            .filter(Boolean) as Company[];
    };

    return (
        <div className="max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">My Lists</h1>
                    <p className="text-sm text-muted mt-1">{lists.length} {lists.length === 1 ? 'list' : 'lists'}</p>
                </div>
                {showNewInput ? (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateList()}
                            placeholder="List name"
                            autoFocus
                            className="text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                        <button onClick={handleCreateList} className="btn-primary">Create</button>
                        <button onClick={() => setShowNewInput(false)} className="btn-secondary">Cancel</button>
                    </div>
                ) : (
                    <button onClick={() => setShowNewInput(true)} className="btn-primary">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        New List
                    </button>
                )}
            </div>

            {/* Lists */}
            {lists.length === 0 ? (
                <div className="space-y-8">
                    <div className="card p-12 text-center">
                        <svg className="mx-auto mb-4 text-muted" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                        </svg>
                        <h3 className="text-base font-semibold text-foreground mb-1">No lists yet</h3>
                        <p className="text-sm text-muted">Start by saving a company from its profile.</p>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-foreground mb-4 text-center">How it works</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-center">
                                <svg className="mx-auto mb-2 text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                <h5 className="font-bold text-sm text-foreground mb-1">Browse Companies</h5>
                                <p className="text-xs text-muted">Find startups that match your thesis</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-center">
                                <svg className="mx-auto mb-2 text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                                <h5 className="font-bold text-sm text-foreground mb-1">Save to List</h5>
                                <p className="text-xs text-muted">Click Save to List on any company profile</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-center">
                                <svg className="mx-auto mb-2 text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                <h5 className="font-bold text-sm text-foreground mb-1">Export</h5>
                                <p className="text-xs text-muted">Download your list as CSV or JSON anytime</p>
                            </div>
                        </div>
                        <div className="mt-8 text-center">
                            <Link href="/companies" className="inline-flex items-center gap-2 border border-indigo-400 text-indigo-600 rounded-md px-4 py-2 text-sm font-medium hover:bg-indigo-50 transition">
                                ← Browse Companies
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {lists.map((list) => {
                        const listCompanies = getCompaniesForList(list);
                        const isExpanded = expandedList === list.id;

                        return (
                            <div key={list.id} className="card p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <h3 className="text-base font-semibold text-foreground">{list.name}</h3>
                                        <p className="text-sm text-muted mt-0.5">
                                            {listCompanies.length} {listCompanies.length === 1 ? 'company' : 'companies'}
                                        </p>
                                        {/* Company pills */}
                                        {listCompanies.length > 0 && !isExpanded && (
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {listCompanies.slice(0, 5).map((c) => (
                                                    <span key={c.id} className="tag-chip">{c.name}</span>
                                                ))}
                                                {listCompanies.length > 5 && (
                                                    <span className="tag-chip">+{listCompanies.length - 5} more</span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {listCompanies.length > 0 && (
                                            <>
                                                <ExportButton companies={listCompanies} listName={list.name} format="csv" />
                                                <ExportButton companies={listCompanies} listName={list.name} format="json" />
                                            </>
                                        )}
                                        {listCompanies.length > 0 && (
                                            <button
                                                onClick={() => setExpandedList(isExpanded ? null : list.id)}
                                                className="btn-secondary text-xs py-1.5 px-3"
                                            >
                                                {isExpanded ? 'Collapse' : 'Expand'}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteList(list.id)}
                                            className="btn-danger text-xs py-1.5 px-3"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded view */}
                                {isExpanded && listCompanies.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-border space-y-2">
                                        {listCompanies.map((c) => (
                                            <div
                                                key={c.id}
                                                className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50"
                                            >
                                                <div>
                                                    <Link href={`/companies/${c.id}`} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                                                        {c.name}
                                                    </Link>
                                                    <span className="text-xs text-muted ml-2">{c.industry} · {c.stage}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveCompany(list.id, c.id)}
                                                    className="text-muted hover:text-red-500 transition-colors p-1"
                                                    title="Remove from list"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M18 6L6 18M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Toast */}
            {toast && <div className="toast">{toast}</div>}
        </div>
    );
}
