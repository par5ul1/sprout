# 🌱 Sprout

A GitHub issue discovery tool that helps you find open source issues to contribute to.

## Features

- 🔍 Search GitHub issues by programming language
- 📅 Filter by date ranges with presets
- 🎯 Sort by creation date, comments, and more
- 🌙 Dark/light theme support
- ⚡ Real-time filtering with GitHub API
- 💾 Session storage caching to reduce API calls

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended package manager)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. (Optional) Set up GitHub token for higher rate limits:
   - Create a GitHub Personal Access Token at https://github.com/settings/tokens
   - Create a `.env` file in the root directory
   - Add your token: `VITE_GITHUB_TOKEN=your_token_here`

4. Start the development server:
   ```bash
   pnpm dev
   ```

## Usage

1. Select programming languages you're interested in
2. Optionally set date ranges to filter recent issues
3. Use the sort options to find issues that match your preferences
4. Click on any issue to view it on GitHub

## Caching

The app implements session storage caching to reduce unnecessary API calls:

- **Cache Duration**: 5 minutes by default
- **Storage**: Browser session storage (cleared when tab closes)
- **Cache Key**: Based on search filters (languages, date range, sort options)
- **Debug Mode**: In development, a cache debug panel shows cache statistics

### Cache Benefits

- Reduces GitHub API rate limit usage
- Faster response times for repeated searches
- Automatic cache invalidation after 5 minutes
- Session persistence across page refreshes

## Development

- Built with React + TypeScript
- Uses Octokit for GitHub API integration
- Styled with Tailwind CSS and Radix UI components
- Formatted with Biome

## License

MIT 