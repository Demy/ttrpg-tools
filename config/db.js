const env = process.env;

const config = {
  db: {
    host: env.DB_HOST,
    port: env.DB_PORT ? env.DB_PORT : undefined,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  },
  listPerPage: env.LIST_PER_PAGE || 10,
};

module.exports = config;