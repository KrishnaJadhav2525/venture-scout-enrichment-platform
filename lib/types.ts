export interface Signal {
  date: string;
  text: string;
  isAI?: boolean;
}

export interface EnrichedSignal {
  text: string;
  type: 'positive' | 'neutral' | 'risk';
  reasoning: string;
}

export interface EnrichedData {
  summary: string;
  whatTheyDo: string[];
  keywords: string[];
  signals: (string | EnrichedSignal)[];
  source: string;
  scrapedAt: string;
  thesisMatch?: {
    score: number;
    reasoning: string;
  };
}

export interface Company {
  id: string;
  name: string;
  website: string;
  industry: string;
  stage: string;
  location: string;
  founded: number;
  headcount: string;
  description: string;
  tags: string[];
  signals: Signal[];
  enriched: EnrichedData | null;
  match?: number;
}

export interface VCList {
  id: string;
  name: string;
  createdAt: string;
  companyIds: string[];
}

export interface SavedSearch {
  id: string;
  query: string;
  filters: {
    industry?: string;
    stage?: string;
    location?: string;
    headcount?: string;
  };
  savedAt: string;
}

export type SortField = 'name' | 'industry' | 'stage' | 'location' | 'founded' | 'match';
export type SortDirection = 'asc' | 'desc';
