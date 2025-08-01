import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	isLoading?: boolean;
}

export function Pagination({
	currentPage,
	totalPages,
	onPageChange,
	isLoading = false,
}: PaginationProps) {
	if (totalPages <= 1) {
		return null;
	}

	const handlePageChange = (page: number) => {
		onPageChange(page);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const getVisiblePages = () => {
		const delta = 2;
		const range = [];
		const rangeWithDots = [];

		for (
			let i = Math.max(2, currentPage - delta);
			i <= Math.min(totalPages - 1, currentPage + delta);
			i++
		) {
			range.push(i);
		}

		if (currentPage - delta > 2) {
			rangeWithDots.push(1, '...');
		} else {
			rangeWithDots.push(1);
		}

		rangeWithDots.push(...range);

		if (currentPage + delta < totalPages - 1) {
			rangeWithDots.push('...', totalPages);
		} else {
			rangeWithDots.push(totalPages);
		}

		return rangeWithDots;
	};

	const visiblePages = getVisiblePages();

	return (
		<div className="flex items-center justify-center gap-2">
			<Button
				variant="outline"
				size="sm"
				onClick={() => handlePageChange(currentPage - 1)}
				disabled={currentPage === 1 || isLoading}
			>
				<ChevronLeft className="h-4 w-4" />
				<span className="sr-only">Previous page</span>
			</Button>

			{visiblePages.map((page) => (
				<div key={page === '...' ? `dots-${Math.random()}` : `page-${page}`}>
					{page === '...' ? (
						<span className="px-2 py-1 text-muted-foreground text-sm">...</span>
					) : (
						<Button
							variant={page === currentPage ? 'default' : 'outline'}
							size="sm"
							onClick={() => handlePageChange(page as number)}
							disabled={isLoading}
							className="min-w-[2.5rem]"
						>
							{page}
						</Button>
					)}
				</div>
			))}

			<Button
				variant="outline"
				size="sm"
				onClick={() => handlePageChange(currentPage + 1)}
				disabled={currentPage === totalPages || isLoading}
			>
				<ChevronRight className="h-4 w-4" />
				<span className="sr-only">Next page</span>
			</Button>
		</div>
	);
}
