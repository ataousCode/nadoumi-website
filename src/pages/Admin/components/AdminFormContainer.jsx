import React from 'react';
import Button from '../../../components/common/Button';
import { cn } from '../../../utils/cn';

const AdminFormContainer = ({ 
  onSubmit, 
  isLoading, 
  children, 
  submitLabel = "Save Changes", 
  maxWidth = "max-w-6xl",
  className = "" 
}) => {
  return (
    <form onSubmit={onSubmit} className={cn("space-y-12 pb-32 mx-auto", maxWidth, className)}>
      {children}
      
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <Button 
          type="submit" 
          isLoading={isLoading}
          size="lg" 
          shadow 
          className="px-24 rounded-full border-4 border-white shadow-2xl scale-105 active:scale-100 transition-all"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default AdminFormContainer;
