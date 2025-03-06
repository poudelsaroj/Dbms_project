const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

exports.authorizeAdmin = (req, res, next) => {
  console.log("this is from the authMiddleware.js file");
  console.log(req.user);
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

exports.authorizeInvigilator = (req, res, next) => {
  if (req.user.role !== 'invigilator' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Invigilator access required' });
  }
  next();
};