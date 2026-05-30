// js/game.js
const game = {
    canvas: null,
    ctx: null,
    lastTime: 0,
    pet: null,
    statsManager: null,
    currency: 0,
    isSleeping: false,

    init() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Carga de estado persistido (Incluye control de nuevo día metabólico)
        const savedData = saveSystem.loadGame();
        this.statsManager = new StatsManager(savedData.stats);
        this.currency = savedData.currency;
        this.isSleeping = savedData.isSleeping;

        this.pet = new Pet();
        ui.init();

        // Escuchar clics directos sobre el Canvas para acariciar a la mascota
        this.canvas.addEventListener('touchstart', (e) => this.handleCanvasTouch(e), { passive: true });

        // Evento de bienvenida con enfoque positivo ante cambios de día real
        if (window.isNewDayEvent) {
            setTimeout(() => {
                ui.showEducationalAlert("¡Nuevo día! Tu mascota se ha despertado con un nivel de glucosa diferente. ¡Vamos a revisar juntos qué necesita hoy!");
                window.isNewDayEvent = false;
            }, 1000);
        } else {
            setTimeout(() => {
                ui.showEducationalAlert("¡Hola! Tu mascota se alegra mucho de verte. ¡Cuidemos de su salud juntos hoy!");
            }, 800);
        }

        // Arranque oficial del Gameloop
        this.lastTime = performance.now();
        requestAnimationFrame((timestamp) => this.loop(timestamp));

        // Auto-guardado recurrente cada 5 segundos
        setInterval(() => this.autoSave(), 5000);
    },

    resizeCanvas() {
        const container = document.getElementById('game-container');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    },

    loop(timestamp) {
        // Cálculo estricto de Delta Time para consistencia de físicas y decaimiento
        let dt = (timestamp - this.lastTime) / 1000;
        if (dt > 0.1) dt = 0.1; // Cap de seguridad ante pérdidas de foco/pestaña móvil
        this.lastTime = timestamp;

        // Actualizar datos de simulación
        this.statsManager.update(dt, this.isSleeping);
        
        // Evaluar estado emocional resultante
        const state = this.pet.determineState(this.statsManager, this.isSleeping);
        
        // Limpieza y Renderizado del Canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackground();

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2 + 100;
        this.pet.renderer.render(this.ctx, centerX, centerY, state, dt);

        // Actualizar elementos HUD
        ui.updateHUD(this.statsManager);

        // Alertas automáticas de seguridad metabólica (Sin ser agresivas ni punitivas)
        this.checkMetabolicAlerts();

        requestAnimationFrame((timestamp) => this.loop(timestamp));
    },

    drawBackground() {
        // Cambio de ambiente Día/Noche según el estado de la mascota
        let gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        if (this.isSleeping) {
            gradient.addColorStop(0, '#1e3c72');
            gradient.addColorStop(1, '#2a5298');
        } else {
            gradient.addColorStop(0, '#a1c4fd');
            gradient.addColorStop(1, '#c2e9fb');
        }
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Colina verde de suelo estilizada
        this.ctx.fillStyle = this.isSleeping ? '#10ac84' : '#1dd1a1';
        this.ctx.beginPath();
        this.ctx.ellipse(this.canvas.width / 2, this.canvas.height + 100, this.canvas.width * 0.8, 200, 0, 0, Math.PI, true);
        this.ctx.fill();
    },

    handleCanvasTouch(e) {
        audio.play('click');
        audio.triggerVibration(40);
        this.pet.triggerInteractionEffect(this.canvas.width, this.canvas.height, 'love');
        
        // El cariño sube ligeramente la energía mental o salud si está sana
        if(this.statsManager.health > 50) {
            this.statsManager.energy = Math.min(100, this.statsManager.energy + 2);
        }
    },

    openMenu(menuType) {
        audio.play('click');
        document.getElementById(`${menuType}-menu`).classList.remove('hidden');
    },

    feedPet(foodId) {
        const foodItem = foodSystem.getFoodById(id = foodId);
        if (!foodItem) return;

        audio.play('chew');
        audio.triggerVibration(60);

        this.statsManager.applyFood(foodItem);
        this.pet.triggerInteractionEffect(this.canvas.width, this.canvas.height, 'feed');
        
        document.getElementById('food-menu').classList.add('hidden');
        
        // Emitir explicación educativa adaptativa basada en la selección
        ui.showEducationalAlert(foodItem.educationalNote);
    },

    administerInsulin(units) {
        audio.play('heal');
        audio.triggerVibration(80);

        this.statsManager.applyInsulin(units);
        this.pet.triggerInteractionEffect(this.canvas.width, this.canvas.height, 'insulin');

        document.getElementById('insulin-menu').classList.add('hidden');
        ui.showEducationalAlert(`Le diste ${units}U de insulina a tu mascota. La insulina ayuda a transformar la glucosa en energía útil.`);
    },

    toggleSleep() {
        audio.play('click');
        this.isSleeping = !this.isSleeping;
        
        if (this.isSleeping) {
            ui.showEducationalAlert("Tu mascota se va a dormir. Su energía se recuperará y su glucosa se estabilizará poco a poco.");
        } else {
            ui.showEducationalAlert("¡Buenos días! Tu mascota se ha despertado con energía.");
        }
    },

    playMinigame() {
        // Ganar monedas y mejorar estadísticas por jugar
        audio.play('heal');
        this.currency += 15;
        this.statsManager.energy = Math.max(10, this.statsManager.energy - 15); // Jugar consume energía física
        this.statsManager.glucose = Math.max(40, this.statsManager.glucose - 20); // El ejercicio físico reduce la glucosa activa
        
        ui.showEducationalAlert("¡Jugamos a atrapar frutas! Ganaste 15 monedas 🪙. Recuerda que hacer ejercicio ayuda a disminuir los niveles altos de glucosa.");
    },

    // Sistema de monitoreo clínico amigable sin Game Over
    private_alertThrottle: false,
    checkMetabolicAlerts() {
        if (this.private_alertThrottle) return;

        if (this.statsManager.glucose < 70) {
            this.private_alertThrottle = true;
            audio.play('alert');
            ui.showEducationalAlert("¡Tu mascota necesita ayuda! Su glucosa está bajando mucho. Un poco de dulce 🍬 o un jugo 🧃 le ayudarán a recuperarse rápidamente.");
            setTimeout(() => this.private_alertThrottle = false, 25000); // Evita spam de alertas
        } else if (this.statsManager.glucose > 250) {
            this.private_alertThrottle = true;
            audio.play('alert');
            ui.showEducationalAlert("¡Vamos a cuidarla juntos! La glucosa de tu mascota está algo alta. Una dosis controlada de insulina 💉 o un paseo (jugar) le ayudarán a balancearse.");
            setTimeout(() => this.private_alertThrottle = false, 25000);
        }
    },

    autoSave() {
        saveSystem.saveGame(
            {
                hunger: this.statsManager.hunger,
                energy: this.statsManager.energy,
                glucose: this.statsManager.glucose,
                health: this.statsManager.health
            },
            this.currency,
            this.isSleeping
        );
    }
};

// Punto de entrada global al cargar la ventana
window.onload = () => {
    game.init();
};