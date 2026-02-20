'use client';

import { Company } from '@/lib/types';

interface ExportButtonProps {
    companies: Company[];
    listName: string;
    format: 'csv' | 'json';
}

export default function ExportButton({ companies, listName, format }: ExportButtonProps) {
    const handleExport = () => {
        let content: string;
        let mimeType: string;
        let extension: string;

        if (format === 'csv') {
            const headers = ['Name', 'Website', 'Industry', 'Stage', 'Location', 'Founded'];
            const rows = companies.map((c) => [
                c.name,
                c.website,
                c.industry,
                c.stage,
                c.location,
                c.founded.toString(),
            ]);
            content = [headers.join(','), ...rows.map((r) => r.map((v) => `"${v}"`).join(','))].join('\n');
            mimeType = 'text/csv';
            extension = 'csv';
        } else {
            content = JSON.stringify(companies, null, 2);
            mimeType = 'application/json';
            extension = 'json';
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${listName.replace(/\s+/g, '-').toLowerCase()}.${extension}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <button onClick={handleExport} className="btn-secondary text-xs py-1.5 px-3">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            {format.toUpperCase()}
        </button>
    );
}
