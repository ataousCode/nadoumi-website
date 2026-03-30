import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/icons/logo.jpg";
import Container from "../Container.jsx";
import DesktopNav from "./DesktopNav.jsx";
import MobileNav from "./MobileNav.jsx";
import NavLinks from "./NavLinks.jsx";
import { cn } from "../../../utils/cn";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled 
          ? "bg-white shadow-xl shadow-gray-200/40 h-16 border-b border-gray-100" 
          : "bg-white/90 backdrop-blur-md h-20 border-b border-transparent"
      )}
    >
      <Container size="none" className="h-full flex items-center justify-between relative">
        <div className="flex items-center gap-3 w-1/4">
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src={logo} 
              alt="Nadoumi Logo" 
              className="h-10 w-10 rounded-lg shadow-sm transition-transform group-hover:scale-105" 
            />
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              Nadoumi
            </span>
          </Link>
        </div>

        {/* Centered Navigation Links */}
        <div className="hidden md:flex flex-1 justify-center items-center">
          <NavLinks className="flex items-center gap-8" />
        </div>

        {/* Right side Actions */}
        <div className="flex items-center gap-4 w-1/4 justify-end">
          <DesktopNav />

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-orange-600 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        </div>
      </Container>

      {/* Mobile Navigation */}
      <MobileNav isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </nav>
  );
}

export default Navbar;
