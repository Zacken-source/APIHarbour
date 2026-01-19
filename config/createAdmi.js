require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB');

    const existingAdmin = await User.findOne({ email: 'admin@russell-port.fr' });
    
    if (existingAdmin) {
      console.log(' L\'admin existe déjà, suppression...');
      await User.deleteOne({ email: 'admin@russell-port.fr' });
    }

    const admin = new User({
      username: 'admin',
      email: 'admin@russell-port.fr',
      password: 'admin123'
    });

    await admin.save();
    
    console.log('\nAdmin créé avec succès !');
    console.log('\nEmail: admin@russell-port.fr');
    console.log('Mot de passe: admin123');
    console.log('\nConnectez-vous sur: http://localhost:3000/login\n');

    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

createAdmin();