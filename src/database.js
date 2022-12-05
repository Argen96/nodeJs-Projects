import knex from 'knex';


const database = knex({
  client: 'sqlite3',
  connection: {
    filename: './sqlite-menu',
  },
  useNullAsDefault: true,
});

export default database;

