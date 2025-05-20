const admin = require("firebase-admin");
const serviceAccount = require("../clothing-app-firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
