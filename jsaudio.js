// js/audio.js
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const audio = {
    enabled: true,

    // Hook preparado para asociar archivos físicos reales en producción
    assets: {
        chew: null,
        heal: null,
        alert: null,
        click: null
    },

    play(effectName) {
        if (!this.enabled) return;

        // Si los assets nativos no están cargados, generamos audio sintético amigable
        if (this.assets[effectName]) {
            const source = audioContext.createBufferSource();
            source.buffer = this.assets[effectName];
            source.connect(audioContext.destination);
            source.start(0);
            return;
        }

        // Sintetizador fallback para mantener el juego responsivo sin dependencias externas
        this.playSyntheticSound(effectName);
    },

    playSyntheticSound(type) {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);

        const now = audioContext.currentTime;

        switch(type) {
            case 'click':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                osc.start(now); osc.stop(now + 0.05);
                break;
            case 'chew':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.setValueAtTime(300, now + 0.05);
                gain.gain.setValueAtTime(0.4, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now); osc.stop(now + 0.1);
                break;
            case 'heal':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523.25, now); // C5
                osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15); // G5
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.start(now); osc.stop(now + 0.2);
                break;
            case 'alert':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(330, now);
                osc.frequency.setValueAtTime(293, now + 0.1);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.start(now); osc.stop(now + 0.2);
                break;
        }
    },

    triggerVibration(ms = 50) {
        if ('vibrate' in navigator) {
            navigator.vibrate(ms);
        }
    }
};