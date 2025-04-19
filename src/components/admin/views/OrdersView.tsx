import React, { useState, useEffect } from 'react';
import { database } from '../../../lib/firebase';
import { ref, onValue, update } from 'firebase/database';
import { Search, Package, Filter, Printer, Download, ChevronDown, ChevronUp, Truck, Ban, RotateCcw } from 'lucide-react';
import { Card } from '../../ui/card';
import { format } from 'date-fns';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  selectedColor: string;
}

interface Order {
  id: string;
  userId: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled' | 'returned';
  total: number;
  items: OrderItem[];
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    notes?: string;
  };
  shippingInfo?: {
    carrier: string;
    trackingNumber: string;
    estimatedDelivery: string;
  };
  refund?: {
    amount: number;
    reason: string;
    date: string;
    status: 'pending' | 'processed';
  };
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  canceled: 'bg-red-100 text-red-800',
  returned: 'bg-gray-100 text-gray-800',
};

export function OrdersView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ordersRef = ref(database, 'orders');
    try {
      const unsubscribe = onValue(ordersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const ordersList = Object.entries(data).flatMap(([userId, userOrders]: [string, any]) =>
            Object.entries(userOrders).map(([orderId, order]: [string, any]) => ({
              id: orderId,
              userId,
              ...order,
            }))
          );
          setOrders(ordersList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        } else {
          setOrders([]);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up orders listener:', error);
      setError('Failed to connect to the database.');
      setLoading(false);
    }
  }, []);

  const handleStatusUpdate = async (orderId: string, userId: string, newStatus: Order['status']) => {
    try {
      await update(ref(database, `orders/${userId}/${orderId}`), {
        status: newStatus,
        lastUpdated: new Date().toISOString(),
      });
      setError(null);
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status.');
    }
  };

  const handleBulkStatusUpdate = async (status: Order['status']) => {
    try {
      const updates: { [key: string]: any } = {};
      selectedOrders.forEach(orderId => {
        const order = orders.find(o => o.id === orderId);
        if (order) {
          updates[`orders/${order.userId}/${orderId}/status`] = status;
          updates[`orders/${order.userId}/${orderId}/lastUpdated`] = new Date().toISOString();
        }
      });
      await update(ref(database), updates);
      setSelectedOrders([]);
      setError(null);
    } catch (error) {
      console.error('Error updating orders:', error);
      setError('Failed to update orders.');
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders(current =>
      current.includes(orderId)
        ? current.filter(id => id !== orderId)
        : [...current, orderId]
    );
  };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(current =>
      current.includes(orderId)
        ? current.filter(id => id !== orderId)
        : [...current, orderId]
    );
  };

  const handlePrintInvoices = () => {
    // Implementation for printing invoices
    console.log('Printing invoices for:', selectedOrders);
  };

  const handleExportOrders = () => {
    const exportData = orders
      .filter(order => selectedOrders.includes(order.id))
      .map(order => ({
        orderId: order.id,
        customerName: order.customerInfo.name,
        email: order.customerInfo.email,
        total: order.total,
        status: order.status,
        date: order.date,
        items: order.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    const orderDate = new Date(order.date);
    const now = new Date();
    let matchesDate = true;

    switch (dateFilter) {
      case 'today':
        matchesDate = orderDate.toDateString() === now.toDateString();
        break;
      case 'week':
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        matchesDate = orderDate >= weekAgo;
        break;
      case 'month':
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        matchesDate = orderDate >= monthAgo;
        break;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

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
        <h1 className="text-2xl font-bold">Order Management</h1>
        
        {/* Bulk Actions */}
        {selectedOrders.length > 0 && (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {selectedOrders.length} orders selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrintInvoices}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button
                onClick={handleExportOrders}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <select
                onChange={(e) => handleBulkStatusUpdate(e.target.value as Order['status'])}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Update Status</option>
                <option value="processing">Mark Processing</option>
                <option value="shipped">Mark Shipped</option>
                <option value="delivered">Mark Delivered</option>
                <option value="canceled">Mark Canceled</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Order['status'] | 'all')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="canceled">Canceled</option>
          <option value="returned">Returned</option>
        </select>

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value as 'today' | 'week' | 'month' | 'all')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="text-center py-8">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleOrderSelection(order.id)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <div>
                      <h3 className="font-semibold">Order #{order.id}</h3>
                      <p className="text-sm text-gray-500">
                        {format(new Date(order.date), 'PPp')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                    <button
                      onClick={() => toggleOrderExpansion(order.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {expandedOrders.includes(order.id) ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {expandedOrders.includes(order.id) && (
                  <div className="mt-6 space-y-6">
                    {/* Order Items */}
                    <div>
                      <h4 className="font-semibold mb-2">Order Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2 border-b last:border-0"
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: item.selectedColor }}
                              />
                              <span>{item.name}</span>
                            </div>
                            <div className="text-gray-600">
                              {item.quantity} × ${item.price}
                            </div>
                          </div>
                        ))}
                        <div className="flex justify-between font-bold pt-2">
                          <span>Total:</span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Customer Information */}
                    <div>
                      <h4 className="font-semibold mb-2">Customer Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Name:</p>
                          <p>{order.customerInfo.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Email:</p>
                          <p>{order.customerInfo.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Phone:</p>
                          <p>{order.customerInfo.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Address:</p>
                          <p>
                            {order.customerInfo.address.street}<br />
                            {order.customerInfo.address.city}, {order.customerInfo.address.state} {order.customerInfo.address.postalCode}<br />
                            {order.customerInfo.address.country}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, order.userId, e.target.value as Order['status'])}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="canceled">Canceled</option>
                          <option value="returned">Returned</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(order.id, order.userId, 'canceled')}
                          className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Ban className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(order.id, order.userId, 'returned')}
                          className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Return</span>
                        </button>
                        {order.status === 'processing' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, order.userId, 'shipped')}
                            className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Truck className="w-4 h-4" />
                            <span>Ship</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}