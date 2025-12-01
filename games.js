
const triviaQuestions = [
    {
        question: "Which Boston team has the most championships?",
        options: ["Red Sox", "Patriots", "Celtics", "Bruins"],
        answer: "Celtics"
    },
    {
        question: "Which Boston athlete is known as 'Big Papi'?",
        options: ["Tom Brady", "Larry Bird", "David Ortiz", "Cam Neely"],
        answer: "David Ortiz"
    },
    {
        question: "The Patriots’ historic 28–3 comeback happened in which Super Bowl?",
        options: ["LI (51)", "XLIX (49)", "LIV (54)", "XLII (42)"],
        answer: "LI (51)"
    },
    {
        question: "Which Boston Celtic is famous for the skyhook?",
        options: ["Bill Russell", "Larry Bird", "Paul Pierce", "Kareem Abdul-Jabbar"],
        answer: "Larry Bird"
    },
    {
        question: "The Bruins play their home games in which arena?",
        options: ["TD Garden", "Fenway Park", "Gillette Stadium", "Boston Garden (old)"],
        answer: "TD Garden"
    },
    {
        question: "How many World Series titles have the Red Sox won in the 21st century?",
        options: ["1", "2", "3", "4"],
        answer: "4"
    }
];

// Game state
let currentQuestionIndex = 0;
let score = 0;

// DOM references
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answerButtons");
const nextButton = document.getElementById("nextBtn");
const triviaCard = document.querySelector(".trivia-container");


// Start game
function startGame() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerText = "Next Question";
    showQuestion();
}

// Display a question
function showQuestion() {
    resetState();

    let currentQuestion = triviaQuestions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;

    currentQuestion.options.forEach(option => {
        const button = document.createElement("button");
        button.innerText = option;
        button.classList.add("answer-btn");
        answerButtons.appendChild(button);

        // Click event for answers
        button.addEventListener("click", () => selectAnswer(button));
    });
}

// Clear old buttons + hide next button
function resetState() {
    nextButton.style.display = "none";

    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

// Handle answer click
function selectAnswer(button) {
    let selected = button.innerText;
    let correct = triviaQuestions[currentQuestionIndex].answer;

    if (selected === correct) {
        button.classList.add("correct");
        score++;
    } else {
        button.classList.add("incorrect");
    }

    // Disable all buttons
    Array.from(answerButtons.children).forEach(btn => {
        btn.disabled = true;

        if (btn.innerText === correct) {
            btn.classList.add("correct");
        }
    });

    nextButton.style.display = "block";
}

// Show final score
function showScore() {
    resetState();
    questionElement.innerText = `You scored ${score} out of ${triviaQuestions.length}!`;

    nextButton.innerText = "Play Again";
    nextButton.style.display = "block";
}

// Handle next button
function handleNextButton() {
    currentQuestionIndex++;

    if (currentQuestionIndex < triviaQuestions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

// Event listener
nextButton.addEventListener("click", () => {
    if (nextButton.innerText === "Play Again") {
        startGame();
    } else {
        handleNextButton();
    }
});

// Start everything
startGame();

