import React from 'react';
import AdminSidebar from './AdminSidebar';
import StudentTopNav from './StudentTopNav';
import { useChatSocket } from '../../features/messages/hooks/useChatSocket';

const AdminLayout = ({ children, admin }) => {
  // Global socket listener — no active conversation selected
  // This ensures the administrator is connected and receiving notifications on all pages.
  useChatSocket(null, null, 'admin');

  return (
    <div className="flex h-screen bg-[#FDFCFB]">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation */}
        <StudentTopNav user={admin} />

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-8">
          <div className="max-w-[1440px] mx-auto animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
