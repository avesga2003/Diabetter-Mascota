// js/stats.js
class StatsManager {
    constructor(initialStats) {
        this.hunger = initialStats.hunger;
        this.energy = initialStats.energy;
        this.glucose = initialStats.glucose;
        this.health = initialStats.health;
        this.trend = 0; // -1: Bajando, 0: Estable, 1: Subiendo
    }

    update(deltaTime, isSleeping) {
        // Reducción pasiva por el paso del tiempo
        const decayMultiplier = isSleeping ? 0.2 : 1.0;
        
        // Hambre: aumenta la necesidad de comer (disminuye la barra)
        this.hunger = Math.max(0, this.hunger - (0.8 * decayMultiplier * deltaTime));

        if (isSleeping) {
            this.energy = Math.min(100, this.energy + (4.0 * deltaTime));
            // La glucosa tiende a estabilizarse suavemente durante el sueño
            this.glucose += (100 - this.glucose) * 0.02 * deltaTime;
        } else {
            this.energy = Math.max(0, this.energy - (0.5 * deltaTime));
            // Consumo pasivo de glucosa por actividad metabólica basal
            this.glucose -= 0.1 * deltaTime;
        }

        this.constrainGlucose();
        this.calculateHealth();
    }

    constrainGlucose() {
        // Límites absolutos del simulador amigable
        this.glucose = Math.max(20, Math.min(350, this.glucose));
    }

    calculateHealth() {
        let penalties = 0;

        // Evaluación de Glucosa (Rango ideal objetivo: 70 - 140 mg/dL)
        if (this.glucose < 70) {
            // Hipoglucemia
            penalties += (70 - this.glucose) * 0.8;
        } else if (this.glucose > 180) {
            // Hiperglucemia prolongada o picos
            penalties += (this.glucose - 180) * 0.3;
        }

        // Evaluación de necesidades básicas
        if (this.hunger < 20) penalties += (20 - this.hunger) * 0.5;
        if (this.energy < 20) penalties += (20 - this.energy) * 0.5;

        // Cálculo inverso ponderado
        this.health = Math.max(0, Math.min(100, 100 - penalties));
    }

    applyFood(foodItem) {
        this.hunger = Math.min(100, this.hunger + foodItem.hungerRepair);
        this.glucose += foodItem.glucoseImpact;
        this.energy = Math.min(100, this.energy + (foodItem.energyBonus || 0));
        
        this.trend = foodItem.glucoseImpact > 0 ? 1 : 0;
        this.constrainGlucose();
        this.calculateHealth();
    }

    applyInsulin(units) {
        // Cada unidad procesa/reduce un bloque controlado de glucosa
        const reductionPerUnit = 35;
        this.glucose -= (units * reductionPerUnit);
        this.trend = -1;

        this.constrainGlucose();
        this.calculateHealth();
    }
}