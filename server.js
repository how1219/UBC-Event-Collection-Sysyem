const express = require('express');
const setupDatabase = require('./server/dbsetup');
const eventRoutes = require('./server/routes/eventRoutes');
const organizerRoutes = require('./server/routes/organizerRoutes');
const teamMemberRoutes = require('./server/routes/teamMemberRoutes');

// Load environment variables from .env file
// Ensure your .env file has the required database credentials.
const loadEnvFile = require('./utils/envUtil');
const envVariables = loadEnvFile('./.env');

const app = express();
const PORT = envVariables.PORT || 65534;

// Middleware setup
app.use(express.static('public'));
app.use(express.json());

// mount the router
app.use('/', eventRoutes);
app.use('/', organizerRoutes);
app.use('/', teamMemberRoutes);

// ----------------------------------------------------------
// setup the database schema and start the server
setupDatabase()
  .then(() => {
    // Start the server only after the database setup is completed
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/`);
    });
  })
  .catch(error => {
    console.error('Error setting up the database:', error);
    process.exit(1);
  });

