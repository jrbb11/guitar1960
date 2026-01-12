import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { User, Package, MapPin, Heart, Settings, LogOut, ShoppingBag, X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/products/ProductCard';

import { getOrders } from '../services/orders';
import { getAddresses, deleteAddress, createAddress, updateAddress, updateProfile } from '../services/profiles';
import { formatPrice } from '../utils/currency';

interface AccountPageProps {
  defaultTab?: 'profile' | 'orders' | 'addresses' | 'wishlist';
}

// --- WishlistTab component ---
const WishlistTab = () => {
  const { wishlist, loading } = useWishlist();

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading wishlist...</div>;
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart size={64} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Wishlist is Empty</h3>
        <p className="text-gray-600 mb-6">Save your favorite items here</p>
        <Link to="/shop">
          <Button className="bg-gray-900 hover:bg-black text-white font-semibold">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => item.product && (
          <ProductCard key={item.product.id} product={item.product} />
        ))}
      </div>
    </div>
  );
};

export const AccountPage = ({ defaultTab = 'profile' }: AccountPageProps) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  // Address Form State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [addressForm, setAddressForm] = useState({
    full_name: '',
    phone: '',
    street_address: '',
    city: '',
    province: '',
    postal_code: '',
    is_default: false
  });

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    phone: '',
  });

  // Initialize profile form when user loads
  useEffect(() => {
    if (user) {
      setProfileForm({
        full_name: user.full_name || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // Fetch orders when tab is active
  useEffect(() => {
    if (activeTab === 'orders' && user) {
      loadOrders();
    }
  }, [activeTab, user]);

  // Fetch addresses when tab is active
  useEffect(() => {
    if (activeTab === 'addresses' && user) {
      loadAddresses();
    }
  }, [activeTab, user]);

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  const loadOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const loadAddresses = async () => {
    setIsLoadingAddresses(true);
    try {
      const data = await getAddresses();
      setAddresses(data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(id);
        loadAddresses(); // Reload list
      } catch (error) {
        console.error('Error deleting address:', error);
        alert('Failed to delete address.');
      }
    }
  };

  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    setAddressForm({
      full_name: address.full_name,
      phone: address.phone,
      street_address: address.street_address,
      city: address.city,
      province: address.province,
      postal_code: address.postal_code || '',
      is_default: address.is_default
    });
    setShowAddressModal(true);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      full_name: user?.full_name || '', // Pre-fill name if available
      phone: '',
      street_address: '',
      city: '',
      province: '',
      postal_code: '',
      is_default: false
    });
    setShowAddressModal(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, addressForm);
      } else {
        await createAddress(addressForm);
      }
      setShowAddressModal(false);
      loadAddresses(); // Reload list
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Failed to save address.');
    }
  };

  const handleSaveProfile = async () => {
    if (!profileForm.full_name.trim()) {
      toast.error('Full name is required');
      return;
    }

    setIsSavingProfile(true);
    try {
      await updateProfile({
        full_name: profileForm.full_name.trim(),
        phone: profileForm.phone.trim(),
      });
      toast.success('Profile updated successfully!');
      setIsEditingProfile(false);
      // Note: useAuth should auto-refresh user data, but if not, you may need to reload
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCancelProfileEdit = () => {
    setProfileForm({
      full_name: user?.full_name || '',
      phone: user?.phone || '',
    });
    setIsEditingProfile(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your account.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/login" className="flex-1">
              <Button className="w-full bg-gray-900 hover:bg-black text-white font-semibold">Log In</Button>
            </Link>
            <Link to="/register" className="flex-1">
              <Button variant="outline" className="w-full font-semibold">Create Account</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {user.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{user.full_name || 'User'}</h1>
                <p className="text-sm sm:text-base text-gray-600 truncate">{user.email || ''}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${activeTab === 'profile' ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'
                    }`}
                >
                  <User size={20} />
                  <span className="font-medium">Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${activeTab === 'orders' ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'
                    }`}
                >
                  <Package size={20} />
                  <span className="font-medium">Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${activeTab === 'addresses' ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'
                    }`}
                >
                  <MapPin size={20} />
                  <span className="font-medium">Addresses</span>
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${activeTab === 'wishlist' ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'
                    }`}
                >
                  <Heart size={20} />
                  <span className="font-medium">Wishlist</span>
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-lg shadow-md p-6">
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold">Profile Information</h2>
                      {!isEditingProfile ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => setIsEditingProfile(true)}
                        >
                          <Settings size={16} />
                          Edit
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={handleCancelProfileEdit}
                            disabled={isSavingProfile}
                          >
                            <X size={16} />
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white"
                            onClick={handleSaveProfile}
                            disabled={isSavingProfile}
                          >
                            {isSavingProfile ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            ) : (
                              <Check size={16} />
                            )}
                            Save
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Full Name</label>
                        {isEditingProfile ? (
                          <input
                            type="text"
                            value={profileForm.full_name}
                            onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="Enter your full name"
                          />
                        ) : (
                          <p className="text-lg text-gray-900">{user.full_name || 'Not provided'}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Email Address</label>
                        <p className="text-lg text-gray-900">{user.email || 'Not provided'}</p>
                        {isEditingProfile && (
                          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Phone Number</label>
                        {isEditingProfile ? (
                          <input
                            type="tel"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="+63 XXX XXX XXXX"
                          />
                        ) : (
                          <p className="text-lg text-gray-900">{user.phone || 'Not provided'}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Member Since</label>
                        <p className="text-lg text-gray-900">
                          {user.created_at
                            ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                            : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Order History</h2>

                    {isLoadingOrders ? (
                      <div className="text-center py-12 text-gray-500">Loading orders...</div>
                    ) : orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                              <div className="flex items-center gap-3">
                                <ShoppingBag className="text-gray-600" size={24} />
                                <div>
                                  <p className="font-semibold text-gray-900">Order #{order.order_number}</p>
                                  <p className="text-sm text-gray-600">
                                    Placed on {new Date(order.order_date).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium self-start sm:self-center ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>

                            {/* Order Items Preview */}
                            <div className="py-2 text-sm text-gray-500">
                              {order.order_items?.slice(0, 2).map((item: any) => (
                                <div key={item.id} className="flex justify-between py-1">
                                  <span>{item.quantity}x {item.product_name}</span>
                                  <span>{formatPrice(item.total)}</span>
                                </div>
                              ))}
                              {order.order_items?.length > 2 && (
                                <p className="text-xs italic mt-1">+ {order.order_items.length - 2} more item(s)</p>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t">
                              <div>
                                <p className="text-sm text-gray-600">Total Amount</p>
                                <p className="text-lg font-bold text-gray-900">{formatPrice(order.order_total)}</p>
                              </div>
                              {/* Future: Link to detail page */}
                              <Link to={`/account/orders/${order.id}`}>
                                <Button size="sm" variant="outline">View Details</Button>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Package size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                        <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                        <Link to="/shop">
                          <Button className="bg-gray-900 hover:bg-black text-white font-semibold">Browse Products</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'addresses' && (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <h2 className="text-2xl font-bold">Saved Addresses</h2>
                      <Button size="sm" onClick={handleAddNewAddress} className="bg-gray-900 hover:bg-black text-white w-full sm:w-auto">+ Add New Address</Button>
                    </div>

                    {isLoadingAddresses ? (
                      <div className="text-center py-12 text-gray-500">Loading addresses...</div>
                    ) : addresses.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        {addresses.map((address) => (
                          <div key={address.id} className="border rounded-lg p-5 hover:shadow-md transition-shadow relative group">
                            {address.is_default && (
                              <span className="absolute top-4 right-4 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                                Default
                              </span>
                            )}
                            <div className="mb-4">
                              <p className="font-bold text-gray-900">{address.full_name}</p>
                              <p className="text-gray-600">{address.phone}</p>
                              <div className="mt-2 text-sm text-gray-700">
                                <p>{address.street_address}</p>
                                <p>{address.city}, {address.province} {address.postal_code}</p>
                              </div>
                            </div>
                            <div className="pt-3 border-t flex justify-end gap-3">
                              <button
                                onClick={() => handleEditAddress(address)}
                                className="text-blue-600 text-sm hover:underline"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(address.id)}
                                className="text-red-500 text-sm hover:underline"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <MapPin size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Saved Addresses</h3>
                        <p className="text-gray-600 mb-6">Add an address for faster checkout</p>
                        <Button onClick={handleAddNewAddress}>Add Address</Button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'wishlist' && (
                  <WishlistTab />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full transform transition-all">
            <h3 className="text-xl font-bold mb-4">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full border rounded-md p-2"
                  value={addressForm.full_name}
                  onChange={e => setAddressForm({ ...addressForm, full_name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  required
                  className="w-full border rounded-md p-2"
                  value={addressForm.phone}
                  onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  className="w-full border rounded-md p-2"
                  value={addressForm.street_address}
                  onChange={e => setAddressForm({ ...addressForm, street_address: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    className="w-full border rounded-md p-2"
                    value={addressForm.city}
                    onChange={e => setAddressForm({ ...addressForm, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                  <input
                    type="text"
                    required
                    className="w-full border rounded-md p-2"
                    value={addressForm.province}
                    onChange={e => setAddressForm({ ...addressForm, province: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    value={addressForm.postal_code}
                    onChange={e => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addressForm.is_default}
                      onChange={e => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                      className="rounded text-gray-900 focus:ring-gray-900"
                    />
                    <span className="text-sm font-medium">Set as Default</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => setShowAddressModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" fullWidth className="bg-gray-900 hover:bg-black text-white">
                  {editingAddress ? 'Update Address' : 'Save Address'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
