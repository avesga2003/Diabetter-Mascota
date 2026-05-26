// js/animations.js
class PetRenderer {
    constructor() {
        this.bounceTimer = 0;
        this.blinkTimer = 0;
        this.particles = [];
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
        this.bounceTimer += dt * (state === 'tired' || state === 'sick' ? 1.5 : 4);
        this.blinkTimer += dt;

        let bounce = Math.sin(this.bounceTimer) * 8;
        let scaleX = 1 + Math.sin(this.bounceTimer) * 0.03;
        let scaleY = 1 - Math.sin(this.bounceTimer) * 0.03;

        if (state === 'sleeping') {
            bounce = Math.sin(this.bounceTimer * 0.5) * 2;
            scaleX = 1.02; scaleY = 0.98;
        }

        ctx.save();
        ctx.translate(centerX, centerY + bounce);
        ctx.scale(scaleX, scaleY);

        // 1. CUERPO DE LA MASCOTA (Estilo Slime/Tamagotchi redondeado)
        let bodyColor = "#48dbfb"; // Color base amigable (Cyan)
        if (state === 'sick') bodyColor = "#a4b0be";
        if (state === 'sleeping') bodyColor = "#54a0ff";
        if (state === 'excited') bodyColor = "#feca57";

        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        // Dibujamos un óvalo estilizado caricaturesco
        ctx.arc(0, 0, 75, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 6;
        ctx.strokeStyle = "#2c3e50";
        ctx.stroke();

        // 2. OJOS
        let isBlinking = (Math.floor(this.blinkTimer) % 4 === 0) && (this.blinkTimer - Math.floor(this.blinkTimer) < 0.15);
        ctx.fillStyle = "#2c3e50";

        let eyeOffsetX = 26;
        let eyeOffsetY = -15;
        let eyeRadius = 10;

        if (isBlinking || state === 'sleeping') {
            // Ojos cerrados (líneas arqueadas)
            ctx.lineWidth = 5;
            ctx.strokeStyle = "#2c3e50";
            ctx.beginPath();
            ctx.arc(-eyeOffsetX, eyeOffsetY, eyeRadius, Math.PI, 0, true);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(eyeOffsetX, eyeOffsetY, eyeRadius, Math.PI, 0, true);
            ctx.stroke();
        } else if (state === 'sick') {
            // Ojos mareados / tristes (X o diagonales)
            ctx.lineWidth = 4;
            ctx.strokeStyle = "#2c3e50";
            this.drawCrossEye(ctx, -eyeOffsetX, eyeOffsetY, 8);
            this.drawCrossEye(ctx, eyeOffsetX, eyeOffsetY, 8);
        } else {
            // Ojos normales abiertos con brillo blanco alegre
            ctx.beginPath();
            ctx.arc(-eyeOffsetX, eyeOffsetY, eyeRadius, 0, Math.PI * 2);
            ctx.arc(eyeOffsetX, eyeOffsetY, eyeRadius, 0, Math.PI * 2);
            ctx.fill();
            // Brillo
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(-eyeOffsetX - 3, eyeOffsetY - 3, 3, 0, Math.PI * 2);
            ctx.arc(eyeOffsetX - 3, eyeOffsetY - 3, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        // 3. BOCA DINÁMICA SEGÚN EMOCIÓN
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#2c3e50";
        ctx.fillStyle = "#ff6b6b";

        ctx.beginPath();
        if (state === 'happy' || state === 'excited') {
            // Gran sonrisa feliz abierta
            ctx.arc(0, 10, 16, 0, Math.PI, false);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else if (state === 'sick' || state === 'tired') {
            // Curva triste o preocupada
            ctx.arc(0, 22, 12, Math.PI, 0, false);
            ctx.stroke();
        } else if (state === 'sleeping') {
            // Boca pequeña redonda (respirando)
            ctx.beginPath();
            ctx.arc(0, 15, 4, 0, Math.PI * 2);
            ctx.stroke();
        } else {
            // Sonrisa sutil por defecto (Idle)
            ctx.arc(0, 8, 12, 0, Math.PI, false);
            ctx.stroke();
        }

        ctx.restore();

        // RENDERIZADO DE PARTÍCULAS INTERACTIVAS
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

    drawCrossEye(ctx, x, y, size) {
        ctx.beginPath();
        ctx.moveTo(x - size, y - size); ctx.lineTo(x + size, y + size);
        ctx.moveTo(x + size, y - size); ctx.lineTo(x - size, y + size);
        ctx.stroke();
    }
}