// passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Define your User model

passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      console.log('Authenticating user:', email); // Log the email being authenticated
      const user = await User.findOne({ email });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return done(null, false, { message: 'Incorrect email or password.' });
      }

      // Fetch the role from the user document
      const role = user.role;
      console.log(role)
      return done(null, user);
    } catch (error) {
      console.log('by')
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  console.log(2)
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    console.log(user)
    done(null, user);
  } catch (error) {
    done(error);
  }
});
