document.addEventListener('DOMContentLoaded', () => {
    const dieElement = document.getElementById('die');
    const rollButton = document.getElementById('roll-button');
    const resultText = document.getElementById('result-text');

    rollButton.addEventListener('click', rollDice);

    function rollDice() {
        // Désactive le bouton pendant le lancer
        rollButton.disabled = true;
        resultText.textContent = 'Lancement en cours...';

        // 1. Générer un nombre aléatoire entre 1 et 6
        const result = Math.floor(Math.random() * 6) + 1;

        // 2. Simuler une rotation réaliste (CSS)
        // Cet effet donne une impression de lancer en tournant le dé aléatoirement
        const randomX = Math.floor(Math.random() * 360) + 720; // Rotation minimale de 2 tours
        const randomY = Math.floor(Math.random() * 360) + 720; // Rotation minimale de 2 tours
        
        // Appliquer la transformation pour l'animation
        dieElement.style.transform = `rotateX(${randomX}deg) rotateY(${randomY}deg)`;

        // 3. Attendre la fin de l'animation CSS (0.5s + un petit délai)
        setTimeout(() => {
            // 4. Mettre à jour la face du dé
            updateDieFace(result);

            // 5. Afficher le résultat
            resultText.textContent = `Le résultat est : ${result} !`;

            // 6. Réactiver le bouton
            rollButton.disabled = false;
            
            // Réinitialiser la transformation pour l'effet 3D initial avant le prochain lancer
            dieElement.style.transform = `rotateX(20deg) rotateY(20deg)`; 
        }, 550); // 550ms est juste après la durée de la transition CSS (0.5s)
    }

    /**
     * Met à jour la classe du dé pour afficher le bon nombre de points.
     * @param {number} value Le résultat du dé (1 à 6).
     */
    function updateDieFace(value) {
        // Enlève toutes les classes de face existantes
        dieElement.className = 'die-face';
        // Ajoute la classe correspondant au résultat
        dieElement.classList.add(`die-${value}`);

        // Génère dynamiquement les points (dots)
        dieElement.innerHTML = '';
        for (let i = 0; i < value; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dieElement.appendChild(dot);
        }
    }
    
    // Initialiser le dé à la face 1 au chargement
    updateDieFace(1); 
});
