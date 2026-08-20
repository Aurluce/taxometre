'use client';

import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ 
  title = 'Une erreur est survenue', 
  message, 
  onRetry 
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <ExclamationCircleIcon className="w-10 h-10 text-red-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center max-w-md mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}