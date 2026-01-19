require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(' Connecté à MongoDB\n');

    const users = await User.find({});
    
    if (users.length === 0) {
      console.log('AUCUN utilisateur trouvé dans la base de données !');
      console.log('\nVeuillez exécuter: node config/importData.js');
    } else {
      console.log(` ${users.length} utilisateur(s) trouvé(s) :\n`);
      users.forEach(user => {
        console.log(`  - Email: ${user.email}`);
        console.log(`    Username: ${user.username}`);
        console.log(`    ID: ${user._id}`);
        console.log(`    Créé le: ${user.createdAt}\n`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error(' Erreur:', error);
    process.exit(1);
  }
}

checkUsers();