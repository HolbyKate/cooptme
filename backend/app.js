const express = require('express');
const app = express();
const profileRoutes = require('./routes/profileRoutes');
const sequelize = require('./config/database');
require('dotenv').config();

app.use(express.json());

// Routes
app.use('/api/profiles', profileRoutes);

// Synchroniser la base de données et démarrer le serveur
const PORT = process.env.PORT || 5000;
sequelize.sync()
    .then(() => {
        console.log('Base de données connectée');
        app.listen(PORT, () => {
            console.log(`Serveur démarré sur le port ${PORT}`);
        });
    })
    .catch(err => console.log(err));
