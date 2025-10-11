'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MessageSquare } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-4xl shadow-xl rounded-2xl">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-4xl font-extrabold text-red-600">
                        Contact Us
                    </CardTitle>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Have questions, feedback, or need help? We're here for you.
                    </p>
                </CardHeader>

                <CardContent className="space-y-10 text-gray-700 text-lg">
                    {/* Contact Options */}000000
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="flex flex-col items-center space-y-3">
                            <Mail className="h-10 w-10 text-red-600" />
                            <h3 className="font-semibold text-xl">Email Us</h3>
                            <p className="text-gray-600 text-base">
                                <a
                                    href="mailto:support@campuszomato.com"
                                    className="text-red-600 underline"
                                >
                                    support@campuszomato.com
                                </a>
                            </p>
                        </div>

                        <div className="flex flex-col items-center space-y-3">
                            <Phone className="h-10 w-10 text-red-600" />
                            <h3 className="font-semibold text-xl">Call Us</h3>
                            <p className="text-gray-600 text-base">
                                Not available at the moment. Please email us instead.
                            </p>
                        </div>

                        <div className="flex flex-col items-center space-y-3">
                            <MessageSquare className="h-10 w-10 text-red-600" />
                            <h3 className="font-semibold text-xl">Live Chat</h3>
                            <p className="text-gray-600 text-base">
                                Not available at the moment. Please email us instead.
                            </p>
                        </div>
                    </div>

                    {/* Closing Note */}
                    <div className="text-center">
                        <p className="text-lg font-medium text-gray-800">
                            We aim to respond to all inquiries within{" "}
                            <span className="text-red-600">24 hours</span>.
                            Your satisfaction is our priority!
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
