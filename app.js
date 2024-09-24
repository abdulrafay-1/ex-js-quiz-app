const container = document.getElementById("main")
const questionEl = document.getElementById("question")
const inputArr = document.querySelectorAll('input')
const labelsArr = [...document.querySelectorAll("label")]
const nextBtn = document.getElementById("next-btn")

let data;
let index = 0;
let result = 0;
let allUserAns = [];

const fetchQuestions = async () => {
    const response = await fetch('https://the-trivia-api.com/v2/questions');
    const questions = await response.json();
    data = questions;
    console.log(data)
    questionEl.innerHTML = `Q:${index + 1} ${data[index].question.text}`;
    let options = [...data[index].incorrectAnswers, data[index].correctAnswer].sort(() => Math.random() - 0.5);
    options.map((item, index) => labelsArr[index].innerText = item)
    nextBtn.setAttribute("disabled", true)

}
fetchQuestions()


function nextQuestion() {
    if (index < (data.length - 1)) {
        calculateResult()
        index++
        nextBtn.setAttribute("disabled", true)
        questionEl.innerHTML = `Q:${index + 1} ${data[index].question.text}`;
        let options = [...data[index].incorrectAnswers, data[index].correctAnswer].sort(() => Math.random() - 0.5);
        options.map((item, index) => labelsArr[index].innerText = item)
    } else {
        calculateResult()
        displayResult()
    }
}

nextBtn.addEventListener("click", nextQuestion)

function calculateResult() {
    let checkedInp = [...inputArr].find((item) => item.checked === true);
    const userAns = checkedInp.labels[0].innerText;
    allUserAns.push(userAns)
    console.log(allUserAns)
    if (userAns === data[index].correctAnswer) {
        result = result + 10
    }
    checkedInp.checked = false;
}

function displayResult() {
    container.innerHTML = `
    <div class='text-center position-absolute top-50 start-50 translate-middle'>
    <h1>Result : ${result}/100</h1>
    <button class="btn btn-primary" onclick="showAnswers()">View Result</button>
    </div>
`;
}

function showAnswers() {
    container.innerHTML = `
    <h1 class='text-center'>Result : ${result}/100</h1>
    ${data.map((item, index) => `
        <hr/>
        <h4>Q:${index + 1} ${item.question.text}</h4>
        <p>correct answer : <b class="text-success">${item.correctAnswer}</b></p>
        <p>your answer : <b class="${allUserAns[index] === item.correctAnswer ? 'text-success' : 'text-danger'}">${allUserAns[index]}</b></p>
    `).join('')}
`;

}

[...inputArr].map(item => item.onchange = () => {
    nextBtn.removeAttribute("disabled")
})
