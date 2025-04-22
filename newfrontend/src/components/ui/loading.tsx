import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LoadingProps {
    fullScreen?: boolean;
    message?: string;
    className?: string;
}

export const Loading: React.FC<LoadingProps> = ({ fullScreen = false, message = 'Loading...', className }) => {
    const containerClasses = cn(
        fullScreen
            ? 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50'
            : 'w-full h-full min-h-[200px] relative',
        className
    );

    return (
        <div className={containerClasses}>
            <div className="flex flex-col items-center justify-center h-full gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                {message && (
                    <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
                )}
            </div>
        </div>
    );
};

export const LoadingOverlay: React.FC<{ message?: string; className?: string }> = ({ message, className }) => (
    <div className={cn(
        "absolute inset-0 bg-background/80 backdrop-blur-sm z-50",
        className
    )}>
        <Loading message={message} />
    </div>
); 