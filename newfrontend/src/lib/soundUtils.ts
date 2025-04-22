class SoundManager {
    private static instance: SoundManager;
    private sounds: Map<string, HTMLAudioElement>;
    private muted: boolean = false;

    private constructor() {
        this.sounds = new Map();
        this.initializeSounds();
    }

    public static getInstance(): SoundManager {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }

    private initializeSounds() {
        // Pre-load sounds
        this.loadSound('emergency', '/sounds/alert.mp3');
        this.loadSound('notification', '/sounds/notification.mp3');
    }

    private loadSound(id: string, path: string) {
        const audio = new Audio(path);
        audio.preload = 'auto';
        this.sounds.set(id, audio);
    }

    public play(soundId: string) {
        if (this.muted) return;

        const sound = this.sounds.get(soundId);
        if (sound) {
            // Reset and play
            sound.currentTime = 0;
            sound.play().catch(error => {
                console.error('Error playing sound:', error);
            });
        }
    }

    public toggle() {
        this.muted = !this.muted;
        return this.muted;
    }

    public isMuted() {
        return this.muted;
    }
}

export const soundManager = SoundManager.getInstance();