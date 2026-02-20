'use client';

import { useState, useEffect } from 'react';

interface NoteEditorProps {
    companyId: string;
}

export default function NoteEditor({ companyId }: NoteEditorProps) {
    const [note, setNote] = useState('');
    const [savedNote, setSavedNote] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [isAvailable, setIsAvailable] = useState(true);

    useEffect(() => {
        try {
            const val = localStorage.getItem(`vcscout_note_${companyId}`);
            if (val) {
                setNote(val);
                setSavedNote(val);
            }
        } catch (e) {
            setIsAvailable(false);
        }
    }, [companyId]);

    const handleSave = () => {
        try {
            localStorage.setItem(`vcscout_note_${companyId}`, note);
            setSavedNote(note);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2500);
        } catch (e) {
            setIsAvailable(false);
        }
    };

    if (!isAvailable) {
        return <p className="text-sm text-amber-600 p-3 bg-amber-50 rounded-lg border border-amber-200">Notes unavailable in this browser</p>;
    }

    const hasChanged = note !== savedNote;
    const isEmpty = note.trim() === '';
    const isSaveDisabled = isEmpty || !hasChanged;

    return (
        <div className="relative">
            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write your analyst notes here..."
                className="w-full min-h-[120px] p-3 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y transition-colors"
            />
            
            <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-muted">{note.length} characters</span>
                <button 
                    onClick={handleSave} 
                    disabled={isSaveDisabled}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Save Note
                </button>
            </div>

            {showToast && (
                <div className="fixed bottom-6 right-6 bg-green-50 text-green-700 px-4 py-3 rounded-lg shadow-lg border border-green-200 flex items-center gap-2 text-sm font-medium z-50 transition-all duration-300">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Saved ✓
                </div>
            )}
        </div>
    );
}
