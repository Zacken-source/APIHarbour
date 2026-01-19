require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

async function resetAdminPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB\n');

    const User = mongoose.model('User', new mongoose.Schema({
      username: String,
      email: String,
      password: String
    }, { timestamps: true }));

    const admin = await User.findOne({ email: 'admin@russell-port.fr' });
    
    if (!admin) {
      console.log('Admin non trouvé');
      process.exit(1);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await User.updateOne(
      { email: 'admin@russell-port.fr' },
      { $set: { password: hashedPassword } }
    );

    console.log('Mot de passe admin réinitialisé !');
    console.log('\nEmail: admin@russell-port.fr');
    console.log(' Mot de passe: admin123');
    console.log('\n Essayez de vous connecter maintenant\n');

    // Vérification
    const updatedAdmin = await User.findOne({ email: 'admin@russell-port.fr' });
    const isMatch = await bcrypt.compare('admin123', updatedAdmin.password);
    console.log('✓ Vérification:', isMatch ? 'OK' : 'ÉCHEC');

    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

resetAdminPassword();