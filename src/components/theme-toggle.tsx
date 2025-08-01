import { Monitor, Moon, Sun } from 'lucide-react';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from '@/components/ui/select';
import { useTheme } from '@/lib/theme-provider';

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<Select value={theme} onValueChange={setTheme}>
			<SelectTrigger>
				<div className="grid grid-cols-1 grid-rows-1">
					<Sun className="dark:-rotate-90 col-start-1 row-start-1 h-4 w-4 rotate-0 scale-100 transition-all dark:scale-0" />
					<Moon className="col-start-1 row-start-1 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
				</div>
				<span className="sr-only">Select theme: {theme}</span>
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="light">
					<div className="flex items-center">
						<Sun className="mr-2 h-4 w-4" />
						<span>Light</span>
					</div>
				</SelectItem>
				<SelectItem value="dark">
					<div className="flex items-center">
						<Moon className="mr-2 h-4 w-4" />
						<span>Dark</span>
					</div>
				</SelectItem>
				<SelectItem value="system">
					<div className="flex items-center">
						<Monitor className="mr-2 h-4 w-4" />
						<span>System</span>
					</div>
				</SelectItem>
			</SelectContent>
		</Select>
	);
}
