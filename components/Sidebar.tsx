'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
    {
        href: '/companies',
        label: 'Companies',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
        ),
    },
    {
        href: '/lists',
        label: 'Lists',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
        ),
    },
    {
        href: '/saved',
        label: 'Saved Searches',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
        ),
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (href: string) => {
        if (href === '/companies') {
            return pathname === '/companies' || pathname.startsWith('/companies/');
        }
        return pathname === href;
    };

    return (
        <>
            {/* Mobile hamburger */}
            <button
                className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-sidebar-bg text-white md:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle sidebar"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {mobileOpen ? (
                        <path d="M18 6L6 18M6 6l12 12" />
                    ) : (
                        <path d="M3 12h18M3 6h18M3 18h18" />
                    )}
                </svg>
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-60 bg-sidebar-bg z-40 flex flex-col transition-transform duration-200 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0`}
            >
                {/* Logo */}
                <div className="px-6 py-5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                    </div>
                    <span className="text-white font-semibold text-lg tracking-tight">VCScout</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 mt-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-1 transition-colors ${isActive(item.href)
                                    ? 'bg-primary/15 text-primary'
                                    : 'text-sidebar-text hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/10">
                    <p className="text-xs text-sidebar-text/60">VC Intelligence Platform</p>
                </div>
            </aside>
        </>
    );
}
