import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Toaster } from 'sonner';

const AppLayout = () => {
    return (
        <div className="min-h-screen bg-background text-foreground noise-bg selection:bg-foreground selection:text-background">
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Toaster position="bottom-right" theme="system" />
        </div>
    );
};

export default AppLayout;