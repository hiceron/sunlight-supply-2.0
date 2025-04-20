import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { auth, database } from '../lib/firebase';
import { ref, onValue } from 'firebase/database';
import { User } from 'firebase/auth';
import { LogOut, Package, User as UserIcon, X, ShoppingCart, Clock, CheckCircle, ChevronDown, ChevronUp, LayoutDashboard } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { Shop } from './Shop';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface OrderHistory {
  id: string;
  date: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    selectedColor: string;
  }[];
  total: number;
  status: 'pending' | 'completed';
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
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'th', name: 'ไทย' },
  { code: 'de', name: 'Deutsch' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'zh', name: '中文' },
];

export function Profile({ onClose }: { onClose: () => void }) {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const { cartItems, total } = useCart();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        const ordersRef = ref(database, `orders/${user.uid}`);
        onValue(ordersRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const ordersList = Object.entries(data).map(([id, order]: [string, any]) => ({
              id,
              ...order,
              date: new Date(order.date).toISOString(),
            }));
            setOrders(ordersList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
          }
          setLoading(false);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      onClose();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleAdminDashboard = () => {
    onClose();
    navigate('/admin');
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrders(current =>
      current.includes(orderId)
        ? current.filter(id => id !== orderId)
        : [...current, orderId]
    );
  };

  if (!user) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Video Background */}
            <div className="absolute inset-0 overflow-hidden rounded-lg">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-10"
              >
                <source src="/videos/header_video.mp4" type="video/mp4" />
              </video>
            </div>

            <div className="relative">
              {/* Header */}
              <div className="sticky top-0 bg-white bg-opacity-90 z-10 p-6 border-b">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-2xl font-bold">My Profile</h2>
                    {isAdmin && (
                      <button
                        onClick={handleAdminDashboard}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    {/* Language Selector */}
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                    
                    <button
                      onClick={onClose}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* User Info */}
                <div className="bg-white bg-opacity-90 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-[#0056b3] text-white p-3 rounded-full">
                      <UserIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{user.displayName || 'User'}</h3>
                      <p className="text-gray-600">{user.email}</p>

                    </div>
                  </div>
                </div>

                {/* Current Cart */}
                <div className="bg-white bg-opacity-90 rounded-lg p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Current Cart</h3>
                    <button
                      onClick={() => setIsShopOpen(true)}
                      className="flex items-center space-x-2 text-[#0056b3] hover:text-[#004494] transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Continue Shopping</span>
                    </button>
                  </div>
                  
                  {cartItems.length === 0 ? (
                    <p className="text-gray-600">Your cart is empty</p>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div
                          key={`${item.id}-${item.selectedColor}`}
                          className="flex justify-between items-center py-2 border-b"
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
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order History */}
                <div className="bg-white bg-opacity-90 rounded-lg p-6 shadow-lg">
                  <h3 className="text-xl font-semibold mb-4">Order History</h3>
                  {loading ? (
                    <p className="text-center text-gray-600">Loading orders...</p>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No orders yet</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center space-x-2 mb-2">
                                <span className={`px-3 py-1 rounded-full text-sm flex items-center space-x-1 ${
                                  order.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {order.status === 'completed' ? (
                                    <CheckCircle className="w-4 h-4" />
                                  ) : (
                                    <Clock className="w-4 h-4" />
                                  )}
                                  <span className="capitalize">{order.status}</span>
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                Order ID: {order.id}
                              </p>
                              <p className="text-sm text-gray-600">
                                {format(new Date(order.date), 'PPP')}
                              </p>
                            </div>
                            <p className="font-semibold">
                              Total: ${order.total.toFixed(2)}
                            </p>
                          </div>

                          {/* Order Items */}
                          <div className="space-y-2 mb-4">
                            {order.items.map((item, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center py-2 border-t"
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
                          </div>

                          {/* Shipping Details Toggle */}
                          <button
                            onClick={() => toggleOrderDetails(order.id)}
                            className="w-full flex items-center justify-between text-[#0056b3] hover:text-[#004494] transition-colors mt-4 pt-4 border-t"
                          >
                            <span className="font-semibold">Shipping Details</span>
                            {expandedOrders.includes(order.id) ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </button>

                          {/* Collapsible Shipping Details */}
                          {expandedOrders.includes(order.id) && (
                            <div className="mt-4 pt-4 border-t">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-600">Name:</p>
                                  <p>{order.customerInfo.name}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Phone:</p>
                                  <p>{order.customerInfo.phone}</p>
                                </div>
                                <div className="col-span-2">
                                  <p className="text-gray-600">Address:</p>
                                  <p>
                                    {order.customerInfo.address.street}, {order.customerInfo.address.city}
                                    <br />
                                    {order.customerInfo.address.state} {order.customerInfo.address.postalCode}
                                    <br />
                                    {order.customerInfo.address.country}
                                  </p>
                                </div>
                                {order.customerInfo.notes && (
                                  <div className="col-span-2">
                                    <p className="text-gray-600">Notes:</p>
                                    <p>{order.customerInfo.notes}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Modal */}
      {isShopOpen && (
        <Shop
          isOpen={isShopOpen}
          onClose={() => setIsShopOpen(false)}
        />
      )}
    </>
  );
}