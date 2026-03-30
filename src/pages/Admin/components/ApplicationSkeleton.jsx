import React from 'react';
import Skeleton from '../../../components/common/Skeleton.jsx';

export const ListSkeleton = () => (
  <div className="space-y-4">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-white p-6 rounded-[24px] border border-gray-100 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4 flex-1">
          <Skeleton className="w-12 h-12 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="w-48 h-5" />
            <Skeleton className="w-32 h-3" />
          </div>
        </div>
        <div className="hidden md:flex flex-col items-center gap-2">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-16 h-3" />
        </div>
        <div className="flex items-center gap-8">
          <Skeleton className="w-24 h-8 rounded-full" />
          <Skeleton className="w-8 h-8 rounded-xl" />
        </div>
      </div>
    ))}
  </div>
);

export const DetailSkeleton = () => (
  <div className="space-y-10">
    {/* Header Skeleton */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="space-y-4">
        <Skeleton className="w-64 h-10" />
        <Skeleton className="w-96 h-6" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="w-32 h-12 rounded-2xl" />
        <Skeleton className="w-32 h-12 rounded-2xl" />
      </div>
    </div>

    {/* Content Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 space-y-6">
          <Skeleton className="w-40 h-8" />
          <div className="grid grid-cols-2 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-full h-8" />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 space-y-6">
          <Skeleton className="w-40 h-8" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="w-full h-20 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-8">
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 space-y-6">
          <Skeleton className="w-40 h-8" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-full h-12 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
