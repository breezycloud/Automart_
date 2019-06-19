const pg = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const con = {
  user: 'andela', // this is the db user credential
  database: 'automart_db',
  password: 'andela123',
  port: 5432,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000,
};

const pool = new pg.Pool(con);

pool.on('connect', () => {
  console.log('connected to the Database');
});

const dropTables = () => {
    const qryDrop = `DROP TABLE IF EXISTS author user`;
    pool.query(qryDrop)
      .then((res) => {
        console.log(res);
        pool.end();
      })
      .catch((err) => {
        console.log(err);
        pool.end();
      });
  };


const createTables = () => {
  const qryTables = `CREATE TABLE IF NOT EXISTS
        users(
            user_id uuid NOT NULL,
            first_name character varying(50) NOT NULL,
            last_name character varying(50) NOT NULL,
            email character varying(50) NOT NULL,
            pwd character varying(150) NOT NULL,
            isAdmin bit DEFAULT 0 NOT NULL,
            isBuyer bit DEFAULT 0 NOT NULL,
            isSeller bit DEFAULT false NOT NULL,
            CONSTRAINT user_unique UNIQUE (user_id)
        )`;
  pool.query(qryTables)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});


// export pool and createTables to be accessible  from an where within the application
module.exports = {
    dropTables,
    createTables,
    pool,
};

require('make-runnable');
