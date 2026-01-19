require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');

const app = express();

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error('Erreur MongoDB:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
  res.locals.user = req.session.userId ? {
    id: req.session.userId,
    username: req.session.username,
    email: req.session.userEmail
  } : null;
  next();
});

const { isAuthenticated, isGuest } = require('./middleware/auth');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', isGuest, (req, res) => {
  res.render('login');
});

app.use('/auth', require('./routes/auth'));

app.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const Reservation = require('./models/Reservation');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const currentReservations = await Reservation.find({
      startDate: { $lte: today },
      endDate: { $gte: today }
    }).sort({ catwayNumber: 1 });

    res.render('dashboard', { 
      currentReservations,
      today: today.toLocaleDateString('fr-FR')
    });
  } catch (error) {
    console.error('Erreur dashboard:', error);
    res.status(500).send('Erreur serveur');
  }
});

app.get('/catways-manage', isAuthenticated, (req, res) => {
  res.render('catways');
});

app.get('/reservations-manage', isAuthenticated, (req, res) => {
  res.render('reservations');
});

app.get('/users-manage', isAuthenticated, (req, res) => {
  res.render('users');
});

app.use('/catways', require('./routes/catways'));
app.use('/', require('./routes/reservations'));
app.use('/users', require('./routes/users'));

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erreur déconnexion:', err);
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

app.use((req, res) => {
  res.status(404).render('404', { 
    message: 'Page non trouvée' 
  }).catch(() => {
    res.status(404).json({ error: 'Page non trouvée' });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur sur http://localhost:${PORT}`);
});