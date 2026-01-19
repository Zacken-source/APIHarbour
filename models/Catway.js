const mongoose = require('mongoose');

const catwaySchema = new mongoose.Schema({
  catwayNumber: {
    type: Number,
    required: [true, 'Le numéro de catway est requis'],
    unique: true,
    min: [1, 'Le numéro doit être positif']
  },
  catwayType: {
    type: String,
    required: [true, 'Le type de catway est requis'],
    enum: {
      values: ['long', 'short'],
      message: 'Le type doit être "long" ou "short"'
    }
  },
  catwayState: {
    type: String,
    required: [true, 'L\'état du catway est requis'],
    default: 'bon état',
    maxlength: [500, 'La description ne peut excéder 500 caractères']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Catway', catwaySchema);