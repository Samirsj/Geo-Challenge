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
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
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
    
    // Création d'une icône personnalisée
    const customIcon = L.divIcon({
        className: 'custom-marker',
        html: '📍',
        iconSize: [30, 30],
        iconAnchor: [15, 30]
    });
    
    // Ajout du nouveau marqueur avec animation
    currentMarker = L.marker(currentCountry.coordinates, {
        icon: customIcon
    }).addTo(map);
    
    map.setView(currentCountry.coordinates, 4, {
        animate: true,
        duration: 1
    });
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

// Mise à jour du score avec animation
function updateScore(correct) {
    if (correct) {
        score += 100;
        const scoreElement = document.getElementById('score');
        scoreElement.textContent = score;
        scoreElement.parentElement.classList.add('score-update');
        setTimeout(() => {
            scoreElement.parentElement.classList.remove('score-update');
        }, 500);
        showFeedback(true);
    } else {
        showFeedback(false);
    }
}

// Affichage du feedback avec animation
function showFeedback(correct) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = correct ? 
        '🎉 Correct ! Bien joué !' : 
        `❌ Incorrect. C'était ${currentCountry.name}`;
    feedback.className = `feedback ${correct ? 'correct' : 'incorrect'} visible`;
    
    // Effacer le feedback après 2 secondes
    setTimeout(() => {
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
    
    // Focus sur l'input au démarrage
    document.getElementById('countryInput').focus();
    
    // Gestionnaire de soumission de réponse
    document.getElementById('submitAnswer').addEventListener('click', handleAnswer);
    
    // Permettre la validation avec la touche Entrée
    document.getElementById('countryInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleAnswer();
        }
    });
}

// Gestion de la réponse
function handleAnswer() {
    const input = document.getElementById('countryInput');
    const userAnswer = input.value;
    const correct = checkAnswer(userAnswer);
    
    updateScore(correct);
    input.value = '';
    input.focus();
    
    // Sélection d'un nouveau pays après un court délai
    setTimeout(selectRandomCountry, 1500);
}

// Démarrage du jeu quand la page est chargée
document.addEventListener('DOMContentLoaded', initGame); 