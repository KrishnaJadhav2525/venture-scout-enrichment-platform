import { VCList, SavedSearch, EnrichedData } from './types';

// ─── Lists ──────────────────────────────────────────────
const LISTS_KEY = 'vc_lists';

export function getLists(): VCList[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(LISTS_KEY);
    return raw ? JSON.parse(raw) : [];
}

export function saveLists(lists: VCList[]) {
    localStorage.setItem(LISTS_KEY, JSON.stringify(lists));
}

export function createList(name: string): VCList {
    const lists = getLists();
    const newList: VCList = {
        id: crypto.randomUUID(),
        name,
        createdAt: new Date().toISOString(),
        companyIds: [],
    };
    lists.push(newList);
    saveLists(lists);
    return newList;
}

export function deleteList(listId: string) {
    const lists = getLists().filter((l) => l.id !== listId);
    saveLists(lists);
}

export function addCompanyToList(listId: string, companyId: string) {
    const lists = getLists();
    const list = lists.find((l) => l.id === listId);
    if (list && !list.companyIds.includes(companyId)) {
        list.companyIds.push(companyId);
        saveLists(lists);
    }
}

export function removeCompanyFromList(listId: string, companyId: string) {
    const lists = getLists();
    const list = lists.find((l) => l.id === listId);
    if (list) {
        list.companyIds = list.companyIds.filter((id) => id !== companyId);
        saveLists(lists);
    }
}

// ─── Saved Searches ─────────────────────────────────────
const SEARCHES_KEY = 'vc_saved_searches';

export function getSavedSearches(): SavedSearch[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(SEARCHES_KEY);
    return raw ? JSON.parse(raw) : [];
}

export function saveSavedSearches(searches: SavedSearch[]) {
    localStorage.setItem(SEARCHES_KEY, JSON.stringify(searches));
}

export function saveSearch(query: string, filters: SavedSearch['filters']): SavedSearch {
    const searches = getSavedSearches();
    const newSearch: SavedSearch = {
        id: crypto.randomUUID(),
        query,
        filters,
        savedAt: new Date().toISOString(),
    };
    searches.push(newSearch);
    saveSavedSearches(searches);
    return newSearch;
}

export function deleteSavedSearch(searchId: string) {
    const searches = getSavedSearches().filter((s) => s.id !== searchId);
    saveSavedSearches(searches);
}

// ─── Notes ──────────────────────────────────────────────
export function getNote(companyId: string): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(`note_${companyId}`) || '';
}

export function saveNote(companyId: string, content: string) {
    localStorage.setItem(`note_${companyId}`, content);
}

// ─── Enrichment Cache ───────────────────────────────────
export function getCachedEnrichment(companyId: string): EnrichedData | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(`enrich_${companyId}`);
    return raw ? JSON.parse(raw) : null;
}

export function cacheEnrichment(companyId: string, data: EnrichedData) {
    localStorage.setItem(`enrich_${companyId}`, JSON.stringify(data));
}
