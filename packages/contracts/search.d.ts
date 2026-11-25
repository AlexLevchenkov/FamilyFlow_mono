export interface GlobalSearchParams {
  query: string;
}

export interface GlobalSearchResult {
  id: number;
  title: string;
  date: Date | null;
}

export interface GlobalSearchResponse {
  tasks: GlobalSearchResult[];
  goals: GlobalSearchResult[];
  events: GlobalSearchResult[];
}
