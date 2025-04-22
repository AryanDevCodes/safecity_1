import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from './button';
import { soundManager } from '@/lib/soundUtils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

export const SoundControl: React.FC = () => {
    const [isMuted, setIsMuted] = useState(soundManager.isMuted());

    const toggleSound = () => {
        const muted = soundManager.toggle();
        setIsMuted(muted);
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleSound}
                        className="w-10 h-10"
                    >
                        {isMuted ? (
                            <VolumeX className="h-5 w-5" />
                        ) : (
                            <Volume2 className="h-5 w-5" />
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{isMuted ? 'Unmute Alerts' : 'Mute Alerts'}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};