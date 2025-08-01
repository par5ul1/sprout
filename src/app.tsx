import { useState } from "react";
import { FilterChips } from "./components/filter-chips";
import { IssuesGrid } from "./components/issues-grid";
import Logo from "./components/logo";
import { Pagination } from "./components/pagination";
import { ThemeToggle } from "./components/theme-toggle";
import { useGitHubIssues } from "./hooks/use-github-issues";
import type { SearchFilters } from "./types/github";

export function App() {
  const [filters, setFilters] = useState<SearchFilters>({
    languages: ["JavaScript", "TypeScript"],
    dateRange: {
      from: null,
      to: null,
    },
    page: 1,
    perPage: 30,
  });

  const { issues, isLoading, error, totalCount } = useGitHubIssues(filters);

  const totalPages = Math.ceil(totalCount / (filters.perPage || 30));

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-24 items-center justify-between">
            <Logo />
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Header with Filter Chips */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-baseline gap-4">
              <h2 className="font-bold text-2xl text-foreground">Issues</h2>
              {totalCount > 0 && (
                <span className="text-muted-foreground text-sm">
                  {totalCount.toLocaleString()} results
                </span>
              )}
            </div>
            <FilterChips filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <p className="text-destructive text-sm">Error: {error}</p>
            </div>
          )}

          {/* Issues List */}
          <IssuesGrid issues={issues} isLoading={isLoading} />

          {/* Pagination */}
          {!isLoading && issues.length > 0 && (
            <div className="flex justify-center pt-6">
              <Pagination
                currentPage={filters.page || 1}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
