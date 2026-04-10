import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/scholarships', label: 'Scholarships' },
  { path: '/universities', label: 'Universities' },
  { path: '/programs', label: 'Program Search' },
  { path: '/about', label: 'About Us' },
  { path: '/contact', label: 'Contact Us' },
];

function NavLinks({ onItemClick, className = '', itemClassName = '' }) {
  const defaultItemClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'
    }`;

  return (
    <div className={className}>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.end}
          onClick={onItemClick}
          className={itemClassName || defaultItemClass}
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

export default NavLinks;
