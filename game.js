const question = document.getElementById('question');
const choises = Array.from(document.getElementsByClassName('choise-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');



let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];
fetch("questions.json").then(res => {
    return res.json();
})
    .then(loadedQuestions => {
        console.log(loadedQuestions);
        questions = loadedQuestions;

        startGame();
    })

    .catch(err => {
        console.error(err);
    });


//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions]

    getNewQuestion();
};

getNewQuestion = () => {

    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        //go to the end page
        return window.location.assign('end.html');
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    //update the progress bar

    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choises.forEach(choise => {
        const number = choise.dataset['number'];
        choise.innerText = currentQuestion['choise' + number];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choises.forEach(choise => {
    choise.addEventListener('click', e => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoise = e.target;
        const selectedAnswer = selectedChoise.dataset['number'];

        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoise.parentElement.classList.add(classToApply);
        setTimeout(() => {
            selectedChoise.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    })
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
};



