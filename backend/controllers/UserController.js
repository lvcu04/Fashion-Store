const User = require('../models/User.js');
const admin = require('../firebase/firebaseAdmin.js');// Firebase Admin SDK đã cấu hình



const userController = {
  register: async (req, res) => {
    const { email , password, name, phone, address } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Email, password, and name are required." });
    }

    try {
      //Tạo tài khoản người dùng trong firebase
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: name,
        phoneNumber: phone,
      });
      //Tạo tài khoản người dùng trong MongoDB
      const newUser = new User({
        uid:userRecord.uid,
        email:userRecord.email,
        name:userRecord.displayName,
        phone:userRecord.phoneNumber,
        address: {
          street: address.street,
          city: address.city,
          zipcode: address.zipcode,
        },
        role: 'customer',
    });
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    }
    catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Error registering user', error });
    }
  },
   // Login nên được xử lý phía client (Firebase Client SDK) 
  // login không cần sử lý ở đây 
   getAllUser: async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({ error: 'Error getting users' });
    }
  },
   getUser: async (req, res) => {
    const { uid } = req.user;
    if (!uid) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    try {
        const user = await User.findOne({ uid });
        if (!user) {
        return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ error: 'Error getting user' });
    }
   },
   getRole: async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    res.status(200).json({ role: req.userRole });
  },
};
module.exports = userController
  