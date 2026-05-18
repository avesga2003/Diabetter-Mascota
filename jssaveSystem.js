// js/saveSystem.js
const saveSystem = {
    LOCAL_STORAGE_KEY: 'glukopet_save_data',

    getTodayString() {
        const today = new Date();
        return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    },

    loadGame() {
        const defaultState = {
            stats: {
                hunger: 80,
                energy: 90,
                glucose: 100,
                health: 90
            },
            currency: 50,
            lastSavedDate: this.getTodayString(),
            isSleeping: false
        };

        const rawData = localStorage.getItem(this.LOCAL_STORAGE_KEY);
        if (!rawData) {
            // Primer inicio de la aplicación
            defaultState.stats.glucose = this.generateRandomInitialGlucose();
            return defaultState;
        }

        const parsed = JSON.parse(rawData);
        const todayStr = this.getTodayString();

        // Control del cambio de día real
        if (parsed.lastSavedDate !== todayStr) {
            parsed.stats.glucose = this.generateRandomInitialGlucose();
            parsed.lastSavedDate = todayStr;
            // Guardamos inmediatamente el nuevo estado del día
            this.saveGame(parsed.stats, parsed.currency, parsed.isSleeping);
            window.isNewDayEvent = true; 
        }

        return parsed;
    },

    saveGame(stats, currency, isSleeping) {
        const dataToSave = {
            stats,
            currency,
            lastSavedDate: this.getTodayString(),
            isSleeping
        };
        localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    },

    generateRandomInitialGlucose() {
        // Retorna un entero entre 60 y 160 mg/dL
        return Math.floor(Math.random() * (160 - 60 + 1)) + 60;
    }
};