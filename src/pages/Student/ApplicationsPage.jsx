import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import StudentLayout from "../../components/layout/StudentLayout";
import TrackingTabs from "../../features/application/components/TrackingTabs";
import ApplicationTrackingCard from "../../features/application/components/ApplicationTrackingCard";
import Pagination from "../../features/application/components/Pagination";
import TrackingEmptyState from "../../features/application/components/TrackingEmptyState";
import { getStudentApplications, searchApplications } from "../../api/applications";
import { authService } from "../../api/auth.service";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const ApplicationsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch Student Profile
  const { data: profileResponse, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authService.getProfile()
  });

  const student = profileResponse?.data || profileResponse;

  // Fetch Applications
  const { data: applications = [], isLoading, isError } = useQuery({
    queryKey: ['student-applications', searchQuery],
    queryFn: () => searchQuery.length >= 2 ? searchApplications(searchQuery) : getStudentApplications()
  });

  // Filter Logic (Client-side for now based on statuses)
  const filteredApplications = useMemo(() => {
    if (activeTab === "all") return applications;
    if (activeTab === "active") {
      return applications.filter(app => ["pending", "received", "under_review", "interview"].includes(app.status));
    }
    if (activeTab === "completed") {
      return applications.filter(app => ["accepted", "rejected", "revoked", "waitlisted", "interview_passed", "interview_failed"].includes(app.status));
    }
    if (activeTab === "drafts") {
      return []; // Backend doesn't seem to have drafts yet, or they are pending
    }
    return applications;
  }, [applications, activeTab]);

  if (profileLoading || isLoading) {
    return (
      <StudentLayout user={null}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout user={student}>
      <div className="space-y-8 pb-20">
        <PageHeader />

        <div className="bg-white rounded-[32px] border border-gray-100/50 shadow-soft overflow-hidden">
          <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50">
            <TrackingTabs activeTab={activeTab} onTabChange={setActiveTab} />
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search applications..." 
                  className="pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-100 w-full md:w-64"
                />
              </div>
            </div>
          </div>

          <div className="p-4 md:p-8 space-y-6">
            {filteredApplications.length > 0 ? (
              <>
                {filteredApplications.map((app) => (
                  <ApplicationTrackingCard key={app.id} application={app} />
                ))}
                
                <Pagination 
                  current={currentPage} 
                  total={filteredApplications.length} 
                  pageSize={10} 
                  onPageChange={setCurrentPage} 
                />
              </>
            ) : (
              <TrackingEmptyState 
                title={searchQuery ? "No results found" : undefined}
                description={searchQuery ? `We couldn't find any applications matching "${searchQuery}"` : undefined}
              />
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

const PageHeader = () => (
  <div>
    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Scholarship Tracking</h1>
    <p className="text-sm font-medium text-gray-500 max-w-2xl">
      Monitor the progress of your active scholarship applications and review your historical submissions.
    </p>
  </div>
);

export default ApplicationsPage;
