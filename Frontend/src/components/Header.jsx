import React from 'react';
import { Navbar } from 'react-bootstrap';

const Header = ({ title }) => {
    return (
        <Navbar bg="primary" variant="dark" className="px-4 py-2">
            <Navbar.Brand className="fw-bold">
                {title}
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
                {/* Add user profile, logout etc. */}
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;