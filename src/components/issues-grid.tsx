import type { GitHubIssue } from '@/types/github';
import { IssueCard, IssueCardSkeleton } from './issue-card';

interface IssuesGridProps {
	issues: GitHubIssue[];
	isLoading: boolean;
}

export function IssuesGrid({ issues, isLoading }: IssuesGridProps) {
	if (!isLoading && issues.length === 0) {
		return (
			<div className="py-8 text-center">
				<h3 className="font-medium text-lg text-muted-foreground">
					No issues found
				</h3>
				<p className="text-muted-foreground text-sm">
					Try adjusting your search filters
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2">
			{isLoading
				? Array.from({ length: 30 }, (_, i) => (
						<IssueCardSkeleton
							key={`issue-card-skeleton-${
								// biome-ignore lint/suspicious/noArrayIndexKey: Skeleton key
								i
							}`}
						/>
					))
				: issues.map((issue) => <IssueCard key={issue.id} issue={issue} />)}
		</div>
	);
}
