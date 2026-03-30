import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Squares2X2Icon, 
  AcademicCapIcon, 
  DocumentTextIcon, 
  UserGroupIcon, 
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BuildingOfficeIcon,
  UserIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';
import { authService } from '../../api/auth.service';
import logo from '../../assets/icons/logo.jpg';
import ConfirmDialog from '../common/ConfirmDialog';

const SidebarLink = ({ to, icon: Icon, label }) => (
  <NavLink to={to} end={to === '/admin'}>
    {({ isActive }) => (
      <div className={`
        flex items-center gap-3 px-6 py-3.5 rounded-xl transition-all duration-300 group cursor-pointer
        ${isActive 
          ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-black' 
          : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900 font-bold'
        }
      `}>
        <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-900'}`} />
        <span className="text-sm tracking-tight">{label}</span>
      </div>
    )}
  </NavLink>
);

const AdminSidebar = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout('admin');
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed:', err);
      window.location.href = '/login';
    }
  };

  return (
    <>
      <aside className="w-[300px] h-full bg-white border-r border-gray-100/30 p-6 flex flex-col sticky top-0">
        {/* Logo/Branding */}
        <div className="flex items-center gap-4 px-4 mb-14">
          <img src={logo} alt="NADOUMI Logo" className="w-12 h-12 rounded-2xl shadow-lg ring-4 ring-gray-50 object-cover" />
          <div className="flex flex-col">
            <span className="text-xl font-black text-gray-900 tracking-tighter leading-none">NADOUMI</span>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Admin Portal</span>
          </div>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 space-y-1">
          <SidebarLink to="/admin" icon={Squares2X2Icon} label="Dashboard" />
          <SidebarLink to="/admin/profile" icon={UserIcon} label="Profile" />
          <SidebarLink to="/admin/applications" icon={DocumentTextIcon} label="Applications" />
          <SidebarLink to="/admin/universities" icon={BuildingOfficeIcon} label="Universities" />
          <SidebarLink to="/admin/scholarships" icon={AcademicCapIcon} label="Scholarships" />
          <SidebarLink to="/admin/users" icon={UserGroupIcon} label="User Management" />
          <SidebarLink to="/admin/messages" icon={ChatBubbleBottomCenterTextIcon} label="Messages" />
        </nav>

        {/* Footer Menu */}
        <div className="pt-8 mt-8 border-t border-gray-100/50 space-y-2">
          <button 
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all group mt-2"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span className="text-sm font-bold tracking-tight">Logout</span>
          </button>
        </div>
      </aside>

      <ConfirmDialog 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out of the Admin Portal?"
        confirmText="Logout"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
};

export default AdminSidebar;
