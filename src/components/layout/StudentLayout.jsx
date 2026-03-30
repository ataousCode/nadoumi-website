import React from 'react';
import StudentSidebar from './StudentSidebar';
import StudentTopNav from './StudentTopNav';

const StudentLayout = ({ children, user }) => {
  return (
    <div className="flex h-screen bg-[#FDFCFB]">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation */}
        <StudentTopNav user={user} />

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-8">
          <div className="max-w-[1240px] mx-auto animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
