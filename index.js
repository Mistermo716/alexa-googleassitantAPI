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
      res.json(results);
    });
  console.log(results);
});

app.delete('/:user_id/:query', (req, res) => {
  const { user_id, query } = req.params;
  pg('favs')
    .where({ user_id, query })
    .del()
    .then(result => {
      res.json({
        messageToResponse: `${query} was removed from your highlights list`,
      });
    })
    .catch(err => {
      return err;
    });
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
          return;
        });
    }
  }

  pg('favs')
    .insert({ user_id, query })
    .then(results => {
      res.json({
        messageToResponse: `${query} has been added to your highlights list`,
      });
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
