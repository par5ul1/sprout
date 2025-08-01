import { Calendar, GitBranch, MessageSquare, Star, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { GitHubIssue } from '@/types/github';
import { Skeleton } from './ui/skeleton';

interface IssueCardProps {
	issue: GitHubIssue;
}

export function IssueCard({ issue }: IssueCardProps) {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	const getRepositoryName = (repositoryUrl: string) => {
		const parts = repositoryUrl.split('/');
		return `${parts[parts.length - 2]}/${parts[parts.length - 1]}`;
	};

	return (
		<a
			href={issue.html_url}
			target="_blank"
			rel="noopener noreferrer"
			className="block h-full"
		>
			<Card className="h-full w-full transition-colors duration-300 ease-in-out hover:bg-muted/50">
				<CardHeader className="pb-3">
					<CardTitle className="truncate text-xl leading-tight">
						{issue.title}
					</CardTitle>
					<div className="flex flex-col gap-4 text-muted-foreground text-sm">
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-1">
								<GitBranch className="h-4 w-4" />
								<span className="text-sm">
									{getRepositoryName(issue.repository_url)}
								</span>
							</div>
							{issue.user && (
								<div className="flex items-center gap-1">
									<User className="h-4 w-4" />
									<span>{issue.user.login}</span>
								</div>
							)}
						</div>

						<div className="flex items-center gap-4">
							<div className="flex items-center gap-1">
								<Calendar className="h-4 w-4" />
								<span>{formatDate(issue.created_at)}</span>
							</div>
							<div className="flex items-center gap-1">
								<MessageSquare className="h-4 w-4" />
								<span>{issue.comments}</span>
							</div>
							{issue.reactions && (
								<div className="flex items-center gap-1">
									<Star className="h-4 w-4" />
									<span>{issue.reactions.total_count}</span>
								</div>
							)}
						</div>

						{issue.labels.length > 0 && (
							<div className="flex flex-wrap gap-1">
								{issue.labels
									.filter((label) => label.name !== 'good first issue')
									.slice(0, 3)
									.map((label) => (
										<Badge
											key={label.id}
											variant="outline"
											className="text-xs"
											style={{
												backgroundColor: `#${label.color}30`,
												borderColor: `#${label.color}`,
												color: `#${label.color}`,
											}}
										>
											{label.name}
										</Badge>
									))}
								{issue.labels.length > 3 && (
									<Badge variant="outline" className="text-xs">
										+{issue.labels.length - 3} more
									</Badge>
								)}
							</div>
						)}
					</div>
				</CardHeader>
				<CardContent className="mt-auto pt-0">
					<div className="relative flex h-48 flex-col gap-2 overflow-hidden rounded-md bg-muted p-4 text-muted-foreground text-sm">
						<div className="overflow-auto">
							{issue.body ? (
								<ReactMarkdown
									remarkPlugins={[remarkGfm]}
									components={{
										h1: ({ children }) => (
											<span className="font-semibold">{children}</span>
										),
										h2: ({ children }) => (
											<span className="font-semibold">{children}</span>
										),
										h3: ({ children }) => (
											<span className="font-semibold">{children}</span>
										),
										h4: ({ children }) => (
											<span className="font-semibold">{children}</span>
										),
										h5: ({ children }) => (
											<span className="font-semibold">{children}</span>
										),
										h6: ({ children }) => (
											<span className="font-semibold">{children}</span>
										),
										code: ({ children }) => (
											<code className="rounded bg-muted-foreground/10 px-1 py-0.5 font-mono text-xs">
												{children}
											</code>
										),
										blockquote: ({ children }) => (
											<div className="border-muted-foreground/20 border-l-2 pl-2 italic">
												{children}
											</div>
										),
										ul: ({ children }) => (
											<ul className="list-inside list-disc space-y-1">
												{children}
											</ul>
										),
										ol: ({ children }) => (
											<ol className="list-inside list-decimal space-y-1">
												{children}
											</ol>
										),
										li: ({ children }) => (
											<li className="[&>p]:contents">{children}</li>
										),
										a: ({ children }) => (
											<span className="text-blue-600 underline dark:text-blue-400">
												{children}
											</span>
										),
									}}
								>
									{issue.body}
								</ReactMarkdown>
							) : (
								<span className="text-muted-foreground">No description</span>
							)}
						</div>
						<div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-muted to-transparent" />
					</div>
				</CardContent>
			</Card>
		</a>
	);
}

/* TODO: Add a skeleton for the issue card */
export function IssueCardSkeleton() {
	return (
		<Card className="h-full w-full">
			<CardHeader className="pb-3">
				<Skeleton className="h-6 w-2/3" />
				<Skeleton className="mt-0.5 h-5 w-1/3" />
				<Skeleton className="mt-3 h-5 w-1/2" />
				<div className="mt-2 flex items-center gap-1">
					<Skeleton className="h-5 w-12" />
					<Skeleton className="h-5 w-24" />
				</div>
			</CardHeader>
			<CardContent className="mt-auto pt-0">
				<Skeleton className="h-48 w-full" />
			</CardContent>
		</Card>
	);
}
