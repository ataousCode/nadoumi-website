import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { authService } from '../../api/auth.service';

const AdminProtect = ({ children }) => {
  const location = useLocation();
  const adminToken = localStorage.getItem('adminToken');

  const { data: admin, isLoading, isError } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: () => authService.getAdminProfile(), 
    enabled: !!adminToken,
    retry: false
  });

  if (!adminToken) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (isError || !admin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return React.cloneElement(children, { admin });
};

export default AdminProtect;
