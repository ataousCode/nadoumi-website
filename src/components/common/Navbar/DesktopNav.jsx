import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../Button.jsx';

function DesktopNav() {
  const navigate = useNavigate();

  return (
    <div className="hidden md:flex items-center gap-6">
      <Link 
        to="/login" 
        className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
      >
        Login
      </Link>
      <Button 
        variant="primary" 
        size="sm" 
        className="rounded-full px-6"
        onClick={() => navigate('/application')}
      >
        Get Started
      </Button>
    </div>
  );
}

export default DesktopNav;
