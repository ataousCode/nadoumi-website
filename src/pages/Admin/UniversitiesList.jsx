import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  PlusIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  ChevronRightIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { getUniversities, deleteUniversity, updateUniversityStatus } from '../../api/universities';
import AdminLoading from '../../features/admin/components/AdminLoading';
import AdminError from '../../features/admin/components/AdminError';
import { useToast } from '../../context/ToastContext';
import { cn } from '../../utils/cn';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const UniversitiesList = () => {
  const { success, error: toastError } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-universities', cityFilter, searchTerm, currentPage],
    queryFn: () => getUniversities({
      city: cityFilter === 'all' ? undefined : cityFilter,
      search: searchTerm || undefined,
      page: currentPage,
      limit: itemsPerPage,
      isAdmin: true
    }),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await deleteUniversity(deleteId);
      success('University removed successfully');
      setDeleteId(null);
      refetch();
    } catch (err) {
      toastError(err.message || 'Failed to delete university');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusToggle = async (e, id, currentStatus) => {
    e.preventDefault();
    e.stopPropagation();
    const nextStatus = currentStatus === 'active' ? 'draft' : 'active';
    
    try {
      await updateUniversityStatus(id, nextStatus);
      success(`Institutional status updated to ${nextStatus}`);
      refetch();
    } catch (err) {
      toastError(err.message || 'Failed to update status');
    }
  };

  const universities = data?.data?.universities || [];
  const pagination = data?.data?.pagination || { totalPages: 1, total: 0 };

  if (isLoading) {
    return <AdminLoading message="Loading Universities..." subtext="Accessing the institutional database." />;
  }

  if (isError) {
    return <AdminError message={error?.message} onRetry={refetch} />;
  }

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-none mb-3">Universities</h1>
          <p className="text-lg text-gray-400 font-medium font-inter">Manage partner institutions and their profiles.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <Link 
            to="/admin/universities/new" 
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-gray-900/10"
          >
            <PlusIcon className="w-4 h-4" />
            Add University
          </Link>

          {/* Search */}
          <div className="relative group">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl w-full sm:w-64 text-sm font-medium placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-50/50 focus:border-blue-600 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      {universities.length === 0 ? (
        <div className="bg-white p-20 rounded-[40px] border border-gray-100 text-center">
          <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <BuildingOfficeIcon className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2">No universities found</h3>
          <p className="text-gray-400 font-medium">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {universities.map((uni) => (
            <div 
              key={uni.id} 
              className="group bg-white rounded-[32px] border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/5 transition-all flex flex-col overflow-hidden"
            >
              <Link 
                to={`/admin/universities/${uni.id}`}
                className="p-6 flex flex-col gap-6"
              >
                <div className="flex items-start justify-between">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100 group-hover:border-blue-100 transition-colors">
                    {uni.logo ? (
                      <img src={uni.logo} alt={uni.name} className="w-full h-full object-cover" />
                    ) : (
                      <BuildingOfficeIcon className="w-8 h-8 text-gray-300" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {uni.isRecommended && (
                      <div className="bg-emerald-500 text-white p-1 rounded-lg">
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      </div>
                    )}
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      uni.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'
                    }`}>
                      {uni.status}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight mb-1 group-hover:text-blue-600 transition-colors">
                    {uni.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                    <MapPinIcon className="w-4 h-4" />
                    {uni.city}, {uni.province}
                  </div>
                  {uni.createdBy && (
                    <div className="flex items-center gap-1.5 mt-3 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                      <UserIcon className="w-3 h-3" />
                      Created by {uni.createdBy.name}
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">Programs</span>
                    <span className="text-sm font-black text-gray-700">{uni.numberOfPrograms || 0} Listed</span>
                  </div>
                  <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ChevronRightIcon className="w-5 h-5" />
                  </div>
                </div>
              </Link>

              {/* Admin Actions Footer - Outside of Link */}
              <div className="bg-gray-50/50 p-4 border-t border-gray-50 flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => handleStatusToggle(e, uni.id, uni.status)}
                  className={cn(
                    "flex-1 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm",
                    uni.status === 'active' 
                      ? "bg-white text-emerald-600 border-emerald-100 hover:bg-emerald-50" 
                      : "bg-white text-gray-400 border-gray-100 hover:bg-gray-50"
                  )}
                >
                  {uni.status === 'active' ? 'Unpublish' : 'Publish Now'}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDeleteId(uni.id);
                  }}
                  className="px-4 py-2.5 bg-rose-50 text-rose-500 border border-rose-100 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
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
              className={`w-12 h-12 rounded-2xl font-black text-sm transition-all ${
                currentPage === i + 1 
                  ? "bg-gray-900 text-white shadow-xl shadow-gray-900/20" 
                  : "bg-white border border-gray-100 text-gray-400 hover:border-blue-600 hover:text-blue-600"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
      {/* Confirm Deletion */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete University"
        message="Are you sure you want to delete this university? All related scholarships and programs will also be removed. This action cannot be undone."
        confirmText="Delete Institutional Data"
        variant="danger"
      />
    </div>
  );
};

export default UniversitiesList;
