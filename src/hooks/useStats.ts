import { create } from 'zustand';
import { database } from '../lib/firebase';
import { ref, onValue } from 'firebase/database';

interface Stats {
  totalOrders: number;
  revenue: number;
  activeCustomers: number;
  growthRate: number;
  recentActivity: {
    type: 'order' | 'inventory' | 'user';
    description: string;
    timestamp: string;
  }[];
}

interface StatsStore {
  stats: Stats;
  loading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
}

export const useStats = create<StatsStore>((set) => ({
  stats: {
    totalOrders: 0,
    revenue: 0,
    activeCustomers: 0,
    growthRate: 0,
    recentActivity: [],
  },
  loading: false,
  error: null,
  fetchStats: async () => {
    set({ loading: true });
    try {
      const statsRef = ref(database, 'stats');
      onValue(statsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          set({ stats: data, loading: false });
        }
      });
    } catch (error) {
      set({ error: 'Failed to fetch stats', loading: false });
    }
  },
}));