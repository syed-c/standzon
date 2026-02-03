'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Global Application Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Something went wrong!</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                    We apologize for the inconvenience. Our team has been notified.
                </p>
                <button
                    onClick={() => reset()}
                    className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
