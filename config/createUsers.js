require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const users = [
  {
    username: 'admin',
    email: 'admin@russell-port.fr',
    password: 'admin123'
  },
  {
    username: 'capitaine',
    email: 'capitaine@russell-port.fr',
    password: 'capitaine123'
  },
  {
    username: 'gestionnaire',
    email: 'gestionnaire@russell-port.fr',
    password: 'gestionnaire123'
  }
];

async function createUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB');

    await User.deleteMany({});
    console.log('Utilisateurs existants supprimés');

    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`Utilisateur créé: ${userData.email}`);
    }

    console.log('\nTous les utilisateurs ont été créés !');
    console.log('\nIdentifiants disponibles :');
    users.forEach(u => {
      console.log(`  - ${u.email} / ${u.password}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

createUsers();