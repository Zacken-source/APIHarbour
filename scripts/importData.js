require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Catway = require('../models/Catway');
const Reservation = require('../models/Reservation');
const User = require('../models/User');

async function importData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB');

    await Catway.deleteMany({});
    await Reservation.deleteMany({});
    await User.deleteMany({});
    console.log('Collections nettoyées');

    const catwaysData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/catways.json'), 'utf-8')
    );
    await Catway.insertMany(catwaysData);
    console.log(`${catwaysData.length} catways importés`);

    const reservationsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/reservations.json'), 'utf-8')
    );
    await Reservation.insertMany(reservationsData);
    console.log(`${reservationsData.length} réservations importées`);

    const defaultUser = new User({
      username: 'admin',
      email: 'admin@russell-port.fr',
      password: 'admin123'
    });
    await defaultUser.save();
    console.log('Utilisateur admin créé (admin@russell-port.fr / admin123)');

    console.log('\n Import terminé!');
    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

importData();