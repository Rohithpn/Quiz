const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',  
  database: 'quiz_app'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/quiz.html');
});

// Fetch 10 random quiz questions
app.get('/questions', (req, res) => {
  const query = 'SELECT * FROM questions ORDER BY RAND() LIMIT 10';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Handle quiz submission and calculate score
app.post('/submit', (req, res) => {
  const userAnswers = req.body;
  let score = 0;

  const query = 'SELECT * FROM questions';
  db.query(query, (err, results) => {
    if (err) throw err;

    results.forEach((question) => {
      const userAnswer = parseInt(userAnswers[`q${question.id}`], 10);
      if (userAnswer === question.correct_answer) {
        score++;
      }
    });

    res.json({ score: score });
  });
});

// Start the server
const PORT = process.env.PORT || 5151;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
kjhvkgv