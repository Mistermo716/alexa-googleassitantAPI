const express = require('express');
const app = express();
const dotenv = require('dotenv').config();

var pg = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  searchPath: ['knex', 'public'],
});

app.get('/:agentType/:user_id/:query', (req, res) => {
  const { agentType, user_id, query } = req.params;

  let results = pg('favs')
    .where({ user_id })
    .then(results => {
      return results;
    });
  console.log(results);
});

app.post('/:user_type/:user_id/:query', (req, res) => {
  const { user_type, user_id, query } = req.params;
  let userResult = [];
  pg('users')
    .where({ user_id })
    .then(result => {
      return processInfo(result);
    });
  function processInfo(value) {
    value.forEach(value => {
      userResult.push(value);
    });

    if (!userResult[0]) {
      console.log('got here');
      pg('users')
        .insert({ user_id, user_type })
        .then(result => {
          res.send(result);
        });
    }
    if (userResult[0]) {
      console.log('user exists');
    }
  }

  pg('favs')
    .insert({ user_id, query })
    .then(results => {
      return;
    })
    .catch(err => {
      return err;
    });
});

app.get('/', (req, res) => {
  pg('users').then(results => {
    console.log(results[0].user_id);
  });
  res.send({ work: 'not working' });
});

app.listen(3000);
