import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';

export const ForgotPasswordPage = () => {
    const { resetPassword, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!email) {
            setError('Please enter your email address');
            return;
        }

        try {
            await resetPassword(email);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send reset email. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-4">
                        <KeyRound className="text-white" size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
                    <p className="mt-2 text-gray-600">No worries, we'll send you reset instructions.</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3"
                            >
                                {isLoading ? 'Sending Instructions...' : 'Reset Password'}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 text-sm">
                                <p className="font-semibold">Check your email!</p>
                                <p>We've sent password reset instructions to {email}.</p>
                            </div>
                            <p className="text-sm text-gray-500">
                                Didn't receive the email? Check your spam folder or try again.
                            </p>
                            <button
                                onClick={() => setSuccess(false)}
                                className="text-sm font-semibold text-gray-900 hover:underline"
                            >
                                Try another email
                            </button>
                        </div>
                    )}
                </div>

                {/* Back to Login */}
                <div className="text-center mt-6">
                    <Link to="/login" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors">
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Log In
                    </Link>
                </div>
            </div>
        </div>
    );
};
