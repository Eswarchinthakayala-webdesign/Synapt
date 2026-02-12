import React from 'react';
import { Hero } from '../components/Hero';
import { Workflow } from '../components/Workflow';
import { Features } from '../components/Features';
import { AIEngine } from '../components/AIEngine';
import { Analytics } from '../components/Analytics';
import { CTA } from '../components/CTA';
import { Footer } from '../components/Footer';

const LandingPage = () => {
    return (
        <div className="flex flex-col">
            <Hero />
            <Workflow />
            <Features />
            <AIEngine />
            <Analytics />
            <CTA />
            <Footer />
        </div>
    );
};

export default LandingPage;