'use client';

interface FilterBarProps {
    industries: string[];
    stages: string[];
    locations: string[];
    headcounts: string[];
    selectedIndustry: string;
    selectedStage: string;
    selectedLocation: string;
    selectedHeadcount: string;
    onIndustryChange: (value: string) => void;
    onStageChange: (value: string) => void;
    onLocationChange: (value: string) => void;
    onHeadcountChange: (value: string) => void;
    onClearFilters: () => void;
}

export default function FilterBar({
    industries,
    stages,
    locations,
    headcounts,
    selectedIndustry,
    selectedStage,
    selectedLocation,
    selectedHeadcount,
    onIndustryChange,
    onStageChange,
    onLocationChange,
    onHeadcountChange,
    onClearFilters,
}: FilterBarProps) {
    const hasActiveFilters =
        selectedIndustry || selectedStage || selectedLocation || selectedHeadcount;

    const activeFilters = [
        selectedIndustry && { label: `Industry: ${selectedIndustry}`, clear: () => onIndustryChange('') },
        selectedStage && { label: `Stage: ${selectedStage}`, clear: () => onStageChange('') },
        selectedLocation && { label: `Location: ${selectedLocation}`, clear: () => onLocationChange('') },
        selectedHeadcount && { label: `Headcount: ${selectedHeadcount}`, clear: () => onHeadcountChange('') },
    ].filter(Boolean) as { label: string; clear: () => void }[];

    return (
        <div className="space-y-3">
            {/* Filter dropdowns */}
            <div className="flex flex-wrap items-center gap-3">
                <select
                    value={selectedIndustry}
                    onChange={(e) => onIndustryChange(e.target.value)}
                    className="text-sm border border-border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                    <option value="">All Industries</option>
                    {industries.map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                    ))}
                </select>

                <select
                    value={selectedStage}
                    onChange={(e) => onStageChange(e.target.value)}
                    className="text-sm border border-border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                    <option value="">All Stages</option>
                    {stages.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

                <select
                    value={selectedLocation}
                    onChange={(e) => onLocationChange(e.target.value)}
                    className="text-sm border border-border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                    <option value="">All Locations</option>
                    {locations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                    ))}
                </select>

                <select
                    value={selectedHeadcount}
                    onChange={(e) => onHeadcountChange(e.target.value)}
                    className="text-sm border border-border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                    <option value="">All Headcounts</option>
                    {headcounts.map((hc) => (
                        <option key={hc} value={hc}>{hc}</option>
                    ))}
                </select>

                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="text-sm text-muted hover:text-foreground transition-colors"
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            {/* Active filter chips */}
            {activeFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                    {activeFilters.map((filter) => (
                        <span
                            key={filter.label}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium"
                        >
                            {filter.label}
                            <button
                                onClick={filter.clear}
                                className="hover:bg-primary/20 rounded p-0.5 transition-colors"
                                aria-label={`Remove ${filter.label}`}
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
