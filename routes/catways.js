const express = require('express');
const router = express.Router();
const Catway = require('../models/Catway');
const Reservation = require('../models/Reservation');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated);

router.get('/', async (req, res) => {
  try {
    const catways = await Catway.find().sort({ catwayNumber: 1 });
    res.json(catways);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const catwayNumber = parseInt(req.params.id);
    
    if (isNaN(catwayNumber)) {
      return res.status(400).json({ error: 'Numéro de catway invalide' });
    }

    const catway = await Catway.findOne({ catwayNumber });
    
    if (!catway) {
      return res.status(404).json({ error: 'Catway non trouvé' });
    }

    res.json(catway);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;

    if (!catwayNumber || !catwayType) {
      return res.status(400).json({ error: 'Numéro et type requis' });
    }

    const existingCatway = await Catway.findOne({ catwayNumber });
    if (existingCatway) {
      return res.status(409).json({ error: 'Ce numéro existe déjà' });
    }

    const catway = new Catway({
      catwayNumber,
      catwayType,
      catwayState: catwayState || 'bon état'
    });

    await catway.save();
    res.status(201).json(catway);
  } catch (error) {
    console.error('Erreur:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Données invalides', details: error.message });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const catwayNumber = parseInt(req.params.id);
    const { catwayState } = req.body;

    if (isNaN(catwayNumber)) {
      return res.status(400).json({ error: 'Numéro invalide' });
    }

    if (!catwayState) {
      return res.status(400).json({ error: 'État requis' });
    }

    const catway = await Catway.findOneAndUpdate(
      { catwayNumber },
      { catwayState },
      { new: true, runValidators: true }
    );

    if (!catway) {
      return res.status(404).json({ error: 'Catway non trouvé' });
    }

    res.json(catway);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const catwayNumber = parseInt(req.params.id);

    if (isNaN(catwayNumber)) {
      return res.status(400).json({ error: 'Numéro invalide' });
    }

    const activeReservations = await Reservation.findOne({ 
      catwayNumber,
      endDate: { $gte: new Date() }
    });

    if (activeReservations) {
      return res.status(409).json({ error: 'Réservations actives existantes' });
    }

    const catway = await Catway.findOneAndDelete({ catwayNumber });

    if (!catway) {
      return res.status(404).json({ error: 'Catway non trouvé' });
    }

    res.json({ message: 'Catway supprimé', catway });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;