import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  PlusIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  ChevronRightIcon,
  UserIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { getScholarships, deleteScholarship, updateScholarshipStatus } from '../../api/scholarships';
import AdminLoading from './components/AdminLoading';
import AdminError from './components/AdminError';
import StatusBadge from './components/StatusBadge';
import { useToast } from '../../context/ToastContext';
import { cn } from '../../utils/cn';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const ScholarshipsList = () => {
  const { success, error: toastError } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [degreeFilter, setDegreeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-scholarships', categoryFilter, degreeFilter, searchTerm, currentPage],
    queryFn: () => getScholarships({
      scholarshipCategory: categoryFilter === 'all' ? undefined : categoryFilter,
      programCategory: degreeFilter === 'all' ? undefined : degreeFilter,
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
      await deleteScholarship(deleteId);
      success('Scholarship deleted successfully');
      setDeleteId(null);
      refetch();
    } catch (err) {
      toastError(err.message || 'Failed to delete scholarship');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusToggle = async (e, id, currentStatus) => {
    e.preventDefault();
    e.stopPropagation();
    const nextStatus = currentStatus === 'published' ? 'closed' : 'published';
    
    try {
      await updateScholarshipStatus(id, nextStatus);
      success(`Scholarship status updated to ${nextStatus}`);
      refetch();
    } catch (err) {
      toastError(err.message || 'Failed to update status');
    }
  };

  const scholarships = data?.data?.scholarships || [];
  const pagination = data?.data?.pagination || { totalPages: 1, total: 0 };

  const categories = ['Self_funded', 'Partial', 'CSC', 'Province', 'Universities', 'HSK', 'Type_A', 'Type_B', 'Type_C', 'Other'];
  const degrees = ['Language', 'Bachelor', 'Master', 'PhD'];

  if (isLoading) {
    return <AdminLoading message="Loading Scholarships..." subtext="Accessing the scholarship database." />;
  }

  if (isError) {
    return <AdminError message={error?.message} onRetry={refetch} />;
  }

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-none mb-3">Scholarships</h1>
          <p className="text-lg text-gray-400 font-medium font-inter">Manage and publish scholarship opportunities.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <Link 
            to="/admin/scholarships/new" 
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-gray-900/10"
          >
            <PlusIcon className="w-4 h-4" />
            New Scholarship
          </Link>

          {/* Search */}
          <div className="relative group">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search title or university..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl w-full sm:w-64 text-sm font-medium placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-50/50 focus:border-blue-600 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-2 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 px-4 py-2 border-r border-gray-50 mr-2">
            <FunnelIcon className="w-4 h-4 text-gray-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Filters</span>
        </div>
        
        <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10 border-transparent transition-all"
        >
            <option value="all">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>)}
        </select>

        <select 
            value={degreeFilter}
            onChange={(e) => setDegreeFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10 border-transparent transition-all"
        >
            <option value="all">All Degrees</option>
            {degrees.map(deg => <option key={deg} value={deg}>{deg}</option>)}
        </select>
      </div>

      {/* Main List */}
      {scholarships.length === 0 ? (
        <div className="bg-white p-20 rounded-[40px] border border-gray-100 text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <AcademicCapIcon className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2">No scholarships found</h3>
          <p className="text-gray-400 font-medium">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {scholarships.map((sch) => (
            <div 
              key={sch.id}
              className="group bg-white rounded-[32px] border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/5 transition-all overflow-hidden"
            >
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <Link 
                  to={`/admin/scholarships/${sch.id}`}
                  className="flex flex-1 items-center gap-5"
                >
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors relative">
                    <AcademicCapIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-black text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">
                          {sch.title}
                      </h3>
                      {sch.isRecommended && (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-tighter flex items-center gap-1">
                          <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          Featured
                        </span>
                      )}
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-tighter">
                        {sch.scholarshipCategory?.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-sm text-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-sm">
                        {sch.universities?.length > 0 
                          ? sch.universities.map(u => u.name).join(', ') 
                          : (sch.universityJson?.name || 'Multiple Universities')}
                      </p>
                      {sch.createdBy && (
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-300 uppercase tracking-widest border-l border-gray-100 pl-4 whitespace-nowrap">
                          <UserIcon className="w-3 h-3" />
                          Created by {sch.createdBy.name}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>

                <div className="flex flex-wrap items-center gap-8 bg-gray-50/50 p-4 rounded-2xl md:bg-transparent md:p-0">
                  <div className="flex items-center gap-10">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">Slots</p>
                      <p className="text-sm font-black text-gray-700">{sch.availableSlots}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">Deadline</p>
                      <div className="flex items-center gap-1.5 text-sm font-black text-gray-700">
                        <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                        {new Date(sch.applicationDeadline).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 border-l border-gray-100 pl-8">
                    <StatusBadge status={sch.status} />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleStatusToggle(e, sch.id, sch.status)}
                        title={sch.status === 'published' ? 'Close Applications' : 'Publish Scholarship'}
                        className={cn(
                          "p-2.5 rounded-xl transition-all border shadow-sm",
                          sch.status === 'published' 
                            ? "bg-white text-gray-400 border-gray-100 hover:bg-gray-50" 
                            : "bg-white text-blue-600 border-blue-100 hover:bg-blue-50"
                        )}
                      >
                        {sch.status === 'published' ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeleteId(sch.id);
                        }}
                        title="Delete Scholarship"
                        className="p-2.5 bg-rose-50 text-rose-500 border border-rose-100 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
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
        title="Delete Scholarship"
        message="Are you sure you want to delete this scholarship? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default ScholarshipsList;
