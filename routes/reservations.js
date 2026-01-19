const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated);

router.get('/catways/:id/reservations', async (req, res) => {
  try {
    const catwayNumber = parseInt(req.params.id);

    if (isNaN(catwayNumber)) {
      return res.status(400).json({ error: 'Numéro invalide' });
    }

    const reservations = await Reservation.find({ catwayNumber })
      .sort({ startDate: -1 });

    res.json(reservations);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/catways/:id/reservations/:idReservation', async (req, res) => {
  try {
    const catwayNumber = parseInt(req.params.id);
    const reservationId = req.params.idReservation;

    const reservation = await Reservation.findOne({
      _id: reservationId,
      catwayNumber
    });

    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    res.json(reservation);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/catways/:id/reservations', async (req, res) => {
  try {
    const catwayNumber = parseInt(req.params.id);
    const { clientName, boatName, startDate, endDate } = req.body;

    const catway = await Catway.findOne({ catwayNumber });
    if (!catway) {
      return res.status(404).json({ error: 'Catway non trouvé' });
    }

    const overlap = await Reservation.findOne({
      catwayNumber,
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) }
        }
      ]
    });

    if (overlap) {
      return res.status(409).json({ error: 'Catway déjà réservé pour cette période' });
    }

    const reservation = new Reservation({
      catwayNumber,
      clientName,
      boatName,
      startDate,
      endDate
    });

    await reservation.save();
    res.status(201).json(reservation);
  } catch (error) {
    console.error('Erreur:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Données invalides', details: error.message });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.put('/catways/:id/reservations/:idReservation', async (req, res) => {
  try {
    const catwayNumber = parseInt(req.params.id);
    const reservationId = req.params.idReservation;
    const { clientName, boatName, startDate, endDate } = req.body;

    if (startDate && endDate) {
      const overlap = await Reservation.findOne({
        _id: { $ne: reservationId },
        catwayNumber,
        $or: [
          {
            startDate: { $lte: new Date(endDate) },
            endDate: { $gte: new Date(startDate) }
          }
        ]
      });

      if (overlap) {
        return res.status(409).json({ error: 'Conflit de dates' });
      }
    }

    const reservation = await Reservation.findOneAndUpdate(
      { _id: reservationId, catwayNumber },
      { clientName, boatName, startDate, endDate },
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    res.json(reservation);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.delete('/catways/:id/reservations/:idReservation', async (req, res) => {
  try {
    const catwayNumber = parseInt(req.params.id);
    const reservationId = req.params.idReservation;

    const reservation = await Reservation.findOneAndDelete({
      _id: reservationId,
      catwayNumber
    });

    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    res.json({ message: 'Réservation supprimée', reservation });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;