import React from 'react';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ChatBubbleBottomCenterTextIcon,
  ArrowPathIcon,
  AcademicCapIcon,
  ArchiveBoxIcon,
  ExclamationCircleIcon,
  GlobeAltIcon,
  GlobeEuropeAfricaIcon
} from '@heroicons/react/24/outline';
import { cn } from '../../../utils/cn';

const statusConfigs = {
  pending: {
    label: 'Pending Review',
    color: 'bg-amber-50 text-amber-700 border-amber-100',
    icon: ClockIcon
  },
  received: {
    label: 'Document Received',
    color: 'bg-sky-50 text-sky-700 border-sky-100',
    icon: ArchiveBoxIcon
  },
  under_review: {
    label: 'Under Review',
    color: 'bg-blue-50 text-blue-700 border-blue-100',
    icon: ArrowPathIcon,
    animate: true
  },
  interview: {
    label: 'Interviewing',
    color: 'bg-purple-50 text-purple-700 border-purple-100',
    icon: ChatBubbleBottomCenterTextIcon
  },
  interview_passed: {
    label: 'Interview Passed',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    icon: CheckCircleIcon
  },
  interview_failed: {
    label: 'Interview Failed',
    color: 'bg-rose-50 text-rose-700 border-rose-100',
    icon: XCircleIcon
  },
  accepted: {
    label: 'Admission Granted',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    icon: AcademicCapIcon
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: XCircleIcon
  },
  revoked: {
    label: 'Action Revoked',
    color: 'bg-orange-50 text-orange-700 border-orange-100',
    icon: ExclamationCircleIcon
  },
  waitlisted: {
    label: 'Waitlisted',
    color: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100',
    icon: ClockIcon
  },
  draft: {
    label: 'Draft',
    color: 'bg-gray-50 text-gray-500 border-gray-100',
    icon: ArchiveBoxIcon
  },
  published: {
    label: 'Published',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    icon: GlobeAltIcon || GlobeEuropeAfricaIcon || CheckCircleIcon
  },
  closed: {
    label: 'Closed',
    color: 'bg-rose-50 text-rose-700 border-rose-100',
    icon: XCircleIcon
  },
  active: {
    label: 'Active',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    icon: CheckCircleIcon
  },
  inactive: {
    label: 'Inactive',
    color: 'bg-red-50 text-red-700 border-red-100',
    icon: XCircleIcon
  }
};

const StatusBadge = ({ status, className }) => {
  const config = statusConfigs[status?.toLowerCase()] || statusConfigs.pending;
  const Icon = config.icon;

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-black uppercase tracking-widest transition-all",
      config.color,
      className
    )}>
      <Icon className={cn("w-3.5 h-3.5", config.animate && "animate-spin-slow")} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
