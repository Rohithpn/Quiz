document.addEventListener('DOMContentLoaded', () => {
  let currentQuestionIndex = 0;
  let userAnswers = {};
  const quizContainer = document.getElementById('quiz-container');
  const nextBtn = document.getElementById('next-btn');
  const submitBtn = document.getElementById('submit-btn');
  const resultDiv = document.getElementById('result');

  let questions = [];

  fetch('/questions')
    .then(response => response.json())
    .then(data => {
      questions = data;
      displayQuestion(currentQuestionIndex);  // Display the first question
    });

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
      <div class="radio-group">
        <div class="option">
          <label class="radio-container">
          <input type="radio" name="q${question.id}" value="1">
          <span class="radio-checkmark"></span>
          ${question.answer_1}
        </label>
        </div>
        <div class="option">
        <label class="radio-container">
          <input type="radio" name="q${question.id}" value="2">
          <span class="radio-checkmark"></span>
          ${question.answer_2}
        </label>
        </div>
        <div class="option">
        <label class="radio-container">
          <input type="radio" name="q${question.id}" value="3">
          <span class="radio-checkmark"></span>
          ${question.answer_3}
        </label>
        </div>
        <div class="option">
        <label class="radio-container">
          <input type="radio" name="q${question.id}" value="4">
          <span class="radio-checkmark"></span>
          ${question.answer_4}
        </label>
        </div>
      </div>
    `;
  }

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

  submitBtn.addEventListener('click', () => {
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