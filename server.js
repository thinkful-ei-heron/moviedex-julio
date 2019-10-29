require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

const store = require('./movies-data-small');
const API_TOKEN = process.env.API_TOKEN;

app.use(morgan('common'));
app.use(cors());
app.use(helmet());

function validateBearer(req, res, next) {
  const authVal = req.get('Authorization') || '';
  if (!authVal.startsWith('Bearer ')) {
    return res.status(400).json({ error: 'Authorization token not found' });
  }
  const token = authVal.split(' ')[1];
  if (token !== API_TOKEN) {
    return res.status(401).json({ error: 'Token is invalid' });
  }
  next();
}

app.get('/movie', validateBearer, (req, res) => {
  let movies = store;
  const { genre, country, avg_vote } = req.query;
  if (genre) {
    movies = movies.filter((app) =>
      app.genre.toLowerCase().includes(genre.toLowerCase()),
    );
  }
  if (country) {
    movies = movies.filter((app) =>
      app.country.toLowerCase().includes(country.toLowerCase()),
    );
  }
  if (avg_vote) {
    movies = movies.filter((app) => app.avg_vote >= avg_vote);
  }
  res.json(movies);
});

app.listen(8000, () => {
  console.log(`Server listening at http://localhost:8000`);
});
