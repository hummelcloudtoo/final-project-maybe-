// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {

    // ------------------------
    // Trivia Questions
    // ------------------------
    const questions = [
        {
            question: "Which Boston team has the most championships?",
            answers: ["Celtics", "Patriots", "Red Sox", "Bruins"],
            correct: "Celtics"
        },
        {
            question: "Who is known as 'Big Papi'?",
            answers: ["David Ortiz", "Larry Bird", "Tom Brady", "Bobby Orr"],
            correct: "David Ortiz"
        },
        {
            question: "What year did the Patriots complete their undefeated regular season?",
            answers: ["2007", "2001", "2014", "1996"],
            correct: "2007"
        },
        {
            question: "Which Bruins legend wore #4?",
            answers: ["Cam Neely", "Bobby Orr", "Ray Bourque", "Patrice Bergeron"],
            correct: "Bobby Orr"
        }
    ];

    let currentIndex = 0;
    let score = 0;

    // ------------------------
    // HTML references
    // ------------------------
    const questionText = document.getElementById("questionText");
    const answerButtons = document.getElementById("answerButtons");
    const answerMessage = document.getElementById("answerMessage");
    const nextBtn = document.getElementById("nextBtn");
    const finalScreen = document.getElementById("finalScreen");
    const triviaBox = document.getElementById("triviaBox");
    const finalScoreText = document.getElementById("finalScoreText");
    const restartBtn = document.getElementById("restartBtn");

    // ------------------------
    // Load Question
    // ------------------------
    function loadQuestion() {
        let q = questions[currentIndex];

        questionText.textContent = q.question;
        answerButtons.innerHTML = ""; // Clear previous buttons
        answerMessage.textContent = ""; // Clear previous message
        nextBtn.style.display = "none"; // Hide Next button

        // Create buttons for each answer
        q.answers.forEach(answer => {
            const btn = document.createElement("button");
            btn.textContent = answer;
            btn.classList.add("btn", "answer-btn");
            btn.addEventListener("click", () => checkAnswer(answer));
            answerButtons.appendChild(btn);
        });
    }

    // ------------------------
    // Check Answer
    // ------------------------
    function checkAnswer(selected) {
        const correct = questions[currentIndex].correct;

        if (selected === correct) {
            score++;
            answerMessage.style.color = "green";
            answerMessage.textContent = "✅ Correct!";
        } else {
            answerMessage.style.color = "red";
            answerMessage.textContent = "❌ Incorrect!";
        }

        // Disable all buttons after selecting
        Array.from(answerButtons.children).forEach(btn => btn.disabled = true);

        // Show Next button
        nextBtn.style.display = "inline-block";
    }

    // ------------------------
    // Next Question
    // ------------------------
    nextBtn.addEventListener("click", () => {
        currentIndex++;
        if (currentIndex < questions.length) {
            loadQuestion();
        } else {
            showFinalScreen();
        }
    });

    // ------------------------
    // Show Final Score
    // ------------------------
    function showFinalScreen() {
        triviaBox.style.display = "none";
        finalScreen.style.display = "block";
        finalScoreText.textContent = `${score} / ${questions.length}`;
    }

    // ------------------------
    // Restart Trivia
    // ------------------------
    restartBtn.addEventListener("click", () => {
        currentIndex = 0;
        score = 0;
        triviaBox.style.display = "block";
        finalScreen.style.display = "none";
        loadQuestion();
    });

    // ------------------------
    // Start the first question
    // ------------------------
    loadQuestion();

});
