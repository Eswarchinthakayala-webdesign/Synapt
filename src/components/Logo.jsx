import React from 'react';

export const Logo = ({ className = "w-8 h-8", ...props }) => {
    return (
        <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className={className}
            {...props}
        >
            <circle cx="12" cy="12" r="3" className="fill-foreground" />
            <path 
                d="M12 9V3M12 15V21M9 12H3M15 12H21" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                className="text-foreground/60"
            />
            <path 
                d="M18.36 5.64L14.12 9.88M18.36 18.36L14.12 14.12M5.64 5.64L9.88 14.12M5.64 18.36L9.88 14.12" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                className="text-foreground/40"
            />
            <circle cx="3" cy="12" r="1.5" className="fill-foreground/20" />
            <circle cx="21" cy="12" r="1.5" className="fill-foreground/20" />
            <circle cx="12" cy="3" r="1.5" className="fill-foreground/20" />
            <circle cx="12" cy="21" r="1.5" className="fill-foreground/20" />
        </svg>
    );
};
