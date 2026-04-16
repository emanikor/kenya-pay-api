const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  // looking for a web token authorization
  const authHeader = req.headers.authorization;

  // if there is no header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false, 
      error: "No token provided or invalid format"
    });
  }

  // We split the "Bearer <token>" string by the space to get just the token
  const token = authHeader.split(" ")[1];

  try {
    // decode and verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // attach user info to req
    req.user = decoded; 
    
    // next() if the token is good
    next();     
  } catch (err) {
    return res.status(401).json({
      success: false, 
      error: "Invalid token or expired"
    });
  }
}

module.exports = { authenticate };