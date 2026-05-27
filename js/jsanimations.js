// js/animations.js
class PetRenderer {
    constructor() {
        // --- SISTEMA DE CARGA ASÍNCRONA DE SPRITES Y FONDOS ---
        this.sprites = {};
        this.fondoDia = new Image();
        this.fondoNoche = new Image();
        this.loaded = false;
        this.imagesToLoad = 0;
        this.imagesLoaded = 0;

        // Registramos los estados de la mascota vinculándolos a su ruta de asset física
        this.registerSprite('idle', 'assets/images/mascota_idle.png');
        this.registerSprite('happy', 'assets/images/mascota_feliz.png');
        this.registerSprite('excited', 'assets/images/mascota_feliz.png'); // Usa feliz o añade un sprite exclusivo si lo deseas
        this.tiredSprite = this.registerSprite('tired', 'assets/images/mascota_cansada.png');
        this.registerSprite('sick', 'assets/images/mascota_enferma.png');
        this.registerSprite('sleeping', 'assets/images/mascota_dormida.png');

        // Registro de fondos ambientales independientes
        this.imagesToLoad += 2;
        this.fondoDia.src = 'assets/images/fondo_dia.png';
        this.fondoDia.onload = () => this.checkAllImagesLoaded();
        this.fondoNoche.src = 'assets/images/fondo_noche.png';
        this.fondoNoche.onload = () => this.checkAllImagesLoaded();

        // Variables de temporización y control de partículas estructurales
        this.bounceTimer = 0;
        this.blinkTimer = 0;
        this.particles = [];
    }

    // Registra internamente la imagen del sprite y escucha su evento de carga
    registerSprite(key, src) {
        this.imagesToLoad++;
        const img = new Image();
        img.src = src;
        img.onload = () => this.checkAllImagesLoaded();
        img.onerror = () => console.error(`Error crítico cargando el asset en: ${src}`);
        this.sprites[key] = img;
    }

    // Verifica la carga completa de todo el set gráfico antes de habilitar el renderizado en el bucle
    checkAllImagesLoaded() {
        this.imagesLoaded++;
        if (this.imagesLoaded >= this.imagesToLoad) {
            this.loaded = true;
            console.log("GlukoPet Engine: Todos los assets visuales cargados con éxito.");
        }
    }

    addParticle(x, y, color) {
        for(let i=0; i<8; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                alpha: 1,
                color: color,
                size: Math.random() * 4 + 2
            });
        }
    }

    updateParticles(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 1.2 * dt;
            if (p.alpha <= 0) this.particles.splice(i, 1);
        }
    }

    render(ctx, centerX, centerY, state, dt) {
        // Pantalla de precarga preventiva si el hardware tarda en leer los archivos físicos
        if (!this.loaded) {
            ctx.fillStyle = "#a1c4fd";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.fillStyle = "#2c3e50";
            ctx.font = "bold 20px 'Comic Sans MS', Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("Cargando mundo...", ctx.canvas.width / 2, ctx.canvas.height / 2);
            return;
        }

        // --- 1. RENDERIZADO DEL FONDO ESCÉNICO ---
        const fondoActual = (state === 'sleeping') ? this.fondoNoche : this.fondoDia;
        ctx.drawImage(fondoActual, 0, 0, ctx.canvas.width, ctx.canvas.height);

        // --- 2. CÁLCULO DE FÍSICAS Y DEFORMACIÓN DE LA MASCOTA ---
        this.bounceTimer += dt * (state === 'tired' || state === 'sick' ? 1.5 : 4);
        this.blinkTimer += dt;

        let bounce = Math.sin(this.bounceTimer) * 8;
        let scaleX = 1 + Math.sin(this.bounceTimer) * 0.03;
        let scaleY = 1 - Math.sin(this.bounceTimer) * 0.03;

        if (state === 'sleeping') {
            bounce = Math.sin(this.bounceTimer * 0.5) * 2;
            scaleX = 1.02; 
            scaleY = 0.98;
        }

        // --- 3. DIBUJO DEL SPRITE SELECCIONADO ---
        let activeSprite = this.sprites[state];
        
        // Fallback de seguridad por si algún estado dinámico no encuentra su archivo físico
        if (!activeSprite) {
            activeSprite = this.sprites['idle'];
        }

        ctx.save();
        
        // Trasladamos el contexto al centro del canvas aplicando el rebote orgánico del motor
        ctx.translate(centerX, centerY + bounce);
        ctx.scale(scaleX, scaleY);

        // Dimensiones del sprite escaladas para dispositivos móviles (Fácilmente modificables)
        const width = 160;
        const height = 160;

        // Dibujamos la textura centrando los ejes relativos respecto al punto translate
        ctx.drawImage(activeSprite, -width / 2, -height / 2, width, height);

        ctx.restore();

        // --- 4. RENDERIZADO DE PARTÍCULAS INTERACTIVAS (Efectos de Comida/Insulina) ---
        this.updateParticles(dt);
        this.particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }
}