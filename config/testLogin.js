require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function testLogin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB\n');

    const email = 'admin@russell-port.fr';
    const password = 'admin123';

    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('Utilisateur non trouvé avec l\'email:', email);
      process.exit(1);
    }

    console.log('✓ Utilisateur trouvé:', user.email);
    
    const isMatch = await user.comparePassword(password);
    
    if (isMatch) {
      console.log('Mot de passe CORRECT !');
      console.log('\nVous pouvez vous connecter avec:');
      console.log('Email:', email);
      console.log('Mot de passe:', password);
    } else {
      console.log('Mot de passe INCORRECT !');
      console.log('Le mot de passe dans la base ne correspond pas.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

testLogin();