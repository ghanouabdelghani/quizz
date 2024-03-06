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

async function getQuestions() {
  const request = await fetch("https://opentdb.com/api.php?amount=10");
  const response = await request.json();

  if (response.results && response.results.length > 0) {
    const questionsArray = response.results;
    return questionsArray;
  } else {
    console.log("No questions received from the API");
    return [];
  }
}

function serverRequest(arr) {
  console.log(arr);
  const question = arr[questionIndex];
  // shuffleArray of answers
  const answrarr = [...question.incorrect_answers, question.correct_answer];
  const newArr = shuffleArray(answrarr);
  console.log(question.correct_answer);

  // list responses
  const questionForm = document.getElementById("question-form");
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

  questionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const selectedAnswer = questionForm.querySelector(
      "input[name='answer']:checked"
    );

    console.log("selected", selectedAnswer.value);
    if (!selectedAnswer) {
      alert("Please select an answer");
      return;
    }
    const selectedValue = selectedAnswer.value;

    // compare user's answer to correct answer and display results

    if (selectedValue === question.correct_answer) {
      console.log("here");
      selectedAnswer.parentElement.style.color = "green";
      correctAnswers++;
    } else {
      console.log("parent", selectedAnswer.parentElement);
      selectedAnswer.parentElement.style.color = "red";
      const element = questionForm.querySelector(
        `input[value="${question.correct_answer}"]`
      );
      if (element) {
        console.log(element);
        element.parentElement.style.backgroundColor = "green";
      }
    }

    // Move to the next question
    questionIndex++;
    console.log("inside set time out", questionIndex);

    if (questionIndex < arr.length) {
      serverRequest(arr);
    } else {
      // All questions completed
      questionForm.innerHTML = `
          <h1>${correctAnswers} / ${arr.length}</h1>
          `;
    }
  });
}

startButton.addEventListener("click", async () => {
  main.style.display = "none";
  questions.style.display = "flex";

  let questionsArray = await getQuestions();
  serverRequest(questionsArray);
});
