import type { Endpoints } from '@octokit/types';

export interface SearchFilters {
	languages: string[];
	dateRange: {
		from: Date | null;
		to: Date | null;
	};
	sortBy?: 'created' | 'updated' | 'comments' | 'reactions';
	sortOrder?: 'asc' | 'desc';
	page?: number;
	perPage?: number;
}

// Infer the GitHub Issue type from the Octokit SDK for the search issues endpoint
export type GitHubIssue =
	Endpoints['GET /search/issues']['response']['data']['items'][0];
