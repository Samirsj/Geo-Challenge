// Initialisation des variables globales
let map;
let currentMarker;
let currentCountry;
let score = 0;
let timerInterval;
let gameTime = 0;

// Initialisation de la carte
function initMap() {
    map = L.map('map').setView([48.866667, 2.333333], 4);
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Désactiver le zoom et le déplacement pour éviter la triche
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    if (map.tap) map.tap.disable();
}

// Sélection aléatoire d'un pays
function selectRandomCountry() {
    const randomIndex = Math.floor(Math.random() * countriesData.length);
    currentCountry = countriesData[randomIndex];
    
    // Suppression du marqueur précédent s'il existe
    if (currentMarker) {
        map.removeLayer(currentMarker);
    }
    
    // Ajout du nouveau marqueur
    currentMarker = L.marker(currentCountry.coordinates).addTo(map);
    map.setView(currentCountry.coordinates, 4);
}

// Vérification de la réponse
function checkAnswer(userAnswer) {
    const normalizedUserAnswer = userAnswer.toLowerCase().trim();
    const correctAnswers = [
        currentCountry.name.toLowerCase(),
        ...currentCountry.alternatives.map(alt => alt.toLowerCase())
    ];
    
    return correctAnswers.includes(normalizedUserAnswer);
}

// Mise à jour du score
function updateScore(correct) {
    if (correct) {
        score += 100;
        document.getElementById('score').textContent = score;
        showFeedback(true);
    } else {
        showFeedback(false);
    }
}

// Affichage du feedback
function showFeedback(correct) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = correct ? 'Correct ! 🎉' : `Incorrect. C'était ${currentCountry.name} 😕`;
    feedback.className = `feedback ${correct ? 'correct' : 'incorrect'}`;
    
    // Effacer le feedback après 2 secondes
    setTimeout(() => {
        feedback.textContent = '';
        feedback.className = 'feedback';
    }, 2000);
}

// Gestion du chronomètre
function updateTimer() {
    gameTime++;
    const minutes = Math.floor(gameTime / 60);
    const seconds = gameTime % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Initialisation du jeu
function initGame() {
    initMap();
    selectRandomCountry();
    
    // Démarrage du chronomètre
    timerInterval = setInterval(updateTimer, 1000);
    
    // Gestionnaire de soumission de réponse
    document.getElementById('submitAnswer').addEventListener('click', () => {
        const userAnswer = document.getElementById('countryInput').value;
        const correct = checkAnswer(userAnswer);
        
        updateScore(correct);
        document.getElementById('countryInput').value = '';
        
        // Sélection d'un nouveau pays après un court délai
        setTimeout(selectRandomCountry, 1500);
    });
    
    // Permettre la validation avec la touche Entrée
    document.getElementById('countryInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('submitAnswer').click();
        }
    });
}

// Démarrage du jeu quand la page est chargée
document.addEventListener('DOMContentLoaded', initGame); 