import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';
import type { SearchFilters } from '@/types/github';

export function useSearchFilters() {
	const [languages, setLanguages] = useQueryState<Array<string>>('languages', {
		defaultValue: [],
		parse: (value) => value.split(',').filter(Boolean),
		serialize: (value) => value.join(','),
	});

	const [fromDate, setFromDate] = useQueryState<Date | null>('from', {
		defaultValue: null,
		parse: (value) => (value ? new Date(value) : null),
		serialize: (value) => (value ? value.toISOString().split('T')[0] : ''),
	});

	const [toDate, setToDate] = useQueryState<Date | null>('to', {
		defaultValue: null,
		parse: (value) => (value ? new Date(value) : null),
		serialize: (value) => (value ? value.toISOString().split('T')[0] : ''),
	});

	const [sortBy, setSortBy] = useQueryState<
		'created' | 'updated' | 'comments' | 'reactions'
	>('sortBy', {
		defaultValue: 'created',
		parse: (value) => value as 'created' | 'updated' | 'comments' | 'reactions',
		serialize: (value) => value,
	});

	const [sortOrder, setSortOrder] = useQueryState<'asc' | 'desc'>('sortOrder', {
		defaultValue: 'desc',
		parse: (value) => value as 'asc' | 'desc',
		serialize: (value) => value,
	});

	const [page, setPage] = useQueryState<number>('page', {
		defaultValue: 1,
		parse: (value) => parseInt(value, 10),
		serialize: (value) => value.toString(),
	});

	const [perPage, setPerPage] = useQueryState<number>('perPage', {
		defaultValue: 30,
		parse: (value) => parseInt(value, 10),
		serialize: (value) => value.toString(),
	});

	const filters: SearchFilters = useMemo(
		() => ({
			languages,
			dateRange: {
				from: fromDate,
				to: toDate,
			},
			sortBy,
			sortOrder,
			page,
			perPage,
		}),
		[languages, fromDate, toDate, sortBy, sortOrder, page, perPage],
	);

	const updateFilters = useCallback(
		(newFilters: Partial<SearchFilters>) => {
			if (newFilters.languages !== undefined) {
				setLanguages(newFilters.languages);
			}
			if (newFilters.dateRange?.from !== undefined) {
				setFromDate(
					newFilters.dateRange.from ? newFilters.dateRange.from : null,
				);
			}
			if (newFilters.dateRange?.to !== undefined) {
				setToDate(newFilters.dateRange.to ? newFilters.dateRange.to : null);
			}
			if (newFilters.sortBy !== undefined) {
				setSortBy(newFilters.sortBy);
			}
			if (newFilters.sortOrder !== undefined) {
				setSortOrder(newFilters.sortOrder);
			}
			if (newFilters.page !== undefined) {
				setPage(newFilters.page);
			}
			if (newFilters.perPage !== undefined) {
				setPerPage(newFilters.perPage);
			}
		},
		[
			setLanguages,
			setFromDate,
			setToDate,
			setSortBy,
			setSortOrder,
			setPage,
			setPerPage,
		],
	);

	const setFilters = useCallback(
		(newFilters: SearchFilters) => {
			setLanguages(newFilters.languages);
			setFromDate(newFilters.dateRange.from ? newFilters.dateRange.from : null);
			setToDate(newFilters.dateRange.to ? newFilters.dateRange.to : null);
			setSortBy(newFilters.sortBy || 'created');
			setSortOrder(newFilters.sortOrder || 'desc');
			setPage(newFilters.page || 1);
			setPerPage(newFilters.perPage || 30);
		},
		[
			setLanguages,
			setFromDate,
			setToDate,
			setSortBy,
			setSortOrder,
			setPage,
			setPerPage,
		],
	);

	return {
		filters,
		updateFilters,
		setFilters,
	};
}
