import React, { useState, useEffect } from 'react';
import { database } from '../../../lib/firebase';
import { ref, query, orderByChild, get } from 'firebase/database';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { 
  BarChart, 
  LineChart, 
  Calendar, 
  Download, 
  Filter,
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign
} from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { motion } from 'framer-motion';

interface ReportFilters {
  dateRange: 'today' | 'week' | 'month' | 'year' | 'custom';
  startDate: Date;
  endDate: Date;
  category?: string;
  productId?: string;
}

interface AnalyticsData {
  salesByDate: Record<string, number>;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
  customerMetrics: {
    total: number;
    new: number;
    returning: number;
    averageOrderValue: number;
  };
  conversionRate: number;
}

export function ReportsView() {
  const [filters, setFilters] = useState<ReportFilters>({
    dateRange: 'month',
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
  });
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    salesByDate: {},
    topProducts: [],
    customerMetrics: {
      total: 0,
      new: 0,
      returning: 0,
      averageOrderValue: 0,
    },
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const startTimestamp = startOfDay(filters.startDate).getTime();
        const endTimestamp = endOfDay(filters.endDate).getTime();

        // Fetch orders within date range
        const ordersRef = ref(database, 'orders');
        const ordersSnapshot = await get(ordersRef);
        const orders = ordersSnapshot.val();

        // Process orders data
        const salesByDate: Record<string, number> = {};
        const productSales: Record<string, { sales: number; revenue: number }> = {};
        const customers = new Set();
        let totalRevenue = 0;
        let orderCount = 0;

        if (orders) {
          Object.values(orders).forEach((userOrders: any) => {
            Object.values(userOrders).forEach((order: any) => {
              const orderDate = new Date(order.date);
              const timestamp = orderDate.getTime();

              if (timestamp >= startTimestamp && timestamp <= endTimestamp) {
                // Aggregate sales by date
                const dateKey = format(orderDate, 'yyyy-MM-dd');
                salesByDate[dateKey] = (salesByDate[dateKey] || 0) + order.total;

                // Track product sales
                order.items.forEach((item: any) => {
                  if (!productSales[item.id]) {
                    productSales[item.id] = { sales: 0, revenue: 0 };
                  }
                  productSales[item.id].sales += item.quantity;
                  productSales[item.id].revenue += item.price * item.quantity;
                });

                // Track customers
                customers.add(order.customerInfo.email);
                totalRevenue += order.total;
                orderCount++;
              }
            });
          });
        }

        // Calculate top products
        const topProducts = Object.entries(productSales)
          .map(([id, data]) => ({
            id,
            name: 'Product ' + id, // You should fetch actual product names
            ...data,
          }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);

        setAnalyticsData({
          salesByDate,
          topProducts,
          customerMetrics: {
            total: customers.size,
            new: Math.floor(customers.size * 0.3), // Example calculation
            returning: Math.floor(customers.size * 0.7),
            averageOrderValue: orderCount ? totalRevenue / orderCount : 0,
          },
          conversionRate: 2.5, // Example hardcoded value
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setError('Failed to load analytics data');
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [filters]);

  const handleExportData = () => {
    const exportData = {
      dateRange: {
        start: format(filters.startDate, 'yyyy-MM-dd'),
        end: format(filters.endDate, 'yyyy-MM-dd'),
      },
      analytics: analyticsData,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <div className="flex items-center space-x-4">
          <select
            value={filters.dateRange}
            onChange={(e) => {
              const now = new Date();
              let startDate = now;
              switch (e.target.value) {
                case 'today':
                  startDate = startOfDay(now);
                  break;
                case 'week':
                  startDate = subDays(now, 7);
                  break;
                case 'month':
                  startDate = subDays(now, 30);
                  break;
                case 'year':
                  startDate = subDays(now, 365);
                  break;
              }
              setFilters({
                ...filters,
                dateRange: e.target.value as ReportFilters['dateRange'],
                startDate,
                endDate: now,
              });
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
            <option value="custom">Custom Range</option>
          </select>

          <button
            onClick={handleExportData}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-6 w-6 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Object.values(analyticsData.salesByDate).reduce((a, b) => a + b, 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Orders
            </CardTitle>
            <ShoppingBag className="h-6 w-6 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(analyticsData.salesByDate).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Customers
            </CardTitle>
            <Users className="h-6 w-6 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.customerMetrics.total}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Conversion Rate
            </CardTitle>
            <TrendingUp className="h-6 w-6 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.conversionRate}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {/* Implement chart visualization here */}
            <div className="flex items-center justify-center h-full text-gray-500">
              Chart visualization would go here
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.topProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-bold text-gray-500">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      {product.sales} units sold
                    </p>
                  </div>
                </div>
                <span className="font-bold">
                  ${product.revenue.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">New Customers</span>
                <span className="font-bold">
                  {analyticsData.customerMetrics.new}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Returning Customers</span>
                <span className="font-bold">
                  {analyticsData.customerMetrics.returning}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Order Value</span>
                <span className="font-bold">
                  ${analyticsData.customerMetrics.averageOrderValue.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-gray-500">
              Traffic sources chart would go here
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}