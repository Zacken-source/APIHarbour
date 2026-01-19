exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }

  if (req.path.startsWith('/api')) {
    return res.status(401).json({ 
      error: 'Non authentifié',
      message: 'Vous devez être connecté pour accéder à cette ressource'
    });
  }

  return res.redirect('/login');
};

exports.isGuest = (req, res, next) => {
  if (req.session && req.session.userId) {
    return res.redirect('/dashboard');
  }
  next();
};