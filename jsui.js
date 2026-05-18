// js/ui.js
const ui = {
    init() {
        this.renderFoodMenu();
    },

    updateHUD(stats) {
        // Actualización de barras de progreso
        document.getElementById('bar-health').style.width = `${stats.health}%`;
        document.getElementById('bar-hunger').style.width = `${stats.hunger}%`;
        document.getElementById('bar-energy').style.width = `${stats.energy}%`;

        // Medidor de Glucosa
        const glukoValElement = document.getElementById('gluko-value');
        glukoValElement.innerText = Math.round(stats.glucose);

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
        const trendIcon = document.getElementById('gluko-trend');
        if (stats.trend > 0) trendIcon.innerText = "🔺";
        else if (stats.trend < 0) trendIcon.innerText = "🔻";
        else trendIcon.innerText = "➡️";
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