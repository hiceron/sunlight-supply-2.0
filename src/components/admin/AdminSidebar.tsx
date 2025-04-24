import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingBag, 
  BarChart,
  Database,
  Zap
} from 'lucide-react';

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'overview' },
  { path: '/admin/orders', icon: ShoppingBag, label: 'orders' },
  { path: '/admin/inventory', icon: Package, label: 'inventory' },
  { path: '/admin/users', icon: Users, label: 'users' },
  { path: '/admin/messages', icon: BarChart, label: 'messages' },
  { path: '/admin/newsletter', icon: Zap, label: 'newsletter' },
  { path: '/admin/reports', icon: BarChart, label: 'reports' },
  { path: '/admin/performance', icon: Zap, label: 'performance' },
  { path: '/admin/backup', icon: Database, label: 'backup' }
];

/**
 * AdminSidebar component with i18n support for navigation labels.
 *
 * Returns:
 *   JSX.Element: The sidebar navigation for the admin dashboard.
 */
export function AdminSidebar() {
  const { t } = useTranslation();
  return (
    <aside className="w-64 bg-white shadow-sm min-h-screen">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navItems.map(({ path, icon: Icon, label }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span>{t(`admin.sidebar.${label}`, label)}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}