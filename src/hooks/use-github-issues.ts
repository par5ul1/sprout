import { Octokit } from 'octokit';
import { useEffect, useState } from 'react';
import { sessionCache } from '@/lib/cache';
import type { GitHubIssue, SearchFilters } from '@/types/github';

export function useGitHubIssues(filters: SearchFilters) {
	const [issues, setIssues] = useState<GitHubIssue[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [totalCount, setTotalCount] = useState(0);

	useEffect(() => {
		const fetchIssues = async () => {
			setIsLoading(true);
			setError(null);

			const cachedResult = sessionCache.get<{
				issues: GitHubIssue[];
				totalCount: number;
			}>(filters);
			if (cachedResult) {
				setIssues(cachedResult.issues);
				setTotalCount(cachedResult.totalCount);
				setIsLoading(false);
				return;
			}

			try {
				const octokit = new Octokit();

				// Build search query
				let query = 'is:issue is:open label:"good first issue"';

				if (filters.languages && filters.languages.length > 0) {
					const languageQuery = filters.languages
						.map((lang) => `language:"${lang}"`)
						.join(' OR ');
					query += ` (${languageQuery})`;
				}

				// Add date range filters
				if (filters.dateRange.from) {
					const fromDate = filters.dateRange.from.toISOString().split('T')[0];
					query += ` created:${fromDate}`;
				}
				if (filters.dateRange.to) {
					const toDate = filters.dateRange.to.toISOString().split('T')[0];
					query += `..${toDate}`;
				}

				const sort = filters.sortBy || 'created';
				const order = filters.sortOrder || 'desc';
				const page = filters.page || 1;
				const perPage = filters.perPage || 30;

				const response = await octokit.request('GET /search/issues', {
					q: query,
					sort,
					order,
					per_page: perPage,
					page,
					advanced_search: 'true',
				});

				const issues = response.data.items;
				const totalCount = response.data.total_count;

				sessionCache.set(filters, { issues, totalCount });

				setIssues(issues);
				setTotalCount(totalCount);
			} catch (err) {
				console.error('Error fetching GitHub issues:', err);

				if (err instanceof Error) {
					const errorMessage = err.message.toLowerCase();
					if (
						errorMessage.includes('rate limit') ||
						errorMessage.includes('403') ||
						errorMessage.includes('too many requests') ||
						errorMessage.includes('exceeded')
					) {
						setError(
							"You've hit the GitHub API rate limit. This resets after an hour. Please come back later.",
						);
					} else {
						setError(err.message);
					}
				} else {
					setError('Failed to fetch issues');
				}

				setIssues([]);
				setTotalCount(0);
			} finally {
				setIsLoading(false);
			}
		};

		fetchIssues();
	}, [filters]);

	return { issues, isLoading, error, totalCount };
}
