// js/foodSystem.js
const foodSystem = {
    // Catálogo maestro de alimentos
    catalog: [
        {
            id: 'candy',
            name: 'Dulce',
            icon: '🍬',
            hungerRepair: 15,
            glucoseImpact: 60, // Sube muy rápido la glucosa
            educationalNote: "¡Wow, eso sube la glucosa rápido! Úsalo si tu mascota la tiene muy baja."
        },
        {
            id: 'fruit',
            name: 'Fruta',
            icon: '🍓',
            hungerRepair: 25,
            glucoseImpact: 20, // Carbohidrato saludable de absorción media
            educationalNote: "Las frutas dan energía saludable y vitaminas naturales."
        },
        {
            id: 'juice',
            name: 'Jugo',
            icon: '🧃',
            hungerRepair: 10,
            glucoseImpact: 45, // Líquido con azúcar de rápida acción
            educationalNote: "El jugo es genial cuando la glucosa baja rápido porque se absorbe velozmente."
        },
        {
            id: 'vegetibles',
            name: 'Verduras',
            icon: '🥦',
            hungerRepair: 35,
            glucoseImpact: 2, // Fibra pura, casi no impacta la glucosa
            educationalNote: "Las verduras tienen mucha fibra. ¡Mantienen la glucosa súper estable!"
        },
        {
            id: 'meat',
            name: 'Proteína',
            icon: '🍗',
            hungerRepair: 45,
            glucoseImpact: 0, // Proteínas/Grasas, estabilidad total
            educationalNote: "La carne y proteínas ayudan a construir los músculos sin subir la glucosa."
        },
        {
            id: 'water',
            name: 'Agua',
            icon: '💧',
            hungerRepair: 5,
            glucoseImpact: -5, // Hidratación que ayuda a limpiar excesos
            educationalNote: "El agua hidrata el cuerpo de tu mascota y ayuda a sentirse genial."
        }
    ],

    getFoodById(id) {
        return this.catalog.find(f => f.id === id);
    }
};