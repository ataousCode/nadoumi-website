import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  ChevronRightIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { adminService } from '../../api/admin.service';
import AdminLoading from '../../features/admin/components/AdminLoading';
import AdminError from '../../features/admin/components/AdminError';
import StatusBadge from '../../features/admin/components/StatusBadge';
import { usePresence } from '../../hooks/usePresence';
import { cn } from '../../utils/cn';

const ApplicationsList = () => {
  const { isOnline } = usePresence();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-applications', statusFilter, searchTerm, currentPage],
    queryFn: () => adminService.getAllApplications({
      status: statusFilter === 'all' ? undefined : statusFilter,
      search: searchTerm || undefined,
      page: currentPage,
      limit: itemsPerPage
    }),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const applications = data?.data?.applications || [];
  const pagination = data?.data?.pagination || { totalPages: 1, total: 0 };

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'interview', label: 'Interview' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' },
  ];

  if (isLoading) {
    return <AdminLoading message="Loading Applications..." subtext="Retrieving student scholarship submissions." />;
  }

  if (isError) {
    return <AdminError message={error?.message} onRetry={refetch} />;
  }

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-none mb-3">Applications</h1>
          <p className="text-lg text-gray-400 font-medium font-inter">Manage and track student scholarship journey.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Search */}
          <div className="relative group">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search student or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl w-full sm:w-64 text-sm font-medium placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-50/50 focus:border-blue-600 transition-all"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <FunnelIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-10 pr-10 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-50/50 focus:border-blue-600 transition-all cursor-pointer"
            >
              {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Main List */}
      {applications.length === 0 ? (
        <div className="bg-white p-20 rounded-[40px] border border-gray-100 text-center">
          <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <DocumentTextIcon className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2">No applications found</h3>
          <p className="text-gray-400 font-medium">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {applications.map((app) => (
            <Link 
              key={app.id} 
              to={`/admin/applications/${app.id}`}
              className="group bg-white p-6 rounded-[28px] border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors relative">
                  <UserCircleIcon className="w-8 h-8" />
                  {isOnline(app.studentId) && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-gray-900 tracking-tight">
                      {app.student?.firstName} {app.student?.lastName}
                    </h3>
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md">
                      #{app.applicationId}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 font-medium flex items-center gap-2">
                    {app.scholarship?.title}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-10 text-center">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">Country</p>
                    <p className="text-sm font-black text-gray-700">{app.student?.country || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">Submitted</p>
                    <div className="flex items-center gap-1.5 text-sm font-black text-gray-700">
                      <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                      {new Date(app.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <StatusBadge status={app.status} />
                  <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ChevronRightIcon className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 py-10">
          {[...Array(pagination.totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={cn(
                "w-12 h-12 rounded-2xl font-black text-sm transition-all",
                currentPage === i + 1 
                  ? "bg-gray-900 text-white shadow-xl shadow-gray-900/20" 
                  : "bg-white border border-gray-100 text-gray-400 hover:border-blue-600 hover:text-blue-600"
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;
