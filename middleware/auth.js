exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }

  // 🔥 Détecter une requête AJAX / API
  const isApiRequest =
    req.originalUrl.startsWith('/catways') ||
    req.originalUrl.startsWith('/users') ||
    req.originalUrl.startsWith('/reservations');

  if (isApiRequest) {
    return res.status(401).json({
      error: 'Non authentifié',
      message: 'Session expirée'
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
