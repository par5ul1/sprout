import { useQueryState } from "nuqs";
import { useCallback } from "react";
import type { SearchFilters } from "@/types/github";

const DEFAULT_FILTERS: SearchFilters = {
  languages: [],
  dateRange: { from: null, to: null },
  sortBy: "created",
  sortOrder: "desc",
  page: 1,
  perPage: 30,
};

const KEYS = {
  languages: "l",
  dateRange: "d",
  sortBy: "s",
  sortOrder: "o",
  page: "p",
  perPage: "pp",
};

const serializeFilters = (filters: SearchFilters): string => {
  const parts: string[] = [];

  if (filters.languages.length > 0) {
    parts.push(`${KEYS.languages}:${filters.languages.join(",")}`);
  }

  const fromDate = filters.dateRange.from?.toISOString().split("T")[0] || "";
  const toDate = filters.dateRange.to?.toISOString().split("T")[0] || "";
  if (fromDate || toDate) {
    parts.push(`${KEYS.dateRange}:${fromDate},${toDate}`);
  }

  if (filters.sortBy !== "created") {
    parts.push(`${KEYS.sortBy}:${filters.sortBy}`);
  }

  if (filters.sortOrder !== "desc") {
    parts.push(`${KEYS.sortOrder}:${filters.sortOrder}`);
  }

  if (filters.page !== 1) {
    parts.push(`${KEYS.page}:${filters.page}`);
  }

  if (filters.perPage !== 30) {
    parts.push(`${KEYS.perPage}:${filters.perPage}`);
  }

  return parts.join("+");
};

const parseFilters = (value: string): SearchFilters => {
  if (!value) return DEFAULT_FILTERS;

  const filters = { ...DEFAULT_FILTERS };
  const parts = value.split("+");

  for (const part of parts) {
    const [key, value] = part.split(":");
    if (!value) continue;

    switch (key) {
      case KEYS.languages: {
        filters.languages = value.split(",").filter(Boolean);
        break;
      }
      case KEYS.dateRange: {
        const [from, to] = value.split(",");
        filters.dateRange.from = from ? new Date(from) : null;
        filters.dateRange.to = to ? new Date(to) : null;
        break;
      }
      case KEYS.sortBy: {
        filters.sortBy = value as SearchFilters["sortBy"];
        break;
      }
      case KEYS.sortOrder: {
        filters.sortOrder = value as SearchFilters["sortOrder"];
        break;
      }
      case KEYS.page: {
        filters.page = parseInt(value, 10);
        break;
      }
      case "pp": {
        filters.perPage = parseInt(value, 10);
        break;
      }
    }
  }

  return filters;
};

export function useSearchFilters() {
  const [filters, setFilters] = useQueryState<SearchFilters>("filters", {
    defaultValue: DEFAULT_FILTERS,
    parse: parseFilters,
    serialize: serializeFilters,
  });

  const updateFilters = useCallback(
    (newFilters: Partial<SearchFilters>) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
        dateRange: {
          from: newFilters.dateRange?.from ?? prev.dateRange.from,
          to: newFilters.dateRange?.to ?? prev.dateRange.to,
        },
      }));
    },
    [setFilters]
  );

  return { filters, updateFilters, setFilters };
}
