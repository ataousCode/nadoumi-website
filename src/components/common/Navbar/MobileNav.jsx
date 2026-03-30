import React from 'react';
import NavLinks from './NavLinks.jsx';
import Button from '../Button.jsx';
import { Link, useNavigate } from 'react-router-dom';

function MobileNav({ isOpen, onClose }) {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-100 shadow-xl animate-in slide-in-from-top duration-300">
      <div className="px-4 pt-4 pb-8 flex flex-col gap-4">
        <NavLinks 
          className="flex flex-col gap-2" 
          onItemClick={onClose}
          itemClassName={({ isActive }) => 
            `block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
              isActive ? 'text-orange-600 bg-orange-50' : 'text-gray-700 hover:bg-orange-50'
            }`
          }
        />
        
        <hr className="border-gray-100 my-2" />
        
        <div className="flex flex-col gap-3 px-4">
          <Link 
            to="/login" 
            onClick={onClose}
            className="text-center text-base font-medium text-gray-700 py-2"
          >
            Login
          </Link>
          <Button 
            variant="primary" 
            className="w-full rounded-full"
            onClick={() => {
              onClose();
              navigate('/application');
            }}
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MobileNav;
