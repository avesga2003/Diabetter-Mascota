// js/ui.js
const ui = {
    init() {
        this.renderFoodMenu();
    },

    updateHUD(stats) {
// Actualización de barras de progreso visuales
        document.getElementById('bar-health').style.width = `${stats.health}%`;
        document.getElementById('bar-hunger').style.width = `${stats.hunger}%`;
        document.getElementById('bar-energy').style.width = `${stats.energy}%`;
        // NUEVO: Actualización de los textos de porcentaje (%)
        document.getElementById('txt-health').innerText = `${Math.round(stats.health)}%`;
        document.getElementById('txt-hunger').innerText = `${Math.round(stats.hunger)}%`;
        document.getElementById('txt-energy').innerText = `${Math.round(stats.energy)}%`;

        // Medidor de Glucosa
        const glukoDisplay = document.getElementById('gluko-display');
        const glukoValElement = document.getElementById('gluko-value');
        
        if (glukoValElement) {
            glukoValElement.innerText = Math.round(stats.glucose);
        }

        if (stats.glucose < 70) {
            // Activamos la estética roja en el cuadro y en el número
            glukoDisplay.classList.add('danger-low');

            // Verificamos si no se ha mostrado la alerta en este episodio de baja
            if (!this.hasShownHypoAlert) {
                const alertBox = document.getElementById('educational-alert');
                const alertText = document.getElementById('alert-text');
                
                if (alertBox && alertText) {
                    alertText.innerText = "⚠️ ¡Gluko tiene una hipoglucemia! Su azúcar está muy baja. Dale algo dulce (como fruta o un jugo) rápido para subir su glucosa.";
                    alertBox.classList.remove('hidden'); // Muestra el cartel en pantalla
                    
                    // Bloqueamos futuras aperturas automáticas en el siguiente frame
                    this.hasShownHypoAlert = true; 
                }
            }
        } else {
            // Si la glucosa está en rangos normales o altos, removemos el peligro
            glukoDisplay.classList.remove('danger-low');
            
            // Reseteamos el flag para que la alerta pueda volver a dispararse la próxima vez que baje
            this.hasShownHypoAlert = false;
        }

        // =====================================================================
        // 2. CONTROL DE SUBIDAS DE GLUCOSA (HIPERGLUCEMIA > 150)
        // =====================================================================
        if (stats.glucose > 150) {
            // Activamos la estética roja en el cuadro y en el número para la subida
            glukoDisplay.classList.add('danger-high');

            // Verificamos si no se ha mostrado la alerta en este episodio de alta
            if (!this.hasShownHyperAlert) {
                const alertBox = document.getElementById('educational-alert');
                const alertText = document.getElementById('alert-text');
                
                if (alertBox && alertText) {
                    alertText.innerText = "⚠️ ¡La glucosa de Gluko está muy alta! Tiene hiperglucemia. Una dosis de insulina le ayudará a regularla y bajarla a un nivel seguro.";
                    alertBox.classList.remove('hidden'); // Muestra el cartel en pantalla
                    
                    // Bloqueamos futuras aperturas automáticas en el siguiente frame
                    this.hasShownHyperAlert = true; 
                }
            }
        } else {
            // Si la glucosa está en rangos normales o bajos, removemos el peligro de alta
            glukoDisplay.classList.remove('danger-high');
            
            // Reseteamos el flag para que la alerta pueda volver a dispararse
            this.hasShownHyperAlert = false;
        }

        // Feedback de color dinámico en el glucómetro para identificación rápida del rango
        const meterContainer = document.getElementById('gluko-display');
        if (stats.glucose < 70) {
            meterContainer.style.borderColor = "#ff9f43"; // Alerta hipo (Naranja suave)
            meterContainer.style.background = "#fff3e0";
        } else if (stats.glucose > 180) {
            meterContainer.style.borderColor = "#ee5253"; // Alerta hiper (Rojo suave)
            meterContainer.style.background = "#ffebee";
        } else {
            meterContainer.style.borderColor = "#10ac84"; // Rango Seguro (Verde)
            meterContainer.style.background = "#ffffff";
        }

        // Flecha de Tendencia metabólica
        const trendImg = document.getElementById('gluko-trend-img');
        if (stats.trend > 0) {
            trendImg.src = "assets/images/arrow_up.png";
        } else if (stats.trend < 0) {
            trendImg.src = "assets/images/arrow_down.png";
        } else {
            trendImg.src = "assets/images/arrow_stable.png";
        }
    },

    renderFoodMenu() {
        const container = document.getElementById('food-grid-container');
        container.innerHTML = ''; // Limpiar

        foodSystem.catalog.forEach(food => {
            const btn = document.createElement('button');
            btn.className = 'food-item-btn';
            btn.onclick = () => game.feedPet(food.id);
            btn.innerHTML = `
                <span class="icon">${food.icon}</span>
                <span>${food.name}</span>
            `;
            container.appendChild(btn);
        });
    },

    showEducationalAlert(text) {
        const alertBox = document.getElementById('educational-alert');
        document.getElementById('alert-text').innerText = text;
        alertBox.classList.remove('hidden');
    },

    hideAlert() {
        document.getElementById('educational-alert').classList.add('hidden');
        audio.play('click');
    },

    closeModals() {
        document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
        audio.play('click');
    }

};