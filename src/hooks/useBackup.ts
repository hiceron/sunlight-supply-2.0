import { create } from 'zustand';
import { database, auth } from '../lib/firebase';
import { ref, get } from 'firebase/database';

interface BackupData {
  timestamp: number;
  data: {
    products?: any;
    orders?: any;
    users?: any;
  };
  metadata: {
    version: string;
    description: string;
  };
}

interface BackupStore {
  loading: boolean;
  error: string | null;
  createBackup: () => Promise<BackupData>;
}

export const useBackup = create<BackupStore>((set) => ({
  loading: false,
  error: null,

  createBackup: async () => {
    try {
      set({ loading: true, error: null });

      const user = auth.currentUser;
      if (!user) {
        throw new Error('Authentication required');
      }

      // Fetch data to backup
      const dataToBackup: BackupData['data'] = {};
      const sections = ['products', 'orders', 'users'];

      for (const section of sections) {
        const snapshot = await get(ref(database, section));
        const data = snapshot.val();
        if (data) {
          dataToBackup[section] = data;
        }
      }

      const backup: BackupData = {
        timestamp: Date.now(),
        data: dataToBackup,
        metadata: {
          version: '1.0',
          description: `Backup ${new Date().toLocaleString()}`
        }
      };

      set({ loading: false, error: null });
      return backup;
    } catch (error: any) {
      console.error('Backup creation failed:', error);
      set({ error: error.message || 'Failed to create backup', loading: false });
      throw error;
    }
  },
}));