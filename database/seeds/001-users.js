const bcryptjs = require('bcryptjs');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { username: 'user', password: bcryptjs.hashSync('password', 8)}
      ]);
    });
};
