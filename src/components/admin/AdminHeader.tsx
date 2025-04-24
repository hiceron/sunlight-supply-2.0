import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Settings, LogOut, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationsPanel } from './NotificationsPanel';
import { useNavigate } from 'react-router-dom';

/**
 * AdminHeader component with notifications and language selector (i18n).
 *
 * Returns:
 *   JSX.Element: The admin dashboard header UI.
 */
export function AdminHeader() {
  const { t, i18n } = useTranslation();
  const { user, signOut } = useAuth();
  const { unreadCount, initialize } = useNotifications();
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'en');
  const navigate = useNavigate();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Update i18n language when selection changes
  useEffect(() => {
    if (selectedLanguage !== i18n.language) {
      i18n.changeLanguage(selectedLanguage);
    }
  }, [selectedLanguage, i18n]);

  const handleClose = () => {
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img
              src="/icons/sunlight_supply_logo.png"
              alt="Logo"
              className="h-8 w-auto"
            />
            <span className="ml-2 text-xl font-semibold text-gray-900">
              {t('admin.header.dashboardTitle', 'Admin Dashboard')}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 mr-2"
              title={t('admin.header.languageSwitcher', 'Change language')}
            >
              <option value="en">English</option>
              <option value="th">ไทย</option>
              <option value="de">Deutsch</option>
              <option value="hi">हिंदी</option>
              <option value="zh">中文</option>
            </select>
            <button
              onClick={() => setIsNotificationsPanelOpen(true)}
              className="relative text-gray-500 hover:text-gray-700"
            >
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <Settings className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">{user?.email}</span>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title="Close Dashboard"
              >
                <X className="h-6 w-6" />
              </button>
              <button
                onClick={signOut}
                className="text-gray-500 hover:text-gray-700"
                title="Sign Out"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <NotificationsPanel
        isOpen={isNotificationsPanelOpen}
        onClose={() => setIsNotificationsPanelOpen(false)}
      />
    </header>
  );
}