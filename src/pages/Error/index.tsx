import React from 'react';
import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const SadFaceIcon = () => (
    <svg className="w-24 h-24 text-primary mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14s1.5 2 4 2 4-2 4-2" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9h.01M15 9h.01" />
    </svg>
);

const ErrorPage: React.FC = () => {
    const error = useRouteError();
    const { isDark } = useTheme();
    console.error(error);

    let errorMessage: string;

    if (isRouteErrorResponse(error)) {
        // error is type `ErrorResponse`
        errorMessage = error.data?.message || error.statusText;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    } else {
        errorMessage = 'An unexpected error has occurred.';
    }

    return (
        <div className={`min-h-screen flex items-center justify-center text-center px-4 ${isDark ? 'bg-background text-text-primary' : 'bg-background-light text-text-primary-light'}`}>
            <div className="max-w-md">
                <SadFaceIcon />
                <h1 className="text-4xl font-bold mb-2">Oops! Something went wrong.</h1>
                <p className="text-lg text-text-secondary mb-6">
                    {errorMessage}
                </p>
                <Link to="/" className="btn-primary px-6 py-3 rounded-xl text-base">
                    Go Back to Homepage
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;
