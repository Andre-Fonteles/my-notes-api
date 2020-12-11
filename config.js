const config = {};
if (process.env.NODE_ENV && process.env.NODE_ENV == 'test') { // Test configuration
  config.database = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'my_notes_test',
  };
} else { // Normal configuration
  config.database = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'my_notes',
  };
}

export default config;
