import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  DocumentTextIcon, 
  ClockIcon, 
  BuildingOfficeIcon, 
  AcademicCapIcon 
} from '@heroicons/react/24/outline';
import { adminService } from '../../api/admin.service';
import AdminLoading from './components/AdminLoading';
import AdminError from './components/AdminError';
import StatsCard from '../../components/common/StatsCard';
import ApplicationTrendsChart from './components/ApplicationTrendsChart';
import RecentSubmissionsTable from './components/RecentSubmissionsTable';
import UniversityPerformance from './components/UniversityPerformance';

const AdminDashboard = () => {
  const { data: stats, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminService.getStats(),
    refetchOnWindowFocus: false, // Optimization to prevent unnecessary refetch
    refetchInterval: 120000, // Refresh every 2 minutes
  });

  if (isLoading) {
    return <AdminLoading message="Loading Analytics..." subtext="Compiling real-time data from your dashboard." />;
  }

  if (isError) {
    return <AdminError message={error?.message} onRetry={refetch} />;
  }

  const { summary = {}, trends = [], topUniversities = [], recentSubmissions = [] } = stats || {};

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-none mb-3">Dashboard Overview</h1>
        <p className="text-lg text-gray-400 font-medium">Welcome back, here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Applications" 
          value={summary.totalApplications} 
          icon={DocumentTextIcon} 
          color="blue"
          trend="up"
          trendValue="+12.5%"
        />
        <StatsCard 
          title="Pending Reviews" 
          value={summary.pendingReviews} 
          icon={ClockIcon} 
          color="orange"
          trend="down"
          trendValue="Requires Action"
        />
        <StatsCard 
          title="Active Universities" 
          value={summary.activeUniversities} 
          icon={BuildingOfficeIcon} 
          color="green"
          trend="up"
          trendValue="Active"
        />
        <StatsCard 
          title="Total Scholarships" 
          value={summary.totalScholarships} 
          icon={AcademicCapIcon} 
          color="purple"
          trend="up"
          trendValue="+4 New"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        <div className="lg:col-span-2 min-h-[450px]">
          <ApplicationTrendsChart data={trends} />
        </div>
        <div className="min-h-[450px]">
          <UniversityPerformance universities={topUniversities} />
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div className="min-h-[400px]">
        <RecentSubmissionsTable submissions={recentSubmissions} />
      </div>
    </div>
  );
};

export default AdminDashboard;
