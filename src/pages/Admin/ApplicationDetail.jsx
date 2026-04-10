import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeftIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  DocumentArrowUpIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { 
  UserCircleIcon as UserCircleSolid,
  DocumentTextIcon as DocumentTextSolid,
  DocumentPlusIcon as DocumentPlusSolid
} from '@heroicons/react/24/solid';
import { adminService } from '../../api/admin.service';
import AdminLoading from '../../features/admin/components/AdminLoading';
import AdminError from '../../features/admin/components/AdminError';
import { usePresence } from '../../hooks/usePresence';
import StatusBadge from '../../features/admin/components/StatusBadge';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isOnline } = usePresence();
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-application', id],
    queryFn: () => adminService.getApplicationById(id),
    refetchOnWindowFocus: false,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (statusData) => adminService.updateApplicationStatus(id, statusData),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-application', id]);
      queryClient.invalidateQueries(['admin-applications']);
      setSelectedStatus('');
      setStatusNote('');
    }
  });

  const app = data?.data;

  if (isLoading) {
    return <AdminLoading message="Loading Application details..." subtext="Syncing scholarship submission data." />;
  }

  if (isError || !app) {
    return <AdminError title="Application Not Found" message={error?.message || "This application might have been removed."} onRetry={refetch} />;
  }

  const handleStatusUpdate = () => {
    if (!selectedStatus) return;
    updateStatusMutation.mutate({
      status: selectedStatus,
      adminNote: statusNote // Changed from note to adminNote to match backend
    });
  };

  const handleAdminDocUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'admission'); // Default for admin uploads

    try {
      await adminService.uploadAdminDoc(id, formData);
      queryClient.invalidateQueries(['admin-application', id]);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <button 
          onClick={() => navigate('/admin/applications')}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold transition-all group"
        >
          <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Applications
        </button>
        <div className="flex items-center gap-4">
          <StatusBadge status={app.status} className="py-2.5 px-5 text-[12px]" />
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest bg-white border border-gray-100 px-4 py-2.5 rounded-2xl shadow-sm">
            Applied: {new Date(app.submittedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left: Student & Scholarship Info */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Header Card */}
          <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-200/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/30 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
             
             <div className="relative flex flex-col md:flex-row gap-10">
                <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center text-gray-300 ring-8 ring-gray-100/50 relative">
                  <UserCircleSolid className="w-14 h-14" />
                  {isOnline(app?.studentId) && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full shadow-lg" />
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                       <h1 className="text-3xl font-black text-gray-900 tracking-tighter">
                          {app.student?.firstName} {app.student?.lastName}
                       </h1>
                       {isOnline(app?.studentId) && (
                         <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-md border border-emerald-100 animate-pulse">
                            Online Now
                         </span>
                       )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-400">
                      <span className="flex items-center gap-1.5"><EnvelopeIcon className="w-4 h-4" /> {app.student?.email}</span>
                      <span className="flex items-center gap-1.5"><PhoneIcon className="w-4 h-4" /> {app.student?.phone || 'No phone'}</span>
                      <span className="flex items-center gap-1.5"><MapPinIcon className="w-4 h-4" /> {app.student?.country}</span>
                    </div>
                  </div>
                </div>
             </div>
          </div>

          {/* Scholarship & University Details */}
          <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
              <AcademicCapIcon className="w-6 h-6 text-blue-600" />
              Program Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Target Scholarship</p>
                  <p className="text-lg font-black text-gray-800 leading-tight">{app.scholarship?.title}</p>
               </div>
               <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Host Institution</p>
                  <p className="text-lg font-black text-gray-800 flex items-center gap-2">
                    <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
                    {app.scholarship?.university?.name || (app.scholarship?.universities?.[0]?.name)}
                  </p>
               </div>
               <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Requested Program (Student Preference)</p>
                  <div className="flex flex-col gap-1">
                    <p className="text-lg font-black text-blue-600">{app.preferences?.major || 'General Interest'}</p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{app.preferences?.level || 'Degree Level Not Specified'}</p>
                  </div>
               </div>
               <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Available Tracks in this Scholarship</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {app.scholarship?.programs?.map(p => (
                      <span key={p.id} className="px-3 py-1 bg-gray-50 text-[10px] font-black text-gray-900 border border-gray-100 rounded-lg uppercase tracking-tighter">
                        {p.category}
                      </span>
                    ))}
                  </div>
               </div>
            </div>
          </div>

          {/* Timeline / Audit Feed */}
          <TimelineFeed logs={app.auditLogs} />
        </div>

        {/* Right: Actions & Documents */}
        <div className="space-y-10">
          
          {/* Action Card */}
          <div className="bg-gray-900 p-8 rounded-[40px] shadow-2xl shadow-blue-900/10 text-white space-y-6">
            <h3 className="text-lg font-black flex items-center gap-2">
               <ClockIcon className="w-5 h-5 text-blue-400" />
               Manage Status
            </h3>
            <div className="space-y-4">
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-gray-900">Select Status Change...</option>
                <option value="under_review" className="bg-gray-900">Under Review</option>
                <option value="interview" className="bg-gray-900">Schedule Interview</option>
                <option value="interview_passed" className="bg-gray-900">Interview Passed</option>
                <option value="accepted" className="bg-gray-900">Approve Admission</option>
                <option value="rejected" className="bg-gray-900">Reject Application</option>
                <option value="waitlisted" className="bg-gray-900">Waitlist</option>
              </select>
              
              <textarea 
                placeholder="Add a note for the student or audit log..."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-sm font-medium h-32 resize-none focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all placeholder:text-white/30"
              />

              <button 
                onClick={handleStatusUpdate}
                disabled={!selectedStatus || updateStatusMutation.isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest text-[11px] py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20"
              >
                {updateStatusMutation.isLoading ? 'Updating...' : 'Update Application'}
              </button>
            </div>
          </div>

          {/* Documents Widget */}
          <DocumentManager app={app} onUpload={handleAdminDocUpload} />
        </div>
      </div>
    </div>
  );
};

// Sub-components for better organization
const TimelineFeed = ({ logs = [] }) => (
  <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
    <h2 className="text-xl font-black text-gray-900">Activity Timeline</h2>
    <div className="space-y-8">
      {logs.length === 0 ? (
        <p className="text-gray-400 text-sm font-medium italic">No activity recorded yet.</p>
      ) : (
        logs.map((log, i) => (
          <div key={log.id} className="relative pl-8">
            {i !== logs.length - 1 && <div className="absolute left-[7px] top-6 bottom-[-32px] w-0.5 bg-gray-100" />}
            <div className="absolute left-0 top-1.5 w-4 h-4 bg-white border-2 border-blue-600 rounded-full" />
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black text-gray-800">{log.action.replace(/_/g, ' ')}</p>
                <span className="text-[10px] font-bold text-gray-400">{new Date(log.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-xs font-bold text-gray-400 italic">By {log.admin?.name || 'System'}</p>
              {log.metadata?.note && (
                <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs font-medium text-gray-600">
                  {log.metadata.note}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);


const DocumentManager = ({ app, onUpload }) => {
  const documents = app.documents || [];

  return (
    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
      <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
        <DocumentArrowUpIcon className="w-5 h-5 text-gray-400" />
        Student Assets
      </h3>
      <div className="space-y-3">
        {documents.length === 0 ? (
          <p className="text-sm font-medium text-gray-400 italic">No documents uploaded yet.</p>
        ) : (
          documents.map((doc) => (
            <a
              key={doc.id}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between group hover:border-blue-200 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                  <DocumentTextSolid className="w-5 h-5" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter truncate">
                    {doc.type?.replace(/_/g, ' ') || 'Document'}
                  </p>
                  <p className="text-sm font-black text-gray-700 truncate max-w-[150px]">
                    {doc.name || 'View File'}
                  </p>
                </div>
              </div>
            </a>
          ))
        )}
      </div>
      
      <div className="pt-4 border-t border-gray-50">
        <label className="w-full flex items-center justify-center gap-2 py-4 bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border border-dashed border-gray-200 hover:border-blue-200 cursor-pointer">
           <DocumentPlusSolid className="w-4 h-4" />
           Attach Admin Document
           <input type="file" className="hidden" onChange={onUpload} />
        </label>
      </div>
    </div>
  );
};

export default ApplicationDetail;
