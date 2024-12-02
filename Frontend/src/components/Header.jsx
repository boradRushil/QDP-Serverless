import React from 'react';
import { Navbar, Button } from 'react-bootstrap';

const Header = ({ title, onLogout }) => {
    return (
        <Navbar bg="primary" variant="dark" className="px-4 py-2">
            <Navbar.Brand className="fw-bold">
                {title}
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">

                <Button variant="outline-light" onClick={onLogout}>
                    Logout
                </Button>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;
