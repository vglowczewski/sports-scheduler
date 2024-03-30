// Import required modules
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser')
const passport = require('passport'); // Import the configured Passport instance
require('./passport');
require('./db'); // Import Mongoose configuration
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Assuming User model is defined in a separate file
const Event = require('./models/Event');
const League = require('./models/League');
const Team = require('./models/Team');
const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const leaguesRoutes = require('./routes/leagues');
const teamsRoutes = require('./routes/teams');
const generateSalt = require('./saltGenerator');

// Initialize Express app
const app = express();

// Middleware setup
app.set('view engine', 'ejs'); // Assuming you're using EJS for templating
app.use(express.urlencoded({ extended: false }));
app.use(cors({origin: true, credentials: true}));
app.use(bodyParser.json());
app.use(session({
  secret: `${generateSalt()}`, // Replace 'secret' with your session secret
  resave: false,
  saveUninitialized: false
}));

// Mount authentication routes
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRoutes); // make sure the above two lines are set up before this

app.use('/events', eventsRoutes);
app.use('/leagues', leaguesRoutes);
app.use('/teams', teamsRoutes);

const isAuthenticated = (req, res, next) => {
  // Passport adds 'req.user' property if user is authenticated
  if (req.isAuthenticated()) {
    // User is authenticated, proceed to the next middleware
    return next();
  }
  // User is not authenticated, redirect to login page or send error response
  res.redirect('/login'); // Redirect to login page
};

// Middleware function to check if user has specific role/permission
const hasPermission = (requiredRole) => {
  return (req, res, next) => {
    // Check if user has the required role/permission
    if (req.user && req.user.role === requiredRole) {
      // User has the required role/permission, proceed to the next middleware
      return next();
    }
    // User does not have the required role/permission, send error response
    res.status(403).send('Forbidden'); // Send 403 Forbidden status
  };
};

// Define routes
app.get('/', (req, res) => {
  res.send('Welcome to the application!');
});

app.get('/login', (req, res) => {
  res.send('This is the Login Page')
});

app.get('/dashboard', (req, res) => {
  res.send('Welcome to the dashboard!');
});

app.get('/logoutConfirmed', (req, res) => {
  res.send('You have logged out!');
});

// Example route that requires authentication and specific role
app.get('/admin', isAuthenticated, hasPermission('admin'), (req, res) => {
  // Route handler for admin route
  res.send('Welcome to the admin dashboard!');
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
