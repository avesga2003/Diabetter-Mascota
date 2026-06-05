// js/ui.js
const ui = {
    init() {
        this.renderFoodMenu();
        this.checkFirstTimeUser(); // NUEVO: Lanza el chequeo de la historia/tutorial al iniciar
    },

    // NUEVO: Método para controlar las ventanas de bienvenida solo la primera vez
    checkFirstTimeUser() {
        const overlay = document.getElementById('onboarding-overlay');
        const screen1 = document.getElementById('onboarding-screen-1');
        const screen2 = document.getElementById('onboarding-screen-2');
        const btnNext = document.getElementById('btn-onboarding-next');
        const btnFinish = document.getElementById('btn-onboarding-finish');

        // Guardilla de seguridad por si acaso no han cargado los elementos en el DOM
        if (!overlay || !screen1 || !screen2 || !btnNext || !btnFinish) return;

        // Validamos la libreta de notas del navegador
        const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');

        if (!hasSeenTutorial) {
            // Es la primera vez: mostramos el contenedor principal
            overlay.classList.remove('hidden');

            // Comportamiento del botón Siguiente (Usa el mismo estilo de clics de tu menú)
            btnNext.onclick = () => {
                screen1.classList.add('hidden');
                screen2.classList.remove('hidden');
                if (typeof audio !== 'undefined') audio.play('click');
            };

            // Comportamiento del botón Finalizar
            btnFinish.onclick = () => {
                overlay.classList.add('hidden');
                localStorage.setItem('hasSeenTutorial', 'true'); // Guarda la marca para siempre
                if (typeof audio !== 'undefined') audio.play('click');
            };
        }
    },

    updateHUD(stats) {
        // Actualización de barras de progreso visuales
        document.getElementById('bar-health').style.width = `${stats.health}%`;
        document.getElementById('bar-hunger').style.width = `${stats.hunger}%`;
        document.getElementById('bar-energy').style.width = `${stats.energy}%`;
        
        // Actualización de los textos de porcentaje (%)
        document.getElementById('txt-health').innerText = `${Math.round(stats.health)}%`;
        document.getElementById('txt-hunger').innerText = `${Math.round(stats.hunger)}%`;
        document.getElementById('txt-energy').innerText = `${Math.round(stats.energy)}%`;

        // Medidor de Glucosa
        const glukoDisplay = document.getElementById('gluko-display');
        const glukoValElement = document.getElementById('gluko-value');
        
        if (glukoValElement) {
            glukoValElement.innerText = Math.round(stats.glucose);
        }

        // =====================================================================
        // 1. CONTROL DE BAJAS DE GLUCOSA (HIPOGLUCEMIA < 70)
        // =====================================================================
        if (stats.glucose < 70) {
            glukoDisplay.classList.add('danger-low');

            if (!this.hasShownHypoAlert) {
                const alertBox = document.getElementById('educational-alert');
                const alertText = document.getElementById('alert-text');
                
                if (alertBox && alertText) {
                    alertText.innerText = "⚠️ ¡Gluko tiene una hipoglucemia! Su azúcar está muy baja. Dale algo dulce (como fruta o un jugo) rápido para subir su glucosa.";
                    alertBox.classList.remove('hidden');
                    this.hasShownHypoAlert = true; 
                }
            }
        } else {
            glukoDisplay.classList.remove('danger-low');
            this.hasShownHypoAlert = false;
        }

        // =====================================================================
        // 2. CONTROL DE SUBIDAS DE GLUCOSA (HIPERGLUCEMIA > 150)
        // =====================================================================
        if (stats.glucose > 150) {
            glukoDisplay.classList.add('danger-high');

            if (!this.hasShownHyperAlert) {
                const alertBox = document.getElementById('educational-alert');
                const alertText = document.getElementById('alert-text');
                
                if (alertBox && alertText) {
                    alertText.innerText = "⚠️ ¡La glucosa de Gluko está muy alta! Tiene hiperglucemia. Una dosis de insulina le ayudará a regularla y bajarla a un nivel seguro.";
                    alertBox.classList.remove('hidden');
                    this.hasShownHyperAlert = true; 
                }
            }
        } else {
            glukoDisplay.classList.remove('danger-high');
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
        container.innerHTML = ''; 

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