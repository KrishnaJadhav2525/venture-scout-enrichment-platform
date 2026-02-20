'use client';

import { useState, useEffect } from 'react';
import { getLists, createList, addCompanyToList } from '@/lib/localStorage';
import { VCList } from '@/lib/types';

interface SaveToListModalProps {
    companyId: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function SaveToListModal({ companyId, isOpen, onClose }: SaveToListModalProps) {
    const [lists, setLists] = useState<VCList[]>([]);
    const [newListName, setNewListName] = useState('');
    const [showNewInput, setShowNewInput] = useState(false);
    const [toast, setToast] = useState('');

    useEffect(() => {
        if (isOpen) {
            setLists(getLists());
            setNewListName('');
            setShowNewInput(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleAddToList = (listId: string) => {
        addCompanyToList(listId, companyId);
        setLists(getLists());
        setToast('Added to list!');
        setTimeout(() => setToast(''), 2000);
    };

    const handleCreateList = () => {
        if (!newListName.trim()) return;
        const newList = createList(newListName.trim());
        addCompanyToList(newList.id, companyId);
        setLists(getLists());
        setNewListName('');
        setShowNewInput(false);
        setToast('List created & company added!');
        setTimeout(() => setToast(''), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 z-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-foreground">Save to List</h3>
                    <button
                        onClick={onClose}
                        className="text-muted hover:text-foreground transition-colors p-1"
                        aria-label="Close"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Existing lists */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {lists.length === 0 && !showNewInput && (
                        <p className="text-sm text-muted py-4 text-center">No lists yet. Create one below.</p>
                    )}
                    {lists.map((list) => {
                        const isInList = list.companyIds.includes(companyId);
                        return (
                            <button
                                key={list.id}
                                onClick={() => !isInList && handleAddToList(list.id)}
                                disabled={isInList}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${isInList
                                        ? 'bg-green-50 text-green-700 cursor-default'
                                        : 'bg-slate-50 hover:bg-slate-100 text-foreground cursor-pointer'
                                    }`}
                            >
                                <span className="font-medium">{list.name}</span>
                                {isInList && (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* New list */}
                <div className="mt-4 pt-4 border-t border-border">
                    {showNewInput ? (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newListName}
                                onChange={(e) => setNewListName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateList()}
                                placeholder="List name"
                                autoFocus
                                className="flex-1 text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                            <button onClick={handleCreateList} className="btn-primary text-sm py-2">Create</button>
                            <button onClick={() => setShowNewInput(false)} className="btn-secondary text-sm py-2">Cancel</button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowNewInput(true)}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            New List
                        </button>
                    )}
                </div>

                {/* Toast */}
                {toast && (
                    <div className="mt-3 text-center text-xs text-green-600 font-medium">{toast}</div>
                )}
            </div>
        </div>
    );
}
