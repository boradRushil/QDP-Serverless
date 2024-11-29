import React from 'react';
import { Link } from 'react-router-dom';
import { FaFileExport, FaSearch, FaCloud, FaList } from 'react-icons/fa';

const Sidebar = () => {
    const services = [
        { id: 1, name: 'JSON to CSV Converter', icon: FaFileExport, route: '/dashboard/service1' },
        { id: 2, name: 'Named Entity Extractor', icon: FaSearch, route: '/dashboard/service2' },
        { id: 3, name: 'Word Cloud Generator', icon: FaCloud, route: '/dashboard/service3' },
    ];

    return (
        <div
            className="bg-dark text-white d-flex flex-column sidebar"
            style={{ width: '250px', padding: '15px' }}
        >
            <div className="mb-4">
                <FaList className="fs-4" />
                <span className="fs-5 ms-2">Menu</span>
            </div>
            {services.map((service) => (
                <Link
                    key={service.id}
                    to={service.route}
                    className="text-decoration-none text-white my-2 p-2 sidebar-item"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: '5px',
                        transition: 'background-color 0.3s',
                    }}
                >
                    <service.icon className="me-2" />
                    <span>{service.name}</span>
                </Link>
            ))}
        </div>
    );
};

export default Sidebar;
