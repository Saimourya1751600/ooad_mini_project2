import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import { 
  CNavbar, CContainer, CNavbarBrand, CNavbarToggler, 
  CCollapse, CNavbarNav, CNavItem 
} from '@coreui/react';  

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CNavbar expand="lg" className="navbar fixed-top">
      <CContainer fluid>
        {/* Brand Logo */}
        <CNavbarBrand>
          <Link to="/" className="logo">Urban<span>Connect</span></Link>
        </CNavbarBrand>

        {/* Navbar Toggle for Mobile */}
        <CNavbarToggler onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation" />

        {/* Navbar Links */}
        <CCollapse className="navbar-collapse" visible={isOpen}>
          <CNavbarNav className="nav-links">
            <CNavItem><Link to="/" className="nav-link">🏠 Home</Link></CNavItem>
            <CNavItem><Link to="/services" className="nav-link">🛠️ Services</Link></CNavItem>
            <CNavItem><Link to="/contact" className="nav-link">📞 Contact</Link></CNavItem>
            <CNavItem><Link to="/about" className="nav-link">ℹ️ About</Link></CNavItem>
          </CNavbarNav>
        </CCollapse>

        {/* Login Button */}
        <div className="nav-right">
          <Link to="/login" className="login-btn">🔐 Login / Signup</Link>
        </div>
      </CContainer>
    </CNavbar>
  );
};

export default Navbar;
