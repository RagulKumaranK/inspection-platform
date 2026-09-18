import React from 'react';
import { HelpCircle } from 'lucide-react';

const HelpPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
            <div className="text-center space-y-4 max-w-md mx-auto">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-sm inline-flex mb-2">
                    <HelpCircle className="w-12 h-12 text-primary-500" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    This page will be updated soon
                </h1>

                <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                    We are team SafeSecure 🙂
                </p>
            </div>
        </div>
    );
};

export default HelpPage;
