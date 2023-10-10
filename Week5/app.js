const firebaseConfig = {
    apiKey: "AIzaSyBfVvxGNT8vrtYs7bAjN-63YXcxVNyS_Hc",
    authDomain: "hello-5f8d5.firebaseapp.com",
    databaseURL: "https://hello-5f8d5-default-rtdb.firebaseio.com",
    projectId: "hello-5f8d5",
    storageBucket: "hello-5f8d5.appspot.com",
    messagingSenderId: "96550242411",
    appId: "1:96550242411:web:1b3325fbbd60b38217492e",
    measurementId: "G-B0Y3TLLJPH"
  };

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

// DOM elements
const wordInput = document.getElementById('word-input');
const submitButton = document.getElementById('submit-button');

// Listen for form submission
submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    const word = wordInput.value.trim();

    if (word !== '') {
        // Push the word and random coordinates to the Firebase database
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;

        database.ref('words').push({
            text: word,
            x: x,
            y: y
        });
        wordInput.value = '';
    }
});

// Listen for new words in the database
database.ref('words').on('child_added', (snapshot) => {
    const word = snapshot.val();
    displayWord(word.text, word.x, word.y);
});

// Function to display a word at a specific position on the screen
function displayWord(text, x, y) {
    const wordElement = document.createElement('div');
    wordElement.classList.add('word');
    wordElement.textContent = text;
    wordElement.style.left = x + 'px';
    wordElement.style.top = y + 'px';

    document.body.appendChild(wordElement);
}
