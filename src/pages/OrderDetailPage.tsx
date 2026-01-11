import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard, Calendar, AlertTriangle } from 'lucide-react';
import { getOrderById, cancelOrder } from '../services/orders';
import { formatPrice } from '../utils/currency';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';

export const OrderDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!id) return;

            try {
                const data = await getOrderById(Number(id));
                setOrder(data);
            } catch (err) {
                console.error('Error fetching order:', err);
                setError('Failed to load order details. It may not exist or belongs to another user.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);



    const handleCancelOrder = async () => {
        setShowCancelModal(false);
        const toastId = toast.loading('Cancelling order...');

        try {
            await cancelOrder(order.id);
            // Refresh order data
            const updatedOrder = await getOrderById(order.id);
            setOrder(updatedOrder);
            toast.success('Order cancelled successfully', { id: toastId });
        } catch (err) {
            console.error('Error cancelling order:', err);
            toast.error('Failed to cancel order', { id: toastId });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-500">Loading order details...</div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="bg-white rounded-lg shadow p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
                        <p className="text-gray-600 mb-6">{error || "The order you're looking for could not be found."}</p>
                        <Link to="/account/orders">
                            <Button>Back to Orders</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Back Navigation */}
                    <Link to="/account/orders" className="flex items-center text-gray-600 hover:text-gray-900 mb-6 w-fit">
                        <ArrowLeft size={20} className="mr-2" />
                        Back to My Orders
                    </Link>

                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_number}</h1>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>
                                <p className="text-gray-500 flex items-center gap-2">
                                    <Calendar size={16} />
                                    Placed on {new Date(order.order_date).toLocaleDateString()} at {new Date(order.order_date).toLocaleTimeString()}
                                </p>
                            </div>
                            <div className="text-left md:text-right">
                                <p className="text-sm text-gray-500">Total Amount</p>
                                <p className="text-2xl font-bold text-gray-900 mb-2">{formatPrice(order.order_total)}</p>
                                {order.status === 'pending' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowCancelModal(true)}
                                        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                                    >
                                        Cancel Order
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Order Items */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <div className="p-4 border-b bg-gray-50">
                                    <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                                        <Package size={20} />
                                        Items ({order.order_items.length})
                                    </h2>
                                </div>
                                <div className="divide-y">
                                    {order.order_items.map((item: any) => (
                                        <div key={item.id} className="p-4 flex gap-4">
                                            {/* Placeholder for product image since we don't have it in order_items yet */}
                                            <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                                                <Package className="text-gray-400" size={32} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">{item.product_name}</h3>
                                                        {item.sku && <p className="text-sm text-gray-500">SKU: {item.sku}</p>}
                                                        <div className="text-sm text-gray-500 mt-1">
                                                            ID: {item.product_id}
                                                            {item.variant_id && ` / Var: ${item.variant_id}`}
                                                        </div>
                                                    </div>
                                                    <p className="font-medium text-gray-900">{formatPrice(item.total)}</p>
                                                </div>
                                                <div className="flex justify-between items-end mt-2">
                                                    <p className="text-sm text-gray-600">Qty: {item.quantity} x {formatPrice(item.unit_price)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Details */}
                        <div className="space-y-6">
                            {/* Order Summary */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(order.order_subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span>{formatPrice(order.shipping_total)}</span>
                                    </div>
                                    <div className="border-t pt-3 flex justify-between font-bold text-gray-900 text-base">
                                        <span>Total</span>
                                        <span>{formatPrice(order.order_total)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <MapPin size={18} />
                                    Shipping Address
                                </h3>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p className="font-medium text-gray-900">
                                        {order.shipping_first_name} {order.shipping_last_name}
                                    </p>
                                    <p>{order.shipping_phone}</p>
                                    <p>{order.shipping_address_1}</p>
                                    {order.shipping_address_2 && <p>{order.shipping_address_2}</p>}
                                    <p>{order.shipping_city}, {order.shipping_state} {order.shipping_postcode}</p>
                                    <p>{order.shipping_country}</p>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <CreditCard size={18} />
                                    Payment Info
                                </h3>
                                <div className="text-sm text-gray-600">
                                    <p className="mb-1">Method: <span className="font-medium text-gray-900 capitalize">{order.payment_method}</span></p>
                                    <p>Status: <span className="font-medium text-gray-900 capitalize">{order.status}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cancel Confirmation Modal */}
                <Modal
                    isOpen={showCancelModal}
                    onClose={() => setShowCancelModal(false)}
                    title="Cancel Order"
                >
                    <div>
                        <div className="flex items-center gap-3 text-amber-600 bg-amber-50 p-3 rounded-lg mb-4">
                            <AlertTriangle className="flex-shrink-0" size={24} />
                            <p className="text-sm">This action cannot be undone.</p>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to cancel Order <span className="font-bold text-gray-900">#{order.order_number}</span>?
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowCancelModal(false)}>
                                Keep Order
                            </Button>
                            <Button
                                className="bg-red-600 hover:bg-red-700 text-white border-transparent"
                                onClick={handleCancelOrder}
                            >
                                Yes, Cancel Order
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};
