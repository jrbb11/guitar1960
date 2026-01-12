import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from '../components/common/Button';
import { submitContactForm } from '../services/contact';

export const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast.error('Please fill in all fields');
            return;
        }

        setIsSubmitting(true);
        try {
            await submitContactForm(formData);
            toast.success('Message sent successfully! We\'ll get back to you soon.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        Have questions or need assistance? We're here to help!
                        Reach out to us and we'll respond as soon as possible.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Contact Information */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-8 h-full">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900">Get in Touch</h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-100 p-3 rounded-lg">
                                        <MapPin className="text-blue-600" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Visit Us</h3>
                                        <p className="text-gray-600 text-sm mt-1">
                                            123 Fashion Street<br />
                                            Makati City, Metro Manila<br />
                                            Philippines 1234
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-green-100 p-3 rounded-lg">
                                        <Phone className="text-green-600" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Call Us</h3>
                                        <p className="text-gray-600 text-sm mt-1">
                                            +63 912 345 6789<br />
                                            +63 2 8123 4567
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-purple-100 p-3 rounded-lg">
                                        <Mail className="text-purple-600" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Email Us</h3>
                                        <p className="text-gray-600 text-sm mt-1">
                                            support@guitar1960.com<br />
                                            orders@guitar1960.com
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-orange-100 p-3 rounded-lg">
                                        <Clock className="text-orange-600" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Business Hours</h3>
                                        <p className="text-gray-600 text-sm mt-1">
                                            Monday - Friday: 9AM - 6PM<br />
                                            Saturday: 10AM - 4PM<br />
                                            Sunday: Closed
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="mt-8 pt-6 border-t">
                                <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
                                <div className="flex gap-3">
                                    <a
                                        href="https://facebook.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-gray-100 hover:bg-blue-600 hover:text-white p-3 rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                                        </svg>
                                    </a>
                                    <a
                                        href="https://instagram.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-gray-100 hover:bg-pink-600 hover:text-white p-3 rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    </a>
                                    <a
                                        href="https://twitter.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-gray-100 hover:bg-sky-500 hover:text-white p-3 rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900">Send us a Message</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject *
                                    </label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                                        required
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="General Inquiry">General Inquiry</option>
                                        <option value="Order Status">Order Status</option>
                                        <option value="Product Question">Product Question</option>
                                        <option value="Returns & Exchanges">Returns & Exchanges</option>
                                        <option value="Wholesale Inquiry">Wholesale Inquiry</option>
                                        <option value="Feedback">Feedback</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Message *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="How can we help you?"
                                        rows={6}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={isSubmitting}
                                    className="w-full md:w-auto bg-gray-900 hover:bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 px-8"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            Send Message
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mt-12 max-w-6xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-900">Find Us on the Map</h2>
                        </div>
                        <div className="h-80 bg-gray-200 flex items-center justify-center">
                            <div className="text-center text-gray-500">
                                <MapPin size={48} className="mx-auto mb-2 opacity-50" />
                                <p>Map integration available</p>
                                <p className="text-sm">Google Maps or similar can be embedded here</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
