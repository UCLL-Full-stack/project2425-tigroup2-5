import apiClient from './apiClient';

/**
 * Types for search options and results
 */
export interface SearchOptions {
  offset?: number;
  limit?: number;
  sort?: string;
  type?: 'member' | 'club' | 'employee';
}

export interface SearchResult {
  total: number;
  results: any[];
  facets?: any;
}

/**
 * Convert search params to URL query string
 */
const buildQueryString = (query: string, options: SearchOptions = {}): string => {
  const params = new URLSearchParams();
  params.append('q', query);
  
  if (options.offset !== undefined) {
    params.append('offset', options.offset.toString());
  }
  if (options.limit !== undefined) {
    params.append('limit', options.limit.toString());
  }
  if (options.sort) {
    params.append('sort', options.sort);
  }
  if (options.type) {
    params.append('type', options.type);
  }
  
  return `?${params.toString()}`;
};

/**
 * Search across all entities
 */
const search = async (query: string, options: SearchOptions = {}): Promise<SearchResult> => {
  try {
    const queryString = buildQueryString(query, options);
    const response = await apiClient.get<SearchResult>(`/search${queryString}`);
    return response;
  } catch (error) {
    console.error('Search error:', error);
    throw new Error('Search failed');
  }
};

/**
 * Search for members
 */
const searchMembers = async (query: string, options: SearchOptions = {}): Promise<SearchResult> => {
  try {
    const queryString = buildQueryString(query, options);
    const response = await apiClient.get<SearchResult>(`/search/members${queryString}`);
    return response;
  } catch (error) {
    console.error('Member search error:', error);
    throw new Error('Member search failed');
  }
};

/**
 * Search for clubs
 */
const searchClubs = async (query: string, options: SearchOptions = {}): Promise<SearchResult> => {
  try {
    const queryString = buildQueryString(query, options);
    const response = await apiClient.get<SearchResult>(`/search/clubs${queryString}`);
    return response;
  } catch (error) {
    console.error('Club search error:', error);
    throw new Error('Club search failed');
  }
};

/**
 * Search for employees
 */
const searchEmployees = async (query: string, options: SearchOptions = {}): Promise<SearchResult> => {
  try {
    const queryString = buildQueryString(query, options);
    const response = await apiClient.get<SearchResult>(`/search/employees${queryString}`);
    return response;
  } catch (error) {
    console.error('Employee search error:', error);
    throw new Error('Employee search failed');
  }
};

/**
 * Trigger reindexing (admin only)
 */
const reindexAll = async (): Promise<void> => {
  try {
    await apiClient.post('/search/reindex', {});
  } catch (error) {
    console.error('Reindex error:', error);
    throw new Error('Reindexing failed');
  }
};

export default {
  search,
  searchMembers,
  searchClubs,
  searchEmployees,
  reindexAll
};