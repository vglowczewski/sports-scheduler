const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  console.log('JWT Secret:', process.env.JWT_SECRET);
  const authHeader = req.headers['authorization'];
  console.log('Authorization Header:', authHeader);
  console.log("hey")
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = user; // Attach user information to the request object
    next();
  });
}

module.exports = authenticateToken;
