const express = require('express');
const helmet = require('helmet');
const fs = require('node:fs');
const app = express();

// process every incoming payload
app.use(express.json());

// middleware
app.use(helmet());
// hide tech
// app.disable('x-powered-by');
// port to server
app.listen(5000, () => {
  console.log('server started...');
});
// ./ current directory
const db = JSON.parse(fs.readFileSync('./db.json', 'utf-8'));

// HANDLERS
const getAllMovies = (req, res) => {
  const totalMovies = db.length;
  res.status(200).json({ status: 200, totalMovies, data: { movies: db } });
};

const addMovie = (req, res) => {
  const id = db[db.length - 1].id + 1;
  const newMovie = Object.assign({ id }, { body: req.body });
  res.status(201).json({
    status: 201,
    message: 'Movie added to db',
    data: { movie: newMovie },
  });
  // save to db
  const data = { id, ...newMovie.body };
  db.push(data);
  fs.writeFileSync('./db.json', JSON.stringify(db));
  // console.log(data)
};

const getMoiveByIdOrName = (req, res) => {
  const { id, title } = req.params;
  const searchParam = +id || title;

  const foundMovie = db.find((movie) => {
    if (movie.id === searchParam || movie.title === searchParam) {
      return movie;
    }
    return null;
  });

  const theMovie = { ...foundMovie, id: foundMovie.id };
  res.status(200).json({ status: 200, body: { movie: theMovie } });
  // console.log(theMovie);
};

const updateMovieById = (req, res) => {
  const id = +req.params.id;
  const updateValue = req.body;
  const theMovie = db.find((movie) => movie.id === id);
  const newMovie = { ...theMovie, ...updateValue };

  // save to db
  // mutate

  const movies = db.map((movie) => {
    if (movie.id === id) {
      movie = newMovie;
    }

    return movie;
  });

  const data = JSON.stringify(movies);
  fs.writeFile('./db.json', data, (err) => {
    if (err) throw err;
    res.status(202).json({ status: 202, data: { body: newMovie } });
  });
};


const deleteMovieById = (req, res) => {
  const id = +req.params.id;
  const filteredMovies = db.filter((movie) => {
    if (!(movie.id === id)) {
      return movie;
    }
  });

  const deletedMovie = db.find((movie) => movie.id === id);

  const newMovies = filteredMovies.map((movie, index) => {
    movie = { ...movie, id: index + 1 };
    return movie;
  });

  const data = JSON.stringify(newMovies);

  fs.writeFile('./db.json', data, (err) => {
    if (err) throw err;
    res.status(202).json({
      status: 202,
      message: `movie with the id:${id} has been deleted from db`,
      body: { data: deletedMovie },
    });
  });
  // console.log(newMovies);
};

// ENDPOINTS
app.get('/api/v1/movies/:id?/:title?', getMoiveByIdOrName);
app.route('/api/v1/movies').get(getAllMovies).post(addMovie);
app.route('/api/v1/movies/:id').patch(updateMovieById).delete(deleteMovieById);

// app.patch('/api/v1/movies/:id', updateMovieById);
// app.delete('/api/v1/movies/:id', deleteMovieById);

// handle delete request

// app.get('/api/v1/movies/:id/:name?', (req, res) => {
//   const { id, name } = req.params;

//   res.send(`the id you requested is ${id}, and the name is ${name || ''}`);
// });

//  route

// you can get a movie by the id or name

// route parameters/params

// /api/v1/movies/:id

// jssend - enveloping

// GET
//  movies api
//  REST API
// nouns and not verbs
// abstract the request into logic resources1

// Movies api

// http verbs - GET, POST, PUT, PATCH, DELETE

// REST API

// /Movies
// /Movie/id
// /Movie/title
// /Movie/genre

// unique

// Endpoint

// resource

// console.log(db);
