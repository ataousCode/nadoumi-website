import React from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Button from '../../../components/common/Button';
import { cn } from '../../../utils/cn';

const AdminError = ({ 
  title = "Connection Interrupted", 
  message = "We're having trouble reaching the server. Please check your connection and try again.",
  onRetry,
  className = ""
}) => {
  return (
    <div className={cn(
      "bg-rose-50/50 border border-rose-100 p-12 rounded-[48px] text-center max-w-2xl mx-auto my-12 animate-fadeIn",
      className
    )}>
      <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner">
        <ExclamationTriangleIcon className="w-10 h-10" />
      </div>
      
      <h3 className="text-2xl font-black text-gray-900 tracking-tighter mb-4">
        {title}
      </h3>
      
      <p className="text-gray-500 font-medium mb-10 max-w-md mx-auto leading-relaxed">
        {message}
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {onRetry && (
          <Button 
            onClick={onRetry}
            variant="primary"
            className="px-10 rounded-2xl bg-gray-900 hover:bg-rose-600"
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Retry Connection
          </Button>
        )}
        <Button 
          variant="secondary" 
          onClick={() => window.location.href = '/admin'}
          className="px-10 rounded-2xl border-gray-200"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default AdminError;
