import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import {
  CNavbar,
  CContainer,
  CNavbarBrand,
  CNavbarToggler,
  CCollapse,
  CNavbarNav,
  CNavItem,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';
import '../styles/Navbar.css';

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  const toggleNavbar = () => {
    setVisible(!visible);
  };

  return (
    <CNavbar expand="lg" className="navbar fixed-top">
      <CContainer fluid>
        {/* Logo */}
        <CNavbarBrand>
          <Link to="/" className="logo">
            Urban<span>Connect</span>
          </Link>
        </CNavbarBrand>

        {/* Mobile Toggle Button */}
        <CNavbarToggler onClick={toggleNavbar}>
          {visible ? <FaTimes size={28} /> : <FaBars size={28} />}
        </CNavbarToggler>

        {/* Collapsible Menu */}
        <CCollapse className="navbar-collapse" visible={visible}>
          <CNavbarNav>
            <CNavItem>
              <Link to="/" className="nav-link" onClick={toggleNavbar}>Home</Link>
            </CNavItem>
            <CNavItem>
              <Link to="/services" className="nav-link" onClick={toggleNavbar}>Services</Link>
            </CNavItem>
            <CNavItem>
              <Link to="/contact" className="nav-link" onClick={toggleNavbar}>Contact</Link>
            </CNavItem>
            <CNavItem>
              <Link to="/about" className="nav-link" onClick={toggleNavbar}>About</Link>
            </CNavItem>
          </CNavbarNav>

          {/* Profile Dropdown */}
          <CDropdown variant="nav-item">
            <CDropdownToggle color="secondary">
              <FaUserCircle size={28} />
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem>
                <Link to="/profile" className="dropdown-link">Profile</Link>
              </CDropdownItem>
              <CDropdownItem>
                <Link to="/settings" className="dropdown-link">Settings</Link>
              </CDropdownItem>
              <CDropdownItem>
                <Link to="/logout" className="dropdown-link">Logout</Link>
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CCollapse>
      </CContainer>
    </CNavbar>
  );
};

export default Navbar;
