
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { InventoryView } from './views/InventoryView';
import { OrdersView } from './views/OrdersView';
import { UsersView } from './views/UsersView';
import { DashboardOverview } from './views/DashboardOverview';
import { ReportsView } from './views/ReportsView';
import { BackupPanel } from './BackupPanel';
import { PerformanceView } from './views/PerformanceView';
import { MessagesView } from './views/MessagesView';
import { NewsletterView } from './views/NewsletterView';
import { useAuth } from '../../hooks/useAuth';

export function AdminDashboard() {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/orders" element={<OrdersView />} />
            <Route path="/inventory" element={<InventoryView />} />
            <Route path="/users" element={<UsersView />} />
            <Route path="/messages" element={<MessagesView />} />
            <Route path="/newsletter" element={<NewsletterView />} />
            <Route path="/reports" element={<ReportsView />} />
            <Route path="/backup" element={<BackupPanel />} />
            <Route path="/performance" element={<PerformanceView />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}