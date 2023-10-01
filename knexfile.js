module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'Trisbrtri-3',
      database: 'postgres',
      schema: 'redflix_node_develop',
    },
    migrations: {
      directory: './migrations',
    },
  },
};