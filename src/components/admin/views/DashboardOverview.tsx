import React, { useEffect, useState } from 'react';
import { database } from '../../../lib/firebase';
import { ref, onValue, query, orderByChild, limitToLast } from 'firebase/database';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { DollarSign, Package, Users, TrendingUp, AlertTriangle, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'completed';
  total: number;
  customerInfo: {
    name: string;
    email: string;
  };
}

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  activeUsers: number;
  recentOrders: Order[];
  topProducts: any[];
  alerts: Array<{
    type: string;
    message: string;
    severity: 'warning' | 'error';
  }>;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const initialStats: DashboardStats = {
  totalSales: 0,
  totalOrders: 0,
  averageOrderValue: 0,
  activeUsers: 0,
  recentOrders: [],
  topProducts: [],
  alerts: []
};

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch orders
        const ordersRef = ref(database, 'orders');
        
        onValue(ordersRef, (snapshot) => {
          const ordersData = snapshot.val();
          if (!ordersData) {
            setStats(prev => ({ ...prev, recentOrders: [] }));
            return;
          }

          // Process all orders from all users
          const allOrders: Order[] = Object.entries(ordersData).flatMap(([userId, userOrders]: [string, any]) =>
            Object.entries(userOrders).map(([orderId, order]: [string, any]) => ({
              id: orderId,
              ...order,
              customerInfo: order.customerInfo || { name: 'Unknown', email: 'Unknown' }
            }))
          );

          // Calculate totals
          const totalSales = allOrders.reduce((sum, order) => sum + (order.total || 0), 0);
          const averageOrderValue = allOrders.length > 0 ? totalSales / allOrders.length : 0;

          // Sort orders by date and get recent ones
          const recentOrders = allOrders
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);

          setStats(prev => ({
            ...prev,
            totalSales,
            totalOrders: allOrders.length,
            averageOrderValue,
            recentOrders
          }));
        });

        // Fetch users
        const usersRef = ref(database, 'users');
        onValue(usersRef, (snapshot) => {
          const users = snapshot.val();
          setStats(prev => ({
            ...prev,
            activeUsers: users ? Object.keys(users).length : 0
          }));
        });

        // Fetch products
        const productsRef = ref(database, 'products');
        onValue(productsRef, (snapshot) => {
          const products = snapshot.val();
          if (!products) {
            setStats(prev => ({ ...prev, topProducts: [], alerts: [] }));
            return;
          }

          const productsList = Object.values(products);
          
          // Generate low stock alerts
          const lowStockProducts = productsList
            .filter((product: any) => product.availableQuantity < 10)
            .map((product: any) => ({
              type: 'low_stock',
              message: `Low stock alert: ${product.name} (${product.availableQuantity} tons remaining)`,
              severity: 'warning' as const
            }));

          setStats(prev => ({
            ...prev,
            alerts: lowStockProducts,
            topProducts: productsList
          }));
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      {/* Key Metrics */}
      <motion.div
        variants={container}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Sales
              </CardTitle>
              <DollarSign className="h-6 w-6 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalSales.toFixed(2)}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Orders
              </CardTitle>
              <Package className="h-6 w-6 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Users
              </CardTitle>
              <Users className="h-6 w-6 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg. Order Value
              </CardTitle>
              <TrendingUp className="h-6 w-6 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.averageOrderValue.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentOrders.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No recent orders</p>
                ) : (
                  stats.recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">{order.customerInfo?.name || 'Unknown'}</p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(order.date), 'PPp')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.total.toFixed(2)}</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alerts and Notifications */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Alerts & Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.alerts.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No alerts at this time</p>
                ) : (
                  stats.alerts.map((alert, index) => (
                    <div
                      key={index}
                      className={`flex items-start space-x-3 p-3 rounded-lg ${
                        alert.severity === 'warning'
                          ? 'bg-yellow-50 text-yellow-800'
                          : 'bg-red-50 text-red-800'
                      }`}
                    >
                      <AlertTriangle className="h-5 w-5 mt-0.5" />
                      <p>{alert.message}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}