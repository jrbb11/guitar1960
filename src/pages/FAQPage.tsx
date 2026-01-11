import { useState } from 'react';
import { Plus, Minus, HelpCircle, CreditCard, Truck, Ruler, Mail } from 'lucide-react';

const faqData = [
    {
        category: 'Order',
        icon: <Truck className="w-6 h-6 text-blue-600" />,
        items: [
            {
                question: 'How can I track my order?',
                answer: 'Once your order gets shipped, an email / sms notification is sent to let you know who from our shipping partners will deliver your package along with your order tracking number.'
            }
        ]
    },
    {
        category: 'Payment',
        icon: <CreditCard className="w-6 h-6 text-green-600" />,
        items: [
            {
                question: 'What are your payment methods?',
                answer: 'During the order checkout, you will be asked which payment option you want to use. Right now, you may choose between GCash, Card Payments, and Cash on Delivery.'
            }
        ]
    },
    {
        category: 'Sizing',
        icon: <Ruler className="w-6 h-6 text-purple-600" />,
        items: [
            {
                question: 'How do I know my size?',
                answer: 'We have a size guide on our product page. You can find it in the description tab below each item or at the end of the product photos.'
            }
        ]
    },
    {
        category: 'Contact',
        icon: <Mail className="w-6 h-6 text-orange-600" />,
        items: [
            {
                question: 'How can I contact you?',
                answer: (
                    <span>
                        Didn't find a specific question? Feel free to talk to us here. You can also send us an email at{' '}
                        <a href="mailto:guitarcorp_1960@yahoo.com" className="font-bold hover:underline">guitarcorp_1960@yahoo.com</a>
                        {' '}or message us on{' '}
                        <span className="font-bold">0917-684-6868</span> / <span className="font-bold">0933-859-8820</span>.
                    </span>
                )
            }
        ]
    }
];

export const FAQPage = () => {
    const [openIndex, setOpenIndex] = useState<string | null>(null);

    const toggleAccordion = (index: string) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm mb-4">
                        <HelpCircle className="w-8 h-8 text-gray-900" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Frequently Asked Questions
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Find answers to common questions about our products, shipping, and more.
                    </p>
                </div>

                {/* FAQ Content */}
                <div className="space-y-8">
                    {faqData.map((section, sectionIdx) => (
                        <div key={sectionIdx} className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                                {section.icon}
                                <h2 className="text-xl font-bold text-gray-900">{section.category}</h2>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {section.items.map((item, itemIdx) => {
                                    const uniqueId = `${sectionIdx}-${itemIdx}`;
                                    const isOpen = openIndex === uniqueId;

                                    return (
                                        <div key={itemIdx} className="group">
                                            <button
                                                onClick={() => toggleAccordion(uniqueId)}
                                                className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none hover:bg-gray-50 transition-colors"
                                            >
                                                <span className="text-lg font-medium text-gray-900 pr-8">
                                                    {item.question}
                                                </span>
                                                <span className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                                                    {isOpen ? (
                                                        <Minus className="w-5 h-5 text-gray-500" />
                                                    ) : (
                                                        <Plus className="w-5 h-5 text-gray-500" />
                                                    )}
                                                </span>
                                            </button>
                                            <div
                                                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                                    }`}
                                            >
                                                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                                                    {item.answer}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Still need help? */}
                <div className="mt-12 text-center">
                    <p className="text-gray-600">
                        Can't find what you're looking for?{' '}
                        <a href="mailto:guitarcorp_1960@yahoo.com" className="font-semibold text-gray-900 hover:underline">
                            Contact our support team
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};
