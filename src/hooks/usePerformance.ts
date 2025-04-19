import { create } from 'zustand';
import { database } from '../lib/firebase';
import { ref, onValue, set } from 'firebase/database';

interface PerformanceMetrics {
  pageLoadTime: number;
  uptime: number;
  errors: Array<{
    id: string;
    message: string;
    timestamp: number;
    path: string;
    resolved: boolean;
  }>;
  resourceMetrics: {
    js: number;
    css: number;
    images: number;
  };
}

interface PerformanceStore {
  metrics: PerformanceMetrics;
  loading: boolean;
  error: string | null;
  trackError: (error: Error, path: string) => void;
}

const initialMetrics: PerformanceMetrics = {
  pageLoadTime: 0,
  uptime: 100,
  errors: [],
  resourceMetrics: {
    js: 0,
    css: 0,
    images: 0
  }
};

export const usePerformance = create<PerformanceStore>((set) => {
  // Initialize metrics on store creation
  const initializeMetrics = () => {
    try {
      // Calculate initial metrics
      const navigationStart = performance?.timing?.navigationStart || 0;
      const loadEventEnd = performance?.timing?.loadEventEnd || Date.now();
      const pageLoadTime = loadEventEnd - navigationStart;

      // Track resource timing
      const resources = performance.getEntriesByType('resource');
      const resourceMetrics = {
        js: 0,
        css: 0,
        images: 0
      };

      resources.forEach((resource: any) => {
        if (resource.name.endsWith('.js')) resourceMetrics.js += resource.duration;
        if (resource.name.endsWith('.css')) resourceMetrics.css += resource.duration;
        if (resource.name.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          resourceMetrics.images += resource.duration;
        }
      });

      // Set initial metrics
      const currentMetrics = {
        ...initialMetrics,
        pageLoadTime,
        resourceMetrics,
        uptime: 100
      };

      // Update Firebase and local state
      const metricsRef = ref(database, 'performance/metrics');
      set(metricsRef, {
        ...currentMetrics,
        lastUpdated: new Date().toISOString()
      });

      set({
        metrics: currentMetrics,
        loading: false,
        error: null
      });

      // Listen for updates
      const metricsListener = onValue(metricsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          set(state => ({
            metrics: {
              ...state.metrics,
              ...data
            },
            loading: false,
            error: null
          }));
        }
      });

      // Listen for errors
      const errorsRef = ref(database, 'performance/errors');
      const errorsListener = onValue(errorsRef, (snapshot) => {
        const errors = snapshot.val();
        if (errors) {
          set(state => ({
            metrics: {
              ...state.metrics,
              errors: Object.values(errors)
            }
          }));
        }
      });

      return () => {
        metricsListener();
        errorsListener();
      };
    } catch (error: any) {
      console.error('Error initializing performance metrics:', error);
      set({ 
        metrics: initialMetrics,
        error: error.message || 'Failed to initialize performance metrics', 
        loading: false 
      });
    }
  };

  // Call initialization immediately
  initializeMetrics();

  return {
    metrics: initialMetrics,
    loading: true,
    error: null,

    trackError: async (error: Error, path: string) => {
      try {
        const errorData = {
          id: Date.now().toString(),
          message: error.message,
          timestamp: Date.now(),
          path,
          resolved: false
        };

        const errorRef = ref(database, `performance/errors/${errorData.id}`);
        await set(errorRef, errorData);

        set(state => ({
          metrics: {
            ...state.metrics,
            errors: [...state.metrics.errors, errorData]
          }
        }));
      } catch (error) {
        console.error('Failed to track error:', error);
      }
    }
  };
});