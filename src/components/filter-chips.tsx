import { format } from 'date-fns';
import {
	ArrowDownNarrowWide,
	ArrowDownWideNarrow,
	Calendar,
	Check,
	Plus,
	Terminal,
	X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import type { SearchFilters } from '@/types/github';

interface FilterChipsProps {
	filters: SearchFilters;
	updateFilters: (filters: Partial<SearchFilters>) => void;
}

const PRESET_LANGUAGES = [
	'JavaScript',
	'TypeScript',
	'Python',
	'Java',
	'C++',
	'C#',
	'Go',
	'Rust',
	'PHP',
	'Ruby',
	'Swift',
	'Kotlin',
	'Dart',
	'R',
	'Scala',
	'Elixir',
];

const SORT_OPTIONS = [
	{ value: 'oldest', label: 'Oldest', sortBy: 'created', sortOrder: 'asc' },
	{ value: 'latest', label: 'Latest', sortBy: 'created', sortOrder: 'desc' },
	{
		value: 'most-comments',
		label: 'Most Comments',
		sortBy: 'comments',
		sortOrder: 'desc',
	},
	{
		value: 'least-comments',
		label: 'Least Comments',
		sortBy: 'comments',
		sortOrder: 'asc',
	},
] as const;

export function FilterChips({ filters, updateFilters }: FilterChipsProps) {
	const [languagesOpen, setLanguagesOpen] = useState(false);
	const [dateOpen, setDateOpen] = useState(false);
	const [fromCalendarOpen, setFromCalendarOpen] = useState(false);
	const [toCalendarOpen, setToCalendarOpen] = useState(false);
	const [languageInput, setLanguageInput] = useState('');
	const [fromDateInput, setFromDateInput] = useState('');
	const [toDateInput, setToDateInput] = useState('');
	const [dateRangeError, setDateRangeError] = useState('');

	// Sync local input state with filter state
	useEffect(() => {
		setFromDateInput(
			filters.dateRange.from
				? filters.dateRange.from.toISOString().split('T')[0]
				: '',
		);
		setToDateInput(
			filters.dateRange.to
				? filters.dateRange.to.toISOString().split('T')[0]
				: '',
		);
	}, [filters.dateRange.from, filters.dateRange.to]);

	const addLanguage = (language: string) => {
		if (language.trim() && !filters.languages.includes(language.trim())) {
			updateFilters({
				languages: [...filters.languages, language.trim()],
				page: 1,
			});
			setLanguageInput('');
		}
	};

	const removeLanguage = (language: string) => {
		updateFilters({
			languages: filters.languages.filter((l) => l !== language),
			page: 1,
		});
	};

	const handleSortChange = (value: string) => {
		const sortOption = SORT_OPTIONS.find((opt) => opt.value === value);
		if (!sortOption) return;
		updateFilters({
			sortBy: sortOption.sortBy,
			sortOrder: sortOption.sortOrder,
			page: 1,
		});
	};

	const handleDateSelect = (date: Date | undefined, type: 'from' | 'to') => {
		updateFilters({
			dateRange: {
				...filters.dateRange,
				[type]: date || null,
			},
			page: 1,
		});
		// Clear any errors when dates are set via calendar
		setDateRangeError('');
	};

	const handleDateInputBlur = (value: string, type: 'from' | 'to') => {
		// Clear any existing error
		setDateRangeError('');

		if (!value) {
			handleDateSelect(undefined, type);
			return;
		}

		// Create date in local timezone to avoid day offset issues
		const [year, month, day] = value.split('-').map(Number);
		const date = new Date(year, month - 1, day); // month is 0-indexed

		if (Number.isNaN(date.getTime())) {
			return;
		}

		// Validate date range constraints
		if (
			type === 'to' &&
			filters.dateRange.from &&
			date < filters.dateRange.from
		) {
			// Clear the invalid "to" date and show error
			setToDateInput('');
			setDateRangeError('End date cannot be before start date');
			return;
		}

		if (
			type === 'from' &&
			filters.dateRange.to &&
			date > filters.dateRange.to
		) {
			// Clear the invalid "from" date and show error
			setFromDateInput('');
			setDateRangeError('Start date cannot be after end date');
			return;
		}

		handleDateSelect(date, type);
	};

	const clearDateRange = () => {
		updateFilters({
			dateRange: { from: null, to: null },
			page: 1,
		});
		// Clear local input state and errors
		setFromDateInput('');
		setToDateInput('');
		setDateRangeError('');
	};

	const clearIndividualDate = (type: 'from' | 'to') => {
		updateFilters({
			dateRange: {
				...filters.dateRange,
				[type]: null,
			},
			page: 1,
		});
		// Clear local input state and errors
		if (type === 'from') {
			setFromDateInput('');
		} else {
			setToDateInput('');
		}
		setDateRangeError('');
	};

	const setDateRangePreset = (from: Date, to: Date) => {
		updateFilters({
			dateRange: { from, to },
			page: 1,
		});
		setDateRangeError('');
	};

	const getLanguagesChipText = () => {
		if (filters.languages.length === 0) return 'Languages';
		if (filters.languages.length === 1)
			return <span className="font-bold">{filters.languages[0]}</span>;
		return (
			<span className="font-bold">{filters.languages.length} Languages</span>
		);
	};

	const getDateChipText = () => {
		const getFormat = (date: Date) => {
			const currentYear = new Date().getFullYear();
			const dateYear = date.getFullYear();
			if (dateYear !== currentYear) {
				return 'MMM d, yyyy';
			}
			return 'MMM d';
		};

		if (!filters.dateRange.from && !filters.dateRange.to) return 'Date Range';
		if (filters.dateRange.from && filters.dateRange.to) {
			return `${format(
				filters.dateRange.from,
				getFormat(filters.dateRange.from),
			)} - ${format(filters.dateRange.to, getFormat(filters.dateRange.to))}`;
		}
		if (filters.dateRange.from) {
			return `From ${format(
				filters.dateRange.from,
				getFormat(filters.dateRange.from),
			)}`;
		}
		if (filters.dateRange.to) {
			return `Until ${format(
				filters.dateRange.to,
				getFormat(filters.dateRange.to),
			)}`;
		}
		return 'Date Range';
	};

	return (
		<div className="flex flex-wrap items-center gap-2">
			{/* Languages Filter */}
			<Popover
				open={languagesOpen}
				onOpenChange={(open) => {
					setLanguagesOpen(open);
					if (!open) {
						setLanguageInput('');
					}
				}}
			>
				<PopoverTrigger asChild>
					<Button variant="outline" size="sm" className="h-8 gap-2 text-sm">
						<Terminal className="h-4 w-4" />
						{getLanguagesChipText()}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-80 p-0" align="end">
					<Command>
						<div className="flex items-center border-b px-3">
							<CommandInput
								placeholder="Search languages..."
								className="flex-1"
								value={languageInput}
								onValueChange={setLanguageInput}
							/>
						</div>
						<CommandList className="max-h-60">
							{/* Add custom language button - always visible when there's input */}
							{languageInput.trim() &&
								!filters.languages.includes(languageInput.trim()) && (
									<CommandGroup heading="Add Custom">
										<CommandItem
											onSelect={() => addLanguage(languageInput)}
											className="font-medium"
										>
											<Plus className="mr-2 h-4 w-4" />
											Add "{languageInput.trim()}"
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
								(lang) => !filters.languages.includes(lang),
							).length > 0 && (
								<CommandGroup heading="Popular">
									{PRESET_LANGUAGES.filter(
										(lang) => !filters.languages.includes(lang),
									).map((language) => (
										<CommandItem
											key={language}
											onSelect={() => {
												addLanguage(language);
												setLanguageInput('');
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

			{/* Date Range Filter */}
			<Popover open={dateOpen} onOpenChange={setDateOpen}>
				<PopoverTrigger asChild>
					<Button variant="outline" size="sm" className="h-8 gap-2 text-sm">
						<Calendar className="h-4 w-4" />
						{getDateChipText()}
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

						{/* Date inputs with shortcuts */}
						<div className="grid gap-4 sm:grid-cols-[auto_1fr]">
							{/* Date range shortcuts */}
							<div className="flex w-full min-w-0 flex-col gap-2">
								<span className="text-muted-foreground text-xs">Presets</span>
								<div className="flex w-full min-w-0 gap-2 overflow-auto sm:flex-col">
									<Button
										size="sm"
										variant="outline"
										onClick={() => {
											const today = new Date();
											setDateRangePreset(today, today);
										}}
										className="text-xs"
									>
										Today
									</Button>
									<Button
										size="sm"
										variant="outline"
										onClick={() => {
											const yesterday = new Date();
											yesterday.setDate(yesterday.getDate() - 1);
											setDateRangePreset(yesterday, yesterday);
										}}
										className="text-xs"
									>
										Yesterday
									</Button>
									<Button
										size="sm"
										variant="outline"
										onClick={() => {
											const now = new Date();
											const startOfWeek = new Date(now);
											startOfWeek.setDate(now.getDate() - now.getDay());
											const endOfWeek = new Date(now);
											setDateRangePreset(startOfWeek, endOfWeek);
										}}
										className="text-xs"
									>
										This Week
									</Button>
									<Button
										size="sm"
										variant="outline"
										onClick={() => {
											const now = new Date();
											const startOfLastWeek = new Date(now);
											startOfLastWeek.setDate(now.getDate() - now.getDay() - 7);
											const endOfLastWeek = new Date(now);
											endOfLastWeek.setDate(now.getDate() - now.getDay() - 1);
											setDateRangePreset(startOfLastWeek, endOfLastWeek);
										}}
										className="text-xs"
									>
										Last Week
									</Button>
									<Button
										size="sm"
										variant="outline"
										onClick={() => {
											const now = new Date();
											const startOfMonth = new Date(
												now.getFullYear(),
												now.getMonth(),
												1,
											);
											const endOfMonth = new Date(now);
											setDateRangePreset(startOfMonth, endOfMonth);
										}}
										className="text-xs"
									>
										This Month
									</Button>
									<Button
										size="sm"
										variant="outline"
										onClick={() => {
											const now = new Date();
											const startOfLastMonth = new Date(
												now.getFullYear(),
												now.getMonth() - 1,
												1,
											);
											const endOfLastMonth = new Date(
												now.getFullYear(),
												now.getMonth(),
												0,
											);
											setDateRangePreset(startOfLastMonth, endOfLastMonth);
										}}
										className="text-xs"
									>
										Last Month
									</Button>
									<Button
										size="sm"
										variant="outline"
										onClick={() => {
											const now = new Date();
											const startOfYear = new Date(now.getFullYear(), 0, 1);
											const endOfYear = new Date(now);
											setDateRangePreset(startOfYear, endOfYear);
										}}
										className="text-xs"
									>
										This Year
									</Button>
								</div>
							</div>

							{/* Date inputs with custom calendar picker */}
							<div className="flex flex-col gap-2">
								<div>
									<label
										htmlFor="date-from-manual"
										className="text-muted-foreground text-xs"
									>
										From
									</label>
									<div className="relative">
										<Input
											id="date-from-manual"
											type="date"
											value={fromDateInput}
											onChange={(e) => setFromDateInput(e.target.value)}
											onBlur={(e) =>
												handleDateInputBlur(e.target.value, 'from')
											}
											placeholder="YYYY-MM-DD"
											className="pr-16 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-clear-button]:hidden [&::-webkit-inner-spin-button]:hidden"
										/>
										{filters.dateRange.from && (
											<Button
												variant="ghost"
												size="sm"
												onClick={() => clearIndividualDate('from')}
												className="absolute top-0 right-8 h-full px-2 text-muted-foreground hover:text-foreground"
											>
												<X className="h-3 w-3" />
											</Button>
										)}
										<Popover
											open={fromCalendarOpen}
											onOpenChange={setFromCalendarOpen}
										>
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
													selected={filters.dateRange.from || undefined}
													defaultMonth={filters.dateRange.from || undefined}
													onSelect={(date) => {
														handleDateSelect(date, 'from');
														setFromCalendarOpen(false);
													}}
													className="rounded-md border"
												/>
											</PopoverContent>
										</Popover>
									</div>
								</div>
								<div>
									<label
										htmlFor="date-to-manual"
										className="text-muted-foreground text-xs"
									>
										To
									</label>
									<div className="relative">
										<Input
											id="date-to-manual"
											type="date"
											value={toDateInput}
											onChange={(e) => setToDateInput(e.target.value)}
											onBlur={(e) => handleDateInputBlur(e.target.value, 'to')}
											placeholder="YYYY-MM-DD"
											className="pr-16 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-clear-button]:hidden [&::-webkit-inner-spin-button]:hidden"
										/>
										{filters.dateRange.to && (
											<Button
												variant="ghost"
												size="sm"
												onClick={() => clearIndividualDate('to')}
												className="absolute top-0 right-8 h-full px-2 text-muted-foreground hover:text-foreground"
											>
												<X className="h-3 w-3" />
											</Button>
										)}
										<Popover
											open={toCalendarOpen}
											onOpenChange={setToCalendarOpen}
										>
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
													selected={filters.dateRange.to || undefined}
													defaultMonth={
														filters.dateRange.to ||
														filters.dateRange.from ||
														undefined
													}
													onSelect={(date) => {
														handleDateSelect(date, 'to');
														setToCalendarOpen(false);
													}}
													className="rounded-md border"
													disabled={(date) =>
														filters.dateRange.from
															? date < filters.dateRange.from
															: false
													}
												/>
											</PopoverContent>
										</Popover>
									</div>
								</div>
							</div>
						</div>

						{/* Single error message for date range issues */}
						{dateRangeError && (
							<div className="pb-2 text-destructive text-xs">
								{dateRangeError}
							</div>
						)}
					</div>
				</PopoverContent>
			</Popover>

			{/* Sort Filter */}
			<Select
				value={`${filters.sortBy}-${filters.sortOrder}`}
				onValueChange={handleSortChange}
			>
				<SelectTrigger size="sm">
					{filters.sortOrder === 'asc' ? (
						<ArrowDownNarrowWide className="h-4 w-4" />
					) : (
						<ArrowDownWideNarrow className="h-4 w-4" />
					)}
					<SelectValue placeholder="Sort by">
						{SORT_OPTIONS.find(
							(option) =>
								option.sortBy === filters.sortBy &&
								option.sortOrder === filters.sortOrder,
						)?.label || 'Sort by'}
					</SelectValue>
				</SelectTrigger>
				<SelectContent>
					{SORT_OPTIONS.map((option) => (
						<SelectItem
							key={`sort-option-${option.value}`}
							value={option.value}
						>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
