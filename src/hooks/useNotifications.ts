import { create } from 'zustand';
import { database } from '../lib/firebase';
import { ref, onValue, update, remove } from 'firebase/database';

export interface Notification {
  id: string;
  type: 'order' | 'stock' | 'user' | 'system';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  deleteAllNotifications: () => void;
  initialize: () => void;
}

export const useNotifications = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: true,
  error: null,

  initialize: () => {
    const notificationsRef = ref(database, 'notifications');
    try {
      const unsubscribe = onValue(notificationsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const notificationsList = Object.entries(data).map(([id, notification]: [string, any]) => ({
            id,
            ...notification,
          }));
          set({
            notifications: notificationsList,
            unreadCount: notificationsList.filter(n => !n.read).length,
            loading: false
          });
        } else {
          set({
            notifications: [],
            unreadCount: 0,
            loading: false
          });
        }
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up notifications listener:', error);
      set({ error: 'Failed to connect to notifications service', loading: false });
    }
  },

  markAsRead: async (id: string) => {
    try {
      const notificationRef = ref(database, `notifications/${id}`);
      await update(notificationRef, { read: true });
      set(state => ({
        notifications: state.notifications.map(n =>
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: state.notifications.filter(n => !n.read && n.id !== id).length
      }));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },

  markAllAsRead: async () => {
    try {
      const updates = {};
      get().notifications.forEach(notification => {
        updates[`notifications/${notification.id}/read`] = true;
      });
      await update(ref(database), updates);
      set(state => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
      }));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  },

  deleteNotification: async (id: string) => {
    try {
      const notificationRef = ref(database, `notifications/${id}`);
      await remove(notificationRef);
      set(state => ({
        notifications: state.notifications.filter(n => n.id !== id),
        unreadCount: state.notifications.filter(n => !n.read && n.id !== id).length
      }));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  },

  deleteAllNotifications: async () => {
    try {
      const notificationsRef = ref(database, 'notifications');
      await remove(notificationsRef);
      set({
        notifications: [],
        unreadCount: 0
      });
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    }
  },
}));