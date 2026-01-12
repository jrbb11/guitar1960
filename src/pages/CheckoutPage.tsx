import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder, type CreateOrderData } from '../services/orders';
import { createAddress, getAddresses, type CustomerAddress } from '../services/profiles';
import { getShippingRate } from '../services/shipping';
import { formatPrice } from '../utils/currency';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { AddressSelector } from '../components/common/AddressSelector';
import { CreditCard, Truck, CheckCircle, Plus, MapPin } from 'lucide-react';

export const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<'shipping' | 'payment' | 'confirm'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);

  // Saved addresses
  const [savedAddresses, setSavedAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | 'new' | null>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'gcash'>('cod');

  const [shippingFee, setShippingFee] = useState(0);

  // Load saved addresses on mount
  useEffect(() => {
    const loadSavedAddresses = async () => {
      if (user) {
        setIsLoadingAddresses(true);
        try {
          const addresses = await getAddresses();
          setSavedAddresses(addresses);

          // Find and select default address, or first one
          const defaultAddr = addresses.find(a => a.is_default) || addresses[0];
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
            setShippingInfo(prev => ({
              ...prev,
              fullName: defaultAddr.full_name,
              phone: defaultAddr.phone,
              address: defaultAddr.street_address,
              city: defaultAddr.city,
              province: defaultAddr.province,
              postalCode: defaultAddr.postal_code || '',
            }));
          } else {
            // No saved addresses - show new address form
            setSelectedAddressId('new');
          }
        } catch (error) {
          console.error('Error loading addresses:', error);
          setSelectedAddressId('new');
        } finally {
          setIsLoadingAddresses(false);
        }
      } else {
        setIsLoadingAddresses(false);
        setSelectedAddressId('new');
      }
    };

    loadSavedAddresses();
  }, [user]);

  // Update shipping fee when city changes
  useEffect(() => {
    const updateShipping = async () => {
      if (shippingInfo.city && shippingInfo.city.length > 2) {
        try {
          const rate = await getShippingRate(shippingInfo.city);
          setShippingFee(rate);
        } catch (error) {
          console.error('Error fetching shipping rate:', error);
        }
      }
    };

    const timeoutId = setTimeout(updateShipping, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [shippingInfo.city]);

  const totalAmount = cart.total + shippingFee;

  const handleShippingSubmit = () => {
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('confirm');
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      alert('You must be logged in to place an order.');
      navigate('/login');
      return;
    }

    setIsProcessing(true);

    try {
      // Map cart items to CreateOrderData format
      const orderItems = cart.items.map(item => ({
        product_id: Number(item.product_id),
        variant_id: item.variant_id ? Number(item.variant_id) : undefined,
        product_name: item.product?.name || 'Unknown Product',
        sku: item.variant?.sku || item.product?.sku,
        quantity: item.quantity,
        unit_price: item.variant?.price || item.product?.price || 0
      }));

      // Construct order data
      const orderData: CreateOrderData = {
        shippingAddress: {
          first_name: shippingInfo.fullName.split(' ')[0] || shippingInfo.fullName,
          last_name: shippingInfo.fullName.split(' ').slice(1).join(' ') || '',
          phone: shippingInfo.phone,
          address_1: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.province,
          postcode: shippingInfo.postalCode,
          country: 'Philippines' // Default country
        },
        items: orderItems,
        paymentMethod: paymentMethod,
        customerNote: '' // Could add a field for this later
      };

      const order = await createOrder(orderData);
      console.log('Order created successfully:', order);

      // Auto-save address as default for future use
      try {
        await createAddress({
          full_name: shippingInfo.fullName,
          phone: shippingInfo.phone,
          street_address: shippingInfo.address,
          city: shippingInfo.city,
          province: shippingInfo.province,
          postal_code: shippingInfo.postalCode,
          is_default: true // Set as default
        });
      } catch (err) {
        // Don't block success if address save fails
        console.warn('Failed to auto-save address:', err);
      }

      clearCart();
      navigate('/order-success');
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="flex items-center gap-2 md:gap-4">
            <div className={`flex items-center gap-1 md:gap-2 ${step === 'shipping' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${step === 'shipping' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                <Truck size={16} className="md:w-5 md:h-5" />
              </div>
              <span className="font-medium text-sm md:text-base">Shipping</span>
            </div>
            <div className="w-6 md:w-12 h-0.5 bg-gray-300" />
            <div className={`flex items-center gap-1 md:gap-2 ${step === 'payment' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                <CreditCard size={16} className="md:w-5 md:h-5" />
              </div>
              <span className="font-medium text-sm md:text-base">Payment</span>
            </div>
            <div className="w-6 md:w-12 h-0.5 bg-gray-300" />
            <div className={`flex items-center gap-1 md:gap-2 ${step === 'confirm' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${step === 'confirm' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                <CheckCircle size={16} className="md:w-5 md:h-5" />
              </div>
              <span className="font-medium text-sm md:text-base">Confirm</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {/* Shipping Information */}
            {step === 'shipping' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">Shipping Address</h2>

                {isLoadingAddresses ? (
                  <div className="text-center py-8 text-gray-500">Loading saved addresses...</div>
                ) : (
                  <div className="space-y-4">
                    {/* Saved Address Cards */}
                    {savedAddresses.length > 0 && (
                      <div className="space-y-3">
                        {savedAddresses.map((addr) => (
                          <label
                            key={addr.id}
                            className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedAddressId === addr.id
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                              }`}
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="radio"
                                name="address"
                                value={addr.id}
                                checked={selectedAddressId === addr.id}
                                onChange={() => {
                                  setSelectedAddressId(addr.id);
                                  setShippingInfo({
                                    fullName: addr.full_name,
                                    email: user?.email || '',
                                    phone: addr.phone,
                                    address: addr.street_address,
                                    city: addr.city,
                                    province: addr.province,
                                    postalCode: addr.postal_code || '',
                                  });
                                }}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">{addr.full_name}</span>
                                  {addr.is_default && (
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Default</span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">{addr.phone}</p>
                                <p className="text-sm text-gray-600">
                                  {addr.street_address}, {addr.city}, {addr.province}
                                  {addr.postal_code && `, ${addr.postal_code}`}
                                </p>
                              </div>
                              <MapPin size={20} className="text-gray-400 flex-shrink-0" />
                            </div>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Add New Address Option */}
                    <label
                      className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedAddressId === 'new'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 border-dashed'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="address"
                          value="new"
                          checked={selectedAddressId === 'new'}
                          onChange={() => {
                            setSelectedAddressId('new');
                            setShippingInfo({
                              fullName: user?.full_name || '',
                              email: user?.email || '',
                              phone: '',
                              address: '',
                              city: '',
                              province: '',
                              postalCode: '',
                            });
                          }}
                        />
                        <Plus size={20} className="text-gray-500" />
                        <span className="font-medium text-gray-700">Use a new address</span>
                      </div>
                    </label>

                    {/* New Address Form (shown when 'new' is selected) */}
                    {selectedAddressId === 'new' && (
                      <div className="mt-4 pt-4 border-t space-y-4">
                        <Input
                          label="Full Name"
                          required
                          value={shippingInfo.fullName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Email"
                            type="email"
                            required
                            value={shippingInfo.email}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                          />
                          <Input
                            label="Phone"
                            required
                            value={shippingInfo.phone}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                          />
                        </div>
                        <Input
                          label="Street Address"
                          required
                          value={shippingInfo.address}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        />
                        <AddressSelector
                          defaultRegion=""
                          defaultProvince={shippingInfo.province}
                          defaultCity={shippingInfo.city}
                          onSelect={(addr) => {
                            setShippingInfo(prev => ({
                              ...prev,
                              city: addr.city,
                              province: addr.province,
                              postalCode: ''
                            }));
                          }}
                        />
                        <Input
                          label="Postal Code (Optional)"
                          value={shippingInfo.postalCode}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                        />
                      </div>
                    )}

                    <div className="mt-6">
                      <Button
                        type="button"
                        fullWidth
                        size="lg"
                        onClick={handleShippingSubmit}
                        disabled={!shippingInfo.city || !shippingInfo.address || !shippingInfo.fullName}
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Payment Method */}
            {step === 'payment' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                <form onSubmit={handlePaymentSubmit}>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:border-blue-600">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                      />
                      <div className="flex-1">
                        <p className="font-semibold">Cash on Delivery</p>
                        <p className="text-sm text-gray-600">Pay when you receive your order</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:border-blue-600">
                      <input
                        type="radio"
                        name="payment"
                        value="gcash"
                        checked={paymentMethod === 'gcash'}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                      />
                      <div className="flex-1">
                        <p className="font-semibold">GCash</p>
                        <p className="text-sm text-gray-600">Pay via GCash mobile wallet</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:border-blue-600 opacity-50">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        disabled
                      />
                      <div className="flex-1">
                        <p className="font-semibold">Credit/Debit Card</p>
                        <p className="text-sm text-gray-600">Coming soon</p>
                      </div>
                    </label>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep('shipping')}
                      fullWidth
                    >
                      Back
                    </Button>
                    <Button type="submit" fullWidth size="lg">
                      Review Order
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Confirm Order */}
            {step === 'confirm' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">Confirm Your Order</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Shipping To:</h3>
                    <p>{shippingInfo.fullName}</p>
                    <p>{shippingInfo.address}</p>
                    <p>{shippingInfo.city}, {shippingInfo.province} {shippingInfo.postalCode}</p>
                    <p>{shippingInfo.phone}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Payment Method:</h3>
                    <p className="capitalize">{paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Order Items:</h3>
                    <div className="space-y-3">
                      {cart.items.map((item) => (
                        <div key={item.id} className="flex gap-3 text-sm">
                          <img
                            src={item.variant?.images?.[0] || item.product?.image_url || item.product?.gallery_urls?.[0] || '/placeholder.jpg'}
                            alt={item.product?.name}
                            className="w-16 h-16 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3C/svg%3E';
                            }}
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.product?.name}</p>
                            {item.variant && (
                              <div className="text-gray-600 text-xs">
                                {(item.variant.attributes?.Size || item.variant.size) && (
                                  <p>Size: {item.variant.attributes?.Size || item.variant.size}</p>
                                )}
                                {(item.variant.attributes?.Color || item.variant.color) && (
                                  <p>Color: {item.variant.attributes?.Color || item.variant.color}</p>
                                )}
                              </div>
                            )}
                            <p className="text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold">
                            {formatPrice((item.variant?.price || item.product?.base_price || 0) * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('payment')}
                    fullWidth
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    isLoading={isProcessing}
                    fullWidth
                    size="lg"
                  >
                    Place Order
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({cart.itemCount} items)</span>
                  <span>{formatPrice(cart.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shippingFee === 0 ? 'Calculated...' : formatPrice(shippingFee)}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">{formatPrice(totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
