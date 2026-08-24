// lib/performance.ts

// Performance monitoring utilities
export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map();

  static startMark(name: string) {
    if (typeof window !== 'undefined') {
      this.marks.set(name, performance.now());
    }
  }

  static endMark(name: string): number {
    if (typeof window !== 'undefined') {
      const startTime = this.marks.get(name);
      if (startTime) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
        }
        
        this.marks.delete(name);
        return duration;
      }
    }
    return 0;
  }

  static measurePageLoad() {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`📄 Page loaded in: ${loadTime.toFixed(2)}ms`);
      });
    }
  }
}

// Lazy loading helper
export function lazyImport<T>(factory: () => Promise<T>, retries = 3): () => Promise<T> {
  return () => factory().catch((error) => {
    if (retries > 0) {
      console.log(`Retrying lazy import, ${retries} attempts left`);
      return lazyImport(factory, retries - 1)();
    }
    throw error;
  });
}