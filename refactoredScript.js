const main = document.querySelector(".main");
const startButton = document.querySelector("#start-quiz");
const questions = document.querySelector(".questions");
let questionIndex = 0;
let correctAnswers = 0;

function shuffleArray(array) {
  const shuffledArray = [...array];

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
}

function renderQuestionForm(question) {
  const questionForm = document.getElementById("question-form");
  const newArr = shuffleArray([
    ...question.incorrect_answers,
    question.correct_answer,
  ]);

  questionForm.innerHTML = `
    <h1>${question.question}</h1>
    <ul class="choices">
      ${newArr
        .map(
          (answer) => `
          <li>
            <input type="radio" name="answer" value="${answer}" />
            ${answer}
          </li>
        `
        )
        .join("")}
    </ul>
    <button type="submit">Submit Answer</button>
  `;

  questionForm.addEventListener("submit", handleAnswerSubmission);
}

function handleAnswerSubmission(e) {
  e.preventDefault();
  const selectedAnswer = document.querySelector("input[name='answer']:checked");

  if (!selectedAnswer) {
    alert("Please select an answer");
    return;
  }

  const selectedValue = selectedAnswer.value;

  const isCorrect = selectedValue === currentQuestion.correct_answer;

  if (isCorrect) {
    selectedAnswer.parentElement.style.color = "green";
    correctAnswers++;
  } else {
    selectedAnswer.parentElement.style.color = "red";
    const correctInput = document.querySelector(
      `input[value="${currentQuestion.correct_answer}"]`
    );
    if (correctInput) {
      correctInput.parentElement.style.backgroundColor = "green";
    }
  }

  setTimeout(nextQuestion, 1000);
}

function nextQuestion() {
  questionIndex++;

  if (questionIndex < questionsData.results.length) {
    renderQuestionForm(questionsData.results[questionIndex]);
  } else {
    showQuizResults();
  }
}

function showQuizResults() {
  alert(
    `You have completed all questions!\nYour score: ${correctAnswers} / ${questionsData.results.length}`
  );
}

let questionsData;

async function fetchQuestions() {
  try {
    const request = await fetch("https://opentdb.com/api.php?amount=10");
    const response = await request.json();

    if (!response.results || response.results.length === 0) {
      console.log("No questions received from the API");
      return;
    }

    questionsData = response;
    renderQuestionForm(questionsData.results[questionIndex]);
  } catch (error) {
    console.log(error, "please refresh the page");
  }
}

startButton.addEventListener("click", () => {
  main.style.display = "none";
  questions.style.display = "flex";
  fetchQuestions();
});
