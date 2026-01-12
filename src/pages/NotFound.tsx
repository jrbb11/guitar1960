import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <SEO
                title="Page Not Found"
                description="The page you are looking for does not exist."
            />
            <div className="max-w-md w-full text-center">
                <div className="mb-8 relative inline-block">
                    <div className="text-9xl font-black text-gray-200">404</div>
                    <ShoppingBag
                        size={64}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-900"
                    />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                <p className="text-gray-600 mb-8 text-lg">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        onClick={() => navigate(-1)}
                        variant="outline"
                        className="flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </Button>
                    <Link to="/">
                        <Button className="bg-gray-900 hover:bg-black text-white font-semibold px-8">
                            Go Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
