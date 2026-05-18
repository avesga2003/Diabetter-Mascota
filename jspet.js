// js/pet.js
class Pet {
    constructor() {
        this.renderer = new PetRenderer();
        this.currentState = 'idle'; // idle, happy, tired, sick, sleeping, excited
    }

    determineState(stats, isSleeping) {
        if (isSleeping) return 'sleeping';
        if (stats.health < 45 || stats.glucose < 55 || stats.glucose > 240) return 'sick';
        if (stats.energy < 25) return 'tired';
        if (stats.hunger > 85 && stats.health > 70) return 'excited';
        
        return 'idle';
    }

    triggerInteractionEffect(canvasW, canvasH, type) {
        const x = canvasW / 2;
        const y = canvasH / 2 + 20;
        let color = "#fff";

        if (type === 'feed') color = "#ff9f43";
        if (type === 'insulin') color = "#54a0ff";
        if (type === 'love') color = "#ff4b72";

        this.renderer.addParticle(x, y, color);
    }
}