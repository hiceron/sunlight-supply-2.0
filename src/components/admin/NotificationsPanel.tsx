import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CheckCircle, AlertTriangle, Package, User, Trash2 } from 'lucide-react';
import { useNotifications, Notification } from '../../hooks/useNotifications';
import { format } from 'date-fns';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'order':
      return Package;
    case 'stock':
      return AlertTriangle;
    case 'user':
      return User;
    default:
      return Bell;
  }
};

const getPriorityColor = (priority: Notification['priority']) => {
  switch (priority) {
    case 'high':
      return 'bg-red-50 text-red-800';
    case 'medium':
      return 'bg-yellow-50 text-yellow-800';
    default:
      return 'bg-blue-50 text-blue-800';
  }
};

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    deleteAllNotifications 
  } = useNotifications();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="h-full bg-white shadow-xl"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={deleteAllNotifications}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Delete All
              </button>
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark All as Read
              </button>
              <button onClick={onClose}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto h-[calc(100vh-64px)]">
            <AnimatePresence>
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Bell className="w-12 h-12 mb-4" />
                  <p>No notifications</p>
                </div>
              ) : (
                notifications
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .map((notification) => {
                    const Icon = getNotificationIcon(notification.type);
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className={`p-4 border-b ${
                          notification.read ? 'bg-white' : 'bg-blue-50'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold">{notification.title}</h3>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="p-1 text-red-600 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors"
                                  title="Delete notification"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="p-1 text-blue-600 hover:text-blue-700 rounded-full hover:bg-blue-50 transition-colors"
                                    title="Mark as read"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-600 mt-1">{notification.message}</p>
                            <span className="text-sm text-gray-500 mt-2 block">
                              {format(notification.timestamp, 'PPp')}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}