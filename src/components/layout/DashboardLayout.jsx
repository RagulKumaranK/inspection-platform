import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../dashboard/Header';

const DashboardLayout = ({ role }) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Header role={role} />
            <Outlet />
        </div>
    );
};

export default DashboardLayout;
