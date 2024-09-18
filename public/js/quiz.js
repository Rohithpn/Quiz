document.addEventListener('DOMContentLoaded', () => {
    let currentQuestionIndex = 0;
    let userAnswers = {};
    const quizContainer = document.getElementById('quiz-container');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const resultDiv = document.getElementById('result');
  
    let questions = [];
  
    // Fetch questions from the backend
    fetch('/questions')
      .then(response => response.json())
      .then(data => {
        questions = data;
        displayQuestion(currentQuestionIndex);  // Display the first question
      });
  
    // Display a question
    function displayQuestion(index) {
      if (index >= questions.length) {
        quizContainer.innerHTML = '';
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
        return;
      }
  
      const question = questions[index];
      quizContainer.innerHTML = `
        <p>${index + 1}. ${question.question}</p>
        <input type="radio" name="q${question.id}" value="1"> ${question.answer_1} <br>
        <input type="radio" name="q${question.id}" value="2"> ${question.answer_2} <br>
        <input type="radio" name="q${question.id}" value="3"> ${question.answer_3} <br>
        <input type="radio" name="q${question.id}" value="4"> ${question.answer_4} <br>
      `;
    }
  
    // Handle the next button click
    nextBtn.addEventListener('click', () => {
      const selectedAnswer = document.querySelector('input[name="q' + questions[currentQuestionIndex].id + '"]:checked');
  
      if (selectedAnswer) {
        userAnswers['q' + questions[currentQuestionIndex].id] = selectedAnswer.value;
        currentQuestionIndex++;
        displayQuestion(currentQuestionIndex);  // Show next question
      } else {
        alert('Please select an answer!');
      }
    });
  
    // Handle quiz submission
    submitBtn.addEventListener('click', () => {
      const selectedAnswer = document.querySelector('input[name="q' + questions[currentQuestionIndex - 1].id + '"]:checked');
      if (selectedAnswer) {
        userAnswers['q' + questions[currentQuestionIndex - 1].id] = selectedAnswer.value;
      }
  
      // Send answers to the backend
      fetch('/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userAnswers)
      })
      .then(response => response.json())
      .then(data => {
        resultDiv.innerHTML = `Your score is: ${data.score}`;
        submitBtn.style.display = 'none';
      });
    });
  });