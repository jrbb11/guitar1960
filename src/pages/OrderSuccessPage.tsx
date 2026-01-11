import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '../components/common/Button';

export const OrderSuccessPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. We've received your order and will start processing it shortly.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Order Number</p>
            <p className="text-xl font-bold text-gray-900">#G1960-{Date.now().toString().slice(-6)}</p>
          </div>
          
          <p className="text-sm text-gray-600 mb-8">
            A confirmation email has been sent to your email address with your order details.
          </p>
          
          <div className="space-y-3">
            <Link to="/account/orders">
              <Button fullWidth size="lg">
                View Order
              </Button>
            </Link>
            <Link to="/shop">
              <Button fullWidth variant="outline">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
