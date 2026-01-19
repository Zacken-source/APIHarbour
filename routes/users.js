const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated);

router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email déjà utilisé' });
    }

    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    console.error('Erreur:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Données invalides', details: error.message });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.put('/:email', async (req, res) => {
  try {
    const { username, password } = req.body;
    const updateData = {};

    if (username) updateData.username = username;
    if (password) updateData.password = password;

    const user = await User.findOne({ email: req.params.email });
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    Object.assign(user, updateData);
    await user.save();

    res.json(user);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.delete('/:email', async (req, res) => {
  try {
    if (req.session.userEmail === req.params.email) {
      return res.status(403).json({ error: 'Impossible de supprimer votre propre compte' });
    }

    const user = await User.findOneAndDelete({ email: req.params.email });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({ message: 'Utilisateur supprimé', user });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;