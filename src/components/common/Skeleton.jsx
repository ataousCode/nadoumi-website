import React from 'react';
import { cn } from '../../utils/cn';

const Skeleton = ({ className, variant = 'rect', ...props }) => {
  const variants = {
    rect: 'rounded-xl',
    circle: 'rounded-full',
    text: 'rounded h-3 w-full mb-2',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200/60',
        variants[variant],
        className
      )}
      {...props}
    />
  );
};

export default Skeleton;
