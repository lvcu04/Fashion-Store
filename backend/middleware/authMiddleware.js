const admin = require('../firebase/firebaseAdmin');
const User = require('../models/User');

const authMiddleware = {
  verifyToken: async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const user = await User.findOne({ uid: decodedToken.uid });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      if (user.role !== 'admin') {
        return res.status(403).json({ error: 'User not allowed!' });
      }
      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
  },

  getRoleByToken: async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const user = await User.findOne({ uid: decodedToken.uid });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      req.user = user; // Gán user vào req để dùng tiếp
      req.userRole = user.role; // Gán role vào req để dùng tiếp
      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
  },
};

module.exports = authMiddleware;
