import {
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import {
  ArrowDownNarrowWide,
  ArrowDownWideNarrow,
  Calendar,
  Check,
  Plus,
  Terminal,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SearchFilters } from "@/types/github";

type FilterProps = {
  filters: SearchFilters;
  updateFilters: (filters: Partial<SearchFilters>) => void;
};

export function Filters({ filters, updateFilters }: FilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <LanguageFilter filters={filters} updateFilters={updateFilters} />
      <DateRangeFilter filters={filters} updateFilters={updateFilters} />
      <SortFilter filters={filters} updateFilters={updateFilters} />
    </div>
  );
}

const PRESET_LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "Dart",
  "R",
  "Scala",
  "Elixir",
];
function LanguageFilter({ filters, updateFilters }: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  const addLanguage = (language: string) => {
    if (language.trim() && !filters.languages.includes(language.trim())) {
      updateFilters({
        languages: [...filters.languages, language.trim()],
        page: 1,
      });
      setInput("");
    }
  };

  const removeLanguage = (language: string) => {
    updateFilters({
      languages: filters.languages.filter((l) => l !== language),
      page: 1,
    });
  };

  const getChipText = () => {
    if (filters.languages.length === 0) return "Languages";
    if (filters.languages.length === 1)
      return <span className="font-bold">{filters.languages[0]}</span>;
    return (
      <span className="font-bold">{filters.languages.length} Languages</span>
    );
  };

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setInput("");
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2 text-sm">
          <Terminal className="h-4 w-4" />
          {getChipText()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Command>
          <div className="flex items-center border-b px-3">
            <CommandInput
              placeholder="Search languages..."
              className="flex-1"
              value={input}
              onValueChange={setInput}
            />
          </div>
          <CommandList className="max-h-60">
            {input.trim() && !filters.languages.includes(input.trim()) && (
              <CommandGroup heading="Add Custom">
                <CommandItem
                  onSelect={() => addLanguage(input)}
                  className="font-medium"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add "{input.trim()}"
                </CommandItem>
              </CommandGroup>
            )}

            <CommandEmpty>
              <div className="py-6 text-center text-muted-foreground text-sm">
                No languages found
              </div>
            </CommandEmpty>

            {filters.languages.length > 0 && (
              <CommandGroup heading="Selected">
                {filters.languages.map((language) => (
                  <CommandItem
                    key={language}
                    className="justify-between"
                    onSelect={() => removeLanguage(language)}
                  >
                    <div className="flex items-center">
                      <Check className="mr-2 h-4 w-4" />
                      {language}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {PRESET_LANGUAGES.filter(
              (lang) => !filters.languages.includes(lang)
            ).length > 0 && (
              <CommandGroup heading="Popular">
                {PRESET_LANGUAGES.filter(
                  (lang) => !filters.languages.includes(lang)
                ).map((language) => (
                  <CommandItem
                    key={language}
                    onSelect={() => {
                      addLanguage(language);
                      setInput("");
                    }}
                  >
                    {language}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

const DATE_PRESETS = [
  { label: "Today", getRange: () => ({ from: new Date(), to: new Date() }) },
  {
    label: "Yesterday",
    getRange: () => ({
      from: subDays(new Date(), 1),
      to: subDays(new Date(), 1),
    }),
  },
  {
    label: "This Week",
    getRange: () => ({
      from: startOfWeek(new Date()),
      to: endOfWeek(new Date()),
    }),
  },
  {
    label: "Last Week",
    getRange: () => ({
      from: startOfWeek(subWeeks(new Date(), 1)),
      to: endOfWeek(subWeeks(new Date(), 1)),
    }),
  },
  {
    label: "This Month",
    getRange: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
  },
  {
    label: "Last Month",
    getRange: () => ({
      from: startOfMonth(subMonths(new Date(), 1)),
      to: endOfMonth(subMonths(new Date(), 1)),
    }),
  },
  {
    label: "This Year",
    getRange: () => ({ from: startOfYear(new Date()), to: new Date() }),
  },
];
function DateRangeFilter({ filters, updateFilters }: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setFromInput(
      filters.dateRange.from ? format(filters.dateRange.from, "yyyy-MM-dd") : ""
    );
    setToInput(
      filters.dateRange.to ? format(filters.dateRange.to, "yyyy-MM-dd") : ""
    );
  }, [filters.dateRange.from, filters.dateRange.to]);

  const handleDateSelect = (date: Date | undefined, type: "from" | "to") => {
    updateFilters({
      dateRange: {
        ...filters.dateRange,
        [type]: date || null,
      },
      page: 1,
    });
    setError("");
  };

  const handleDateInputBlur = (value: string, type: "from" | "to") => {
    setError("");

    if (!value) {
      handleDateSelect(undefined, type);
      return;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return;

    if (
      type === "to" &&
      filters.dateRange.from &&
      isBefore(date, filters.dateRange.from)
    ) {
      setToInput("");
      setError("End date cannot be before start date");
      return;
    }

    if (
      type === "from" &&
      filters.dateRange.to &&
      isAfter(date, filters.dateRange.to)
    ) {
      setFromInput("");
      setError("Start date cannot be after end date");
      return;
    }

    handleDateSelect(date, type);
  };

  const clearDateRange = () => {
    updateFilters({
      dateRange: { from: null, to: null },
      page: 1,
    });
    setFromInput("");
    setToInput("");
    setError("");
  };

  const clearIndividualDate = (type: "from" | "to") => {
    updateFilters({
      dateRange: {
        ...filters.dateRange,
        [type]: null,
      },
      page: 1,
    });
    if (type === "from") {
      setFromInput("");
    } else {
      setToInput("");
    }
    setError("");
  };

  const setDateRangePreset = (from: Date, to: Date) => {
    updateFilters({
      dateRange: { from, to },
      page: 1,
    });
    setError("");
  };

  const getChipText = () => {
    const getFormat = (date: Date) => {
      const currentYear = new Date().getFullYear();
      const dateYear = date.getFullYear();
      return dateYear !== currentYear ? "MMM d, yyyy" : "MMM d";
    };

    if (!filters.dateRange.from && !filters.dateRange.to) return "Date Range";
    if (filters.dateRange.from && filters.dateRange.to) {
      return `${format(
        filters.dateRange.from,
        getFormat(filters.dateRange.from)
      )} - ${format(filters.dateRange.to, getFormat(filters.dateRange.to))}`;
    }
    if (filters.dateRange.from) {
      return `From ${format(
        filters.dateRange.from,
        getFormat(filters.dateRange.from)
      )}`;
    }
    if (filters.dateRange.to) {
      return `Until ${format(
        filters.dateRange.to,
        getFormat(filters.dateRange.to)
      )}`;
    }
    return "Date Range";
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2 text-sm">
          <Calendar className="h-4 w-4" />
          {getChipText()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto max-w-[90vw] p-0" align="end">
        <div className="w-full space-y-4 p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Date Range</h4>
            <Button
              size="sm"
              variant="ghost"
              onClick={clearDateRange}
              disabled={!filters.dateRange.from && !filters.dateRange.to}
            >
              Clear All
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
            <div className="flex w-full min-w-0 flex-col gap-2">
              <span className="text-muted-foreground text-xs">Presets</span>
              <div className="flex w-full min-w-0 gap-2 overflow-auto sm:flex-col">
                {DATE_PRESETS.map((preset) => (
                  <Button
                    key={preset.label}
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const range = preset.getRange();
                      setDateRangePreset(range.from, range.to);
                    }}
                    className="text-xs"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {(["from", "to"] as const).map((type) => (
                <div key={type}>
                  <label
                    htmlFor={`date-${type}-manual`}
                    className="text-muted-foreground text-xs"
                  >
                    {type === "from" ? "From" : "To"}
                  </label>
                  <div className="relative">
                    <Input
                      id={`date-${type}-manual`}
                      type="date"
                      value={type === "from" ? fromInput : toInput}
                      onChange={(e) =>
                        type === "from"
                          ? setFromInput(e.target.value)
                          : setToInput(e.target.value)
                      }
                      onBlur={(e) => handleDateInputBlur(e.target.value, type)}
                      placeholder="YYYY-MM-DD"
                      className="pr-16 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-clear-button]:hidden [&::-webkit-inner-spin-button]:hidden"
                    />
                    {filters.dateRange[type] && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => clearIndividualDate(type)}
                        className="absolute top-0 right-8 h-full px-2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                    <DatePickerButton
                      date={filters.dateRange[type]}
                      defaultMonth={filters.dateRange.from || undefined}
                      onSelect={(date) => {
                        handleDateSelect(date, type);
                      }}
                      disabled={
                        type === "to" && filters.dateRange.from
                          ? (date: Date) =>
                              // biome-ignore lint/style/noNonNullAssertion: confirmed by the type
                              isBefore(date, filters.dateRange.from!)
                          : undefined
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="pb-2 text-destructive text-xs">{error}</div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
function DatePickerButton({
  date,
  defaultMonth,
  onSelect,
  disabled,
}: {
  date: Date | null;
  defaultMonth: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-0 right-0 h-full px-3 text-muted-foreground hover:text-foreground"
        >
          <Calendar className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent
          mode="single"
          selected={date || undefined}
          defaultMonth={defaultMonth}
          onSelect={(date) => {
            onSelect(date);
            setIsOpen(false);
          }}
          className="rounded-md border"
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}

const SORT_OPTIONS = [
  { value: "oldest", label: "Oldest", sortBy: "created", sortOrder: "asc" },
  { value: "latest", label: "Latest", sortBy: "created", sortOrder: "desc" },
  {
    value: "most-comments",
    label: "Most Comments",
    sortBy: "comments",
    sortOrder: "desc",
  },
  {
    value: "least-comments",
    label: "Least Comments",
    sortBy: "comments",
    sortOrder: "asc",
  },
] as const;
function SortFilter({ filters, updateFilters }: FilterProps) {
  const handleSortChange = (value: string) => {
    const sortOption = SORT_OPTIONS.find((opt) => opt.value === value);
    if (!sortOption) return;
    updateFilters({
      sortBy: sortOption.sortBy,
      sortOrder: sortOption.sortOrder,
      page: 1,
    });
  };

  const currentSort = SORT_OPTIONS.find(
    (option) =>
      option.sortBy === filters.sortBy && option.sortOrder === filters.sortOrder
  );

  return (
    <Select
      value={`${filters.sortBy}-${filters.sortOrder}`}
      onValueChange={handleSortChange}
    >
      <SelectTrigger size="sm">
        {filters.sortOrder === "asc" ? (
          <ArrowDownNarrowWide className="h-4 w-4" />
        ) : (
          <ArrowDownWideNarrow className="h-4 w-4" />
        )}
        <SelectValue placeholder="Sort by">
          {currentSort?.label || "Sort by"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={`sort-option-${option.value}`} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
