const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Profile = sequelize.define('Profile', {
    linkedinId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    position: DataTypes.STRING,
    // Ajoutez d'autres champs nécessaires
}, {
    timestamps: true,
});

module.exports = Profile;
