'use client';

import { useState, useEffect } from 'react';

const steps = [
    { label: "Initializing Jina reading agents..." },
    { label: "Parsing deep website structure..." },
    { label: "Synthesizing insights with LLM..." }
];

export default function EnrichmentLoading() {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const timer1 = setTimeout(() => setCurrentStep(1), 3000);
        const timer2 = setTimeout(() => setCurrentStep(2), 6500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    return (
        <div className="card p-6 border-dashed border-border/80 bg-slate-50/50 flex flex-col justify-center min-h-[300px]">
            <div className="space-y-4 max-w-[260px] mx-auto w-full">
                {steps.map((step, idx) => {
                    const isActive = idx === currentStep;
                    const isCompleted = idx < currentStep;
                    const isPending = idx > currentStep;

                    return (
                        <div key={idx} className={`flex items-start gap-3 transition-opacity duration-500 ${isPending ? 'opacity-20' : 'opacity-100'}`}>
                            {isActive ? (
                                <div className="mt-0.5">
                                    <svg className="animate-spin text-primary" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                    </svg>
                                </div>
                            ) : isCompleted ? (
                                <div className="mt-0.5 text-green-500 flex-shrink-0 animate-pulse">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                </div>
                            ) : (
                                <div className="mt-0.5 text-slate-300 flex-shrink-0">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                    </svg>
                                </div>
                            )}
                            <span className={`text-sm ${isActive ? 'text-primary font-medium' : isCompleted ? 'text-foreground font-medium' : 'text-muted'}`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
            {currentStep === 2 && (
                <p className="text-center text-xs text-muted mt-6 animate-pulse">
                    This can take up to 20 seconds.
                </p>
            )}
        </div>
    );
}
