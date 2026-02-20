'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Topbar() {
    const router = useRouter();
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/companies?q=${encodeURIComponent(query.trim())}`);
        } else {
            router.push('/companies');
        }
    };

    return (
        <header className="fixed top-0 right-0 left-0 md:left-60 h-16 bg-white border-b border-border z-20 flex items-center px-6 gap-4">
            {/* Spacer for mobile hamburger */}
            <div className="w-8 md:hidden" />

            {/* Search form */}
            <form onSubmit={handleSubmit} className="flex-1 max-w-xl">
                <div className="relative">
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search companies..."
                        className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />
                </div>
            </form>

            {/* Right section */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>All systems operational</span>
            </div>
        </header>
    );
}
