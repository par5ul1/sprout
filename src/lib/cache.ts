const ENABLE_CACHE = true;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds (default: 5 minutes)
}

export class SessionCache {
  private static instance: SessionCache;
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    // Load existing cache from sessionStorage on initialization
    if (ENABLE_CACHE) {
      this.loadFromSessionStorage();
    }
  }

  static getInstance(): SessionCache {
    if (!SessionCache.instance) {
      SessionCache.instance = new SessionCache();
    }
    return SessionCache.instance;
  }

  private generateKey(filters: unknown): string {
    // Create a unique key based on the filters
    return `github-issues-${JSON.stringify(filters)}`;
  }

  private loadFromSessionStorage(): void {
    try {
      const cached = sessionStorage.getItem("github-issues-cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        const now = Date.now();

        // Only load entries that haven't expired
        for (const [key, entry] of Object.entries(parsed)) {
          if (
            typeof entry === "object" &&
            entry !== null &&
            "expiresAt" in entry &&
            typeof entry.expiresAt === "number" &&
            entry.expiresAt > now
          ) {
            this.cache.set(key, entry as CacheEntry<unknown>);
          }
        }
      }
    } catch (error) {
      console.warn("Failed to load cache from sessionStorage:", error);
    }
  }

  private saveToSessionStorage(): void {
    try {
      const cacheObject: Record<string, CacheEntry<any>> = {};
      this.cache.forEach((value, key) => {
        cacheObject[key] = value;
      });
      sessionStorage.setItem(
        "github-issues-cache",
        JSON.stringify(cacheObject)
      );
    } catch (error) {
      console.warn("Failed to save cache to sessionStorage:", error);
    }
  }

  get<T>(filters: unknown): T | null {
    const key = this.generateKey(filters);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.saveToSessionStorage();
      return null;
    }

    return entry.data as T;
  }

  set<T>(filters: unknown, data: T, options: CacheOptions = {}): void {
    const key = this.generateKey(filters);
    const ttl = options.ttl || this.defaultTTL;
    const now = Date.now();

    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + ttl,
    };

    this.cache.set(key, entry);
    this.saveToSessionStorage();
  }

  clear(): void {
    this.cache.clear();
    sessionStorage.removeItem("github-issues-cache");
  }

  // Get cache statistics for debugging
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Export a singleton instance
export const sessionCache = SessionCache.getInstance();
