const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/ProfileController');

// Ajouter un profil manuellement
router.post('/add', ProfileController.addProfile);

// Récupérer un profil par ID
router.get('/:id', ProfileController.getProfile);

// Mettre à jour un profil
router.put('/:id', ProfileController.updateProfile);

module.exports = router;
