// Sample decks for demonstration
const decks = [
    { id: 1, name: "Basic Vocabulary" },
    { id: 2, name: "Advanced Phrases" }
];

// Populate deck list
const deckList = document.getElementById("deck-list");
decks.forEach(deck => {
    const option = document.createElement("option");
    option.value = deck.id;
    option.textContent = deck.name;
    deckList.appendChild(option);
});

// Start game button logic
document.getElementById("start-game").addEventListener("click", () => {
    startFlashcardMode(deckList.value);
});

// Service Worker registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
            console.error('Service Worker registration failed:', error);
        });
}

// Sample deck for demonstration
const sampleDeck = {
    id: 1,
    name: "Basic Vocabulary",
    cards: [
        { front: "Hello", back: "Hola" },
        { front: "Thank you", back: "Gracias" }
    ]
};
localStorage.setItem('deck-1', JSON.stringify(sampleDeck));

function saveDeck(deck) {
    localStorage.setItem(`deck-${deck.id}`, JSON.stringify(deck));
}

function getAllDecks() {
    const decks = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('deck-')) {
            decks.push(JSON.parse(localStorage.getItem(key)));
        }
    }
    return decks;
}

let currentCardIndex = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startFlashcardMode(deckId) {
    const deck = JSON.parse(localStorage.getItem(`deck-${deckId}`));
    if (!deck || deck.cards.length === 0) {
        alert('Deck not found or is empty!');
        return;
    }

    shuffleArray(deck.cards);  // Shuffle the cards

    const gameArea = document.getElementById("game-area");
    gameArea.innerHTML = `
        <div class="card" onclick="flipCard()">
            <div class="card-front">${deck.cards[currentCardIndex].front}</div>
            <div class="card-back" hidden>${deck.cards[currentCardIndex].back}</div>
        </div>
        <button onclick="answer(true)">I Knew It</button>
        <button onclick="answer(false)">I Didn't Know</button>
    `;
    gameArea.hidden = false;
}

function flipCard() {
    const cardFront = document.querySelector(".card-front");
    const cardBack = document.querySelector(".card-back");
    cardFront.hidden = !cardFront.hidden;
    cardBack.hidden = !cardBack.hidden;
}

function answer(knewIt) {
    if (knewIt) {
        correctAnswers++;
    } else {
        incorrectAnswers++;
    }
    nextCard();
}

function nextCard() {
    const deck = JSON.parse(localStorage.getItem(`deck-${deckList.value}`));
    currentCardIndex++;
    if (currentCardIndex >= deck.cards.length) {
        const gameArea = document.getElementById("game-area");
        gameArea.innerHTML = `
            <h3>Your Score:</h3>
            <p>Correct Answers: ${correctAnswers}</p>
            <p>Incorrect Answers: ${incorrectAnswers}</p>
        `;
        currentCardIndex = 0;
        correctAnswers = 0;
        incorrectAnswers = 0;
        return;
    }
    const cardFront = document.querySelector(".card-front");
    const cardBack = document.querySelector(".card-back");
    cardFront.textContent = deck.cards[currentCardIndex].front;
    cardBack.textContent = deck.cards[currentCardIndex].back;
    cardFront.hidden = false;
    cardBack.hidden = true;
}
